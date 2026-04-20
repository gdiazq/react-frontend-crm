interface PaginationComponentProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  loading?: boolean
  onPageChange: (page: number) => void
}

export function PaginationComponent({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  loading = false,
  onPageChange,
}: PaginationComponentProps) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalItems)
  const maxVisiblePages = 5
  const halfWindow = Math.floor(maxVisiblePages / 2)
  let pageStart = Math.max(currentPage - halfWindow, 1)
  const pageEnd = Math.min(pageStart + maxVisiblePages - 1, totalPages)
  if (pageEnd - pageStart + 1 < maxVisiblePages) {
    pageStart = Math.max(pageEnd - maxVisiblePages + 1, 1)
  }
  const visiblePages = Array.from(
    { length: pageEnd >= pageStart ? pageEnd - pageStart + 1 : 0 },
    (_, i) => pageStart + i,
  )

  return (
    <div className="flex min-w-0 flex-col items-center justify-between gap-3 border-t border-slate-200 pt-3 sm:flex-row dark:border-white/10">
      <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {totalItems === 0 ? (
          <span>Sin resultados</span>
        ) : (
          <>
            <span>Mostrando</span>
            <span className="num text-[11.5px] normal-case tracking-normal text-slate-700 dark:text-slate-200">
              {start}–{end}
            </span>
            <span className="h-px w-4 bg-slate-300 dark:bg-slate-700" />
            <span>Total</span>
            <span className="num text-[11.5px] normal-case tracking-normal text-slate-700 dark:text-slate-200">
              {totalItems}
            </span>
          </>
        )}
      </div>

      <div className="flex min-w-0 items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1 || loading}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Página anterior"
          className="r-md inline-flex h-8 w-8 items-center justify-center border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:opacity-30 dark:border-white/10 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-slate-50"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {pageStart > 1 && (
          <span className="num px-1 text-[11px] text-slate-400 dark:text-slate-500">…</span>
        )}

        {visiblePages.map((page) => {
          const isActive = page === currentPage
          return (
            <button
              key={page}
              type="button"
              disabled={loading}
              onClick={() => onPageChange(page)}
              aria-current={isActive ? 'page' : undefined}
              className={`r-md num inline-flex h-8 min-w-[2rem] items-center justify-center px-1.5 text-[11.5px] transition disabled:opacity-40 ${
                isActive
                  ? 'accent-bg text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'
              }`}
            >
              {page}
            </button>
          )
        })}

        {pageEnd < totalPages && (
          <span className="num px-1 text-[11px] text-slate-400 dark:text-slate-500">…</span>
        )}

        <button
          type="button"
          disabled={currentPage >= totalPages || loading}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Página siguiente"
          className="r-md inline-flex h-8 w-8 items-center justify-center border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:opacity-30 dark:border-white/10 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-slate-50"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
