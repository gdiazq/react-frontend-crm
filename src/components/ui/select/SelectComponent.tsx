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

  // Dispara validación cada vez que el dropdown cierra (cuando el padre ya actualizó su estado)
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

  const triggerClass = `flex min-h-[42px] w-full cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-60 ${
    error
      ? 'border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-400 dark:bg-rose-950/20 dark:text-rose-200'
      : 'border-slate-300 bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
  }`

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </span>

      <div ref={containerRef} className="relative">
        <button type="button" disabled={disabled} onClick={handleToggle} className={triggerClass}>
          <span className="flex min-w-0 flex-1 flex-wrap gap-1">
            {multiple ? (
              selectedOptions.length > 0 ? (
                selectedOptions.map((opt) => (
                  <span
                    key={opt.value}
                    className="inline-flex items-center gap-1 rounded bg-cyan-100 px-2 py-0.5 text-xs text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200"
                  >
                    {opt.label}
                    <span
                      role="button"
                      onClick={(e) => handleRemoveValue(opt.value, e)}
                      className="leading-none hover:text-cyan-600 dark:hover:text-cyan-100"
                    >
                      ✕
                    </span>
                  </span>
                ))
              ) : (
                <span className="text-slate-400 dark:text-slate-500">{placeholder}</span>
              )
            ) : (
              <span className={!selectedOption ? 'text-slate-400 dark:text-slate-500' : ''}>
                {selectedOption?.label ?? placeholder}
              </span>
            )}
          </span>

          <span className="flex shrink-0 items-center gap-1 text-slate-400">
            {!multiple && value && (
              <span
                role="button"
                onClick={handleClearSingle}
                className="hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </span>
            )}
            <span className={`text-xs transition-transform duration-150 ${open ? 'rotate-180' : ''}`}>▼</span>
          </span>
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-200 p-2 dark:border-slate-700">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Buscar..."
                className="w-full rounded-md border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400"
              />
            </div>

            <ul className="max-h-48 overflow-y-auto py-1">
              {loading ? (
                <li className="px-3 py-2 text-sm text-slate-400 dark:text-slate-500">Cargando...</li>
              ) : options.length === 0 ? (
                <li className="px-3 py-2 text-sm text-slate-400 dark:text-slate-500">Sin resultados</li>
              ) : (
                options.map((option) => {
                  const isSelected = multiple ? values.includes(option.value) : option.value === value
                  return (
                    <li
                      key={option.value}
                      onClick={() => handleSelectOption(option)}
                      className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 ${
                        isSelected
                          ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {multiple && (
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${
                            isSelected
                              ? 'border-cyan-500 bg-cyan-500 text-white'
                              : 'border-slate-400 dark:border-slate-500'
                          }`}
                        >
                          {isSelected && '✓'}
                        </span>
                      )}
                      {option.label}
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {!error && helperText && <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
      {error && <p className="text-xs text-rose-500 dark:text-rose-400">{error}</p>}
    </div>
  )
}
