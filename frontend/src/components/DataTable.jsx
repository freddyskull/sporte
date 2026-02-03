import React, { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
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
import { Plus, Edit, Trash2 } from 'lucide-react'
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

const DataTable = ({ data, columns, onCreate, onUpdate, onDelete, fields, extraLeftContent }) => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mode, setMode] = useState('create') // 'create' or 'edit'
  const [selectedItem, setSelectedItem] = useState(null)

  // We don't need formData state here anymore as DataForm manages it or we pass initialData
  // But wait, DataForm copies initialData to internal state. 
  // We need to pass the correct initialData when opening the dialog.
  const [initialFormData, setInitialFormData] = useState({})

  const table = useReactTable({
    data,
    columns: [
      ...columns,
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(row.original)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: 'includesString',
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  const handleCreate = () => {
    setMode('create')
    setSelectedItem(null)
    setInitialFormData(fields.reduce((acc, field) => ({ ...acc, [field.key]: field.defaultValue || '' }), {}))
    setDialogOpen(true)
  }

  const handleEdit = (item) => {
    setMode('edit')
    setSelectedItem(item)
    // Ensure we format the date correctly for the date input if it exists
    const formattedItem = { ...item }
    fields.forEach(field => {
      if (field.type === 'date' && item[field.key]) {
        // Handle both ISO strings (T separator) and SQL-like strings (space separator)
        formattedItem[field.key] = item[field.key].split(/[T ]/)[0]
      }
    })
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
    } else {
      onUpdate(selectedItem.id, formData)
    }
    setDialogOpen(false)
  }

  const getPageNumbers = () => {
    const totalPages = table.getPageCount()
    const currentPage = table.getState().pagination.pageIndex
    const pageNumbers = []

    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      pageNumbers.push(0)
      if (currentPage > 2) {
        pageNumbers.push('ellipsis-start')
      }
      const start = Math.max(1, currentPage - 1)
      const end = Math.min(totalPages - 2, currentPage + 1)
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i)
      }
      if (currentPage < totalPages - 3) {
        pageNumbers.push('ellipsis-end')
      }
      pageNumbers.push(totalPages - 1)
    }
    return pageNumbers
  }


  return (
    <Card>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 flex-1">
            <Input
              placeholder="Buscar..."
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="max-w-sm"
            />
            {extraLeftContent}
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="uppercase" onClick={handleCreate}>
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-lg font-medium text-foreground">
                  {mode === 'create' ? 'Crear Nuevo' : 'Editar'}
                </DialogTitle>
                <DialogDescription>
                  {mode === 'create' ? 'Ingresa los datos para crear un nuevo registro.' : 'Edita los datos del registro.'}
                </DialogDescription>
              </DialogHeader>

              {/* Force re-render of DataForm when dialog opens or mode/data changes to reset state */}
              {dialogOpen && (
                <DataForm
                  fields={fields}
                  initialData={initialFormData}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setDialogOpen(false)}
                  submitLabel={mode === 'create' ? 'Crear' : 'Actualizar'}
                />
              )}

            </DialogContent >
          </Dialog >
        </div >

        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`px-4 uppercase font-bold text-muted-foreground py-2 ${header.id === 'actions' ? 'text-right' : 'text-left'
                        }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-t">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="h-24 text-center">
                    No hay resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Filas por página</p>
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
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
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