import { StatusBadgeComponent } from '@/components'
import type { TableCellCustomRenderer } from '@/components'
import type { TableRow } from '@/types'

interface CreateProjectsTableCustomRendererParams {
  nameColumnIndex: number
  typeColumnIndex: number
  statusColumnIndex: number
  specialtyColumnIndex: number
  activeColumnIndex: number
  onViewDetail: (rowId: string) => void
  getTypeName: (rowId: string) => string
  getStatusName: (rowId: string) => string
  getSpecialtyName: (rowId: string) => string
  getActive: (rowId: string) => boolean
}

export function createProjectsTableCustomRenderer({
  nameColumnIndex,
  typeColumnIndex,
  statusColumnIndex,
  specialtyColumnIndex,
  activeColumnIndex,
  onViewDetail,
  getTypeName,
  getStatusName,
  getSpecialtyName,
  getActive,
}: CreateProjectsTableCustomRendererParams): TableCellCustomRenderer {
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

    if (columnIndex == typeColumnIndex) {
      return getTypeName(tableRow.id)
    }

    if (columnIndex == statusColumnIndex) {
      return getStatusName(tableRow.id)
    }

    if (columnIndex == specialtyColumnIndex) {
      return getSpecialtyName(tableRow.id)
    }

    if (columnIndex == activeColumnIndex) {
      return <StatusBadgeComponent enabled={getActive(tableRow.id)} />
    }

    return null
  }
}
