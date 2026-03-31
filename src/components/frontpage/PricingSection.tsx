import { ButtonComponent } from '@/components/ui/button/ButtonComponent'
import type { CrmPricingPlan } from '@/types'

interface PricingSectionProps {
  plans: CrmPricingPlan[]
  onSelectPlan: (planId: string) => void
}

export function PricingSection({ plans, onSelectPlan }: PricingSectionProps) {
  return (
    <section className="relative isolate overflow-hidden border-y border-slate-200 py-16 dark:border-white/10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,_rgba(8,145,178,0.12),_transparent_40%),radial-gradient(circle_at_80%_100%,_rgba(14,165,233,0.12),_transparent_45%)] dark:bg-[radial-gradient(circle_at_20%_0%,_rgba(56,189,248,0.2),_transparent_42%),radial-gradient(circle_at_80%_100%,_rgba(14,165,233,0.18),_transparent_48%)]" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">
            Precios
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Un plan para cada etapa de tu operacion
          </h2>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            Empieza simple, escala sin migraciones y mantén el control comercial desde el primer día.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const isHighlighted = plan.highlighted === true
            return (
              <article
                key={plan.id}
                className={`rounded-2xl border p-6 shadow-sm transition ${
                  isHighlighted
                    ? 'border-cyan-300 bg-cyan-50/70 shadow-cyan-200/60 dark:border-cyan-400/40 dark:bg-cyan-900/15 dark:shadow-none'
                    : 'border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/70'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  {isHighlighted && (
                    <span className="rounded-full bg-cyan-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Recomendado
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{plan.description}</p>

                <div className="mt-5">
                  <p className="text-3xl font-bold">{plan.priceMonthly}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{plan.billingLabel}</p>
                </div>

                <ul className="mt-6 space-y-2.5 text-sm">
                  {plan.features.map((feature) => (
                    <li key={`${plan.id}-${feature}`} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-cyan-600/15 text-cyan-700 dark:text-cyan-300">
                        ✓
                      </span>
                      <span className="text-slate-700 dark:text-slate-200">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7">
                  <ButtonComponent
                    type="button"
                    variant={isHighlighted ? 'solid' : 'outline'}
                    className={`w-full ${isHighlighted ? 'bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-500 dark:text-white dark:hover:bg-cyan-400' : ''}`}
                    onClick={() => onSelectPlan(plan.id)}
                  >
                    {plan.ctaLabel}
                  </ButtonComponent>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
