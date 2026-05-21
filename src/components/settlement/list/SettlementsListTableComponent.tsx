import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow, TableSortState } from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_EDIT, SortDirection } from '@/constant'
import { settlementTableColumns, settlementTableColumnIndex, settlementTableSortByColumn } from '@/factories'
import { useStoreSettlement } from '@/store'
import type { SettlementTableRow } from '@/types'
import {
  createSettlementActions,
  createTableCustomRenderer,
  renderEmployeeApprovalStatus,
  renderStatusBadge,
  renderViewDetailButton,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const EMPLOYEE_NAME_COLUMN_INDEX = settlementTableColumnIndex.employeeName
const STATUS_COLUMN_INDEX = settlementTableColumnIndex.status
const REHIRE_COLUMN_INDEX = settlementTableColumnIndex.rehire
const ACTIONS_COLUMN_INDEX = settlementTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(settlementTableSortByColumn).map((index) => Number(index))

interface SettlementsListTableComponentProps {
  onViewDetail: (row: SettlementTableRow) => void
}

export function SettlementsListTableComponent({ onViewDetail }: SettlementsListTableComponentProps) {
  const navigate = useNavigate()
  const rows = useStoreSettlement((s) => s.settlementRows)
  const pagination = useStoreSettlement((s) => s.pagination)
  const queryParams = useStoreSettlement((s) => s.queryParams)
  const loading = useStoreSettlement((s) => s.operationLoading.list)
  const sortSettlements = useStoreSettlement((s) => s.sortSettlements)
  const goToPage = useStoreSettlement((s) => s.goToPage)
  const { actionViewDetail, actionEdit } = createSettlementActions()

  const findRowById = (rowId: string) => rows.find((row) => row.id === rowId) ?? null

  const resolveRowActions = (row: SettlementTableRow): DropdownAction[] => [
    actionViewDetail(() => onViewDetail(row)),
    actionEdit(() => navigate(`${AUTH_ROUTE_SETTLEMENTS_EDIT}=${row.id}`)),
  ]

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = findRowById(tableRow.id)
    return row ? resolveRowActions(row) : []
  }

  const renderCustomCell = createTableCustomRenderer({
    [EMPLOYEE_NAME_COLUMN_INDEX]: ({ row, value }) =>
      renderViewDetailButton(value, () => {
        const settlementRow = findRowById(row.id)
        if (settlementRow) onViewDetail(settlementRow)
      }),
    [STATUS_COLUMN_INDEX]: ({ value }) => renderEmployeeApprovalStatus(value),
    [REHIRE_COLUMN_INDEX]: ({ value }) => renderStatusBadge(value === 'Si', { activeLabel: 'Si', inactiveLabel: 'No' }),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = settlementTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortSettlements(sortBy, nextSortDir)
  }

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => settlementTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = { columnIndex: activeSortColumn, direction: queryParams.sortDir }

  return (
    <>
      <TableComponent
        columns={settlementTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay acuerdos de término registrados."
        customRenderer={renderCustomCell}
        actionsConfig={{ columnIndex: ACTIONS_COLUMN_INDEX, resolveRowActions: resolveRowActionsFromTableRow }}
        sortableColumnIndexes={SORTABLE_COLUMNS}
        sortState={sortState}
        onSortChange={(columnIndex) => { void handleSortChange(columnIndex) }}
      />

      <div className="flex justify-end">
        <PaginationComponent
          currentPage={pagination.page + 1}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalElements}
          pageSize={pagination.size}
          loading={loading}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>
    </>
  )
}
