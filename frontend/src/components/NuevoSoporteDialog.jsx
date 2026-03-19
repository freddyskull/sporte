import React, { useEffect, useState, useMemo } from 'react'
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
import useAsuntosStore from '../stores/asuntosStore'
import DataForm from './DataForm'
import useDraftStore from '../stores/draftStore'
import { Edit } from 'lucide-react'

const asuntoOptions = [
  { value: 'soporte técnico', label: 'Soporte técnico' },
  { value: 'soporte ofimático', label: 'Soporte ofimático' },
  { value: 'soporte impresora', label: 'Soporte impresora' },
  { value: 'falla del saad', label: 'Falla del SAAD' },
  { value: 'falla de red', label: 'Falla de red' },
  { value: 'mantenimiento correctivo', label: 'Mantenimiento Correctivo' },
  { value: 'mantenimiento preventivo', label: 'Mantenimiento Preventivo' },
  { value: 'cableado estructurado', label: 'Cableado Estructurado' },
  { value: 'soporte de red', label: 'Soporte de red' },
  { value: 'formateo', label: 'Formateo' },
]

const fields = [
  {
    key: 'info_section',
    label: 'Información General',
    type: 'section',
    gridCols: 'md:col-span-3'
  },
  {
    key: 'asunto',
    label: 'Asunto',
    type: 'select',
    options: asuntoOptions,
    gridCols: 'md:col-span-1'
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
    gridCols: 'md:col-span-1'
  },
  {
    key: 'fecha_soporte',
    label: 'Fecha del Soporte',
    type: 'date',
    defaultValue: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD local
    max: new Date().toLocaleDateString('en-CA'),
    gridCols: 'md:col-span-1'
  },
  { key: 'descripcion_problema', label: 'Descripción del Problema', type: 'textarea', optional: true, gridCols: 'md:col-span-3' },

  {
    key: 'mostrar_detalles',
    label: '¿Incluir detalles técnicos?',
    type: 'switch',
    optional: true,
    defaultValue: false,
    gridCols: 'md:col-span-3',
  },
  {
    key: 'formateo_section',
    label: 'Detalles Técnicos',
    type: 'section',
    gridCols: 'md:col-span-3',
    showIf: (data) => data.asunto === 'formateo' || data.mostrar_detalles === true
  },
  {
    key: 'campo_auxiliar.especificaciones',
    label: 'Especificaciones del Equipo',
    type: 'textarea',
    optional: true,
    showIf: (data) => data.asunto === 'formateo' || data.mostrar_detalles === true,
    gridCols: 'md:col-span-3'
  },
  {
    key: 'campo_auxiliar.nombre_equipo',
    label: 'Nombre del Equipo',
    type: 'text',
    optional: true,
    showIf: (data) => data.asunto === 'formateo' || data.mostrar_detalles === true,
    gridCols: 'md:col-span-1'
  },
  {
    key: 'campo_auxiliar.serial_bienes',
    label: 'Serial de Bienes',
    type: 'text',
    optional: true,
    showIf: (data) => data.asunto === 'formateo' || data.mostrar_detalles === true,
    gridCols: 'md:col-span-1'
  },
  {
    key: 'campo_auxiliar.direccion_mac',
    label: 'Dirección MAC',
    type: 'text',
    optional: true,
    showIf: (data) => data.asunto === 'formateo' || data.mostrar_detalles === true,
    gridCols: 'md:col-span-1'
  },
]

const DRAFT_KEY = 'nuevo_soporte_main_draft'

const NuevoSoporteDialog = ({ className, children }) => {
  const [open, setOpen] = useState(false)
  const { createHistorial } = useHistorialStore()
  const { departamentos, fetchDepartamentos } = useDepartamentosStore()
  const { tecnicos, fetchTecnicos } = useTecnicosStore()
  const { asuntos, fetchAsuntos } = useAsuntosStore()

  const { getDraft, setDraft, clearDraft } = useDraftStore()
  const [hasDraft, setHasDraft] = useState(false)
  const [currentDraft, setCurrentDraft] = useState(null)

  useEffect(() => {
    // Initial check
    const draft = getDraft(DRAFT_KEY)
    setHasDraft(!!draft && Object.keys(draft).length > 0)
  }, [getDraft])

  useEffect(() => {
    if (open) {
      // When opening, try to load draft
      const draft = getDraft(DRAFT_KEY)
      if (draft && Object.keys(draft).length > 0) {
        setCurrentDraft(draft)
        setHasDraft(true)
      } else {
        // Reset only if we are creating new from scratch without draft
        // But wait, if initialData is used, we need to pass null/empty to reset form
        setCurrentDraft(null)
        setHasDraft(false)
      }
    } else {
      // When closing, re-verify draft existence for trigger button state
      const draft = getDraft(DRAFT_KEY)
      setHasDraft(!!draft && Object.keys(draft).length > 0)
    }
  }, [open, getDraft])


  useEffect(() => {
    // Load dependencies
    fetchDepartamentos()
    fetchTecnicos()
    fetchAsuntos()
  }, [fetchDepartamentos, fetchTecnicos, fetchAsuntos])

  const departamentoOptions = departamentos.map(d => ({ value: d.id, label: d.nombre }))
  const tecnicoOptions = tecnicos.map(t => ({ value: t.id, label: t.nombre }))

  // Merge static options with dynamic ones
  const mergedAsuntoOptions = useMemo(() => {
    const dynamicOptions = asuntos.map(a => ({ value: a.nombre.toLowerCase(), label: a.nombre }))
    const staticOptsLowercase = asuntoOptions.map(o => ({ ...o, value: o.value.toLowerCase() }))
    const allOptions = [...staticOptsLowercase, ...dynamicOptions]

    const uniqueOptions = []
    const seen = new Set()

    for (const opt of allOptions) {
      if (!seen.has(opt.value)) {
        seen.add(opt.value)
        uniqueOptions.push(opt)
      }
    }
    return uniqueOptions
  }, [asuntos])

  const today = new Date()
  const localToday = today.toLocaleDateString('en-CA') // Formato YYYY-MM-DD local, confiable en navegadores modernos

  const dynamicFields = [
    ...fields.map(f => {
      if (f.key === 'fecha_soporte') return { ...f, defaultValue: localToday, max: localToday }
      if (f.key === 'asunto') return { ...f, options: mergedAsuntoOptions }
      return f
    }),
    {
      key: 'asignacion_section',
      label: 'Asignación y Ubicación',
      type: 'section',
      gridCols: 'md:col-span-3'
    },
    {
      key: 'departamento',
      label: 'Departamento',
      type: 'searchable-multi-select',
      options: departamentoOptions,
      gridCols: 'md:col-span-2'
    },
    {
      key: 'tecnicos_asociados',
      label: 'Técnicos Asociados',
      type: 'multi-select',
      options: tecnicoOptions,
      gridCols: 'md:col-span-1'
    },
  ]

  const handleSubmit = async (data) => {
    try {
      const formattedData = { ...data }

      // Eliminar campos auxiliares de UI que no pertenecen a la base de datos
      delete formattedData.mostrar_detalles

      if (formattedData.fecha_soporte) {
        formattedData.fecha_soporte = new Date(formattedData.fecha_soporte + 'T12:00:00').toISOString()
      }
      await createHistorial(formattedData)

      clearDraft(DRAFT_KEY)
      setHasDraft(false)
      setCurrentDraft(null)

      setOpen(false)
    } catch (e) {
      console.error("Failed to create support", e)
      alert("Error al crear el soporte")
    }
  }

  const handleFormChange = (newData) => {
    setDraft(DRAFT_KEY, newData)
    setHasDraft(true)
  }

  // Initial form data default values
  const defaultValues = useMemo(() => {
    const defaults = {}
    dynamicFields.forEach(field => {
      const defaultValue = field.defaultValue !== undefined
        ? field.defaultValue
        : (field.type === 'searchable-multi-select' || field.type === 'multi-select' ? [] : '')
      if (field.key.startsWith('campo_auxiliar.')) {
        const auxKey = field.key.split('.')[1]
        if (!defaults.campo_auxiliar) defaults.campo_auxiliar = {}
        defaults.campo_auxiliar[auxKey] = defaultValue
      } else {
        defaults[field.key] = defaultValue
      }
    })
    return defaults
  }, [dynamicFields])

  // Combine draft with defaults for missing fields if any
  const initialData = currentDraft ? { ...defaultValues, ...currentDraft } : defaultValues

  // Button Style adjustments
  const triggerButton = React.isValidElement(children) ? (
    // If it's a child element, clone it and override className if draft exists
    // We append the orange style ONLY if hasDraft is true
    React.cloneElement(children, {
      className: hasDraft
        ? `${children.props.className || ''} bg-amber-500 hover:bg-amber-600 text-white`
        : children.props.className
    })
  ) : (
    <Button className={`${className} ${hasDraft ? 'bg-amber-500 hover:bg-amber-600' : ''}`}>
      {hasDraft ? (
        <span className="flex items-center gap-2">
          Continuar <Edit className="h-4 w-4" />
        </span>
      ) : 'Nuevo Soporte'}
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {hasDraft ? 'Continuar Editando Borrador' : 'Nuevo Soporte'}
          </DialogTitle>
          <DialogDescription>
            {hasDraft
              ? 'Tienes un soporte sin guardar. Continúa donde lo dejaste.'
              : 'Registra un nuevo soporte técnico.'}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <DataForm
            fields={dynamicFields}
            initialData={initialData}
            onSubmit={handleSubmit}
            onChange={handleFormChange}
            onCancel={() => setOpen(false)}
            submitLabel="Crear Soporte"
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default NuevoSoporteDialog
