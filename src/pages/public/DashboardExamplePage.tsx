import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FooterComponent, SellerDashboardMainComponent, SellerDashboardSideComponent, ThemeToggle } from '@/components'
import { AUTH_ROUTE_HOME } from '@/constant'
import { useStoreDashboardExample, useStoreTheme } from '@/store'

export default function DashboardExamplePage() {
  const navigate = useNavigate()
  const isDark = useStoreTheme((s) => s.isDark)
  const toggleTheme = useStoreTheme((s) => s.toggleTheme)
  const dashboard = useStoreDashboardExample((s) => s.dashboard)
  const loadingDashboard = useStoreDashboardExample((s) => s.loadingDashboard)
  const errorMessage = useStoreDashboardExample((s) => s.errorMessage)
  const getDashboard = useStoreDashboardExample((s) => s.getDashboard)

  useEffect(() => {
    getDashboard()
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </div>

      <section className="relative overflow-hidden border-b border-slate-200 dark:border-white/10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.12),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(14,116,144,0.1),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.15),_transparent_30%)]" />
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            onClick={() => navigate(AUTH_ROUTE_HOME)}
          >
            <span aria-hidden="true">←</span>
            Volver al inicio
          </button>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
              Dashboard Publico
            </p>
            <h1 className="mt-3 text-balance text-4xl font-bold leading-tight sm:text-5xl">
              Panel vendedor de {dashboard.seller.name || 'equipo comercial'}
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
              Vista demo para seguimiento de oportunidades, actividad diaria y foco de cierre en terreno {dashboard.seller.territory}.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {loadingDashboard ? (
          <div className="rounded-2xl border border-dashed border-cyan-400/40 p-8 text-center text-sm">
            Cargando dashboard...
          </div>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-rose-300 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-400/40 dark:bg-rose-900/20 dark:text-rose-200">
            {errorMessage}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
            <SellerDashboardMainComponent
              kpis={dashboard.kpis}
              pipeline={dashboard.pipeline}
              periodLabel={dashboard.periodLabel}
            />
            <SellerDashboardSideComponent
              tasks={dashboard.tasks}
              topClients={dashboard.topClients}
              recentActivity={dashboard.recentActivity}
            />
          </div>
        )}
      </section>

      <FooterComponent />
    </main>
  )
}
