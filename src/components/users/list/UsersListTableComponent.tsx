import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow, TableSortState } from '@/components'
import { AUTH_ROUTE_USERS_EDIT, PermissionAction, PermissionModule, SortDirection } from '@/constant'
import { usersTableColumns, usersTableColumnIndex, usersTableSortByColumn } from '@/factories'
import { useStoreUsers } from '@/store'
import { useHasPermission } from '@/hooks'
import type { UserTableRow } from '@/types'
import { createTableCustomRenderer, createUsersActions, renderStatusBadge, renderViewDetailButton } from '@/utils'
import type { DropdownAction } from '@/utils'

const EMAIL_COLUMN_INDEX = usersTableColumnIndex.email
const STATUS_COLUMN_INDEX = usersTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = usersTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(usersTableSortByColumn).map((index) => Number(index))

interface UsersListTableComponentProps {
  onViewDetail: (row: UserTableRow) => void
  onToggleStatus: (row: UserTableRow) => void
  loadingExtra?: boolean
}

export function UsersListTableComponent({ onViewDetail, onToggleStatus, loadingExtra = false }: UsersListTableComponentProps) {
  const navigate = useNavigate()
  const rows = useStoreUsers((s) => s.usersRows)
  const pagination = useStoreUsers((s) => s.pagination)
  const queryParams = useStoreUsers((s) => s.queryParams)
  const loading = useStoreUsers((s) => s.operationLoading.list)
  const sortUsers = useStoreUsers((s) => s.sortUsers)
  const goToPage = useStoreUsers((s) => s.goToPage)
  const canToggleUserStatus = useHasPermission(PermissionModule.User, PermissionAction.Update)
  const { actionViewDetail, actionUpdateUser, actionToggleStatus } = createUsersActions()

  const findRowById = (rowId: string) => rows.find((row) => row.id === rowId) ?? null

  const resolveRowActions = (row: UserTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => onViewDetail(row)),
      actionUpdateUser(() => navigate(`${AUTH_ROUTE_USERS_EDIT}=${row.id}`)),
    ]

    if (canToggleUserStatus) {
      actions.push(actionToggleStatus(row.status === true, () => onToggleStatus(row)))
    }

    return actions
  }

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = findRowById(tableRow.id)
    return row ? resolveRowActions(row) : []
  }

  const renderCustomCell = createTableCustomRenderer({
    [EMAIL_COLUMN_INDEX]: ({ row, value }) =>
      renderViewDetailButton(value, () => {
        const userRow = findRowById(row.id)
        if (userRow) onViewDetail(userRow)
      }),
    [STATUS_COLUMN_INDEX]: ({ row }) => renderStatusBadge(Boolean(findRowById(row.id)?.status)),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = usersTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortUsers(sortBy, nextSortDir)
  }

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => usersTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = { columnIndex: activeSortColumn, direction: queryParams.sortDir }

  return (
    <>
      <TableComponent
        columns={usersTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay usuarios registrados."
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
          loading={loading || loadingExtra}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>
    </>
  )
}
