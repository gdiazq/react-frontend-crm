import type { CrmFeature } from '@/types'

interface FeatureGridProps {
  features: CrmFeature[]
}

export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <p className="num text-[10.5px] uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">MODULOS · SISTEMA</p>
        <h2 className="display mt-3 text-[42px] leading-none text-slate-950 dark:text-slate-50">
          Todo el ciclo
          <span className="display-it text-slate-500 dark:text-slate-400"> en una sola ruta</span>
        </h2>
        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          El objetivo no es llenar pantallas: es reducir saltos, errores y dobles registros entre RRHH, contratos y proyectos.
        </p>
      </div>

      {features.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="group r-2xl relative overflow-hidden border border-slate-200 bg-white p-6 soft-ring transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-950/5 dark:border-white/10 dark:bg-slate-950 dark:hover:border-cyan-300/35"
            >
              <span className="num text-[10px] uppercase tracking-[0.2em] text-slate-400">0{index + 1}</span>
              <h3 className="display mt-5 text-[30px] leading-none text-slate-950 dark:text-slate-50">{feature.title}</h3>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{feature.description}</p>
              <div className="absolute -bottom-12 -right-12 h-28 w-28 rounded-full bg-cyan-300/0 blur-2xl transition group-hover:bg-cyan-300/20" />
            </article>
          ))}
        </div>
      ) : (
        <article className="r-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 dark:border-white/20 dark:bg-slate-900/60 dark:text-slate-300">
          No hay funcionalidades para mostrar por ahora.
        </article>
      )}
    </section>
  )
}
