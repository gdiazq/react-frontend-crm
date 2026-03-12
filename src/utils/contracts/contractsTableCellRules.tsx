import {
  ContractStatusBadgeComponent,
  ContractTypeBadgeComponent,
} from '@/components'
import type { TableCellCustomRenderer } from '@/components'
import type { TableRow } from '@/types'

interface CreateContractsTableCustomRendererParams {
  employeeNameColumnIndex: number
  contractTypeColumnIndex: number
  contractStatusColumnIndex: number
  onViewDetail: (rowId: string) => void
}

export function createContractsTableCustomRenderer({
  employeeNameColumnIndex,
  contractTypeColumnIndex,
  contractStatusColumnIndex,
  onViewDetail,
}: CreateContractsTableCustomRendererParams): TableCellCustomRenderer {
  return ({ row, value, columnIndex }) => {
    const tableRow: TableRow = row

    if (columnIndex == employeeNameColumnIndex) {
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

    if (columnIndex == contractTypeColumnIndex) {
      const contractType = String(value ?? '')
      return <ContractTypeBadgeComponent contractType={contractType} />
    }

    if (columnIndex == contractStatusColumnIndex) {
      const contractStatus = String(value ?? '')
      return <ContractStatusBadgeComponent contractStatus={contractStatus} />
    }

    return null
  }
}
