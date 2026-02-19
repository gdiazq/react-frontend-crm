import type { InputHTMLAttributes } from 'react'

interface InputComponentProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string | null
  onValueChange?: (value: string) => void
  modelValue?: string
}

export default function InputComponent({
  label,
  error,
  onValueChange,
  modelValue,
  value,
  onChange,
  id,
  className = '',
  ...rest
}: InputComponentProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  const inputValue = modelValue !== undefined ? modelValue : value

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange?.(e.target.value)
    onChange?.(e)
  }

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      <input
        id={inputId}
        value={inputValue}
        onChange={handleChange}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1 dark:placeholder:text-slate-500 ${
          error
            ? 'border-rose-400 bg-rose-50 text-rose-900 focus:ring-rose-400 dark:border-rose-500 dark:bg-rose-950/20 dark:text-rose-200'
            : 'border-slate-300 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
        } ${className}`}
        {...rest}
      />
      {error && <p className="text-xs text-rose-500 dark:text-rose-400">{error}</p>}
    </div>
  )
}
