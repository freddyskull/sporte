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
    type: 'searchable-select',
    options: asuntoOptions,
    gridCols: 'md:col-span-1'
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'pendiente', label: 'Pendiente' },
      { value: 'en progreso', label: 'En Pregreso' },
      { value: 'resuelto', label: 'Resuelto' },
    ],
    gridCols: 'md:col-span-1'
  },
  {
    key: 'fecha_soporte',
    label: 'Fecha del Soporte',
    type: 'date',
    defaultValue: new Date().toLocaleDateString('en-CA'),
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

const SoporteDialog = ({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  mode = 'create',
  item = null,
  className,
  children,
  onSuccess
}) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const onOpenChange = externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalOpen

  const { createHistorial, updateHistorial } = useHistorialStore()
  const { departamentos, fetchDepartamentos } = useDepartamentosStore()
  const { tecnicos, fetchTecnicos } = useTecnicosStore()
  const { asuntos, fetchAsuntos } = useAsuntosStore()

  const { getDraft, setDraft, clearDraft } = useDraftStore()
  const [hasDraft, setHasDraft] = useState(false)
  const [currentDraft, setCurrentDraft] = useState(null)

  useEffect(() => {
    // Solo chequear borrador en modo creación
    if (mode === 'create') {
      const draft = getDraft(DRAFT_KEY)
      setHasDraft(!!draft && Object.keys(draft).length > 0)
    }
  }, [getDraft, mode])

  useEffect(() => {
    if (open) {
      if (mode === 'create') {
        const draft = getDraft(DRAFT_KEY)
        if (draft && Object.keys(draft).length > 0) {
          setCurrentDraft(draft)
          setHasDraft(true)
        } else {
          setCurrentDraft(null)
          setHasDraft(false)
        }
      }
    } else if (mode === 'create') {
      const draft = getDraft(DRAFT_KEY)
      setHasDraft(!!draft && Object.keys(draft).length > 0)
    }
  }, [open, getDraft, mode])


  useEffect(() => {
    fetchDepartamentos()
    fetchTecnicos()
    fetchAsuntos()
  }, [fetchDepartamentos, fetchTecnicos, fetchAsuntos])

  const departamentoOptions = useMemo(() => departamentos.map(d => ({ value: d.id, label: d.nombre })), [departamentos])
  const tecnicoOptions = useMemo(() => 
    tecnicos
      .filter(t => !t.cargo?.toUpperCase().includes('JEFE'))
      .map(t => ({ value: t.id, label: t.nombre })), 
    [tecnicos]
  )

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
  const localToday = today.toLocaleDateString('en-CA')

  const dynamicFields = useMemo(() => [
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
      type: 'searchable-multi-select',
      options: tecnicoOptions,
      gridCols: 'md:col-span-1'
    },
  ], [mergedAsuntoOptions, departamentoOptions, tecnicoOptions, localToday])

  const handleSubmit = async (data) => {
    try {
      const formattedData = { ...data }
      delete formattedData.mostrar_detalles

      if (formattedData.fecha_soporte) {
        formattedData.fecha_soporte = new Date(formattedData.fecha_soporte + 'T12:00:00').toISOString()
      }

      if (mode === 'create') {
        await createHistorial(formattedData)
        clearDraft(DRAFT_KEY)
        setHasDraft(false)
        setCurrentDraft(null)
      } else {
        await updateHistorial(item.id, formattedData)
      }

      if (onSuccess) onSuccess()
      onOpenChange(false)
    } catch (e) {
      console.error("Failed to save support", e)
      alert("Error al guardar el soporte")
    }
  }

  const handleFormChange = (newData) => {
    if (mode === 'create') {
      setDraft(DRAFT_KEY, newData)
      setHasDraft(true)
    }
  }

  const initialData = useMemo(() => {
    if (mode === 'edit' && item) {
      const formattedItem = { ...item }
      // Formatear fecha para el input
      if (item.fecha_soporte) {
        formattedItem.fecha_soporte = item.fecha_soporte.split(/[T ]/)[0]
      }

      // Auto-activar mostrar_detalles si hay datos técnicos
      const aux = typeof item.campo_auxiliar === 'string'
        ? JSON.parse(item.campo_auxiliar || '{}')
        : (item.campo_auxiliar || {})

      if (aux.especificaciones || aux.nombre_equipo || aux.serial_bienes || aux.direccion_mac) {
        formattedItem.mostrar_detalles = true
      }
      return formattedItem
    }

    // Modo creación (con borrador si existe)
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

    return currentDraft ? { ...defaults, ...currentDraft } : defaults
  }, [mode, item, dynamicFields, currentDraft])

  const triggerButton = children ? (
    React.isValidElement(children) ? (
      React.cloneElement(children, {
        className: (mode === 'create' && hasDraft)
          ? `${children.props.className || ''} bg-amber-500 hover:bg-amber-600 text-white`
          : children.props.className
      })
    ) : children
  ) : (
    <Button className={`${className} ${(mode === 'create' && hasDraft) ? 'bg-amber-500 hover:bg-amber-600' : ''}`}>
      {(mode === 'create' && hasDraft) ? (
        <span className="flex items-center gap-2">
          Continuar <Edit className="h-4 w-4" />
        </span>
      ) : (mode === 'create' ? 'Nuevo Soporte' : 'Editar Soporte')}
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Solo mostrar trigger si se pasaron hijos o si no se controla externamente */}
      {externalOpen === undefined && (
        <DialogTrigger asChild>
          {triggerButton}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[40vw] px-12">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Editar Soporte' : (hasDraft ? 'Continuar Editando Borrador' : 'Nuevo Soporte')}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? 'Modifica la información del soporte técnico.'
              : (hasDraft ? 'Tienes un soporte sin guardar. Continúa donde lo dejaste.' : 'Registra un nuevo soporte técnico.')}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <DataForm
            fields={dynamicFields}
            initialData={initialData}
            onSubmit={handleSubmit}
            onChange={handleFormChange}
            onCancel={() => onOpenChange(false)}
            submitLabel={mode === 'create' ? 'Crear Soporte' : 'Actualizar Soporte'}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SoporteDialog
