import type { InputHTMLAttributes } from 'react'

interface InputComponentProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string | null
  onValueChange?: (value: string) => void
  modelValue?: string
}

export function InputComponent({
  label,
  error,
  onValueChange,
  modelValue,
  value,
  onChange,
  id,
  required,
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
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[10.5px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400"
        >
          {label}
          {required && <span className="ml-0.5 accent-text">*</span>}
        </label>
      )}
      <input
        id={inputId}
        value={inputValue}
        onChange={handleChange}
        required={required}
        className={`r-md h-9 w-full border px-2.5 text-[13px] outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--accent-400)]/30 dark:placeholder:text-slate-500 ${
          error
            ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500 focus:ring-rose-400/30 dark:border-rose-500/60 dark:bg-rose-950/20 dark:text-rose-200'
            : 'border-slate-200 bg-white text-slate-800 focus:border-[var(--accent-500)] dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-100'
        } ${className}`}
        {...rest}
      />
      {error && <p className="num text-[11px] text-rose-500 dark:text-rose-400">{error}</p>}
    </div>
  )
}
