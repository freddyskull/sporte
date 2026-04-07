
import React, { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
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
import { Card, CardContent } from '@/components/ui/card'
import { X, Filter, Monitor, Search, RotateCcw } from 'lucide-react'
import { InformeTecnicoDialog } from '../components/InformeTecnicoDialog'
import { ActaEntregaDialog } from '../components/ActaEntregaDialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { EditableCell } from '@/components/EditableCell'
import SoporteDialog from '../components/SoporteDialog'
import { SearchableMultiSelect } from '@/components/ui/SearchableMultiSelect'
import { SearchableSelect } from '@/components/ui/SearchableSelect'

const statusOptions = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en progreso', label: 'En Progreso' },
  { value: 'resuelto', label: 'Resuelto' },
]

export const Historial = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { historial, loading, error, fetchHistorial, updateHistorial, deleteHistorial } = useHistorialStore()
  const { departamentos, fetchDepartamentos } = useDepartamentosStore()
  const { tecnicos, fetchTecnicos } = useTecnicosStore()
  const { asuntos, fetchAsuntos } = useAsuntosStore()

  useEffect(() => {
    fetchHistorial()
    fetchDepartamentos()
    fetchTecnicos()
    fetchAsuntos()
  }, [])

  // -- Estados sincronizados con URL --
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  const [startDate, setStartDate] = useState(searchParams.get('start') || '')
  const [endDate, setEndDate] = useState(searchParams.get('end') || '')
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || 'all')
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all')
  const [selectedAsunto, setSelectedAsunto] = useState(searchParams.get('asunto') || 'all')
  const [selectedDepts, setSelectedDepts] = useState(searchParams.get('depts')?.split(',').filter(Boolean) || [])
  const [selectedTecnicos, setSelectedTecnicos] = useState(searchParams.get('tecs')?.split(',').filter(Boolean) || [])

  // -- Paginación --
  const [pagination, setPagination] = useState({
    pageIndex: parseInt(searchParams.get('page') || '0'),
    pageSize: parseInt(searchParams.get('limit') || '10'),
  })

  const [showFilters, setShowFilters] = useState(searchParams.get('show') === 'true')

  // Sincronizar URL cuando cambian los filtros
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('q', searchTerm)
    if (startDate) params.set('start', startDate)
    if (endDate) params.set('end', endDate)
    if (selectedYear !== 'all') params.set('year', selectedYear)
    if (selectedStatus !== 'all') params.set('status', selectedStatus)
    if (selectedAsunto !== 'all') params.set('asunto', selectedAsunto)
    if (selectedDepts.length > 0) params.set('depts', selectedDepts.join(','))
    if (selectedTecnicos.length > 0) params.set('tecs', selectedTecnicos.join(','))
    if (showFilters) params.set('show', 'true')

    // Paginación
    params.set('page', pagination.pageIndex.toString())
    params.set('limit', pagination.pageSize.toString())

    setSearchParams(params, { replace: true })
  }, [searchTerm, startDate, endDate, selectedYear, selectedStatus, selectedAsunto, selectedDepts, selectedTecnicos, showFilters, pagination, setSearchParams])

  const years = useMemo(() => {
    const uniqueYears = new Set(
      historial
        .filter(h => h.fecha_soporte)
        .map(h => parseInt(String(h.fecha_soporte).split(/[T ]/)[0].split('-')[0]))
    )
    return Array.from(uniqueYears).sort((a, b) => b - a)
  }, [historial])

  const departamentoOptions = useMemo(() => departamentos.map(d => ({ value: d.id, label: d.nombre })), [departamentos])
  const tecnicoOptions = useMemo(() => 
    tecnicos
      .filter(t => !t.cargo?.toUpperCase().includes('JEFE'))
      .map(t => ({ value: t.id, label: t.nombre })), 
    [tecnicos]
  )

  const mergedAsuntoOptions = useMemo(() => {
    const dynamicOptions = asuntos.map(a => ({ value: a.nombre.toLowerCase(), label: a.nombre }))
    const staticAsuntoOptions = [
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
    const all = [...staticAsuntoOptions.map(o => ({ ...o, value: o.value.toLowerCase() })), ...dynamicOptions]
    const unique = []
    const seen = new Set()
    for (const opt of all) {
      if (!seen.has(opt.value)) {
        seen.add(opt.value)
        unique.push(opt)
      }
    }
    return unique
  }, [asuntos])

  const filteredHistorial = useMemo(() => {
    return historial.filter(item => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const aux = item.campo_auxiliar || {}
        const searchableText = [
          item.asunto,
          item.descripcion_problema,
          item.status,
          aux.nombre_equipo,
          aux.serial_bienes,
          aux.direccion_mac,
          aux.especificaciones,
          ...(item.expand?.tecnicos_asociados?.map(t => t.nombre) || []),
          ...(Array.isArray(item.expand?.departamento)
            ? item.expand?.departamento.map(d => d.nombre)
            : [item.expand?.departamento?.nombre])
        ].join(' ').toLowerCase()
        if (!searchableText.includes(term)) return false
      }

      if (!item.fecha_soporte) return false
      const [yVal, mVal, dVal] = String(item.fecha_soporte).split(/[T ]/)[0].split('-').map(Number)
      const itemDate = new Date(yVal, mVal - 1, dVal)

      if (startDate && new Date(startDate) > itemDate) return false
      if (endDate) {
        const eDate = new Date(endDate)
        eDate.setHours(23, 59, 59, 999)
        if (eDate < itemDate) return false
      }

      if (selectedYear !== 'all' && itemDate.getFullYear() !== parseInt(selectedYear)) return false
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false
      if (selectedAsunto !== 'all' && item.asunto?.toLowerCase() !== selectedAsunto) return false

      if (selectedDepts.length > 0) {
        const itemDepts = Array.isArray(item.departamento) ? item.departamento : [item.departamento]
        if (!selectedDepts.some(id => itemDepts.includes(id))) return false
      }

      if (selectedTecnicos.length > 0) {
        const itemTecs = item.tecnicos_asociados || []
        if (!selectedTecnicos.some(id => itemTecs.includes(id))) return false
      }

      return true
    }).sort((a, b) => new Date(b.fecha_soporte) - new Date(a.fecha_soporte))
  }, [historial, searchTerm, startDate, endDate, selectedYear, selectedStatus, selectedAsunto, selectedDepts, selectedTecnicos])

  const resetFilters = () => {
    setSearchTerm('')
    setStartDate('')
    setEndDate('')
    setSelectedYear('all')
    setSelectedStatus('all')
    setSelectedAsunto('all')
    setSelectedDepts([])
    setSelectedTecnicos([])
    setPagination({ pageIndex: 0, pageSize: 10 })
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'asunto', header: 'Asunto',
      cell: ({ getValue, row }) => {
        const displayValue = row.original.expand?.asunto_rel?.nombre || getValue()
        return (
          <EditableCell value={getValue()} id={row.original.id} field="asunto" type="searchable-select" options={mergedAsuntoOptions} onSave={updateHistorial}>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-blue-200 uppercase truncate max-w-[120px] md:max-w-[180px] h-[20px]" title={displayValue}>
              {displayValue}
            </div>
          </EditableCell>
        )
      }
    },
    {
      accessorKey: 'status', header: 'Status',
      cell: ({ getValue, row }) => (
        <EditableCell value={getValue()} id={row.original.id} field="status" type="select" options={statusOptions} onSave={updateHistorial}>
          <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase truncate max-w-[80px] md:max-w-[150px] ${getValue() === 'resuelto' ? 'bg-green-100 text-green-700 border-green-200' :
            getValue() === 'en progreso' ? 'bg-blue-100 text-blue-700 border-blue-200' :
              'bg-amber-100 text-amber-700 border-amber-200'
            }`} title={getValue()}>
            {getValue()}
          </div>
        </EditableCell>
      )
    },
    {
      accessorKey: 'descripcion_problema', header: 'Descripción',
      cell: ({ getValue, row }) => (
        <EditableCell value={getValue()} id={row.original.id} field="descripcion_problema" type="textarea" onSave={updateHistorial}>
          <div className="max-w-xs line-clamp-1 text-xs" title={getValue()}>
            {getValue() || 'N/A'}
          </div>
        </EditableCell>
      )
    },
    {
      id: 'tecnicos_asociados',
      header: 'Técnicos',
      cell: ({ row }) => {
        const tecnicosExpand = row.original.expand?.tecnicos_asociados || []
        return (
          <div className="flex gap-1 items-center">
            <EditableCell value={row.original.tecnicos_asociados || []} id={row.original.id} field="tecnicos_asociados" type="multi-select" options={tecnicoOptions} onSave={updateHistorial}>
              {tecnicosExpand.length ? (
                <Badge variant="secondary" className="truncate max-w-[100px] text-[10px] uppercase">
                  {tecnicosExpand[0].nombre}
                </Badge>
              ) : <span className='text-xs'>N/A</span>}
            </EditableCell>

            {tecnicosExpand.length > 1 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Badge variant="outline" className="text-[10px] font-bold cursor-pointer hover:bg-secondary transition-colors">
                    +{tecnicosExpand.length - 1}
                  </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 shadow-xl border-primary/10" align="start">
                  <div className="space-y-2">
                    <h4 className="font-bold text-[10px] text-muted-foreground uppercase border-b pb-1 mb-2">
                      Técnicos Asignados ({tecnicosExpand.length})
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      {tecnicosExpand.map((tec) => (
                        <div key={tec.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-secondary/30 border border-primary/5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                          <span className="text-xs font-bold uppercase tracking-tight">{tec.nombre}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )
      },
    },
    {
      id: 'departamento',
      header: 'Departamento',
      cell: ({ row }) => {
        const expandedData = row.original.expand?.departamento
        const depts = Array.isArray(expandedData) ? expandedData : (expandedData ? [expandedData] : [])
        const allDeptsNames = depts.map(d => d.nombre).join(', ')
        return (
          <div className="flex gap-1 items-center">
            <EditableCell value={row.original.departamento} id={row.original.id} field="departamento" type="searchable-multi-select" options={departamentoOptions} onSave={updateHistorial}>
              {depts.length > 0 ? (
                <Badge variant="outline" className="truncate max-w-[120px] text-[10px] uppercase" title={allDeptsNames}>
                  {depts[0].nombre}
                </Badge>
              ) : <span className='text-xs'>N/A</span>}
            </EditableCell>

            {depts.length > 1 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Badge variant="secondary" className="text-[10px] font-bold cursor-pointer hover:bg-secondary transition-colors">
                    +{depts.length - 1}
                  </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 shadow-xl border-primary/10" align="start">
                  <div className="space-y-2">
                    <h4 className="font-bold text-[10px] text-muted-foreground uppercase border-b pb-1 mb-2">
                      Departamentos Asignados ({depts.length})
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      {depts.map((dept) => (
                        <div key={dept.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-secondary/30 border border-primary/5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                          <span className="text-xs font-bold uppercase tracking-tight">{dept.nombre}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: 'fecha_soporte', header: 'Fecha',
      cell: ({ getValue, row }) => {
        const rawValue = getValue()
        if (!rawValue) return <span className="text-xs">N/A</span>
        const [year, month, day] = String(rawValue).split(/[T ]/)[0].split('-').map(Number)
        const localDate = new Date(year, month - 1, day)
        const formattedDate = localDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })
        return (
          <EditableCell value={rawValue} id={row.original.id} field="fecha_soporte" type="date" onSave={updateHistorial}>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-50 text-slate-500 border border-slate-200 uppercase" title={formattedDate}>
              {formattedDate}
            </span>
          </EditableCell>
        )
      },
    },
    {
      id: 'detalles_equipo',
      header: 'Equipo',
      cell: ({ row }) => {
        const aux = row.original.campo_auxiliar || {}
        const hasData = aux.especificaciones || aux.serial_bienes || aux.direccion_mac || aux.nombre_equipo
        if (!hasData) return <span className="text-xs text-muted-foreground italic">N/A</span>
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 flex gap-1 items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-1 px-2">
                <Monitor className="h-3 w-3" />
                <span className="max-w-[60px] truncate text-[10px] font-bold uppercase tracking-tight">{aux.nombre_equipo || 'Equipo'}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <h4 className="font-bold text-sm border-b pb-1 uppercase flex items-center gap-2"><Monitor className="h-4 w-4" /> Información</h4>
                {Object.entries({ 'Nombre': aux.nombre_equipo, 'Serial': aux.serial_bienes, 'MAC': aux.direccion_mac, 'Specs': aux.especificaciones }).map(([key, val]) => val && (
                  <div key={key} className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">{key}</span>
                    <span className="text-sm font-medium break-all">{val}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )
      }
    },
  ], [mergedAsuntoOptions, tecnicoOptions, departamentoOptions, updateHistorial])

  return (
    <Layout>
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Historial</h1>
            <p className="text-xs text-muted-foreground uppercase font-medium">Gestión y auditoría de soportes técnicos</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-md">
              {filteredHistorial.length} RESULTADOS
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="BUSCAR POR EQUIPO, TÉCNICO, PROBLEMA..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPagination(prev => ({ ...prev, pageIndex: 0 })) }} className="pl-10 uppercase text-xs font-bold bg-white border-2" />
          </div>
          <Button variant={showFilters ? "default" : "outline"} size="sm" onClick={() => setShowFilters(!showFilters)} className="h-10 gap-2 font-bold uppercase text-xs bg-primary! text-primary-foreground!">
            <Filter className="h-4 w-4" /> {showFilters ? 'Ocultar Filtros' : 'Filtros Avanzados'}
          </Button>
          {(searchTerm || startDate || endDate || selectedYear !== 'all' || selectedStatus !== 'all' || selectedAsunto !== 'all' || selectedDepts.length > 0 || selectedTecnicos.length > 0) && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-10 text-red-500 hover:text-red-700 font-bold uppercase text-xs">
              <RotateCcw className="mr-2 h-4 w-4" /> Reiniciar
            </Button>
          )}
        </div>

        {showFilters && (
          <Card className="bg-muted/20 border-2 border-dashed border-border animate-in slide-in-from-top-2 duration-300">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Rango de Fecha</Label>
                  <div className="flex gap-2 items-center">
                    <Input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPagination(prev => ({ ...prev, pageIndex: 0 })) }} className="h-9 text-xs font-bold uppercase bg-background" />
                    <span className="text-muted-foreground/50">/</span>
                    <Input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPagination(prev => ({ ...prev, pageIndex: 0 })) }} className="h-9 text-xs font-bold uppercase bg-background" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Estatus</Label>
                    <Select value={selectedStatus} onValueChange={(val) => { setSelectedStatus(val); setPagination(prev => ({ ...prev, pageIndex: 0 })) }}>
                      <SelectTrigger className="h-9 text-xs font-bold uppercase bg-background">
                        <SelectValue placeholder="STATUS" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">TODOS</SelectItem>
                        {statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label.toUpperCase()}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Año</Label>
                    <Select value={selectedYear} onValueChange={(val) => { setSelectedYear(val); setPagination(prev => ({ ...prev, pageIndex: 0 })) }}>
                      <SelectTrigger className="h-9 text-xs font-bold uppercase bg-background">
                        <SelectValue placeholder="AÑO" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">TODOS</SelectItem>
                        {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Asunto</Label>
                  <SearchableSelect value={selectedAsunto === 'all' ? '' : selectedAsunto} options={mergedAsuntoOptions} onSelect={(val) => { setSelectedAsunto(val || 'all'); setPagination(prev => ({ ...prev, pageIndex: 0 })) }} placeholder="BUSCAR ASUNTO..." />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Departamentos</Label>
                  <SearchableMultiSelect value={selectedDepts} options={departamentoOptions} onSelect={(val) => { setSelectedDepts(val); setPagination(prev => ({ ...prev, pageIndex: 0 })) }} placeholder="TODOS LOS DEPTOS" />
                </div>
                <div className="space-y-1.5 lg:col-span-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Técnicos Responsables</Label>
                  <SearchableMultiSelect value={selectedTecnicos} options={tecnicoOptions} onSelect={(val) => { setSelectedTecnicos(val); setPagination(prev => ({ ...prev, pageIndex: 0 })) }} placeholder="TODOS LOS TÉCNICOS" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <DataTable
        showSearch={false}
        pagination={pagination}
        onPaginationChange={setPagination}
        extraActions={(item, asMenuItem) => (
          <>
            <InformeTecnicoDialog item={item} tecnicos={tecnicos} asMenuItem={asMenuItem} />
            <ActaEntregaDialog item={item} tecnicos={tecnicos} asMenuItem={asMenuItem} />
          </>
        )}
        data={filteredHistorial}
        columns={columns}
        onDelete={deleteHistorial}
        renderDialog={({ open, setOpen, mode, item, onSuccess }) => (
          <SoporteDialog
            open={open} onOpenChange={setOpen} mode={mode} item={item}
            onSuccess={() => { onSuccess(); fetchHistorial() }}
          />
        )}
      />
    </Layout>
  )
}
