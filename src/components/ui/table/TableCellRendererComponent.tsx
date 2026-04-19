import { type ReactNode } from 'react'
import { DropdownActionsMenuComponent } from '@/components/ui/dropdown/DropdownActionsMenuComponent'
import type { TableRow } from '@/types'
import type { DropdownAction } from '@/utils'

const TABLE_ROW_TRIGGER_CLASS = 'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900'

const TableRowActionsIcon = (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="5" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="12" cy="19" r="1.5" />
  </svg>
)

export interface TableCellRenderContext {
  row: TableRow
  value: ReactNode
  columnIndex: number
  rowIndex: number
}

export type TableCellCustomRenderer = (context: TableCellRenderContext) => ReactNode | null | undefined

interface TableCellRendererComponentProps {
  row: TableRow
  value: ReactNode
  columnIndex: number
  rowIndex: number
  rowsLength: number
  customRenderer?: TableCellCustomRenderer
  actionsConfig?: {
    columnIndex: number
    openRowId: string | null
    resolveRowActions: (row: TableRow) => DropdownAction[]
    onToggleRow: (rowId: string) => void
    resolveOpenDirection?: (rowIndex: number, rowsLength: number) => 'up' | 'down'
  }
}

export function TableCellRendererComponent({
  row,
  value,
  columnIndex,
  rowIndex,
  rowsLength,
  customRenderer,
  actionsConfig,
}: TableCellRendererComponentProps) {
  const customRenderedCell = customRenderer?.({
    row,
    value,
    columnIndex,
    rowIndex,
  })

  if (customRenderedCell !== undefined && customRenderedCell !== null) {
    return <>{customRenderedCell}</>
  }

  if (actionsConfig && columnIndex === actionsConfig.columnIndex) {
    const openDirection = actionsConfig.resolveOpenDirection
      ? actionsConfig.resolveOpenDirection(rowIndex, rowsLength)
      : rowsLength > 2 && rowIndex >= rowsLength - 2
        ? 'up'
        : 'down'
    return (
      <DropdownActionsMenuComponent
        variant="portal"
        open={actionsConfig.openRowId === row.id}
        actions={actionsConfig.resolveRowActions(row)}
        openDirection={openDirection}
        onToggle={() => actionsConfig.onToggleRow(row.id)}
        triggerClassName={TABLE_ROW_TRIGGER_CLASS}
        triggerIcon={TableRowActionsIcon}
        ariaLabel="Abrir acciones"
      />
    )
  }

  return <span>{value}</span>
}
