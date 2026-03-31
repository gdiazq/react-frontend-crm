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
    <div className="flex min-w-0 flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {totalItems === 0 ? 'Sin resultados' : `Mostrando ${start}–${end} de ${totalItems}`}
      </p>
      <div className="flex min-w-0 items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1 || loading}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>

        {visiblePages.map((page) => (
          <button
            key={page}
            type="button"
            disabled={loading}
            onClick={() => onPageChange(page)}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition disabled:opacity-40 ${
              page === currentPage
                ? 'bg-cyan-600 text-white dark:bg-cyan-400 dark:text-slate-950'
                : 'border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage >= totalPages || loading}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
