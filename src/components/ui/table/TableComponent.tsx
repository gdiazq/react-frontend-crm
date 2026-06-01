import { SortDirection } from '@/constant'
import { useEffect, useState } from 'react'
import type { TableComponentProps, TableRow } from '@/types'
import type { DropdownAction } from '@/utils'
import { TableCellRendererComponent, type TableCellCustomRenderer } from './TableCellRendererComponent'

export interface TableActionsConfig {
  columnIndex: number
  resolveRowActions: (row: TableRow) => DropdownAction[]
  resolveOpenDirection?: (rowIndex: number, rowsLength: number) => 'up' | 'down'
}

interface FullTableComponentProps extends TableComponentProps {
  customRenderer?: TableCellCustomRenderer
  actionsConfig?: TableActionsConfig
}

export function TableComponent({
  columns,
  rows,
  loading = false,
  emptyMessage = 'Sin datos',
  scrollContainerClassName = '',
  preserveHeaderCase = false,
  renderCell,
  customRenderer,
  actionsConfig,
  sortableColumnIndexes = [],
  sortState = { columnIndex: null, direction: SortDirection.Desc },
  onSortChange,
}: FullTableComponentProps) {
  const [openActionsRowId, setOpenActionsRowId] = useState<string | null>(null)

  useEffect(() => {
    const closeActions = () => setOpenActionsRowId(null)
    window.addEventListener('click', closeActions)
    return () => window.removeEventListener('click', closeActions)
  }, [])

  const isSortableColumn = (columnIndex: number) =>
    sortableColumnIndexes.includes(columnIndex) && typeof onSortChange === 'function'

  const internalActionsConfig = actionsConfig
    ? {
        columnIndex: actionsConfig.columnIndex,
        openRowId: openActionsRowId,
        onToggleRow: (rowId: string) => {
          setOpenActionsRowId((id) => (id === rowId ? null : rowId))
        },
        resolveRowActions: (row: TableRow) =>
          actionsConfig.resolveRowActions(row).map((action) => ({
            ...action,
            handler: () => {
              setOpenActionsRowId(null)
              action.handler()
            },
          })),
        resolveOpenDirection: actionsConfig.resolveOpenDirection,
      }
    : undefined

  const renderSortIndicator = (columnIndex: number) => {
    const isActive = sortState.columnIndex === columnIndex
    const direction = isActive ? sortState.direction : null
    return (
      <span
        aria-hidden="true"
        className={`flex h-4 w-3 flex-col items-center justify-center leading-none transition ${
          isActive ? 'accent-text' : 'text-slate-300 dark:text-slate-600'
        }`}
      >
        <svg viewBox="0 0 10 6" className={`h-[5px] w-[10px] ${direction === SortDirection.Asc ? '' : direction === SortDirection.Desc ? 'opacity-30' : 'opacity-60'}`} fill="currentColor">
          <path d="M5 0 L10 6 L0 6 Z" />
        </svg>
        <svg viewBox="0 0 10 6" className={`mt-[1px] h-[5px] w-[10px] ${direction === SortDirection.Desc ? '' : direction === SortDirection.Asc ? 'opacity-30' : 'opacity-60'}`} fill="currentColor">
          <path d="M0 0 L10 0 L5 6 Z" />
        </svg>
      </span>
    )
  }

  return (
    <section className="r-lg overflow-visible min-w-0 border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
      <div className={`min-w-0 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] ${scrollContainerClassName}`.trim()}>
        <table className="w-full min-w-max border-separate border-spacing-0">
          <thead>
            <tr>
              {columns.map((column, columnIndex) => {
                const isSortable = sortableColumnIndexes.includes(columnIndex)
                return (
                  <th
                    key={column}
                    scope="col"
                    className={`sticky top-0 z-10 border-b border-slate-200 bg-slate-50/60 px-4 py-2.5 text-left text-[10.5px] font-semibold tracking-[0.08em] text-slate-500 first:rounded-tl-lg last:rounded-tr-lg dark:border-white/10 dark:bg-slate-800/40 dark:text-slate-400 ${preserveHeaderCase ? '' : 'uppercase'}`.trim()}
                  >
                    {isSortableColumn(columnIndex) ? (
                      <button
                        type="button"
                        className="group inline-flex items-center gap-1.5 text-left transition hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:hover:text-slate-200"
                        onClick={() => onSortChange?.(columnIndex)}
                      >
                        <span>{column}</span>
                        {renderSortIndicator(columnIndex)}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        <span>{column}</span>
                        {isSortable && renderSortIndicator(columnIndex)}
                      </span>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="border-b border-slate-100 px-4 py-3 dark:border-white/5">
                      <div className="h-3 w-3/4 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-[12.5px] text-slate-500 dark:text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => {
                const isLast = rowIndex === rows.length - 1
                return (
                  <tr
                    key={row.id}
                    className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                  >
                    {columns.map((column, index) => {
                      const cellValue = row.values[index] || '-'
                      const borderClass = isLast ? '' : 'border-b border-slate-100 dark:border-white/5'
                      return (
                        <td
                          key={`${row.id}-${column}-${index}`}
                          className={`whitespace-nowrap px-4 py-3 text-[12.5px] text-slate-800 transition-colors dark:text-slate-100 ${borderClass}`.trim()}
                        >
                          {renderCell
                            ? renderCell(row, cellValue, index, rowIndex)
                            : (
                                (customRenderer !== null && customRenderer !== undefined)
                                || (internalActionsConfig !== null && internalActionsConfig !== undefined)
                              )
                              ? (
                                <TableCellRendererComponent
                                  row={row}
                                  value={cellValue}
                                  columnIndex={index}
                                  rowIndex={rowIndex}
                                  rowsLength={rows.length}
                                  customRenderer={customRenderer}
                                  actionsConfig={internalActionsConfig}
                                />
                              )
                              : cellValue}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
