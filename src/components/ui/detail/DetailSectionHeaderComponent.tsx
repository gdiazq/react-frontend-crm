interface DetailSectionHeaderComponentProps {
  number: string
  title: string
  className?: string
}

export function DetailSectionHeaderComponent({
  number,
  title,
  className = '',
}: DetailSectionHeaderComponentProps) {
  return (
    <div
      className={`mb-4 flex items-baseline gap-3 border-b border-slate-200 pb-3 dark:border-white/10 ${className}`.trim()}
    >
      <span className="num text-[11px] accent-text">{number}</span>
      <h2 className="display text-[24px] leading-none text-slate-900 dark:text-slate-50">{title}</h2>
    </div>
  )
}
