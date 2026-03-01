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
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-heading text-slate-700 dark:text-slate-200">{label}</span>
      <select
        value={multiple ? values : value}
        multiple={multiple}
        size={multiple ? (size || Math.min(Math.max(options.length, 6), 12)) : undefined}
        required={required}
        disabled={disabled}
        onChange={handleChange}
        onBlur={onValidation}
        className={`block w-full rounded-base rounded-lg border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs shadow-sm placeholder:text-body outline-none transition focus:border-brand focus:ring-2 focus:ring-brand disabled:cursor-not-allowed disabled:opacity-60 ${
          error
            ? 'border-rose-400 bg-rose-50 text-rose-900 focus:border-rose-500 focus:ring-rose-400 dark:border-rose-400 dark:bg-rose-950/20 dark:text-rose-200 dark:focus:border-rose-400 dark:focus:ring-rose-400'
            : 'border-slate-300 bg-slate-100 text-slate-900 focus:border-cyan-500 focus:ring-cyan-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400'
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
