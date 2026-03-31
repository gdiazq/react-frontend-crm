import { StatusBadgeComponent } from '@/components'
import type { TableCellCustomRenderer } from '@/components'
import type { TableRow } from '@/types'

interface CreateSafetyComplianceTableCustomRendererParams {
  nameColumnIndex: number
  statusColumnIndex: number
  onViewDetail: (rowId: string) => void
  getStatusEnabled: (rowId: string) => boolean
}

export function createSafetyComplianceTableCustomRenderer({
  nameColumnIndex,
  statusColumnIndex,
  onViewDetail,
  getStatusEnabled,
}: CreateSafetyComplianceTableCustomRendererParams): TableCellCustomRenderer {
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

    if (columnIndex == statusColumnIndex) {
      return <StatusBadgeComponent enabled={Boolean(getStatusEnabled(tableRow.id))} />
    }

    return null
  }
}
