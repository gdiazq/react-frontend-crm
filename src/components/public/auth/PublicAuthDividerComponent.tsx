interface PublicAuthDividerComponentProps {
  label: string
}

export function PublicAuthDividerComponent({ label }: PublicAuthDividerComponentProps) {
  return (
    <div className="relative py-2">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-slate-200 dark:border-white/10" />
      </div>
      <div className="relative flex justify-center">
        <span className="num bg-white px-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-400 dark:bg-slate-900 dark:text-slate-500">
          {label}
        </span>
      </div>
    </div>
  )
}
