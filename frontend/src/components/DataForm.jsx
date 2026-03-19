import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
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
import { SearchableMultiSelect } from '@/components/ui/SearchableMultiSelect'

const DataForm = ({ fields, initialData = {}, onSubmit, onCancel, onChange, submitLabel = 'Guardar' }) => {
  const [formData, setFormData] = useState(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Determinar si el formulario ha cambiado (isDirty)
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData)

  const handleInputChange = (key, value) => {
    let newData
    if (key.startsWith('campo_auxiliar.')) {
      const auxKey = key.split('.')[1]
      const currentAux = typeof formData.campo_auxiliar === 'string'
        ? JSON.parse(formData.campo_auxiliar || '{}')
        : (formData.campo_auxiliar || {})

      const newAux = { ...currentAux, [auxKey]: value }
      newData = { ...formData, campo_auxiliar: newAux }
    } else {
      newData = { ...formData, [key]: value }
    }

    setFormData(newData)
    if (onChange) {
      onChange(newData)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    // Validar campos obligatorios
    for (const field of fields) {
      if (field.showIf && !field.showIf(formData)) continue
      if (field.type === 'section') continue // Omitir secciones de la validación

      if (!field.optional) {
        let value
        if (field.key.startsWith('campo_auxiliar.')) {
          const auxKey = field.key.split('.')[1]
          const currentAux = typeof formData.campo_auxiliar === 'string'
            ? JSON.parse(formData.campo_auxiliar || '{}')
            : (formData.campo_auxiliar || {})
          value = currentAux[auxKey]
        } else {
          value = formData[field.key]
        }

        if (!value || (Array.isArray(value) && value.length === 0)) {
          alert(`El campo ${field.label} es obligatorio.`)
          return
        }
      }
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Submit error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFieldValue = (key) => {
    if (key.startsWith('campo_auxiliar.')) {
      const auxKey = key.split('.')[1]
      const currentAux = typeof formData.campo_auxiliar === 'string'
        ? JSON.parse(formData.campo_auxiliar || '{}')
        : (formData.campo_auxiliar || {})
      return currentAux[auxKey] || ''
    }
    return formData[key]
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col max-h-[75vh]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-1 overflow-y-auto pr-2 custom-scrollbar">
        {fields.map((field) => {
          if (field.showIf && !field.showIf(formData)) return null

          return (
            <div key={field.key} className={field.gridCols || "md:col-span-3"}>
              {field.type === 'section' ? (
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary/60 border-b border-primary/10 pb-1 mb-3 mt-4">
                  {field.label}
                </h3>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={field.key} className="text-[12px] font-bold text-foreground/70 uppercase tracking-tight">
                    {field.label}
                    {!field.optional && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {field.type === 'select' ? (
                    <Select
                      value={getFieldValue(field.key) || ''}
                      onValueChange={(value) => handleInputChange(field.key, value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="h-9 w-full bg-secondary/30 border-input hover:bg-secondary/50 transition-all duration-200">
                        <SelectValue placeholder={`Selecciona...`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="uppercase font-medium text-xs">
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
                      disabled={isSubmitting}
                      className="h-9 cursor-pointer file:font-semibold file:text-xs"
                    />
                  ) : field.type === 'textarea' ? (
                    <Textarea
                      id={field.key}
                      value={getFieldValue(field.key) || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      required={!field.optional}
                      disabled={isSubmitting}
                      className="min-h-[80px] text-sm bg-secondary/20 focus:bg-background transition-colors resize-none py-2"
                    />
                  ) : field.type === 'multi-select' ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          disabled={isSubmitting}
                          className="h-9 w-full justify-start text-left font-normal bg-secondary/30 border-input hover:bg-secondary/50 uppercase truncate text-xs"
                        >
                          <span className="truncate">
                            {getFieldValue(field.key)?.length
                              ? field.options
                                ?.filter((opt) => getFieldValue(field.key).includes(opt.value))
                                .map((opt) => opt.label)
                                .join(', ')
                              : 'Seleccionar...'}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-2 shadow-xl border-primary/10">
                        <div className="space-y-1 max-h-[300px] overflow-y-auto">
                          {field.options?.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2 p-1.5 hover:bg-secondary/50 rounded transition-colors cursor-pointer">
                              <Checkbox
                                id={option.value}
                                checked={getFieldValue(field.key)?.includes(option.value) || false}
                                onCheckedChange={(checked) => {
                                  const current = getFieldValue(field.key) || []
                                  const newSelected = checked
                                    ? [...current, option.value]
                                    : current.filter((v) => v !== option.value)
                                  handleInputChange(field.key, newSelected)
                                }}
                              />
                              <Label className="uppercase font-medium cursor-pointer flex-1 text-xs" htmlFor={option.value}>{option.label}</Label>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : field.type === 'searchable-select' ? (
                    <SearchableSelect
                      value={getFieldValue(field.key)}
                      options={field.options}
                      onSelect={(value) => handleInputChange(field.key, value)}
                      placeholder={`Selecciona...`}
                      disabled={isSubmitting}
                      className="h-9"
                    />
                  ) : field.type === 'searchable-multi-select' ? (
                    <SearchableMultiSelect
                      value={getFieldValue(field.key)}
                      options={field.options}
                      onSelect={(value) => handleInputChange(field.key, value)}
                      placeholder={`Selecciona...`}
                      disabled={isSubmitting}
                      className="h-9"
                    />
                  ) : field.type === 'switch' ? (
                    <div className="flex items-center space-x-2 h-9">
                      <Switch
                        id={field.key}
                        checked={getFieldValue(field.key) || false}
                        onCheckedChange={(checked) => handleInputChange(field.key, checked)}
                        disabled={isSubmitting}
                      />
                      <Label htmlFor={field.key} className="text-xs font-medium cursor-pointer">
                        {getFieldValue(field.key) ? 'Activado' : 'Desactivado'}
                      </Label>
                    </div>
                  ) : (
                    <Input
                      id={field.key}
                      type={field.type || 'text'}
                      value={getFieldValue(field.key) || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      required={!field.optional}
                      max={field.max}
                      defaultValue={field.defaultValue}
                      disabled={isSubmitting}
                      className="h-9 bg-secondary/30 focus:bg-background transition-all text-sm"
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex justify-between items-center w-full mt-4 border-t border-primary/10 pt-4 bg-background z-10">
        <Button
          type="button"
          variant="ghost"
          disabled={isSubmitting}
          className="text-destructive hover:text-destructive hover:bg-destructive/5 transition-colors font-medium text-xs h-8"
          onClick={() => {
            if (window.confirm('¿Estás seguro de limpiar el formulario? Se perderán los datos actuales.')) {
              const resetData = {}
              fields.forEach(field => {
                const defaultValue = field.defaultValue !== undefined
                  ? field.defaultValue
                  : (field.type === 'searchable-multi-select' || field.type === 'multi-select' ? [] : '')
                if (field.key.startsWith('campo_auxiliar.')) {
                  const auxKey = field.key.split('.')[1]
                  if (!resetData.campo_auxiliar) resetData.campo_auxiliar = {}
                  resetData.campo_auxiliar[auxKey] = defaultValue
                } else {
                  resetData[field.key] = defaultValue
                }
              })
              setFormData(resetData)
              if (onChange) onChange(resetData)
            }
          }}
        >
          Limpiar
        </Button>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="h-9 text-xs">
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="h-9 min-w-[120px] shadow-sm bg-primary hover:bg-primary/90 transition-all font-bold uppercase tracking-wider text-xs"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-1.5">
                <span className="animate-spin h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full" />
                ...
              </span>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default DataForm
