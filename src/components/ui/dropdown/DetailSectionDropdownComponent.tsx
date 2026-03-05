import { useEffect, useRef, useState } from 'react'

export interface DetailSectionDropdownOption {
  value: string
  label: string
}

interface DetailSectionDropdownComponentProps {
  label: string
  value: string
  options: DetailSectionDropdownOption[]
  disabled?: boolean
  onValueChange: (value: string) => void
}

export default function DetailSectionDropdownComponent({
  label,
  value,
  options,
  disabled = false,
  onValueChange,
}: DetailSectionDropdownComponentProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const close = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (!containerRef.current || !target) return
      if (!containerRef.current.contains(target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  useEffect(() => {
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', closeWithEscape)
    return () => document.removeEventListener('keydown', closeWithEscape)
  }, [])

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div ref={containerRef} className="relative">
      <p className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">{label}</p>
      <button
        type="button"
        disabled={disabled}
        className="flex min-h-[42px] w-full items-center justify-between rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-left text-sm text-slate-900 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="truncate">{selectedOption?.label || 'Selecciona una opcion'}</span>
        <span className={`text-xs text-slate-500 transition-transform dark:text-slate-300 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-slate-900">
          {options.map((option) => {
            const selected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition ${
                  selected
                    ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-200'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
                onClick={() => {
                  onValueChange(option.value)
                  setOpen(false)
                }}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
