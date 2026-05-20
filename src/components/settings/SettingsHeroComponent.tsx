interface SettingsHeroComponentProps {
  mfaStatusLabel: string
  mfaStatusClass: string
  activeSessions: number
}

export function SettingsHeroComponent({ mfaStatusLabel, mfaStatusClass, activeSessions }: SettingsHeroComponentProps) {
  return (
    <header className="relative isolate overflow-hidden rounded-[calc(1.5rem*var(--radius-scale))] border border-slate-200 bg-white p-5 soft-ring dark:border-white/10 dark:bg-slate-950 sm:p-6 lg:p-7">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_0%,rgba(8,145,178,0.14),transparent_30%),linear-gradient(135deg,rgba(236,254,255,0.72),transparent_48%)] dark:bg-[radial-gradient(circle_at_10%_0%,rgba(34,211,238,0.12),transparent_30%),linear-gradient(135deg,rgba(8,47,73,0.22),transparent_48%)]" />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            <span className="num">CUENTA · SEGURIDAD</span>
          </div>
          <h1 className="display mt-3 text-[42px] leading-[0.95] text-slate-950 dark:text-slate-50 sm:text-[56px]">
            Configuracion
            <span className="display-it text-slate-500 dark:text-slate-400"> del sistema</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Administra tu perfil, avatar, autenticacion multifactor y sesiones activas desde un solo lugar.
          </p>
        </div>

        <div className="grid min-w-[220px] grid-cols-2 gap-2">
          <article className="r-xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-slate-900/65">
            <p className="num text-[10px] uppercase tracking-[0.16em] text-slate-400">MFA</p>
            <p className={`mt-2 text-sm font-semibold ${mfaStatusClass}`}>{mfaStatusLabel}</p>
          </article>
          <article className="r-xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-slate-900/65">
            <p className="num text-[10px] uppercase tracking-[0.16em] text-slate-400">Sesiones</p>
            <p className="display mt-1 text-[30px] leading-none text-slate-950 dark:text-slate-50">{activeSessions}</p>
          </article>
        </div>
      </div>
    </header>
  )
}
