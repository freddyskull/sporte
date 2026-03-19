import React, { useState } from 'react'
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export const SearchableMultiSelect = ({ value, options, onSelect, placeholder }) => {
  const [open, setOpen] = useState(false)

  // Ensure we always have an array
  const selectedValues = Array.isArray(value) ? value : (value ? [value] : [])

  const handleSelect = (currentValue) => {
    // If it's already selected, remove it
    const newSelectedValues = selectedValues.includes(currentValue)
      ? selectedValues.filter((v) => v !== currentValue)
      : [...selectedValues, currentValue]

    onSelect(newSelectedValues)
  }

  const handleRemove = (e, valToRemove) => {
    e.preventDefault()
    e.stopPropagation()
    const newSelectedValues = selectedValues.filter((v) => v !== valToRemove)
    onSelect(newSelectedValues)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-background text-foreground font-normal min-h-[40px] h-auto whitespace-normal"
        >
          <div className="flex flex-wrap gap-1 items-center">
            {selectedValues.length > 0 ? (
              selectedValues.map((val) => {
                const option = options.find((o) => o.value === val)
                if (!option) return null // Skip invalid values

                return (
                  <Badge
                    key={val}
                    variant="secondary"
                    className="mr-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 uppercase flex items-center gap-1 border border-border"
                  >
                    {option.label}
                    <div
                      role="button"
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer p-0.5 hover:bg-muted transition-colors"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={(e) => handleRemove(e, val)}
                    >
                      <X className="h-3 w-3 text-destructive font-bold" />
                    </div>
                  </Badge>
                )
              })
            ) : (
              <span className="uppercase text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Buscar ${placeholder}...`} />
          <CommandList>
            <CommandEmpty>No se encontró nada.</CommandEmpty>
            <CommandGroup className="max-h-[200px] overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => handleSelect(option.value)}
                  className="uppercase font-bold text-foreground cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
