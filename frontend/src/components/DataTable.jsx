import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Edit, Trash2, ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import DataForm from './DataForm'
import useDraftStore from '../stores/draftStore'
import { cn } from "@/lib/utils"

const DataTable = ({ 
  data, 
  columns, 
  onCreate, 
  onUpdate, 
  onDelete, 
  fields, 
  extraLeftContent, 
  extraActions, 
  draftKey, 
  renderDialog, 
  showSearch = true,
  pagination,
  onPaginationChange,
  containerHeight = "60vh"
}) => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mode, setMode] = useState('create') // 'create' or 'edit'
  const [selectedItem, setSelectedItem] = useState(null)
  const [initialFormData, setInitialFormData] = useState({})
  const { getDraft, setDraft, clearDraft } = useDraftStore()
  const [hasDraft, setHasDraft] = useState(false)
  const [sorting, setSorting] = useState([{ id: 'created', desc: true }])

  // Paginación interna si no se provee por props
  const [internalPagination, setInternalPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const actualPagination = pagination || internalPagination
  const actualOnPaginationChange = onPaginationChange || setInternalPagination

  const parentRef = useRef(null)

  useEffect(() => {
    if (!draftKey) return
    const draft = getDraft(draftKey)
    setHasDraft(!!draft && Object.keys(draft).length > 0)
  }, [draftKey, getDraft, dialogOpen])

  const table = useReactTable({
    data,
    columns: [
      ...columns,
      {
        id: 'actions',
        header: 'Acciones',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end pr-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menú de acciones</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-1 shadow-xl border-primary/10" align="end">
                <div className="flex flex-col gap-1">
                  {extraActions && (
                    <div className="border-b border-primary/5 pb-1 mb-1">
                      {extraActions(row.original, true)}
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start gap-2 h-9 text-xs font-semibold uppercase hover:bg-secondary/80"
                    onClick={() => handleEdit(row.original)}
                  >
                    <Edit className="h-3.5 w-3.5 text-blue-500" />
                    Editar Registro
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start gap-2 h-9 text-xs font-semibold uppercase text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(row.original.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Eliminar
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    globalFilterFn: 'includesString',
    state: {
      globalFilter,
      sorting,
      pagination: actualPagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: actualOnPaginationChange,
  })

  const { rows } = table.getRowModel()

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48, // Estimación de altura de fila
    overscan: 10,
  })

  const virtualRows = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
  const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0

  const handleCreate = () => {
    setMode('create')
    setSelectedItem(null)
    if (renderDialog) {
      setDialogOpen(true)
      return
    }
    if (draftKey) {
      const draft = getDraft(draftKey)
      if (draft) {
        setInitialFormData(draft)
        setDialogOpen(true)
        return
      }
    }
    const defaults = {}
    fields.forEach(field => {
      const defaultValue = field.defaultValue !== undefined ? field.defaultValue : ''
      if (field.key.startsWith('campo_auxiliar.')) {
        const auxKey = field.key.split('.')[1]
        if (!defaults.campo_auxiliar) defaults.campo_auxiliar = {}
        defaults.campo_auxiliar[auxKey] = defaultValue
      } else {
        defaults[field.key] = defaultValue
      }
    })
    setInitialFormData(defaults)
    setDialogOpen(true)
  }

  const handleEdit = (item) => {
    setMode('edit')
    setSelectedItem(item)
    if (renderDialog) {
      setDialogOpen(true)
      return
    }
    const formattedItem = { ...item }
    fields.forEach(field => {
      if (field.type === 'date' && item[field.key]) {
        formattedItem[field.key] = item[field.key].split(/[T ]/)[0]
      }
    })
    if (fields.some(f => f.key === 'mostrar_detalles')) {
      const aux = typeof item.campo_auxiliar === 'string'
        ? JSON.parse(item.campo_auxiliar || '{}')
        : (item.campo_auxiliar || {})
      if (aux.especificaciones || aux.nombre_equipo || aux.serial_bienes || aux.direccion_mac) {
        formattedItem.mostrar_detalles = true
      }
    }
    setInitialFormData(formattedItem)
    setDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este elemento?')) {
      onDelete(id)
    }
  }

  const handleFormSubmit = (formData) => {
    if (mode === 'create') {
      onCreate(formData)
      if (draftKey) {
        clearDraft(draftKey)
        setHasDraft(false)
      }
    } else {
      onUpdate(selectedItem.id, formData)
    }
    setDialogOpen(false)
  }

  const handleFormChange = (newData) => {
    if (mode === 'create' && draftKey) {
      setDraft(draftKey, newData)
      setHasDraft(true)
    }
  }

  const getPageNumbers = () => {
    const totalPages = table.getPageCount()
    const currentPage = table.getState().pagination.pageIndex
    const pageNumbers = []
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) pageNumbers.push(i)
    } else {
      pageNumbers.push(0)
      if (currentPage > 2) pageNumbers.push('ellipsis-start')
      const start = Math.max(1, currentPage - 1)
      const end = Math.min(totalPages - 2, currentPage + 1)
      for (let i = start; i <= end; i++) pageNumbers.push(i)
      if (currentPage < totalPages - 3) pageNumbers.push('ellipsis-end')
      pageNumbers.push(totalPages - 1)
    }
    return pageNumbers
  }

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardContent className="flex-1 flex flex-col p-6 min-h-0">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <div className="flex flex-col md:flex-row items-center gap-2 w-full md:flex-1">
            {showSearch && (
              <Input
                placeholder="Buscar..."
                value={globalFilter ?? ''}
                onChange={(event) => setGlobalFilter(String(event.target.value))}
                className="w-full md:max-w-sm"
              />
            )}
            {extraLeftContent}
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {renderDialog ? (
              renderDialog({
                open: dialogOpen,
                setOpen: setDialogOpen,
                mode,
                item: selectedItem,
                onSuccess: () => setDialogOpen(false)
              })
            ) : (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className={cn("w-full md:w-auto uppercase transition-all duration-300", hasDraft ? "bg-amber-500 hover:bg-amber-600 text-white" : "")}
                    onClick={handleCreate}
                    aria-label={hasDraft ? "Continuar borrador" : "Crear nuevo registro"}
                  >
                    {hasDraft ? (
                      <>
                        <span className="mr-2">Continuar</span>
                        <Edit className="h-4 w-4" />
                      </>
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-medium text-foreground">
                      {mode === 'create'
                        ? (hasDraft ? 'Continuar Editando Borrador' : 'Crear Nuevo')
                        : 'Editar'}
                    </DialogTitle>
                    <DialogDescription>
                      {mode === 'create'
                        ? (hasDraft ? 'Tienes datos sin guardar. Continúa donde lo dejaste.' : 'Ingresa los datos para crear un nuevo registro.')
                        : 'Edita los datos del registro.'}
                    </DialogDescription>
                  </DialogHeader>
                  {dialogOpen && (
                    <DataForm
                      fields={fields}
                      initialData={initialFormData}
                      onSubmit={handleFormSubmit}
                      onChange={handleFormChange}
                      onCancel={() => setDialogOpen(false)}
                      submitLabel={mode === 'create' ? 'Crear' : 'Actualizar'}
                    />
                  )}
                </DialogContent >
              </Dialog >
            )}
          </div>
        </div >

        <div 
          ref={parentRef}
          className="rounded-md border overflow-auto relative bg-background" 
          style={{ height: containerHeight, maxHeight: 'calc(100vh - 300px)' }}
        >
          <table className="w-full min-w-[600px] md:min-w-full border-collapse">
            <thead className="sticky top-0 z-20">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-muted/95 backdrop-blur-md">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{ top: 0 }}
                      className={`px-4 uppercase font-bold text-[11px] md:text-xs text-muted-foreground py-3 border-b sticky z-20 ${header.id === 'actions' ? 'text-right' : 'text-left'
                        }`}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            "flex items-center gap-2 whitespace-nowrap",
                            header.column.getCanSort() ? "cursor-pointer select-none" : "",
                            header.id === 'actions' ? "justify-end" : ""
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <ArrowUpDown className="h-3 w-3 opacity-50" />
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {paddingTop > 0 && (
                <tr>
                  <td style={{ height: `${paddingTop}px` }} />
                </tr>
              )}
              {virtualRows.length > 0 ? (
                virtualRows.map((virtualRow) => {
                  const row = rows[virtualRow.index]
                  return (
                    <tr 
                      key={row.id} 
                      className="hover:bg-muted/30 transition-colors"
                      data-index={virtualRow.index}
                      ref={node => virtualizer.measureElement(node)}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const value = cell.getContext().getValue()
                        const titleValue = typeof value === 'string' || typeof value === 'number' ? String(value) : undefined
                        
                        return (
                          <td key={cell.id} className="px-4 py-2 text-xs md:text-sm border-b">
                            <div className="truncate whitespace-nowrap" title={titleValue}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="h-24 text-center">
                    No hay resultados.
                  </td>
                </tr>
              )}
              {paddingBottom > 0 && (
                <tr>
                  <td style={{ height: `${paddingBottom}px` }} />
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t mt-auto">
          <div className="flex items-center gap-2 order-2 md:order-1">
            <p className="text-sm font-medium whitespace-nowrap">Filas por página</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50, 100, 500].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground uppercase font-bold ml-2">
              Total: {data.length}
            </span>
          </div>
          <div className="flex justify-center md:justify-end w-full md:w-auto order-1 md:order-2 overflow-x-auto pb-2 md:pb-0">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => table.previousPage()}
                    className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {getPageNumbers().map((pageIndex, index) => (
                  <PaginationItem key={index}>
                    {pageIndex === 'ellipsis-start' || pageIndex === 'ellipsis-end' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        isActive={table.getState().pagination.pageIndex === pageIndex}
                        onClick={() => table.setPageIndex(pageIndex)}
                        className="cursor-pointer"
                      >
                        {pageIndex + 1}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => table.nextPage()}
                    className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </CardContent >
    </Card >
  )
}

export default DataTable