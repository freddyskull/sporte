
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileText } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const InformeTecnicoDialog = ({ item, tecnicos, asMenuItem = false }) => {
  const [open, setOpen] = useState(false)
  const [specs, setSpecs] = useState(item.campo_auxiliar?.especificaciones || '')
  const [descripcion, setDescripcion] = useState(item.descripcion_problema || '')
  const [tecnicoId, setTecnicoId] = useState('')

  const generatePDF = async () => {
    const doc = new jsPDF()
    const selectedTecnico = tecnicos.find(t => t.id === tecnicoId)
    const aux = item.campo_auxiliar || {}
    const primaryColor = [0, 0, 0] // Negro para mayor formalidad

    // Función para cargar imágenes y transformarlas a Base64
    const loadImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = url
        img.onload = () => resolve(img)
        img.onerror = (e) => reject(e)
      })
    }

    try {
      const [headerImg, footerImg] = await Promise.all([
        loadImage('/cabezap.png'),
        loadImage('/piep.png')
      ])

      const addMembrete = (pdf) => {
        const pageWidth = pdf.internal.pageSize.width
        const pageHeight = pdf.internal.pageSize.height
        // Header (cabezap.png)
        pdf.addImage(headerImg, 'PNG', 10, 5, pageWidth - 20, 25)
        // Footer (piep.png)
        pdf.addImage(footerImg, 'PNG', 10, pageHeight - 30, pageWidth - 20, 25)
      }

      addMembrete(doc)

      // Título
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('INFORME TÉCNICO DE SOPORTE', 105, 45, { align: 'center' })

      // Fecha en la esquina superior derecha
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const fechaHoy = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
      doc.text(`Fecha de Emisión: ${fechaHoy}`, 190, 52, { align: 'right' })

      // 1. Información del Soporte
      doc.setDrawColor(200)
      doc.setFillColor(245, 245, 245)
      doc.rect(15, 57, 180, 7, 'F')
      doc.setFont('helvetica', 'bold')
      doc.text('1. IDENTIFICACIÓN DEL SERVICIO', 20, 62)

      const infoTableData = [
        ['ASUNTO:', (item.asunto || 'N/A').toUpperCase(), 'ESTATUS:', (item.status || 'N/A').toUpperCase()],
        ['FECHA SOPORTE:', item.fecha_soporte ? new Date(item.fecha_soporte).toLocaleDateString('es-ES') : 'N/A', 'ID REGISTRO:', item.id.toUpperCase()],
        ['DEPARTAMENTO:', (item.expand?.departamento?.map(d => d.nombre).join(', ') || 'N/A').toUpperCase(), '', '']
      ]

      autoTable(doc, {
        startY: 65,
        body: infoTableData,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 2, overflow: 'linebreak' },
        columnStyles: {
          0: { fontStyle: 'bold', fillColor: [240, 240, 240], width: 35 },
          2: { fontStyle: 'bold', fillColor: [240, 240, 240], width: 35 }
        },
        margin: { left: 15, right: 15 }
      })

      // 2. Información del Equipo
      let currentY = doc.lastAutoTable.finalY + 10
      doc.setFillColor(245, 245, 245)
      doc.rect(15, currentY, 180, 7, 'F')
      doc.setFont('helvetica', 'bold')
      doc.text('2. ESPECIFICACIONES DEL EQUIPO', 20, currentY + 5)

      const equipmentData = [
        ['NOMBRE EQUIPO:', (aux.nombre_equipo || 'N/A').toUpperCase()],
        ['SERIAL BIENES:', (aux.serial_bienes || 'N/A').toUpperCase()],
        ['DIRECCIÓN MAC:', (aux.direccion_mac || 'N/A').toUpperCase()],
        ['COMPONENTES:', (specs || 'DETALLES GENÉRICOS').toUpperCase()]
      ]

      autoTable(doc, {
        startY: currentY + 8,
        body: equipmentData,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: { 0: { fontStyle: 'bold', fillColor: [240, 240, 240], width: 45 } },
        margin: { left: 15, right: 15 }
      })

      // 3. Descripción y Acciones
      currentY = doc.lastAutoTable.finalY + 10

      // Chequear si cabe en la página actual
      if (currentY > 200) {
        doc.addPage()
        addMembrete(doc)
        currentY = 45
      }

      doc.setFillColor(245, 245, 245)
      doc.rect(15, currentY, 180, 7, 'F')
      doc.setFont('helvetica', 'bold')
      doc.text('3. DESCRIPCIÓN DEL PROBLEMA Y ACCIONES REALIZADAS', 20, currentY + 5)

      autoTable(doc, {
        startY: currentY + 8,
        body: [[(descripcion || 'NO SE PROPORCIONÓ DESCRIPCIÓN DETALLADA.').toUpperCase()]],
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 5, minCellHeight: 40 },
        margin: { left: 15, right: 15 }
      })

      // Firmas
      currentY = doc.lastAutoTable.finalY + 25
      if (currentY > 240) {
        doc.addPage()
        addMembrete(doc)
        currentY = 50
      }

      doc.setDrawColor(0)
      doc.setLineWidth(0.5)

      // Línea de firma técnico
      doc.line(30, currentY, 80, currentY)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('ENTREGADO POR (TÉCNICO)', 55, currentY + 5, { align: 'center' })
      doc.setFont('helvetica', 'normal')
      doc.text(selectedTecnico ? selectedTecnico.nombre.toUpperCase() : 'FIRMA DEL TÉCNICO', 55, currentY + 10, { align: 'center' })

      // Línea de firma usuario/recibido
      doc.line(130, currentY, 180, currentY)
      doc.setFont('helvetica', 'bold')
      doc.text('RECIBIDO CONFORME (USUARIO)', 155, currentY + 5, { align: 'center' })
      doc.setFont('helvetica', 'normal')
      doc.text('FIRMA Y SELLO', 155, currentY + 10, { align: 'center' })

      // Generar nombre de archivo: informe_tecnico_TECNICO_FECHA_CREACION
      const tecnicoName = selectedTecnico ? selectedTecnico.nombre.replace(/\s+/g, '_') : 'SINDATO'
      const fechaFull = item.created || new Date().toISOString()
      const fechaLimpia = fechaFull.split(/[\sT]/)[0] // Obtener solo YYYY-MM-DD
      const fileName = `informe_tecnico_${tecnicoName}_${fechaLimpia}.pdf`.toLowerCase()

      doc.save(fileName)
      setOpen(false)
    } catch (error) {
      console.error('Error generando PDF:', error)
      alert('Error al cargar las imágenes del membrete. Asegúrese de que cabezap.png y piep.png existen en public/')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {asMenuItem ? (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 h-9 text-xs font-semibold uppercase hover:bg-secondary/80"
          >
            <FileText className="h-3.5 w-3.5 text-blue-500" />
            Generar Informe
          </Button>
        ) : (
          <Button variant="outline" size="sm" title="Generar Informe Técnico" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <FileText className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent >
        <DialogHeader>
          <DialogTitle>Generar Informe Técnico</DialogTitle>
          <DialogDescription>
            Complete los detalles para generar el PDF del informe técnico.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {item.campo_auxiliar?.nombre_equipo && (
            <div className="bg-secondary/30 p-3 rounded-md border border-primary/10 text-[11px] leading-relaxed">
              <p className="text-primary font-bold uppercase tracking-wider mb-1">Resumen del Equipo</p>
              <p><strong className="text-foreground/70">Equipo:</strong> {item.campo_auxiliar.nombre_equipo}</p>
              {item.campo_auxiliar.serial_bienes && <p><strong className="text-foreground/70">Serial:</strong> {item.campo_auxiliar.serial_bienes}</p>}
              {item.campo_auxiliar.direccion_mac && <p><strong className="text-foreground/70">MAC:</strong> {item.campo_auxiliar.direccion_mac}</p>}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="specs">Especificaciones de la PC</Label>
            <Textarea
              id="specs"
              placeholder="Ej: Dell Optiplex, 16GB RAM, i5-12th gen, Serial:..."
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="descripcion">Descripción del Problema / Observaciones</Label>
            <Textarea
              id="descripcion"
              placeholder="Describa el problema detalladamente..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tecnico">Técnico que genera el informe <span className="text-red-500">*</span></Label>
            <Select value={tecnicoId} onValueChange={setTecnicoId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un técnico" />
              </SelectTrigger>
              <SelectContent>
                {tecnicos.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={generatePDF} disabled={!tecnicoId} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
            Descargar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

