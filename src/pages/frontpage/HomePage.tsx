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
    if (planId === 'enterprise') {
      navigate(AUTH_ROUTE_LOGIN)
      return
    }
    navigate(AUTH_ROUTE_REGISTER)
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </div>
      <section className="relative isolate overflow-hidden border-b border-slate-200 dark:border-white/10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.12),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(14,116,144,0.1),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.15),_transparent_30%)]" />
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <HeroHeader
            onGoRegister={() => navigate(AUTH_ROUTE_REGISTER)}
            onGoLogin={() => navigate(AUTH_ROUTE_LOGIN)}
          />
          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center">
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
