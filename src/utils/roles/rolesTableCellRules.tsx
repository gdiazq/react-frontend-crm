import { StatusBadgeComponent } from '@/components'
import type { TableCellCustomRenderer } from '@/components'
import type { TableRow } from '@/types'

interface CreateRolesTableCustomRendererParams {
  roleNameColumnIndex: number
  statusColumnIndex: number
  onViewDetail: (rowId: string) => void
  getStatusEnabled: (rowId: string) => boolean
}

export function createRolesTableCustomRenderer({
  roleNameColumnIndex,
  statusColumnIndex,
  onViewDetail,
  getStatusEnabled,
}: CreateRolesTableCustomRendererParams): TableCellCustomRenderer {
  return ({ row, value, columnIndex }) => {
    const tableRow: TableRow = row

    if (columnIndex == roleNameColumnIndex) {
      return (
        <button
          type="button"
          className="accent-text font-medium transition hover:opacity-80"
          onClick={() => onViewDetail(tableRow.id)}
        >
          {value}
        </button>
      )
    }

    if (columnIndex == statusColumnIndex) {
      return <StatusBadgeComponent enabled={Boolean(getStatusEnabled(tableRow.id))} />
    }

    return null
  }
}
