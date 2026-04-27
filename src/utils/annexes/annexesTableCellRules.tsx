import { EmployeeApprovalStatusBadgeComponent } from '@/components'
import type { TableCellCustomRenderer } from '@/components'
import type { TableRow } from '@/types'

interface CreateAnnexesTableCustomRendererParams {
  employeeNameColumnIndex: number
  statusColumnIndex: number
  onViewDetail: (rowId: string) => void
}

export function createAnnexesTableCustomRenderer({
  employeeNameColumnIndex,
  statusColumnIndex,
  onViewDetail,
}: CreateAnnexesTableCustomRendererParams): TableCellCustomRenderer {
  return ({ row, value, columnIndex }) => {
    const tableRow: TableRow = row

    if (columnIndex === employeeNameColumnIndex) {
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

    if (columnIndex === statusColumnIndex) {
      return <EmployeeApprovalStatusBadgeComponent statusName={String(value ?? '')} />
    }

    return null
  }
}
