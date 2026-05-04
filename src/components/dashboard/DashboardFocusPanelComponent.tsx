interface DashboardFocusPanelComponentProps {
  hasModules: boolean
}

export function DashboardFocusPanelComponent({ hasModules }: DashboardFocusPanelComponentProps) {
  return (
    <aside className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-5 text-white shadow-sm dark:border-white/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="num text-[10px] uppercase tracking-[0.18em] text-cyan-200/80">Foco del día</p>
          <h2 className="display mt-3 text-[32px] leading-none">
            Opera con
            <span className="display-it text-cyan-200"> criterio</span>
          </h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] text-cyan-100">
          {hasModules ? 'Disponible' : 'Sin módulos'}
        </span>
      </div>

      <div className="mt-8 space-y-3">
        <DashboardFocusItem number="01" title="Revisa solicitudes" body="Parte por aprobaciones y cambios pendientes antes de mover datos maestros." />
        <DashboardFocusItem number="02" title="Actualiza expedientes" body="Trabajadores, contratos y anexos deben quedar alineados con la operación real." />
        <DashboardFocusItem number="03" title="Cierra trazabilidad" body="Documentos y permisos deben conservar registro limpio para auditoría." />
      </div>
    </aside>
  )
}

function DashboardFocusItem({ number, title, body }: { number: string, title: string, body: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
      <div className="flex items-center gap-2">
        <span className="num text-[10px] text-cyan-200">{number}</span>
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <p className="mt-2 text-[12px] leading-5 text-slate-300">{body}</p>
    </div>
  )
}
