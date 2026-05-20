interface SettingsSectionTitleComponentProps {
  eyebrow: string
  title: string
  description?: string
}

export function SettingsSectionTitleComponent({ eyebrow, title, description }: SettingsSectionTitleComponentProps) {
  return (
    <div>
      <p className="num text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{eyebrow}</p>
      <h2 className="display mt-2 text-[32px] leading-none text-slate-950 dark:text-slate-50">{title}</h2>
      {description && <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>}
    </div>
  )
}
