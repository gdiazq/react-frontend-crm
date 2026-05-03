import { ButtonComponent } from '@/components/ui/button/ButtonComponent'
import type { CrmPricingPlan } from '@/types'

interface PricingSectionProps {
  plans: CrmPricingPlan[]
  onSelectPlan: (planId: string) => void
}

export function PricingSection({ plans, onSelectPlan }: PricingSectionProps) {
  return (
    <section className="relative isolate overflow-hidden border-y border-slate-200 py-16 dark:border-white/10">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(236,254,255,0.86),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(8,145,178,0.14),transparent_35%),radial-gradient(circle_at_10%_90%,rgba(16,185,129,0.12),transparent_36%)] dark:bg-[linear-gradient(135deg,rgba(8,47,73,0.34),transparent_44%),radial-gradient(circle_at_85%_10%,rgba(34,211,238,0.12),transparent_36%),radial-gradient(circle_at_10%_90%,rgba(16,185,129,0.1),transparent_36%)]" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <p className="num text-[10.5px] uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
            ACCESO · OPERACION
          </p>
          <h2 className="display mt-3 text-[42px] leading-none text-slate-950 dark:text-slate-50 sm:text-[52px]">
            Entra por el flujo
            <span className="display-it text-slate-500 dark:text-slate-400"> que necesitas resolver</span>
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            La bienvenida debe orientar rapido: crear acceso, revisar una demo o coordinar una configuracion inicial con el equipo.
          </p>
        </header>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => {
            const isHighlighted = plan.highlighted === true
            return (
              <article
                key={plan.id}
                className={`r-2xl border p-6 soft-ring transition hover:-translate-y-0.5 ${
                  isHighlighted
                    ? 'border-cyan-300 bg-white shadow-cyan-200/60 dark:border-cyan-300/35 dark:bg-slate-950'
                    : 'border-slate-200 bg-white/80 dark:border-white/10 dark:bg-slate-950/80'
                }`}
              >
                <div>
                  <div>
                    <p className="num text-[10px] uppercase tracking-[0.18em] text-slate-400">{plan.priceMonthly}</p>
                    <h3 className="display mt-2 text-[30px] leading-none text-slate-950 dark:text-slate-50">{plan.name}</h3>
                  </div>
                </div>
                <p className="mt-4 min-h-12 text-sm leading-6 text-slate-600 dark:text-slate-300">{plan.description}</p>

                <ul className="mt-6 space-y-2.5 text-sm">
                  {plan.features.map((feature) => (
                    <li key={`${plan.id}-${feature}`} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-600/15 text-[10px] text-cyan-700 dark:text-cyan-300">
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
                    className={`w-full ${isHighlighted ? 'bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300' : 'bg-white/80'}`}
                    onClick={() => onSelectPlan(plan.id)}
                  >
                    {plan.ctaLabel}
                  </ButtonComponent>
                </div>
                <p className="mt-3 text-center text-[11px] text-slate-400">{plan.billingLabel}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
