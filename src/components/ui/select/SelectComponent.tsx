interface SelectOption {
  label: string
  value: string
}

interface SelectComponentProps {
  value: string
  label: string
  required?: boolean
  options: SelectOption[]
  error?: string | null
  onValidation?: () => void
  onValueChange?: (value: string) => void
}

export default function SelectComponent({
  value,
  label,
  required = false,
  options,
  error,
  onValidation,
  onValueChange,
}: SelectComponentProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide opacity-80">{label}</span>
      <select
        value={value}
        required={required}
        onChange={(e) => onValueChange?.(e.target.value)}
        onBlur={onValidation}
        className={`w-full rounded-lg bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus-visible:ring-2 focus-visible:ring-offset-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:focus-visible:ring-offset-slate-950 ${
          error
            ? 'border border-rose-400 focus-visible:ring-rose-400 dark:border-rose-400 dark:focus-visible:ring-rose-400'
            : 'border border-slate-300 focus-visible:ring-cyan-400 dark:border-slate-700 dark:focus-visible:ring-cyan-400'
        }`}
      >
        <option value="" disabled>
          Selecciona una opcion
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-500 dark:text-rose-400">{error}</p>}
    </label>
  )
}
