import {
  EmployeeApprovalStatusBadgeComponent,
  StatusBadgeComponent,
} from '@/components'
import type { TableCellCustomRenderer } from '@/components/ui/table/TableCellRendererComponent'
import type { TableRow } from '@/types'

interface CreateEmployeesTableCustomRendererParams {
  nameColumnIndex: number
  approvalStatusColumnIndex: number
  contractColumnIndex: number
  activeColumnIndex: number
  onViewDetail: (rowId: string) => void
  getHasContract: (rowId: string) => boolean
  getIsActive: (rowId: string) => boolean
}

export function createEmployeesTableCustomRenderer({
  nameColumnIndex,
  approvalStatusColumnIndex,
  contractColumnIndex,
  activeColumnIndex,
  onViewDetail,
  getHasContract,
  getIsActive,
}: CreateEmployeesTableCustomRendererParams): TableCellCustomRenderer {
  return ({ row, value, columnIndex }) => {
    const tableRow: TableRow = row

    if (columnIndex == nameColumnIndex) {
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

    if (columnIndex == approvalStatusColumnIndex) {
      const statusName = String(value ?? '')
      return <EmployeeApprovalStatusBadgeComponent statusName={statusName} />
    }

    if (columnIndex == contractColumnIndex) {
      return (
        <StatusBadgeComponent
          enabled={Boolean(getHasContract(tableRow.id))}
          activeLabel="Si"
          inactiveLabel="No"
        />
      )
    }

    if (columnIndex == activeColumnIndex) {
      return <StatusBadgeComponent enabled={Boolean(getIsActive(tableRow.id))} />
    }

    return null
  }
}
