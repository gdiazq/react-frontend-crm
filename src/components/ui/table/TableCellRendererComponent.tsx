import { type ReactNode } from 'react'
import { ActionsDropdownComponent } from '@/components/ui/dropdown/ActionsDropdownComponent'
import type { TableRow } from '@/types'
import type { DropdownAction } from '@/utils'

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
      <ActionsDropdownComponent
        open={actionsConfig.openRowId === row.id}
        actions={actionsConfig.resolveRowActions(row)}
        openDirection={openDirection}
        onToggle={() => actionsConfig.onToggleRow(row.id)}
      />
    )
  }

  return <span>{value}</span>
}
