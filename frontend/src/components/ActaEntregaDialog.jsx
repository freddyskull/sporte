
import React, { useState, useMemo } from 'react'
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
import { ClipboardCheck } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const ActaEntregaDialog = ({ item, tecnicos, asMenuItem = false }) => {
  const [open, setOpen] = useState(false)
  const [para, setPara] = useState('')
  const [destino, setDestino] = useState('')
  const [descripcion, setDescripcion] = useState(item.descripcion_problema || '')
  const [jefeId, setJefeId] = useState('')

  const jefes = useMemo(() => {
    return tecnicos.filter(t => t.cargo?.toUpperCase().includes('JEFE'))
  }, [tecnicos])

  const generatePDF = async () => {
    const doc = new jsPDF()
    const selectedJefe = tecnicos.find(t => t.id === jefeId)
    const aux = item.campo_auxiliar || {}

    const loadImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = url
        img.onload = () => resolve(img)
        img.onerror = (e) => reject(e)
      })
    }

    try {
      const [headerImg] = await Promise.all([
        loadImage('/cabezap.png')
      ])

      const drawActa = (pdf, yOffset, title) => {
        const pageWidth = pdf.internal.pageSize.width

        // Membrete reducido para que quepan dos
        pdf.addImage(headerImg, 'PNG', 10, yOffset, pageWidth - 20, 15)

        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`ACTA DE ENTREGA - ${title}`, 105, yOffset + 20, { align: 'center' })

        pdf.setFontSize(8)
        pdf.setFont('helvetica', 'normal')
        const fechaHoy = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
        pdf.text(`FECHA: ${fechaHoy}`, 190, yOffset + 20, { align: 'right' })

        // Datos principales simplificados
        const data = [
          ['PARA:', para.toUpperCase(), 'DESTINO:', destino.toUpperCase()],
          ['DESCRIPCIÓN:', { content: descripcion.toUpperCase(), colSpan: 3 }]
        ]

        autoTable(pdf, {
          startY: yOffset + 23,
          body: data,
          theme: 'grid',
          styles: { fontSize: 7, cellPadding: 3 },
          columnStyles: {
            0: { fontStyle: 'bold', width: 25, fillColor: [240, 240, 240] },
            2: { fontStyle: 'bold', width: 25, fillColor: [240, 240, 240] }
          },
          margin: { left: 15, right: 15 }
        })

        const finalY = pdf.lastAutoTable.finalY + 15

        // Firmas
        pdf.setLineWidth(0.2)
        // Jefe
        pdf.line(20, finalY, 70, finalY)
        pdf.setFont('helvetica', 'bold')
        pdf.text('ENTREGADO POR', 45, finalY + 4, { align: 'center' })
        pdf.setFont('helvetica', 'normal')
        const jefeNombre = selectedJefe ? selectedJefe.nombre.toUpperCase() : 'N/A'
        const splitText = pdf.splitTextToSize(jefeNombre, 60)
        pdf.text(splitText, 45, finalY + 8, { align: 'center' })

        // Recibido
        pdf.line(140, finalY, 190, finalY)
        pdf.setFont('helvetica', 'bold')
        pdf.text('RECIBIDO POR', 165, finalY + 4, { align: 'center' })
        pdf.setFont('helvetica', 'normal')
        pdf.text('NOMBRE, APELLIDO Y CÉDULA', 165, finalY + 8, { align: 'center' })
      }

      // Dibujar Original (parte superior)
      drawActa(doc, 10, '')

      // Línea divisoria punteada
      doc.setLineDash([2, 2])
      doc.line(10, 148, 200, 148)
      doc.setLineDash([])

      // Dibujar Duplicado (parte inferior)
      drawActa(doc, 155, '')

      const fileName = `acta_entrega_${item.id}.pdf`.toLowerCase()
      doc.save(fileName)
      setOpen(false)
    } catch (error) {
      console.error('Error generando Acta:', error)
      alert('Error al generar el PDF.')
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
            <ClipboardCheck className="h-3.5 w-3.5 text-green-500" />
            Generar Acta de Entrega
          </Button>
        ) : (
          <Button variant="outline" size="sm" title="Generar Acta de Entrega" className="text-green-600 hover:text-green-700 hover:bg-green-50">
            <ClipboardCheck className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generar Acta de Entrega</DialogTitle>
          <DialogDescription>
            Este documento generará dos copias (Original y Duplicado) en una misma hoja.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="para">Para (Nombre/Cargo)</Label>
            <Input id="para" value={para} onChange={(e) => setPara(e.target.value)} placeholder="Ej: JUAN PEREZ / ADM." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="destino">Destino (Departamento)</Label>
            <Input id="destino" value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Ej: RECURSOS HUMANOS" />
          </div>
          <div className="grid gap-2 col-span-2">
            <Label htmlFor="descripcion">Descripción del Bien/Servicio</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describa lo que se entrega..."
              className="min-h-[60px]"
            />
          </div>
          <div className="grid gap-2 col-span-2">
            <Label htmlFor="jefe">Jefe que autoriza/envía</Label>
            <Select value={jefeId} onValueChange={setJefeId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un jefe" />
              </SelectTrigger>
              <SelectContent>
                {jefes.map((j) => (
                  <SelectItem key={j.id} value={j.id}>
                    {j.nombre} ({j.cargo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button
            onClick={generatePDF}
            disabled={!para || !jefeId}
            className="bg-green-600 hover:bg-green-700 text-white font-bold"
          >
            Descargar Acta (Doble)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
