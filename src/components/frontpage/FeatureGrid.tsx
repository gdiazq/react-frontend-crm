import type { CrmFeature } from '@/types'

interface FeatureGridProps {
  features: CrmFeature[]
}

export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      {features.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/70"
            >
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
            </article>
          ))}
        </div>
      ) : (
        <article className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 dark:border-white/20 dark:bg-slate-900/60 dark:text-slate-300">
          No hay funcionalidades para mostrar por ahora.
        </article>
      )}
    </section>
  )
}
