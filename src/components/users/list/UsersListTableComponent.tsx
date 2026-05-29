import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow } from '@/components'
import { AUTH_ROUTE_USERS_EDIT, PermissionAction, PermissionModule } from '@/constant'
import { usersTableColumns, usersTableColumnIndex, usersTableSortByColumn } from '@/factories'
import { mapperUserRowStatus } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreUsers } from '@/store'
import { useHasPermission } from '@/hooks'
import type { UserTableRow } from '@/types'
import {
  createRowsById,
  createTableCustomRenderer,
  createTableSortState,
  createUsersActions,
  findRowById,
  renderStatusBadge,
  renderViewDetailButton,
  resolveNextTableSortDir,
} from '@/utils'
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
  const canUpdateUser = useHasPermission(PermissionModule.User, PermissionAction.Update)
  const { actionViewDetail, actionUpdateUser, actionToggleStatus } = createUsersActions()

  const rowsById = useMemo(() => createRowsById(rows), [rows])
  const resolveUserRow = (rowId: string) => findRowById(rowsById, rowId)

  const resolveRowActions = (row: UserTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => onViewDetail(row)),
    ]

    if (canUpdateUser) {
      actions.push(actionUpdateUser(() => navigate(`${AUTH_ROUTE_USERS_EDIT}=${row.id}`)))
      actions.push(actionToggleStatus(mapperUserRowStatus(row), () => onToggleStatus(row)))
    }

    return actions
  }

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = resolveUserRow(tableRow.id)
    return row ? resolveRowActions(row) : []
  }

  const renderCustomCell = createTableCustomRenderer({
    [EMAIL_COLUMN_INDEX]: ({ row, value }) =>
      renderViewDetailButton(value, () => {
        const userRow = resolveUserRow(row.id)
        if (userRow) onViewDetail(userRow)
      }),
    [STATUS_COLUMN_INDEX]: ({ row }) => renderStatusBadge(mapperUserRowStatus(resolveUserRow(row.id))),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = usersTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = resolveNextTableSortDir(queryParams.sortBy, queryParams.sortDir, sortBy)
    await sortUsers(sortBy, nextSortDir)
  }

  const sortState = createTableSortState(SORTABLE_COLUMNS, usersTableSortByColumn, queryParams.sortBy, queryParams.sortDir)

  return (
    <>
      <TableComponent
        columns={usersTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage={messages.users.ui.emptyList}
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
