import { useCallback, useEffect, useRef, useState } from 'react'

interface SelectOption {
  label: string
  value: string
}

interface SelectComponentProps {
  value?: string
  values?: string[]
  label: string
  required?: boolean
  disabled?: boolean
  multiple?: boolean
  placeholder?: string
  helperText?: string
  options: SelectOption[]
  error?: string | null
  loading?: boolean
  onSearch?: (query: string) => void
  onValidation?: () => void
  onValueChange?: (value: string) => void
  onValuesChange?: (values: string[]) => void
}

export function SelectComponent({
  value = '',
  values = [],
  label,
  required = false,
  disabled = false,
  multiple = false,
  placeholder = 'Selecciona una opcion',
  helperText,
  options,
  error,
  loading = false,
  onSearch,
  onValidation,
  onValueChange,
  onValuesChange,
}: SelectComponentProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const wasOpenRef = useRef(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const closeDropdown = useCallback(() => {
    setOpen(false)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setSearch('')
    onSearch?.('')
  }, [onSearch])

  useEffect(() => {
    if (!open && wasOpenRef.current) {
      onValidation?.()
    }
    wasOpenRef.current = open
  }, [open, onValidation])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (open && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, closeDropdown])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        closeDropdown()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, closeDropdown])

  useEffect(() => {
    if (open) {
      searchRef.current?.focus()
    }
  }, [open])

  const handleToggle = () => {
    if (disabled) return
    if (open) {
      closeDropdown()
    } else {
      setOpen(true)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearch(query)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onSearch?.(query), 100)
  }

  const handleSelectOption = (option: SelectOption) => {
    if (multiple) {
      const isSelected = values.includes(option.value)
      const nextValues = isSelected
        ? values.filter((v) => v !== option.value)
        : [...values, option.value]
      onValuesChange?.(nextValues)
    } else {
      onValueChange?.(option.value)
      closeDropdown()
    }
  }

  const handleRemoveValue = (val: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onValuesChange?.(values.filter((v) => v !== val))
  }

  const handleClearSingle = (e: React.MouseEvent) => {
    e.stopPropagation()
    onValueChange?.('')
  }

  const selectedOption = options.find((o) => o.value === value)
  const selectedOptions = options.filter((o) => values.includes(o.value))

  const triggerClass = `r-md flex w-full cursor-pointer justify-between gap-2 border px-2.5 text-[13px] outline-none transition disabled:cursor-not-allowed disabled:opacity-60 ${
    multiple
      ? 'sidebar-scrollbar min-h-9 max-h-32 items-start overflow-y-auto py-1.5'
      : 'h-9 items-center'
  } ${
    error
      ? 'border-rose-400 bg-rose-50/40 text-rose-900 dark:border-rose-500/60 dark:bg-rose-950/20 dark:text-rose-200'
      : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-100 dark:hover:border-white/20'
  }`

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10.5px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {label}
        {required && <span className="ml-0.5 accent-text">*</span>}
      </span>

      <div ref={containerRef} className="relative">
        <button type="button" disabled={disabled} onClick={handleToggle} className={triggerClass}>
          <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
            {multiple ? (
              selectedOptions.length > 0 ? (
                selectedOptions.map((opt) => (
                  <span
                    key={opt.value}
                    className="r-sm inline-flex max-w-full min-w-0 items-center gap-1 accent-bg-soft accent-text px-1.5 py-0.5 text-[11px]"
                  >
                    <span className="min-w-0 truncate">{opt.label}</span>
                    <span
                      role="button"
                      onClick={(e) => handleRemoveValue(opt.value, e)}
                      className="inline-flex h-3 w-3 shrink-0 items-center justify-center leading-none hover:opacity-70"
                      aria-label="Eliminar"
                    >
                      <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 1 L9 9 M9 1 L1 9" strokeLinecap="round" />
                      </svg>
                    </span>
                  </span>
                ))
              ) : (
                <span className="text-slate-400 dark:text-slate-500">{placeholder}</span>
              )
            ) : (
              <span className={`truncate ${!selectedOption ? 'text-slate-400 dark:text-slate-500' : ''}`}>
                {selectedOption?.label ?? placeholder}
              </span>
            )}
          </span>

          <span className="flex shrink-0 items-center gap-1 text-slate-400 dark:text-slate-500">
            {!multiple && value && (
              <span
                role="button"
                onClick={handleClearSingle}
                aria-label="Limpiar"
                className="inline-flex h-4 w-4 items-center justify-center hover:text-slate-700 dark:hover:text-slate-200"
              >
                <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 1 L9 9 M9 1 L1 9" strokeLinecap="round" />
                </svg>
              </span>
            )}
            <svg
              viewBox="0 0 10 6"
              className={`h-2 w-2.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M0 0 L10 0 L5 6 Z" />
            </svg>
          </span>
        </button>

        {open && (
          <div className="soft-ring r-md absolute z-50 mt-1 w-full border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
            <div className="border-b border-slate-200 p-1.5 dark:border-white/10">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Buscar..."
                className="r-sm h-7 w-full border border-slate-200 bg-slate-50/70 px-2 text-[12px] outline-none transition placeholder:text-slate-400 focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--accent-400)]/30 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500"
              />
            </div>

            <ul className="sidebar-scrollbar max-h-56 overflow-y-auto py-1">
              {loading ? (
                <li className="px-3 py-2 text-[12px] text-slate-400 dark:text-slate-500">Cargando...</li>
              ) : options.length === 0 ? (
                <li className="px-3 py-2 text-[12px] text-slate-400 dark:text-slate-500">Sin resultados</li>
              ) : (
                options.map((option) => {
                  const isSelected = multiple ? values.includes(option.value) : option.value === value
                  return (
                    <li
                      key={option.value}
                      onClick={() => handleSelectOption(option)}
                      className={`flex min-w-0 cursor-pointer items-center gap-2 px-3 py-1.5 text-[12.5px] transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${
                        isSelected
                          ? 'accent-bg-soft accent-text'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {multiple && (
                        <span
                          className={`r-sm flex h-3.5 w-3.5 shrink-0 items-center justify-center border text-[9px] ${
                            isSelected
                              ? 'accent-bg accent-border text-white'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {isSelected && (
                            <svg viewBox="0 0 10 8" className="h-2 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <path d="M1 4 L4 7 L9 1" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                      )}
                      <span className="min-w-0 truncate">{option.label}</span>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {!error && helperText && <p className="text-[11px] text-slate-500 dark:text-slate-400">{helperText}</p>}
      {error && <p className="num text-[11px] text-rose-500 dark:text-rose-400">{error}</p>}
    </div>
  )
}
