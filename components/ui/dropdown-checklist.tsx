"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Checkbox } from "./checkbox"
import { cn } from "@/lib/utils"

interface DropdownChecklistOption {
  value: string
  label: string
}

interface DropdownChecklistProps {
  options: DropdownChecklistOption[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  className?: string
  triggerClassName?: string
  contentClassName?: string
}

export function DropdownChecklist({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options",
  className,
  triggerClassName,
  contentClassName,
}: DropdownChecklistProps) {
  const [open, setOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Handle clicks outside the dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    // Add event listener when dropdown is open
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const handleCheckedChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, value])
    } else {
      onChange(selectedValues.filter((v) => v !== value))
    }
  }

  // Get display text for selected values
  const displayText = React.useMemo(() => {
    if (selectedValues.length === 0) return placeholder
    
    if (selectedValues.length === 1) {
      const option = options.find(opt => opt.value === selectedValues[0])
      return option ? option.label : placeholder
    }
    
    return `${selectedValues.length} options selected`
  }, [selectedValues, options, placeholder])

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          triggerClassName
        )}
        aria-expanded={open}
      >
        <span className="flex-1 text-left truncate">{displayText}</span>
        <ChevronDownIcon className="h-4 w-4 opacity-50" />
      </button>
      
      {open && (
        <div
          className={cn(
            "absolute z-50 w-full min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
            "mt-1 max-h-60 overflow-auto p-1",
            contentClassName
          )}
        >
          <div className="space-y-1">
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 p-2 hover:bg-accent hover:text-accent-foreground rounded-sm"
              >
                <Checkbox
                  id={`option-${option.value}`}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) =>
                    handleCheckedChange(option.value, checked as boolean)
                  }
                />
                <label
                  htmlFor={`option-${option.value}`}
                  className="flex-1 cursor-pointer text-sm"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}