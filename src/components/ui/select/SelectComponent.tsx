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
  size?: number
  placeholder?: string
  helperText?: string
  options: SelectOption[]
  error?: string | null
  onValidation?: () => void
  onValueChange?: (value: string) => void
  onValuesChange?: (values: string[]) => void
}

export default function SelectComponent({
  value = '',
  values = [],
  label,
  required = false,
  disabled = false,
  multiple = false,
  size,
  placeholder = 'Selecciona una opcion',
  helperText,
  options,
  error,
  onValidation,
  onValueChange,
  onValuesChange,
}: SelectComponentProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selectedValues = Array.from(event.target.selectedOptions).map((option) => option.value)
      onValuesChange?.(selectedValues)
      return
    }
    onValueChange?.(event.target.value)
  }

  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide opacity-80">{label}</span>
      <select
        value={multiple ? values : value}
        multiple={multiple}
        size={multiple ? (size || Math.min(Math.max(options.length, 6), 12)) : undefined}
        required={required}
        disabled={disabled}
        onChange={handleChange}
        onBlur={onValidation}
        className={`w-full rounded-lg bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus-visible:ring-2 focus-visible:ring-offset-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:focus-visible:ring-offset-slate-950 ${
          error
            ? 'border border-rose-400 focus-visible:ring-rose-400 dark:border-rose-400 dark:focus-visible:ring-rose-400'
            : 'border border-slate-300 focus-visible:ring-cyan-400 dark:border-slate-700 dark:focus-visible:ring-cyan-400'
        }`}
      >
        {!multiple && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {!error && helperText && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
      {error && <p className="mt-1 text-xs text-rose-500 dark:text-rose-400">{error}</p>}
    </label>
  )
}
