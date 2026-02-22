import type { TableComponentProps } from '@/types'

export default function TableComponent({
  columns,
  rows,
  loading = false,
  emptyMessage = 'Sin datos',
  scrollContainerClassName = '',
  renderCell,
  sortableColumnIndexes = [],
  sortState = { columnIndex: null, direction: 'desc' },
  onSortChange,
}: TableComponentProps) {
  const isSortableColumn = (columnIndex: number) =>
    sortableColumnIndexes.includes(columnIndex) && typeof onSortChange === 'function'

  return (
    <section className="overflow-visible rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
      <div className={`overflow-x-auto ${scrollContainerClassName}`.trim()}>
        <table className="w-full min-w-max">
          <thead className="bg-slate-50 dark:bg-slate-800/60">
            <tr>
              {columns.map((column, columnIndex) => (
                <th
                  key={column}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-200"
                >
                  {isSortableColumn(columnIndex) ? (
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-2 text-left transition hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:hover:text-cyan-300"
                      onClick={() => onSortChange?.(columnIndex)}
                    >
                      <span>{column}</span>
                      <span className="flex flex-col leading-none text-[9px]">
                        <span
                          className={
                            sortState.columnIndex === columnIndex && sortState.direction === 'asc'
                              ? 'text-cyan-600 dark:text-cyan-300'
                              : 'text-slate-300 dark:text-slate-600'
                          }
                        >
                          ▲
                        </span>
                        <span
                          className={
                            sortState.columnIndex === columnIndex && sortState.direction === 'desc'
                              ? 'text-cyan-600 dark:text-cyan-300'
                              : 'text-slate-300 dark:text-slate-600'
                          }
                        >
                          ▼
                        </span>
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <span>{column}</span>
                      {sortableColumnIndexes.includes(columnIndex) && (
                        <span className="flex flex-col leading-none text-[9px] text-slate-300 dark:text-slate-600">
                          <span>▲</span>
                          <span>▼</span>
                        </span>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/10">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  Cargando...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  {columns.map((column, index) => (
                    <td
                      key={`${row.id}-${column}-${index}`}
                      className="whitespace-nowrap px-4 py-3 text-sm text-slate-700 dark:text-slate-200"
                    >
                      {renderCell ? renderCell(row, row.values[index], index, rowIndex) : row.values[index] ?? '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
