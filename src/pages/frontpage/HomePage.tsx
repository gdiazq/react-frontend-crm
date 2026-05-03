import { useNavigate } from 'react-router-dom'
import { FeatureGrid, FooterComponent, HeroContent, HeroHeader, KpiPanel, PricingSection, ThemeToggle } from '@/components'
import {
  AUTH_ROUTE_DASHBOARD_EXAMPLE,
  AUTH_ROUTE_LOGIN,
  AUTH_ROUTE_REGISTER,
  CRM_FEATURES,
  CRM_PRICING_PLANS,
  CRM_STAGES,
  CRM_STATS,
} from '@/constant'
import { useStoreTheme } from '@/store'

export default function HomePage() {
  const navigate = useNavigate()
  const isDark = useStoreTheme((s) => s.isDark)
  const toggleTheme = useStoreTheme((s) => s.toggleTheme)

  const handleSelectPlan = (planId: string) => {
    if (planId === 'growth') {
      navigate(AUTH_ROUTE_LOGIN)
      return
    }
    if (planId === 'enterprise') {
      navigate(AUTH_ROUTE_LOGIN)
      return
    }
    navigate(AUTH_ROUTE_REGISTER)
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </div>

      <section className="relative isolate overflow-hidden border-b border-slate-200 dark:border-white/10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_18%,rgba(8,145,178,0.18),transparent_31%),radial-gradient(circle_at_85%_8%,rgba(16,185,129,0.13),transparent_26%),linear-gradient(135deg,#f8fafc_0%,#ecfeff_42%,#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_16%_18%,rgba(34,211,238,0.16),transparent_31%),radial-gradient(circle_at_85%_8%,rgba(16,185,129,0.11),transparent_26%),linear-gradient(135deg,#020617_0%,#082f49_45%,#020617_100%)]" />
        <div className="absolute left-1/2 top-0 -z-10 h-px w-[72rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8 lg:py-8">
          <HeroHeader
            onGoRegister={() => navigate(AUTH_ROUTE_REGISTER)}
            onGoLogin={() => navigate(AUTH_ROUTE_LOGIN)}
          />
          <div className="grid gap-10 py-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(390px,0.95fr)] lg:items-center lg:py-20">
            <HeroContent
              onGoRegister={() => navigate(AUTH_ROUTE_REGISTER)}
              onGoDashboard={() => navigate(AUTH_ROUTE_DASHBOARD_EXAMPLE)}
            />
            <KpiPanel stats={CRM_STATS} stages={CRM_STAGES} />
          </div>
        </div>
      </section>

      <FeatureGrid features={CRM_FEATURES} />
      <PricingSection plans={CRM_PRICING_PLANS} onSelectPlan={handleSelectPlan} />
      <FooterComponent />
    </main>
  )
}
