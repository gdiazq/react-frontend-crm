import { useState } from 'react'

interface PasswordInputComponentProps {
  label?: string
  value: string
  error?: string | null
  placeholder?: string
  autocomplete?: string
  required?: boolean
  onValueChange: (value: string) => void
}

export function PasswordInputComponent({
  label,
  value,
  error,
  placeholder = 'Contraseña',
  autocomplete = 'current-password',
  required,
  onValueChange,
}: PasswordInputComponentProps) {
  const [show, setShow] = useState(false)
  const inputId = label?.toLowerCase().replace(/\s+/g, '-') ?? 'password'

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autocomplete}
          required={required}
          className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1 dark:placeholder:text-slate-500 ${
            error
              ? 'border-rose-400 bg-rose-50 text-rose-900 focus:ring-rose-400 dark:border-rose-500 dark:bg-rose-950/20 dark:text-rose-200'
              : 'border-slate-300 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
          }`}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {show ? (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="text-xs text-rose-500 dark:text-rose-400">{error}</p>}
    </div>
  )
}
