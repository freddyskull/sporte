import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

import { SearchableSelect } from '@/components/ui/SearchableSelect'

/**
 * EditableCell
 * Wrapper component to allow double-click editing of a cell.
 * 
 * @param {any} value - The raw value to be edited (e.g. ID, string, array of IDs)
 * @param {string} id - The ID of the record being edited
 * @param {string} field - The key of the field to update
 * @param {function} onSave - Async function(id, data) to save changes
 * @param {string} type - 'text', 'textarea', 'select', 'date', 'multi-select', 'searchable-select'
 * @param {Array} options - Options for select/multi-select {value, label}
 * @param {React.ReactNode} children - The read-only view content
 */
export const EditableCell = ({
  value,
  id,
  field,
  onSave,
  type = 'text',
  options = [],
  children,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)
  const inputRef = useRef(null)

  useEffect(() => {
    setTempValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleDoubleClick = (e) => {
    e.stopPropagation() // Prevent row click events if any
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setTempValue(value)
  }

  const handleSave = async (valToSaveOverride) => {
    const valObj = valToSaveOverride !== undefined ? valToSaveOverride : tempValue

    // Basic equality check to avoid request if unchanged
    // JSON.stringify for arrays (multi-select)
    if (valObj === value || JSON.stringify(valObj) === JSON.stringify(value)) {
      setIsEditing(false)
      return
    }

    try {
      // Special handling for Date: ensure fixing timezone/noon logic if needed
      let finalValue = valObj
      if (type === 'date' && valObj) {
        // valObj is YYYY-MM-DD from input type="date".
        // Append noon to be safe
        finalValue = new Date(valObj + 'T12:00:00').toISOString()
      }

      await onSave(id, { [field]: finalValue })
      setIsEditing(false)
    } catch (err) {
      console.error("Failed to save inline edit", err)
      // Optional: keep editing state or show toast
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (type !== 'textarea' && type !== 'multi-select' && type !== 'searchable-select') {
        e.preventDefault()
        handleSave()
      }
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isEditing) {
    if (type === 'searchable-select') {
      return (
        <div className="w-[180px]">
          <SearchableSelect
            value={tempValue}
            options={options}
            onSelect={(val) => {
              setTempValue(val)
              handleSave(val)
            }}
            placeholder="Buscar..."
          />
        </div>
      )
    }

    if (type === 'select') {
      return (
        <Select
          value={tempValue}
          onValueChange={(val) => {
            setTempValue(val)
            handleSave(val) // Auto save on selection for better UX
          }}
          open={true} // Force open immediately
          onOpenChange={(open) => {
            if (!open) setIsEditing(false) // Close edit mode when dropdown closes
          }}
        >
          <SelectTrigger className="h-8 w-full min-w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (type === 'textarea') {
      return (
        <Textarea
          ref={inputRef}
          value={tempValue || ''}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={() => handleSave()}
          onKeyDown={handleKeyDown}
          className="min-h-[60px] text-xs"
        />
      )
    }

    if (type === 'date') {
      // Parse ISO to YYYY-MM-DD for input
      const dateStr = tempValue ? String(tempValue).split(/[T ]/)[0] : ''
      return (
        <Input
          ref={inputRef}
          type="date"
          value={dateStr}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={() => handleSave()}
          onKeyDown={handleKeyDown}
          className="h-8 w-[130px]"
        />
      )
    }

    if (type === 'multi-select') {
      // Use Popover to avoid deforming table layout
      return (
        <Popover open={true} onOpenChange={(open) => { if (!open) handleSave() }}>
          <PopoverTrigger asChild>
            <div className="h-8 flex items-center px-2 border rounded text-xs cursor-pointer bg-slate-50 w-full min-w-[200px]">
              {tempValue?.length ? `${tempValue.length} seleccionados` : 'Seleccionar...'}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="start">
            <div className="max-h-[200px] overflow-y-auto flex flex-col gap-1">
              {options.map(opt => (
                <div key={opt.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`chk-${opt.value}`}
                    checked={(tempValue || []).includes(opt.value)}
                    onCheckedChange={(checked) => {
                      const current = tempValue || []
                      const next = checked
                        ? [...current, opt.value]
                        : current.filter(x => x !== opt.value)
                      setTempValue(next)
                    }}
                  />
                  <Label htmlFor={`chk-${opt.value}`} className="text-xs">{opt.label}</Label>
                </div>
              ))}
            </div>
            <div className="flex justify-between gap-2 mt-2 pt-2 border-t">
              <Button size="sm" variant="ghost" onClick={handleCancel} className="h-7 text-xs">Cancelar</Button>
              <Button size="sm" onClick={() => handleSave()} className="h-7 text-xs">Guardar</Button>
            </div>
          </PopoverContent>
        </Popover>
      )
    }

    // Default text
    return (
      <Input
        ref={inputRef}
        value={tempValue || ''}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={() => handleSave()}
        onKeyDown={handleKeyDown}
        className="h-8 text-xs"
      />
    )
  }

  // Not editing - render children with double click handler
  return (
    <div onDoubleClick={handleDoubleClick} className={`cursor-pointer hover:bg-primary/50 p-1 rounded-full transition-colors ${className}`}>
      {children}
    </div>
  )
}
