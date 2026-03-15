import { StatusBadgeComponent } from '@/components'
import type { TableCellCustomRenderer } from '@/components'
import type { TableRow } from '@/types'

interface CreateProjectsTableCustomRendererParams {
  typeColumnIndex: number
  statusColumnIndex: number
  specialtyColumnIndex: number
  activeColumnIndex: number
  getTypeName: (rowId: string) => string
  getStatusName: (rowId: string) => string
  getSpecialtyName: (rowId: string) => string
  getActive: (rowId: string) => boolean
}

export function createProjectsTableCustomRenderer({
  typeColumnIndex,
  statusColumnIndex,
  specialtyColumnIndex,
  activeColumnIndex,
  getTypeName,
  getStatusName,
  getSpecialtyName,
  getActive,
}: CreateProjectsTableCustomRendererParams): TableCellCustomRenderer {
  return ({ row, columnIndex }) => {
    const tableRow: TableRow = row

    if (columnIndex === typeColumnIndex) {
      return getTypeName(tableRow.id)
    }

    if (columnIndex === statusColumnIndex) {
      return getStatusName(tableRow.id)
    }

    if (columnIndex === specialtyColumnIndex) {
      return getSpecialtyName(tableRow.id)
    }

    if (columnIndex === activeColumnIndex) {
      return <StatusBadgeComponent enabled={getActive(tableRow.id)} />
    }

    return null
  }
}
