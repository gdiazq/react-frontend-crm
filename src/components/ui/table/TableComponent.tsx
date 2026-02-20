import type { ReactNode } from 'react'

export interface TableRow {
  id: string
  values: (string | ReactNode)[]
}

interface TableComponentProps {
  columns: string[]
  rows: TableRow[]
  loading?: boolean
  emptyMessage?: string
  renderCell?: (row: TableRow, value: string | ReactNode, columnIndex: number, rowIndex: number) => ReactNode
}

export default function TableComponent({
  columns,
  rows,
  loading = false,
  emptyMessage = 'Sin datos',
  renderCell,
}: TableComponentProps) {
  return (
    <section className="overflow-visible rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-slate-50 dark:bg-slate-800/60">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-200"
                >
                  {column}
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
