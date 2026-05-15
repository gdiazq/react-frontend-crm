import type { ReactNode } from 'react'
import {
  ContractStatusBadgeComponent,
  ContractTypeBadgeComponent,
  EmployeeApprovalStatusBadgeComponent,
  StatusBadgeComponent,
} from '@/components'
import type { TableCellCustomRenderer } from '@/components'
import type { TableRow } from '@/types'

type ViewDetailVariant = 'accent' | 'cyan'

const VIEW_DETAIL_CLASSES: Record<ViewDetailVariant, string> = {
  accent: 'accent-text font-medium transition hover:opacity-80',
  cyan: 'text-cyan-700 transition hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200',
}

export function renderViewDetailButton(
  value: unknown,
  onClick: () => void,
  variant: ViewDetailVariant = 'cyan',
): ReactNode {
  return (
    <button type="button" className={VIEW_DETAIL_CLASSES[variant]} onClick={onClick}>
      {String(value ?? '')}
    </button>
  )
}

export function renderStatusBadge(
  enabled: boolean,
  options?: { activeLabel?: string, inactiveLabel?: string },
): ReactNode {
  return (
    <StatusBadgeComponent
      enabled={enabled}
      activeLabel={options?.activeLabel}
      inactiveLabel={options?.inactiveLabel}
    />
  )
}

export function renderEmployeeApprovalStatus(value: unknown): ReactNode {
  return <EmployeeApprovalStatusBadgeComponent statusName={String(value ?? '')} />
}

export function renderContractStatus(value: unknown): ReactNode {
  return <ContractStatusBadgeComponent contractStatus={String(value ?? '')} />
}

export function renderContractType(value: unknown): ReactNode {
  return <ContractTypeBadgeComponent contractType={String(value ?? '')} />
}

interface TableCellRenderContext {
  row: TableRow
  value: unknown
  columnIndex: number
}

export type ColumnRenderers = Record<number, (ctx: TableCellRenderContext) => ReactNode>

export function createTableCustomRenderer(renderers: ColumnRenderers): TableCellCustomRenderer {
  return ({ row, value, columnIndex }) => {
    const fn = renderers[columnIndex]
    if (!fn) return null
    return fn({ row: row as TableRow, value, columnIndex })
  }
}
