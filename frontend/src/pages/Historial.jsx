
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
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-blue-200 uppercase text-nowrap overflow-hidden h-[20px] max-w-[100px] line-clamp-1" title={getValue()}>
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
      // 1. Formateamos la fecha
      const date = new Date(getValue()).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short', // 'short' dará "ene", "feb", etc.
        year: '2-digit',
      })

      // 2. Retornamos el Badge con Tailwind
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-blue-200 uppercase text-nowrap">
          {date}
        </span>
      )
    },
  },
  {
    accessorKey: 'created',
    header: 'creación',
    cell: ({ getValue }) => {
      // 1. Formateamos la fecha
      const date = new Date(getValue()).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short', // 'short' dará "ene", "feb", etc.
        year: '2-digit',
      })

      // 2. Retornamos el Badge con Tailwind
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-blue-200 uppercase text-nowrap">
          {date}
        </span>
      )
    },
  },
]

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
        .map(h => new Date(h.fecha_soporte).getFullYear())
    )
    return Array.from(uniqueYears).sort((a, b) => b - a)
  }, [historial])

  // Filter Logic
  const filteredHistorial = React.useMemo(() => {
    return historial.filter(item => {
      const itemDate = new Date(item.fecha_soporte)

      // 1. Date Range
      if (startDate && new Date(startDate) > itemDate) return false
      if (endDate) {
        // Create end date object set to end of that day (or simpler: just compare strings if ISO)
        // Since input is YYYY-MM-DD, comparison with itemDate (ISO full) needs care.
        // Let's assume itemDate includes time.
        const eDate = new Date(endDate)
        eDate.setHours(23, 59, 59, 999)
        if (eDate < itemDate) return false
      }

      // 2. Year
      if (selectedYear !== 'all' && itemDate.getFullYear() !== parseInt(selectedYear)) {
        return false
      }

      // 3. Month Range
      // Month in JS is 0-11
      const m = itemDate.getMonth()
      let sM = startMonth === 'all' ? 0 : parseInt(startMonth)
      let eM = endMonth === 'all' ? 11 : parseInt(endMonth)

      // Handle wrap-around if start > end? Usually Range is Start <= End.
      // If user puts Start: Dec, End: Jan, maybe invalid? Let's assume simple range.
      if (startMonth !== 'all' && endMonth !== 'all') {
        if (sM <= eM) {
          if (m < sM || m > eM) return false
        } else {
          // If Start > End (e.g. Nov to Feb across year boundary?), 
          // but Year filter might conflict. 
          // Let's logic: if sM > eM, allow m >= sM OR m <= eM
          if (!(m >= sM || m <= eM)) return false
        }
      } else if (startMonth !== 'all') {
        // If only start specified, assume "from this month onwards"? 
        // Or strictly "equal"? User said "range".
        // Let's treat singular selection as "Start Month" to "End of Year" if End is All?
        // Or just "month >= startMonth"
        if (m < sM) return false
      } else if (endMonth !== 'all') {
        // If only end specified
        if (m > eM) return false
      }

      return true
    })
  }, [historial, startDate, endDate, selectedYear, startMonth, endMonth])

  const resetFilters = () => {
    setStartDate('')
    setEndDate('')
    setSelectedYear('all')
    setStartMonth('all')
    setEndMonth('all')
  }

  const months = [
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

  if (loading) return <Layout><p>Cargando...</p></Layout>
  if (error) return <Layout><p>Error: {error}</p></Layout>

  return (
    <Layout>
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Historial</h1>
        </div>

        {showFilters && (
          <Card className="bg-white animate-in fade-in duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium uppercase text-slate-500">Filtros Avanzados</CardTitle>
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
                    className="bg-white"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs">Fecha Fin</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-white"
                  />
                </div>

                {/* Year */}
                <div className="flex flex-col gap-2">
                  <Label className="text-xs">Año</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="bg-white">
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
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {months.map(m => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs">Mes Fin</Label>
                  <Select value={endMonth} onValueChange={setEndMonth}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {months.map(m => (
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
          // Ensure date is properly formatted as a full datetime
          const formattedData = { ...data }
          if (formattedData.fecha_soporte) {
            // Append time to ensure it effectively sets the date to the beginning of that day (or noon to avoid timezone shifts)
            formattedData.fecha_soporte = new Date(formattedData.fecha_soporte).toISOString()
          }
          createHistorial(formattedData)
        }}
        onUpdate={(id, data) => {
          // Ensure date is properly formatted as a full datetime
          const formattedData = { ...data }
          if (formattedData.fecha_soporte) {
            formattedData.fecha_soporte = new Date(formattedData.fecha_soporte).toISOString()
          }
          updateHistorial(id, formattedData)
        }}
        onDelete={deleteHistorial}
      />
    </Layout>
  )
}
