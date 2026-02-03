import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import useHistorialStore from '../stores/historialStore'
import useDepartamentosStore from '../stores/departamentosStore'
import useTecnicosStore from '../stores/tecnicosStore'
import DataForm from './DataForm'

const fields = [
  {
    key: 'asunto',
    label: 'Asunto',
    type: 'select',
    options: [
      { value: 'soporte técnico', label: 'Soporte técnico' },
      { value: 'soporte ofimático', label: 'Soporte ofimático' },
      { value: 'falla del saad', label: 'Falla del SAAD' },
      { value: 'falla de conexión', label: 'Falla de conexión' },
      { value: 'falla de internet', label: 'Falla de internet' },
      { value: 'falla de red', label: 'Falla de red' },
      { value: 'mantenimiento correctivo', label: 'Mantenimiento Correctivo' },
      { value: 'mantenimiento preventivo', label: 'Mantenimiento Preventivo' },
      { value: 'cableado estructurado', label: 'Cableado Estructurado' },
      { value: 'soporte de red', label: 'Soporte de red' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'pendiente', label: 'Pendiente' },
      { value: 'en progreso', label: 'En Progreso' },
      { value: 'resuelto', label: 'Resuelto' },
    ],
  },
  { key: 'descripcion_problema', label: 'Descripción del Problema', type: 'textarea', optional: true },
  {
    key: 'fecha_soporte',
    label: 'Fecha del Soporte',
    type: 'date',
    defaultValue: new Date().toISOString().split('T')[0],
    max: new Date().toISOString().split('T')[0],
  },
]

const NuevoSoporteDialog = ({ className, children }) => {
  const [open, setOpen] = useState(false)
  const { createHistorial } = useHistorialStore()
  const { departamentos, fetchDepartamentos } = useDepartamentosStore()
  const { tecnicos, fetchTecnicos } = useTecnicosStore()

  useEffect(() => {
    // Load dependencies when component mounts (or when dialog opens if we wanted to optimize)
    fetchDepartamentos()
    fetchTecnicos()
  }, [fetchDepartamentos, fetchTecnicos])

  const departamentoOptions = departamentos.map(d => ({ value: d.id, label: d.nombre }))
  const tecnicoOptions = tecnicos.map(t => ({ value: t.id, label: t.nombre }))

  const today = new Date()
  const localToday = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')

  const dynamicFields = [
    ...fields.map(f => f.key === 'fecha_soporte' ? { ...f, defaultValue: localToday, max: localToday } : f),
    {
      key: 'departamento',
      label: 'Departamento',
      type: 'searchable-select',
      options: departamentoOptions,
    },
    {
      key: 'tecnicos_asociados',
      label: 'Técnicos Asociados',
      type: 'multi-select',
      options: tecnicoOptions,
    },
  ]

  const handleSubmit = async (data) => {
    try {
      // Ensure date is properly formatted as a full datetime
      const formattedData = { ...data }
      if (formattedData.fecha_soporte) {
        formattedData.fecha_soporte = new Date(formattedData.fecha_soporte + 'T12:00:00').toISOString()
      }
      await createHistorial(formattedData)
      setOpen(false)
      // Optionally show success toast/alert
    } catch (e) {
      console.error("Failed to create support", e)
      alert("Error al crear el soporte")
    }
  }

  // Initial form data
  const initialData = dynamicFields.reduce((acc, field) => ({
    ...acc,
    [field.key]: field.defaultValue || ''
  }), {})

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className={className}>Nuevo Soporte</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo Soporte</DialogTitle>
          <DialogDescription>
            Registra un nuevo soporte técnico.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <DataForm
            fields={dynamicFields}
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
            submitLabel="Crear Soporte"
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default NuevoSoporteDialog
