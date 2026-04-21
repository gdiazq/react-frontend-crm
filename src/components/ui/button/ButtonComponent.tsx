import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonComponentProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'solid' | 'ghost' | 'danger' | 'success'
  label?: string
  loading?: boolean
  children?: ReactNode
  onClick?: () => void
}

export function ButtonComponent({
  variant = 'primary',
  label,
  loading = false,
  children,
  disabled,
  type = 'button',
  onClick,
  className = '',
  ...rest
}: ButtonComponentProps) {
  const base =
    'inline-flex h-9 items-center justify-center gap-1.5 r-md px-3.5 text-[12.5px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-400)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

  const variants: Record<string, string> = {
    primary:
      'accent-bg text-white hover:opacity-90 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950',
    solid:
      'accent-bg text-white hover:opacity-90 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950',
    outline:
      'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/60',
    ghost:
      'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-400',
    success:
      'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-offset-slate-50 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:focus-visible:ring-offset-slate-950',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant] ?? variants.primary} ${className}`}
      {...rest}
    >
      {label ?? children}
    </button>
  )
}
