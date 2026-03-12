import {
  ContractStatusBadgeComponent,
  ContractTypeBadgeComponent,
  StatusBadgeComponent,
} from '@/components'
import type { TableCellCustomRenderer } from '@/components'
import type { TableRow } from '@/types'

interface CreateContractsTableCustomRendererParams {
  contractTypeColumnIndex: number
  contractStatusColumnIndex: number
  contractActiveColumnIndex: number
  getIsActive: (rowId: string) => boolean
}

export function createContractsTableCustomRenderer({
  contractTypeColumnIndex,
  contractStatusColumnIndex,
  contractActiveColumnIndex,
  getIsActive,
}: CreateContractsTableCustomRendererParams): TableCellCustomRenderer {
  return ({ row, value, columnIndex }) => {
    const tableRow: TableRow = row

    if (columnIndex == contractTypeColumnIndex) {
      const contractType = String(value ?? '')
      return <ContractTypeBadgeComponent contractType={contractType} />
    }

    if (columnIndex == contractStatusColumnIndex) {
      const contractStatus = String(value ?? '')
      return <ContractStatusBadgeComponent contractStatus={contractStatus} />
    }

    if (columnIndex == contractActiveColumnIndex) {
      return <StatusBadgeComponent enabled={Boolean(getIsActive(tableRow.id))} />
    }

    return null
  }
}
