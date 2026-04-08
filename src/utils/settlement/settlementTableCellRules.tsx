import {
  EmployeeApprovalStatusBadgeComponent,
  StatusBadgeComponent,
} from '@/components'
import type { TableCellCustomRenderer } from '@/components'
import type { TableRow } from '@/types'

interface CreateSettlementTableCustomRendererParams {
  employeeNameColumnIndex: number
  statusColumnIndex: number
  rehireColumnIndex: number
  onViewDetail: (rowId: string) => void
}

export function createSettlementTableCustomRenderer({
  employeeNameColumnIndex,
  statusColumnIndex,
  rehireColumnIndex,
  onViewDetail,
}: CreateSettlementTableCustomRendererParams): TableCellCustomRenderer {
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

    if (columnIndex === rehireColumnIndex) {
      return (
        <StatusBadgeComponent
          enabled={value === 'Si'}
          activeLabel="Si"
          inactiveLabel="No"
        />
      )
    }

    return null
  }
}
