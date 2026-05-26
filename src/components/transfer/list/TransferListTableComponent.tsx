import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow, TableSortState } from '@/components'
import { AUTH_ROUTE_TRANSFERS_EDIT, PermissionAction, PermissionModule, SortDirection } from '@/constant'
import { transferTableColumns, transferTableColumnIndex, transferTableSortByColumn } from '@/factories'
import { useStoreTransfer } from '@/store'
import { useHasPermission } from '@/hooks'
import type { TransferTableRow } from '@/types'
import {
  createTableCustomRenderer,
  createTransferActions,
  renderEmployeeApprovalStatus,
  renderViewDetailButton,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const EMPLOYEE_NAME_COLUMN_INDEX = transferTableColumnIndex.employeeName
const STATUS_COLUMN_INDEX = transferTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = transferTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(transferTableSortByColumn).map((index) => Number(index))

interface TransferListTableComponentProps {
  onViewDetail: (row: TransferTableRow) => void
}

export function TransferListTableComponent({ onViewDetail }: TransferListTableComponentProps) {
  const navigate = useNavigate()
  const rows = useStoreTransfer((s) => s.transferRows)
  const pagination = useStoreTransfer((s) => s.pagination)
  const queryParams = useStoreTransfer((s) => s.queryParams)
  const loading = useStoreTransfer((s) => s.operationLoading.list)
  const sortTransfers = useStoreTransfer((s) => s.sortTransfers)
  const goToPage = useStoreTransfer((s) => s.goToPage)
  const canUpdateTransfer = useHasPermission(PermissionModule.Transfer, PermissionAction.Update)
  const { actionViewDetail, actionUpdateTransfer } = createTransferActions()

  const findRowById = (rowId: string) => rows.find((row) => row.id === rowId) ?? null

  const resolveRowActions = (row: TransferTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [actionViewDetail(() => onViewDetail(row))]
    if (canUpdateTransfer) actions.push(actionUpdateTransfer(() => navigate(`${AUTH_ROUTE_TRANSFERS_EDIT}=${row.id}`)))
    return actions
  }

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = findRowById(tableRow.id)
    return row ? resolveRowActions(row) : []
  }

  const renderCustomCell = createTableCustomRenderer({
    [EMPLOYEE_NAME_COLUMN_INDEX]: ({ row, value }) =>
      renderViewDetailButton(value, () => {
        const transferRow = findRowById(row.id)
        if (transferRow) onViewDetail(transferRow)
      }),
    [STATUS_COLUMN_INDEX]: ({ value }) => renderEmployeeApprovalStatus(value),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = transferTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortTransfers(sortBy, nextSortDir)
  }

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => transferTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = { columnIndex: activeSortColumn, direction: queryParams.sortDir }

  return (
    <>
      <TableComponent
        columns={transferTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay traspasos registrados."
        customRenderer={renderCustomCell}
        actionsConfig={{
          columnIndex: ACTIONS_COLUMN_INDEX,
          resolveRowActions: resolveRowActionsFromTableRow,
          resolveOpenDirection: (activeRowIndex, rowsLength) => (
            activeRowIndex >= Math.max(rowsLength - 2, 0) ? 'up' : 'down'
          ),
        }}
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
