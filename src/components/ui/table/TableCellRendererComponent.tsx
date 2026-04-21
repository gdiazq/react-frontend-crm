import { type ReactNode } from 'react'
import { DropdownActionsMenuComponent } from '@/components/ui/dropdown/DropdownActionsMenuComponent'
import { IconDots } from '@/components/ui/icons/IconDots'
import type { TableRow } from '@/types'
import type { DropdownAction } from '@/utils'

const TABLE_ROW_TRIGGER_CLASS = 'r-md inline-flex h-8 w-8 items-center justify-center border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-400)] focus-visible:ring-offset-2 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-slate-50 dark:focus-visible:ring-offset-slate-900'

const TableRowActionsIcon = <IconDots />

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
