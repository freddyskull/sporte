
import React, { useEffect } from 'react'
import { Layout } from '../Layout'
import useHistorialStore from '../stores/historialStore'
import useDepartamentosStore from '../stores/departamentosStore'
import useTecnicosStore from '../stores/tecnicosStore'
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
import { X, Filter } from 'lucide-react'

const columns = [
  {
    accessorKey: 'asunto', header: 'Asunto',
    cell: ({ getValue }) => (
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-blue-200 uppercase text-nowrap overflow-hidden h-[20px] line-clamp-1" title={getValue()}>
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
    header: 'Técnicos Asociados',
    cell: ({ row }) => {
      const tecnicos = row.original.expand?.tecnicos_asociados || []
      return tecnicos.length ? (
        <div className="flex flex-wrap gap-1">
          {tecnicos.map((t) => (
            <Badge key={t.id} variant="secondary">
              {t.nombre}
            </Badge>
          ))}
        </div>
      ) : (
        <span className='text-xs'>N/A</span>
      )
    },
  },
  {
    id: 'departamento',
    header: 'Departamento',
    cell: ({ row }) => {
      const departamento = row.original.expand?.departamento
      return departamento ? (
        <Badge variant="outline">
          {departamento.nombre}
        </Badge>
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
  { value: 'falla del saad', label: 'Falla del SAAD' },
  { value: 'falla de conexión', label: 'Falla de conexión' },
  { value: 'falla de internet', label: 'Falla de internet' },
  { value: 'falla de red', label: 'Falla de red' },
  { value: 'mantenimiento correctivo', label: 'Mantenimiento Correctivo' },
  { value: 'mantenimiento preventivo', label: 'Mantenimiento Preventivo' },
  { value: 'cableado estructurado', label: 'Cableado Estructurado' },
  { value: 'soporte de red', label: 'Soporte de red' },
]

const statusOptions = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en progreso', label: 'En Progreso' },
  { value: 'resuelto', label: 'Resuelto' },
]

const fields = [
  {
    key: 'asunto',
    label: 'Asunto',
    type: 'select',
    options: asuntoOptions,
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: statusOptions,
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

export const Historial = () => {
  const { historial, loading, error, fetchHistorial, createHistorial, updateHistorial, deleteHistorial } = useHistorialStore()
  const { departamentos, fetchDepartamentos } = useDepartamentosStore()
  const { tecnicos, fetchTecnicos } = useTecnicosStore()

  useEffect(() => {
    fetchHistorial()
    fetchDepartamentos()
    fetchTecnicos()
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
          options={asuntoOptions}
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
            className={
              `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase text-nowrap
                    ${getValue() === 'pendiente' && 'bg-amarillo text-yellow-800'}
                    ${getValue() === 'en progreso' && 'bg-verde text-green-800'}
                    ${getValue() === 'resuelto' && 'bg-azul text-blue-800'}
                    `
            }
            title={getValue()}>
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
      header: 'Técnicos Asociados',
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
              <div className="flex flex-wrap gap-1">
                {tecnicos.map((t) => (
                  <Badge key={t.id} variant="secondary">
                    {t.nombre}
                  </Badge>
                ))}
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
      cell: ({ row }) => {
        const departamento = row.original.expand?.departamento
        // Value for editing is ID
        const rawValue = row.original.departamento

        return (
          <EditableCell
            value={rawValue}
            id={row.original.id}
            field="departamento"
            type="searchable-select"
            options={departamentoOptions}
            onSave={updateHistorial}
          >
            {departamento ? (
              <Badge variant="outline">
                {departamento.nombre}
              </Badge>
            ) : (
              <span className='text-xs'>N/A</span>
            )}
          </EditableCell>
        )
      }
    },

    {
      accessorKey: 'fecha_soporte',
      header: 'Fecha soporte',
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
  ], [asuntoOptions, statusOptions, departamentoOptions, tecnicoOptions, updateHistorial])

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
        data={filteredHistorial}
        columns={columns}
        fields={dynamicFields}
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

