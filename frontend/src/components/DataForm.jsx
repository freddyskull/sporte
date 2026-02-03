import React, { useState } from 'react'
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
import { SearchableSelect } from '@/components/ui/SearchableSelect'

const DataForm = ({ fields, initialData = {}, onSubmit, onCancel, submitLabel = 'Guardar' }) => {
  const [formData, setFormData] = useState(initialData)

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate required fields
    for (const field of fields) {
      if (!field.optional) {
        const value = formData[field.key]
        if (!value || (Array.isArray(value) && value.length === 0)) {
          // Simple alert for now, could be better
          alert(`El campo ${field.label} es obligatorio.`)
          return
        }
      }
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.key}>
          <Label htmlFor={field.key} className="block mb-2 text-foreground">
            {field.label}
          </Label>
          {field.type === 'select' ? (
            <Select
              value={formData[field.key] || ''}
              onValueChange={(value) => handleInputChange(field.key, value)}
            >
              <SelectTrigger className="w-full bg-slate-300">
                <SelectValue placeholder={`Selecciona ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="uppercase font-bold text-foreground">
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
                      <Label className="uppercase font-bold text-foreground" htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          ) : field.type === 'searchable-select' ? (
            <SearchableSelect
              value={formData[field.key]}
              options={field.options}
              onSelect={(value) => handleInputChange(field.key, value)}
              placeholder={`Selecciona ${field.label.toLowerCase()}`}
            />
          ) : (
            <Input
              id={field.key}
              type={field.type || 'text'}
              value={formData[field.key] || ''}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              required={!field.optional}
              max={field.max}
              defaultValue={field.defaultValue}
            />
          )}
        </div>
      ))}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default DataForm
