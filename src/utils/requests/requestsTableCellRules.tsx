import { EmployeeApprovalStatusBadgeComponent } from '@/components'
import type { TableCellCustomRenderer } from '@/components/ui/table/TableCellRendererComponent'
import type { TableRow } from '@/types'

interface CreateRequestsTableCustomRendererParams {
  requestNameColumnIndex: number
  statusColumnIndex: number
  onViewDetail: (rowId: string) => void
  getStatusName: (rowId: string, fallbackStatusName: string) => string
}

export function createRequestsTableCustomRenderer({
  requestNameColumnIndex,
  statusColumnIndex,
  onViewDetail,
  getStatusName,
}: CreateRequestsTableCustomRendererParams): TableCellCustomRenderer {
  return ({ row, value, columnIndex }) => {
    const tableRow: TableRow = row

    if (columnIndex == requestNameColumnIndex) {
      return (
        <button
          type="button"
          className="text-cyan-700 transition hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
          onClick={() => onViewDetail(tableRow.id)}
        >
          {value}
        </button>
      )
    }

    if (columnIndex == statusColumnIndex) {
      return <EmployeeApprovalStatusBadgeComponent statusName={getStatusName(tableRow.id, String(value ?? ''))} />
    }

    return null
  }
}
