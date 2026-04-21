export function FooterComponent() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-[10.5px] uppercase tracking-[0.18em] sm:flex-row lg:px-8">
        <span className="num">REG · CRM</span>
        <span className="num flex items-center gap-3">
          <span>Desarrollado por</span>
          <span className="h-px w-6 bg-slate-300 dark:bg-slate-700" />
          <span className="text-slate-700 dark:text-slate-200">Guillermo. Diaz Q.</span>
        </span>
      </div>
    </footer>
  )
}
