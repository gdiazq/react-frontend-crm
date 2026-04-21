import type { InputHTMLAttributes, ReactNode } from 'react'

interface CheckboxComponentProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: ReactNode
  description?: ReactNode
  error?: string | null
  onCheckedChange?: (checked: boolean) => void
}

export function CheckboxComponent({
  label,
  description,
  error,
  onCheckedChange,
  checked,
  id,
  disabled,
  required,
  className = '',
  ...rest
}: CheckboxComponentProps) {
  const labelText = typeof label === 'string' ? label : ''
  const inputId = id ?? (labelText ? labelText.toLowerCase().replace(/\s+/g, '-') : undefined)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked)
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        htmlFor={inputId}
        className={`group inline-flex items-start gap-2.5 text-[12.5px] transition-colors ${
          disabled
            ? 'cursor-not-allowed text-slate-400 dark:text-slate-600'
            : 'cursor-pointer text-slate-600 has-[:checked]:text-slate-900 dark:text-slate-300 dark:has-[:checked]:text-slate-100'
        }`}
      >
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className="peer sr-only"
          {...rest}
        />
        <span
          aria-hidden="true"
          className={`r-sm mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center border bg-white transition-all duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-[color:var(--accent-400)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white peer-checked:[&>svg]:scale-100 peer-checked:[&>svg]:opacity-100 dark:bg-slate-900 dark:peer-focus-visible:ring-offset-slate-900 ${
            error
              ? 'border-rose-400 dark:border-rose-500/60'
              : 'border-slate-300 group-hover:border-slate-400 dark:border-slate-600'
          } ${
            disabled
              ? 'opacity-60'
              : 'peer-checked:border-transparent peer-checked:bg-[color:var(--accent-500)] peer-checked:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent-400)_20%,transparent)]'
          }`}
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3 scale-75 text-white opacity-0 transition-all duration-150">
            <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        {(label || description) && (
          <span className="flex flex-col gap-0.5 leading-tight">
            {label && (
              <span>
                {label}
                {required && <span className="ml-0.5 accent-text">*</span>}
              </span>
            )}
            {description && (
              <span className="text-[11.5px] text-slate-500 dark:text-slate-400">{description}</span>
            )}
          </span>
        )}
      </label>
      {error && <p className="num pl-[26px] text-[11px] text-rose-500 dark:text-rose-400">{error}</p>}
    </div>
  )
}
