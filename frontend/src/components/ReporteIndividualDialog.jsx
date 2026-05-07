
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FileDown, Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import pb from '../lib/pb'

export const ReporteIndividualDialog = ({ tecnico, asMenuItem = false }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reportType, setReportType] = useState('all') // 'all', 'year', 'range'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const generatePDF = async () => {
    setLoading(true)
    try {
      // 1. Configurar filtro según el tipo de reporte
      let filter = `tecnicos_asociados ~ "${tecnico.id}"`
      let periodText = "TODO EL HISTÓRICO"

      if (reportType === 'year') {
        filter += ` && fecha_soporte >= "${selectedYear}-01-01 00:00:00" && fecha_soporte <= "${selectedYear}-12-31 23:59:59"`
        periodText = `AÑO ${selectedYear}`
      } else if (reportType === 'range') {
        if (startDate && endDate) {
          filter += ` && fecha_soporte >= "${startDate} 00:00:00" && fecha_soporte <= "${endDate} 23:59:59"`
          const sD = new Date(startDate + "T12:00:00")
          const eD = new Date(endDate + "T12:00:00")
          periodText = sD.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase() + " - " + 
                       eD.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()
        } else if (startDate) {
          filter += ` && fecha_soporte >= "${startDate} 00:00:00"`
          periodText = `DESDE ${new Date(startDate + "T12:00:00").toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}`
        } else if (endDate) {
          filter += ` && fecha_soporte <= "${endDate} 23:59:59"`
          periodText = `HASTA ${new Date(endDate + "T12:00:00").toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}`
        }
      }

      const records = await pb.collection("historial").getFullList({
        filter,
        sort: "fecha_soporte",
        expand: "departamento",
      })

      if (records.length === 0) {
        alert("No se encontraron soportes para este técnico en el periodo seleccionado.")
        setLoading(false)
        return
      }

      const doc = new jsPDF()
      const formatMonth = (date) => {
        if (!date || isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase();
      };
      
      // Si el periodo es "Todo el histórico", intentamos darle un rango real basado en los datos
      if (reportType === 'all') {
        const validRecordsSorted = [...records].filter(r => r.fecha_soporte).sort((a, b) => new Date(a.fecha_soporte) - new Date(b.fecha_soporte));
        if (validRecordsSorted.length > 0) {
          const firstDate = new Date(validRecordsSorted[0].fecha_soporte);
          const lastDate = new Date(validRecordsSorted[validRecordsSorted.length - 1].fecha_soporte);
          if (firstDate.getFullYear() === lastDate.getFullYear()) {
            periodText = `AÑO ${firstDate.getFullYear()}`;
          } else {
            periodText = `${formatMonth(firstDate)} - ${formatMonth(lastDate)}`;
          }
        }
      }

      // Resto de la lógica de generación (Imágenes, Títulos, Tabla...)
      const loadImage = (url) => new Promise((resolve) => {
        const img = new Image(); img.src = url;
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
      })

      const [headerImg, footerImg] = await Promise.all([loadImage('/cabezap.png'), loadImage('/piep.png')])

      const addMembrete = (pdf) => {
        const pageWidth = pdf.internal.pageSize.width
        const pageHeight = pdf.internal.pageSize.height
        if (headerImg) pdf.addImage(headerImg, 'PNG', 10, 5, pageWidth - 20, 25)
        if (footerImg) pdf.addImage(footerImg, 'PNG', 10, pageHeight - 30, pageWidth - 20, 25)
      }

      addMembrete(doc)
      doc.setFontSize(16); doc.setFont('helvetica', 'bold');
      doc.text('REPORTE DE ACTIVIDADES', 105, 45, { align: 'center' })
      
      doc.setFontSize(11); 
      doc.setFont('helvetica', 'bold'); doc.text(`Técnico: `, 15, 55)
      let labelWidth = doc.getTextWidth(`Técnico: `)
      doc.setFont('helvetica', 'normal'); doc.text(`${tecnico.nombre.toUpperCase()}`, 15 + labelWidth + 2, 55)
      
      doc.setFont('helvetica', 'bold'); doc.text(`Periodo: `, 15, 62)
      labelWidth = doc.getTextWidth(`Periodo: `)
      doc.setFont('helvetica', 'normal'); doc.text(`${periodText}`, 15 + labelWidth + 2, 62)
      
      doc.setFont('helvetica', 'bold'); doc.text(`Total de Soportes Realizados: `, 15, 69)
      labelWidth = doc.getTextWidth(`Total de Soportes Realizados: `)
      doc.setFont('helvetica', 'normal'); doc.text(`${records.length}`, 15 + labelWidth + 2, 69)

      const tableData = []
      let lastMonth = ''
      records.forEach(record => {
        const dateObj = record.fecha_soporte ? new Date(record.fecha_soporte) : null;
        const isValidDate = dateObj && !isNaN(dateObj.getTime());
        const currentMonth = isValidDate ? formatMonth(dateObj) : 'FECHA NO REGISTRADA';
        if (currentMonth !== lastMonth) {
          tableData.push([{ content: currentMonth, colSpan: 4, styles: { halign: 'center', fillColor: [240, 240, 240], fontStyle: 'bold' } }])
          lastMonth = currentMonth
        }
        const depts = (record.expand?.departamento?.map(d => d.nombre).join(', ') || 'N/A').toUpperCase()
        const fecha = isValidDate ? dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A';
        tableData.push([(record.asunto || 'N/A').toUpperCase(), (record.descripcion_problema || 'N/A').toUpperCase(), depts, fecha])
      })

      autoTable(doc, {
        startY: 75,
        head: [['ASUNTO', 'DESCRIPCIÓN', 'DEPARTAMENTO', 'FECHA']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'center' },
        columnStyles: { 0: { width: 40 }, 1: { width: 70 }, 2: { width: 50 }, 3: { width: 25, halign: 'center' } },
        margin: { left: 15, right: 15, top: 35, bottom: 35 },
        didDrawPage: (data) => { if (data.pageNumber > 1) addMembrete(doc) }
      })

      doc.save(`reporte_${tecnico.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`.toLowerCase())
      setOpen(false)
    } catch (error) {
      console.error('Error:', error); alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString())

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {asMenuItem ? (
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 h-9 text-xs font-semibold uppercase hover:bg-secondary/80">
            <FileDown className="h-3.5 w-3.5 text-green-600" /> Reporte de Actividades
          </Button>
        ) : (
          <Button variant="outline" size="sm" title="Reporte de Actividades" className="text-green-600 hover:text-green-700 hover:bg-green-50">
            <FileDown className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-green-600" /> Generar Reporte
          </DialogTitle>
          <DialogDescription>
            Reporte de actividades para <strong>{tecnico.nombre}</strong>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground mr-2">Filtrar por:</Label>
            <div className="flex gap-2">
              <Button 
                variant={reportType === 'all' ? 'default' : 'outline'} 
                size="xs" 
                onClick={() => setReportType('all')}
                className="text-[10px] h-7 uppercase font-bold"
              >
                Histórico
              </Button>
              <Button 
                variant={reportType === 'year' ? 'default' : 'outline'} 
                size="xs" 
                onClick={() => setReportType('year')}
                className="text-[10px] h-7 uppercase font-bold"
              >
                Por Año
              </Button>
              <Button 
                variant={reportType === 'range' ? 'default' : 'outline'} 
                size="xs" 
                onClick={() => setReportType('range')}
                className="text-[10px] h-7 uppercase font-bold"
              >
                Rango
              </Button>
            </div>
          </div>

          {reportType === 'year' && (
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold">Seleccionar Año</Label>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          )}

          {reportType === 'range' && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase">Desde</Label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase">Hasta</Label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs" />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={generatePDF} 
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
            {loading ? 'Generando...' : 'Descargar Reporte'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
