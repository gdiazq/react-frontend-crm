interface DetailSkeletonComponentProps {
  sections?: number
  fieldsPerSection?: number
}

export function DetailSkeletonComponent({
  sections = 4,
  fieldsPerSection = 4,
}: DetailSkeletonComponentProps) {
  return (
    <section className="animate-pulse space-y-12" aria-hidden="true">
      <header className="flex flex-col gap-5 pb-2 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="h-2.5 w-40 r-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-3/4 r-md bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-2">
            <div className="h-2.5 w-2/3 r-full bg-slate-100 dark:bg-slate-800/60" />
            <div className="h-2.5 w-1/2 r-full bg-slate-100 dark:bg-slate-800/60" />
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <div className="h-5 w-24 r-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-28 r-full bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 r-md bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-9 r-md bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-24 r-md bg-slate-200 dark:bg-slate-800" />
        </div>
      </header>

      {Array.from({ length: sections }).map((_, sectionIdx) => (
        <section key={sectionIdx}>
          <div className="mb-4 flex items-baseline gap-3 border-b border-slate-200 pb-3 dark:border-white/10">
            <div className="h-2.5 w-6 r-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-40 r-md bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="grid gap-x-10 md:grid-cols-2">
            {Array.from({ length: fieldsPerSection }).map((_, fieldIdx) => {
              const widths = ['w-24', 'w-32', 'w-28', 'w-36', 'w-20', 'w-40']
              const valueWidth = widths[(sectionIdx + fieldIdx) % widths.length]
              return (
                <div
                  key={fieldIdx}
                  className="flex items-baseline justify-between gap-4 border-b border-slate-100 py-2 dark:border-white/5"
                >
                  <div className="h-2 w-20 r-full bg-slate-100 dark:bg-slate-800/60" />
                  <div className={`h-3 ${valueWidth} r-full bg-slate-200 dark:bg-slate-800`} />
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </section>
  )
}
