import { StatusBadgeComponent } from '@/components'
import type { TableCellCustomRenderer } from '@/components'
import type { TableRow } from '@/types'

interface CreateProjectAssignmentsTableCustomRendererParams {
  employeeNameColumnIndex: number
  projectNameColumnIndex: number
  statusColumnIndex: number
  onViewEmployeeDetail: (rowId: string) => void
  onViewCostCenterDetail: (rowId: string) => void
  getActive: (rowId: string) => boolean
}

export function createProjectAssignmentsTableCustomRenderer({
  employeeNameColumnIndex,
  projectNameColumnIndex,
  statusColumnIndex,
  onViewEmployeeDetail,
  onViewCostCenterDetail,
  getActive,
}: CreateProjectAssignmentsTableCustomRendererParams): TableCellCustomRenderer {
  return ({ row, value, columnIndex }) => {
    const tableRow: TableRow = row

    if (columnIndex === employeeNameColumnIndex) {
      return (
        <button
          type="button"
          className="text-cyan-700 transition hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
          onClick={() => onViewEmployeeDetail(tableRow.id)}
        >
          {value}
        </button>
      )
    }

    if (columnIndex === projectNameColumnIndex) {
      return (
        <button
          type="button"
          className="text-cyan-700 transition hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
          onClick={() => onViewCostCenterDetail(tableRow.id)}
        >
          {value}
        </button>
      )
    }

    if (columnIndex === statusColumnIndex) {
      return <StatusBadgeComponent enabled={getActive(tableRow.id)} />
    }

    return null
  }
}
