
import React, { useEffect } from 'react'
import { Layout } from '../Layout'
import useHistorialStore from '../stores/historialStore'
import useDepartamentosStore from '../stores/departamentosStore'
import useTecnicosStore from '../stores/tecnicosStore'
import useAsuntosStore from '../stores/asuntosStore'
import DataTable from '../components/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Filter, Monitor, Cpu, Tag, Wifi, Info } from 'lucide-react'
import { InformeTecnicoDialog } from '../components/InformeTecnicoDialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const columns = [
  {
    accessorKey: 'asunto', header: 'Asunto',
    cell: ({ getValue }) => (
      <div
        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary/50 text-foreground/70 border border-border uppercase truncate max-w-[80px] md:max-w-[150px]"
        title={getValue()}
      >
        {getValue()}
      </div>
    )
  },
  {
    accessorKey: 'status', header: 'Status',
    cell: ({ getValue }) => (
      <div
        className={
          `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase text-nowrap
        ${getValue() === 'pendiente' && 'bg-yellow-100 text-yellow-800 border-yellow-200'}
        ${getValue() === 'en progreso' && 'bg-green-100 text-green-800 border-green-200'}
        ${getValue() === 'resuelto' && 'bg-blue-100 text-blue-800 border-blue-200'}
        `
        }
        title={getValue()}>
        {getValue()}
      </div>
    )
  },
  {
    accessorKey: 'descripcion_problema', header: 'Descripción',
    cell: ({ getValue }) => (
      <div className="max-w-xs line-clamp-1 text-xs" title={getValue()}>
        {getValue() || 'N/A'}
      </div>
    )
  },
  {
    id: 'tecnicos_asociados',
    header: 'Técnicos',
    accessorFn: (row) => (row.expand?.tecnicos_asociados || []).map(t => t.nombre).join(', '),
    cell: ({ row }) => {
      const nombresCompletos = tecnicos.map(t => t.nombre).join(', ')
      return tecnicos.length ? (
        <div className="flex gap-1 items-center cursor-help" title={`Técnicos: ${nombresCompletos}`}>
          <Badge variant="secondary" className="truncate max-w-[100px]">
            {tecnicos[0].nombre}
          </Badge>
          {tecnicos.length > 1 && (
            <Badge variant="outline" className="text-[10px] font-bold">
              +{tecnicos.length - 1}
            </Badge>
          )}
        </div>
      ) : (
        <span className='text-xs'>N/A</span>
      )
    },
  },
  {
    id: 'departamento',
    header: 'Departamento',
    accessorFn: (row) => row.expand?.departamento?.nombre || '',
    cell: ({ row }) => {
      const expandedData = row.original.expand?.departamento
      const departamentos = Array.isArray(expandedData) ? expandedData : (expandedData ? [expandedData] : [])
      const nombresCompletos = departamentos.map(d => d.nombre).join(', ')

      return departamentos.length ? (
        <div className="flex gap-1 items-center cursor-help" title={`Departamentos: ${nombresCompletos}`}>
          <Badge variant="outline" className="truncate max-w-[120px]">
            {departamentos[0].nombre}
          </Badge>
          {departamentos.length > 1 && (
            <Badge variant="secondary" className="text-[10px] font-bold">
              +{departamentos.length - 1}
            </Badge>
          )}
        </div>
      ) : (
        <span className='text-xs'>N/A</span>
      )
    }
  },

  {
    accessorKey: 'fecha_soporte',
    header: 'Fecha soporte',
    cell: ({ getValue }) => {
      const rawValue = getValue()
      if (!rawValue) return <span className="text-xs">N/A</span>

      // Parse manually to avoid timezone shifts (UTC vs Local)
      // Expecting standard ISO string or YYYY-MM-DD (with T or space separator)
      const datePart = String(rawValue).split(/[T ]/)[0]
      const [year, month, day] = datePart.split('-').map(Number)

      // Create date in LOCAL time (browser's timezone) using components
      // new Date(year, monthIndex, day)
      // Note: month is 0-indexed in JS Date
      const localDate = new Date(year, month - 1, day)

      const formattedDate = localDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      })

      // Retornamos el Badge con Tailwind
      return (
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-blue-200 uppercase text-nowrap"
          title={`Raw: ${rawValue} | Parsed: ${localDate.toString()}`}
        >
          {formattedDate}
        </span>
      )
    },
  },
  // {
  //   accessorKey: 'created',
  //   header: 'creación',
  //   cell: ({ getValue }) => {
  //     // 1. Formateamos la fecha
  //     const date = new Date(getValue()).toLocaleDateString('es-ES', {
  //       day: '2-digit',
  //       month: 'short', // 'short' dará "ene", "feb", etc.
  //       year: '2-digit',
  //     })

  //     // 2. Retornamos el Badge con Tailwind
  //     return (
  //       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-blue-200 uppercase text-nowrap">
  //         {date}
  //       </span>
  //     )
  //   },
  // },
]

import { EditableCell } from '@/components/EditableCell'

// Keep arrays as static constants outside if they don't depend on state
const monthOptions = [
  { value: '0', label: 'Enero' },
  { value: '1', label: 'Febrero' },
  { value: '2', label: 'Marzo' },
  { value: '3', label: 'Abril' },
  { value: '4', label: 'Mayo' },
  { value: '5', label: 'Junio' },
  { value: '6', label: 'Julio' },
  { value: '7', label: 'Agosto' },
  { value: '8', label: 'Septiembre' },
  { value: '9', label: 'Octubre' },
  { value: '10', label: 'Noviembre' },
  { value: '11', label: 'Diciembre' },
]

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

const statusOptions = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en progreso', label: 'En Progreso' },
  { value: 'resuelto', label: 'Resuelto' },
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
    options: statusOptions,
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
    key: 'formateo_section',
    label: 'Detalles Técnicos (Solo Formateo)',
    type: 'section',
    gridCols: 'md:col-span-3',
    showIf: (data) => data.asunto === 'formateo'
  },
  {
    key: 'campo_auxiliar.especificaciones',
    label: 'Especificaciones del Equipo',
    type: 'textarea',
    showIf: (data) => data.asunto === 'formateo',
    gridCols: 'md:col-span-3'
  },
  {
    key: 'campo_auxiliar.nombre_equipo',
    label: 'Nombre del Equipo',
    type: 'text',
    showIf: (data) => data.asunto === 'formateo',
    gridCols: 'md:col-span-1'
  },
  {
    key: 'campo_auxiliar.serial_bienes',
    label: 'Serial de Bienes',
    type: 'text',
    optional: true,
    showIf: (data) => data.asunto === 'formateo',
    gridCols: 'md:col-span-1'
  },
  {
    key: 'campo_auxiliar.direccion_mac',
    label: 'Dirección MAC',
    type: 'text',
    optional: true,
    showIf: (data) => data.asunto === 'formateo',
    gridCols: 'md:col-span-1'
  },
]

export const Historial = () => {
  const { historial, loading, error, fetchHistorial, createHistorial, updateHistorial, deleteHistorial } = useHistorialStore()
  const { departamentos, fetchDepartamentos } = useDepartamentosStore()
  const { tecnicos, fetchTecnicos } = useTecnicosStore()
  const { asuntos, fetchAsuntos } = useAsuntosStore()

  useEffect(() => {
    fetchHistorial()
    fetchDepartamentos()
    fetchTecnicos()
    fetchAsuntos()
  }, [])

  // -- Filters State --
  const [showFilters, setShowFilters] = React.useState(false)
  const [startDate, setStartDate] = React.useState('')
  const [endDate, setEndDate] = React.useState('')
  const [selectedYear, setSelectedYear] = React.useState('all')
  const [startMonth, setStartMonth] = React.useState('all') // 0-11 or 'all'
  const [endMonth, setEndMonth] = React.useState('all')     // 0-11 or 'all'

  // Extract unique years from data
  const years = React.useMemo(() => {
    const uniqueYears = new Set(
      historial
        .filter(h => h.fecha_soporte)
        .map(h => parseInt(String(h.fecha_soporte).split(/[T ]/)[0].split('-')[0])) // Safe year extraction
    )
    return Array.from(uniqueYears).sort((a, b) => b - a)
  }, [historial])

  // Filter Logic
  const filteredHistorial = React.useMemo(() => {
    return historial.filter(item => {
      // Robust parsing: utilize the date string components directly to creating local date
      if (!item.fecha_soporte) return false
      const [yVal, mVal, dVal] = String(item.fecha_soporte).split(/[T ]/)[0].split('-').map(Number)
      const itemDate = new Date(yVal, mVal - 1, dVal) // Local midnight

      // 1. Date Range
      if (startDate && new Date(startDate) > itemDate) return false
      if (endDate) {
        const eDate = new Date(endDate)
        eDate.setHours(23, 59, 59, 999)
        if (eDate < itemDate) return false
      }

      // 2. Year
      if (selectedYear !== 'all' && itemDate.getFullYear() !== parseInt(selectedYear)) {
        return false
      }

      // 3. Month Range
      const m = itemDate.getMonth()
      let sM = startMonth === 'all' ? 0 : parseInt(startMonth)
      let eM = endMonth === 'all' ? 11 : parseInt(endMonth)

      if (startMonth !== 'all' && endMonth !== 'all') {
        if (sM <= eM) {
          if (m < sM || m > eM) return false
        } else {
          if (!(m >= sM || m <= eM)) return false
        }
      } else if (startMonth !== 'all') {
        if (m < sM) return false
      } else if (endMonth !== 'all') {
        if (m > eM) return false
      }

      return true
    }).sort((a, b) => {
      // Sort by fecha_soporte descending (newest first)
      const dateA = new Date(a.fecha_soporte)
      const dateB = new Date(b.fecha_soporte)
      return dateB - dateA
    })
  }, [historial, startDate, endDate, selectedYear, startMonth, endMonth])

  const resetFilters = () => {
    setStartDate('')
    setEndDate('')
    setSelectedYear('all')
    setStartMonth('all')
    setEndMonth('all')
  }

  const departamentoOptions = departamentos.map(d => ({ value: d.id, label: d.nombre }))
  const tecnicoOptions = tecnicos.map(t => ({ value: t.id, label: t.nombre }))

  // Merge static options with dynamic ones, removing duplicates by value
  const mergedAsuntoOptions = React.useMemo(() => {
    const dynamicOptions = asuntos.map(a => ({ value: a.nombre.toLowerCase(), label: a.nombre }))
    // Map static with lowercase value to match
    const staticOptsLowercase = asuntoOptions.map(o => ({ ...o, value: o.value.toLowerCase() }))

    const allOptions = [...staticOptsLowercase, ...dynamicOptions]

    // Deduplicate by value
    const uniqueOptions = []
    const seen = new Set()

    for (const opt of allOptions) {
      if (!seen.has(opt.value)) {
        seen.add(opt.value)
        // Capitalize label for consistent display if needed, but preserve original label from DB if available
        uniqueOptions.push(opt)
      }
    }
    return uniqueOptions
  }, [asuntos])

  // Define columns INSIDE component to access Store data and options
  const columns = React.useMemo(() => [
    {
      accessorKey: 'asunto', header: 'Asunto',
      cell: ({ getValue, row }) => (
        <EditableCell
          value={getValue()}
          id={row.original.id}
          field="asunto"
          type="select"
          options={mergedAsuntoOptions}
          onSave={updateHistorial}
        >
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-blue-200 uppercase text-nowrap h-[20px]" title={getValue()}>
            {getValue()}
          </div>
        </EditableCell>
      )
    },
    {
      accessorKey: 'status', header: 'Status',
      cell: ({ getValue, row }) => (
        <EditableCell
          value={getValue()}
          id={row.original.id}
          field="status"
          type="select"
          options={statusOptions}
          onSave={updateHistorial}
        >
          <div
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary/50 text-foreground/70 border border-border uppercase truncate max-w-[80px] md:max-w-[150px]"
            title={getValue()}
          >
            {getValue()}
          </div>
        </EditableCell>
      )
    },
    {
      accessorKey: 'descripcion_problema', header: 'Descripción',
      cell: ({ getValue, row }) => (
        <EditableCell
          value={getValue()}
          id={row.original.id}
          field="descripcion_problema"
          type="textarea"
          onSave={updateHistorial}
        >
          <div className="max-w-xs line-clamp-1 text-xs" title={getValue()}>
            {getValue() || 'N/A'}
          </div>
        </EditableCell>
      )
    },
    {
      id: 'tecnicos_asociados',
      header: 'Técnicos',
      accessorFn: (row) => (row.expand?.tecnicos_asociados || []).map(t => t.nombre).join(', '),
      cell: ({ row }) => {
        const tecnicos = row.original.expand?.tecnicos_asociados || []
        // Value for editing is array of Ids
        const rawValue = row.original.tecnicos_asociados || []

        return (
          <EditableCell
            value={rawValue}
            id={row.original.id}
            field="tecnicos_asociados"
            type="multi-select"
            options={tecnicoOptions}
            onSave={updateHistorial}
          >
            {tecnicos.length ? (
              <div
                className="flex gap-1 items-center cursor-help"
                title={`Técnicos: ${tecnicos.map(t => t.nombre).join(', ')}`}
              >
                <Badge variant="secondary" className="truncate max-w-[100px]">
                  {tecnicos[0].nombre}
                </Badge>
                {tecnicos.length > 1 && (
                  <Badge variant="outline" className="text-[10px] font-bold">
                    +{tecnicos.length - 1}
                  </Badge>
                )}
              </div>
            ) : (
              <span className='text-xs'>N/A</span>
            )}
          </EditableCell>
        )
      },
    },
    {
      id: 'departamento',
      header: 'Departamento',
      accessorFn: (row) => {
        const expandedData = row.expand?.departamento
        const departamentos = Array.isArray(expandedData) ? expandedData : (expandedData ? [expandedData] : [])
        return departamentos.map(d => d.nombre).join(', ')
      },
      cell: ({ row }) => {
        const expandedData = row.original.expand?.departamento
        const departamentos = Array.isArray(expandedData)
          ? expandedData
          : (expandedData ? [expandedData] : [])

        // Value for editing is ID or array of IDs
        const rawValue = row.original.departamento

        return (
          <EditableCell
            value={rawValue}
            id={row.original.id}
            field="departamento"
            type="searchable-multi-select"
            options={departamentoOptions}
            onSave={updateHistorial}
          >
            {departamentos.length > 0 ? (
              <div
                className="flex gap-1 items-center cursor-help"
                title={`Departamentos: ${departamentos.map(d => d.nombre).join(', ')}`}
              >
                <Badge variant="outline" className="truncate max-w-[120px]">
                  {departamentos[0].nombre}
                </Badge>
                {departamentos.length > 1 && (
                  <Badge variant="secondary" className="text-[10px] font-bold">
                    +{departamentos.length - 1}
                  </Badge>
                )}
              </div>
            ) : (
              <span className='text-xs'>N/A</span>
            )}
          </EditableCell>
        )
      }
    },

    {
      accessorKey: 'fecha_soporte',
      header: 'Fecha',
      cell: ({ getValue, row }) => {
        const rawValue = getValue()

        // Display logic
        let content = <span className="text-xs">N/A</span>
        if (rawValue) {
          // Parse manually to avoid timezone shifts (UTC vs Local)
          const datePart = String(rawValue).split(/[T ]/)[0]
          const [year, month, day] = datePart.split('-').map(Number)
          const localDate = new Date(year, month - 1, day)

          const formattedDate = localDate.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          })

          content = (
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-blue-200 uppercase text-nowrap"
              title={`Raw: ${rawValue}`}
            >
              {formattedDate}
            </span>
          )
        }

        return (
          <EditableCell
            value={rawValue}
            id={row.original.id}
            field="fecha_soporte"
            type="date"
            onSave={updateHistorial}
          >
            {content}
          </EditableCell>
        )
      },
    },
    {
      id: 'detalles_equipo',
      header: 'Equipo',
      accessorFn: (row) => {
        const aux = row.campo_auxiliar || {}
        return `${aux.nombre_equipo || ''} ${aux.serial_bienes || ''} ${aux.direccion_mac || ''} ${aux.especificaciones || ''}`.trim()
      },
      cell: ({ row }) => {
        const aux = row.original.campo_auxiliar || {}
        const hasData = aux.especificaciones || aux.serial_bienes || aux.direccion_mac || aux.nombre_equipo

        if (!hasData) return <span className="text-xs text-muted-foreground italic">N/A</span>

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 flex gap-1.5 items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-1.5 max-w-[120px]">
                <Monitor className="h-3.5 w-3.5 shrink-0" />
                <span
                  className="max-w-[80px] truncate text-[11px] font-bold uppercase tracking-tight"
                  title={aux.nombre_equipo || 'Ver equipo'}
                >
                  {aux.nombre_equipo || 'Equipo'}
                </span>
                <Info className="h-3 w-3 opacity-40 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <h4 className="font-bold text-sm border-b pb-1 uppercase flex items-center gap-2">
                  <Monitor className="h-4 w-4" /> Información del Equipo
                </h4>

                {aux.nombre_equipo && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Nombre del Equipo</span>
                    <span className="text-sm font-medium">{aux.nombre_equipo}</span>
                  </div>
                )}

                {aux.serial_bienes && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                      <Tag className="h-3 w-3" /> Serial de Bienes
                    </span>
                    <span className="text-sm font-medium">{aux.serial_bienes}</span>
                  </div>
                )}

                {aux.direccion_mac && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                      <Wifi className="h-3 w-3" /> Dirección MAC
                    </span>
                    <code className="text-xs bg-secondary/40 p-1.5 rounded font-mono text-foreground break-all">
                      {aux.direccion_mac}
                    </code>
                  </div>
                )}

                {aux.especificaciones && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                      <Cpu className="h-3 w-3" /> Especificaciones
                    </span>
                    <p className="text-xs bg-secondary/30 p-2 rounded italic whitespace-pre-wrap leading-relaxed text-foreground/90">
                      {aux.especificaciones}
                    </p>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )
      }
    },
  ], [mergedAsuntoOptions, statusOptions, departamentoOptions, tecnicoOptions, updateHistorial])

  const today = new Date()
  const localToday = today.toLocaleDateString('en-CA')

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
      label: 'Técnicos',
      type: 'multi-select',
      options: tecnicoOptions,
      gridCols: 'md:col-span-1'
    },
  ]

  if (loading) return <Layout><p>Cargando...</p></Layout>
  if (error) return <Layout><p>Error: {error}</p></Layout>

  return (
    <Layout>
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Historial</h1>
          <span className="text-sm text-muted-foreground">Total de soportes: {historial.length}</span>
        </div>

        {showFilters && (
          <Card className="bg-card animate-in fade-in duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Filtros Avanzados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                {/* Date Range */}
                <div className="flex flex-col gap-2">
                  <Label className="text-xs">Fecha Inicio</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs">Fecha Fin</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-background"
                  />
                </div>

                {/* Year */}
                <div className="flex flex-col gap-2">
                  <Label className="text-xs">Año</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {years.map(y => (
                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Month Range */}
                <div className="flex flex-col gap-2">
                  <Label className="text-xs">Mes Inicio</Label>
                  <Select value={startMonth} onValueChange={setStartMonth}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {monthOptions.map(m => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs">Mes Fin</Label>
                  <Select value={endMonth} onValueChange={setEndMonth}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {monthOptions.map(m => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {(startDate || endDate || selectedYear !== 'all' || startMonth !== 'all' || endMonth !== 'all') && (
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={resetFilters} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <X className="mr-2 h-4 w-4" />
                    Limpiar Filtros
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <DataTable
        extraLeftContent={
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-slate-100 border-slate-300" : ""}
            title="Mostrar/Ocultar filtros avanzados"
          >
            <Filter className="h-4 w-4" />
          </Button>
        }
        extraActions={(item, asMenuItem) => (
          <InformeTecnicoDialog item={item} tecnicos={tecnicos} asMenuItem={asMenuItem} />
        )}
        data={filteredHistorial}
        columns={columns}
        fields={dynamicFields}
        draftKey="historial_create_draft"
        onCreate={(data) => {
          const formattedData = { ...data }
          if (formattedData.fecha_soporte) {
            formattedData.fecha_soporte = new Date(formattedData.fecha_soporte + 'T12:00:00').toISOString()
          }
          createHistorial(formattedData)
        }}
        onUpdate={(id, data) => {
          const formattedData = { ...data }
          if (formattedData.fecha_soporte) {
            formattedData.fecha_soporte = new Date(formattedData.fecha_soporte + 'T12:00:00').toISOString()
          }
          updateHistorial(id, formattedData)
        }}
        onDelete={deleteHistorial}
      />
    </Layout>
  )
}
