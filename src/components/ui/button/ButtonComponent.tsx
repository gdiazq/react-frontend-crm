import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonComponentProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'solid' | 'ghost' | 'danger'
  label?: string
  loading?: boolean
  children?: ReactNode
  onClick?: () => void
}

export default function ButtonComponent({
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
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

  const variants: Record<string, string> = {
    primary:
      'bg-cyan-600 text-white hover:bg-cyan-700 focus-visible:ring-offset-slate-50 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300 dark:focus-visible:ring-offset-slate-950',
    solid:
      'bg-cyan-600 text-white hover:bg-cyan-700 focus-visible:ring-offset-slate-50 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300 dark:focus-visible:ring-offset-slate-950',
    outline:
      'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
    ghost:
      'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-400',
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
