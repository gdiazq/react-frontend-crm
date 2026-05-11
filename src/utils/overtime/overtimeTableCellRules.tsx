import { EmployeeApprovalStatusBadgeComponent } from '@/components'
import type { TableCellCustomRenderer } from '@/components'
import type { TableRow } from '@/types'

interface CreateOvertimeTableCustomRendererParams {
  employeeNameColumnIndex: number
  statusColumnIndex: number
  onViewDetail?: (rowId: string) => void
}

export function createOvertimeTableCustomRenderer({
  employeeNameColumnIndex,
  statusColumnIndex,
  onViewDetail,
}: CreateOvertimeTableCustomRendererParams): TableCellCustomRenderer {
  return ({ row, value, columnIndex }) => {
    const tableRow: TableRow = row

    if (columnIndex === employeeNameColumnIndex) {
      return onViewDetail ? (
        <button
          type="button"
          className="accent-text font-medium transition hover:opacity-80"
          onClick={() => onViewDetail(tableRow.id)}
        >
          {value}
        </button>
      ) : (
        <span className="font-medium text-slate-800 dark:text-slate-100">{value}</span>
      )
    }

    if (columnIndex === statusColumnIndex) {
      return <EmployeeApprovalStatusBadgeComponent statusName={String(value ?? '')} />
    }

    return null
  }
}
