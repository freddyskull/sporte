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
import { Plus, Edit, Trash2, Car } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const DataTable = ({ data, columns, onCreate, onUpdate, onDelete, fields }) => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mode, setMode] = useState('create') // 'create' or 'edit'
  const [selectedItem, setSelectedItem] = useState(null)
  const [formData, setFormData] = useState({})

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
    setFormData(fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {}))
    setDialogOpen(true)
  }

  const handleEdit = (item) => {
    setMode('edit')
    setSelectedItem(item)
    setFormData({ ...item })
    setDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este elemento?')) {
      onDelete(id)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (mode === 'create') {
      onCreate(formData)
    } else {
      onUpdate(selectedItem.id, formData)
    }
    setDialogOpen(false)
  }

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Card>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Buscar..."
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm"
          />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="uppercase" onClick={handleCreate}>
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-lg font-medium text-slate-800">
                  {mode === 'create' ? 'Crear Nuevo' : 'Editar'}
                </DialogTitle>
                <DialogDescription>
                  {mode === 'create' ? 'Ingresa los datos para crear un nuevo registro.' : 'Edita los datos del registro.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((field) => (
                  <div key={field.key}>
                    <Label htmlFor={field.key} className="block mb-2 text-slate-600">{field.label}</Label>
                    {field.type === 'select' ? (
                      <Select
                        value={formData[field.key] || ''}
                        onValueChange={(value) => handleInputChange(field.key, value)}
                      >
                        <SelectTrigger className="w-full bg-slate-300">
                          <SelectValue placeholder={`Selecciona ${field.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-200 border-slate-400">
                          {field.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="uppercase font-bold text-slate-600">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === 'file' ? (
                      <Input
                        id={field.key}
                        type="file"
                        onChange={(e) => handleInputChange(field.key, e.target.files[0])}
                        accept="image/*"
                      />
                    ) : field.type === 'textarea' ? (
                      <Textarea
                        id={field.key}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        required={!field.optional}
                      />
                    ) : field.type === 'multi-select' ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal bg-slate-300 uppercase">
                            {formData[field.key]?.length
                              ? field.options
                                ?.filter((opt) => formData[field.key].includes(opt.value))
                                .map((opt) => opt.label)
                                .join(', ')
                              : 'Seleccionar técnicos'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            {field.options?.map((option) => (
                              <div key={option.value} className="flex items-center space-x-2">
                                <Checkbox
                                  id={option.value}
                                  checked={formData[field.key]?.includes(option.value) || false}
                                  onCheckedChange={(checked) => {
                                    const current = formData[field.key] || []
                                    const newSelected = checked
                                      ? [...current, option.value]
                                      : current.filter((v) => v !== option.value)
                                    handleInputChange(field.key, newSelected)
                                  }}
                                />
                                <Label className="uppercase font-bold text-slate-600" htmlFor={option.value}>{option.label}</Label>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <Input
                        id={field.key}
                        type={field.type || 'text'}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        required={!field.optional}
                      />
                    )}
                  </div>
                ))}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {mode === 'create' ? 'Crear' : 'Actualizar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`px-4 uppercase font-bold text-slate-600 py-2 ${header.id === 'actions' ? 'text-right' : 'text-left'
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

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default DataTable