interface PublicAuthBackButtonComponentProps {
  label: string
  onClick: () => void
  variant?: 'badge' | 'plain'
}

export function PublicAuthBackButtonComponent(props: PublicAuthBackButtonComponentProps) {
  const { label, onClick, variant = 'plain' } = props

  if (variant === 'badge') {
    return (
      <button
        type="button"
        className="num inline-flex items-center gap-2 r-full border border-[color:var(--accent-500)]/20 accent-bg-soft px-3 py-1.5 text-[10.5px] uppercase tracking-[0.16em] accent-text shadow-sm transition hover:-translate-y-0.5 hover:border-[color:var(--accent-500)]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-[color:var(--accent-400)]/25 dark:focus-visible:ring-offset-slate-950"
        onClick={onClick}
      >
        <span aria-hidden="true" className="inline-flex h-4 w-4 items-center justify-center r-full bg-white/70 text-[12px] dark:bg-slate-950/40">←</span>
        {label}
      </button>
    )
  }

  return (
    <button
      type="button"
      className="num inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 transition hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:focus-visible:ring-offset-slate-950"
      onClick={onClick}
    >
      <span aria-hidden="true">←</span>
      {label}
    </button>
  )
}
