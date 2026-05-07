import { useCallback, useEffect, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { es } from 'react-day-picker/locale'
import {
  buildDateDisabledMatchers,
  calendarClassNames,
  formatDateLabel,
  formatDateValue,
  parseDateValue,
} from './datePickerUtils'

interface DatePickerComponentProps {
  value?: string
  label?: string
  required?: boolean
  disabled?: boolean
  error?: string | null
  placeholder?: string
  min?: string
  max?: string
  onValueChange?: (value: string) => void
  onValidation?: () => void
}

export function DatePickerComponent({
  value = '',
  label,
  required = false,
  disabled = false,
  error,
  placeholder = 'Selecciona una fecha',
  min,
  max,
  onValueChange,
  onValidation,
}: DatePickerComponentProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedDate = parseDateValue(value)
  const displayValue = formatDateLabel(value)

  const closeDropdown = useCallback(() => {
    setOpen(false)
    onValidation?.()
  }, [onValidation])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!open || !containerRef.current) return
      if (!containerRef.current.contains(event.target as Node)) closeDropdown()
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [closeDropdown, open])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) closeDropdown()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeDropdown, open])

  const handleSelectDate = (date?: Date) => {
    onValueChange?.(formatDateValue(date))
    closeDropdown()
  }

  const handleToday = () => {
    onValueChange?.(formatDateValue(new Date()))
    closeDropdown()
  }

  const handleClear = () => {
    onValueChange?.('')
    closeDropdown()
  }

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1.5">
      {label && (
        <span className="text-[10.5px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          {label}
          {required && <span className="ml-0.5 accent-text">*</span>}
        </span>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={`r-md flex h-9 w-full items-center justify-between gap-2 border px-2.5 text-left text-[13px] outline-none transition disabled:cursor-not-allowed disabled:opacity-60 ${
          error
            ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-400/30 dark:border-rose-500/60 dark:bg-rose-950/20 dark:text-rose-200'
            : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--accent-400)]/30 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-100 dark:hover:border-white/20'
        }`}
      >
        <span className={`truncate ${displayValue ? '' : 'text-slate-400 dark:text-slate-500'}`}>
          {displayValue || placeholder}
        </span>
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.7">
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4M16 3v4M4 10h16" />
        </svg>
      </button>

      {open && (
        <div className="soft-ring r-xl absolute left-0 top-full z-50 mt-2 w-[310px] max-w-[calc(100vw-2rem)] border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelectDate}
            locale={es}
            weekStartsOn={1}
            autoFocus
            disabled={buildDateDisabledMatchers(min, max)}
            classNames={calendarClassNames}
          />
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/10">
            <button type="button" className="num text-[11px] text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100" onClick={handleClear}>
              Limpiar
            </button>
            <button type="button" className="r-md accent-bg px-3 py-1.5 text-[12px] font-medium text-white transition hover:opacity-90" onClick={handleToday}>
              Hoy
            </button>
          </div>
        </div>
      )}

      {error && <p className="num text-[11px] text-rose-500 dark:text-rose-400">{error}</p>}
    </div>
  )
}
