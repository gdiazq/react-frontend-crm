import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow } from '@/components'
import { AUTH_ROUTE_ROLES_EDIT, PermissionAction, PermissionModule } from '@/constant'
import { rolesTableColumns, rolesTableColumnIndex, rolesTableSortByColumn } from '@/factories'
import { mapperRoleRowStatus } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreRoles } from '@/store'
import { useHasPermission } from '@/hooks'
import type { RoleTableRow } from '@/types'
import {
  createRolesActions,
  createRowsById,
  createTableCustomRenderer,
  createTableSortState,
  findRowById,
  renderStatusBadge,
  renderViewDetailButton,
  resolveNextTableSortDir,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const ROLE_NAME_COLUMN_INDEX = rolesTableColumnIndex.name
const STATUS_COLUMN_INDEX = rolesTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = rolesTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(rolesTableSortByColumn).map((index) => Number(index))

interface RolesListTableComponentProps {
  onViewDetail: (row: RoleTableRow) => void
  onToggleStatus: (row: RoleTableRow) => void
  loadingExtra?: boolean
}

export function RolesListTableComponent(props: RolesListTableComponentProps) {
  const { onViewDetail, onToggleStatus, loadingExtra = false } = props
  const navigate = useNavigate()
  const rows = useStoreRoles((s) => s.rolesRows)
  const pagination = useStoreRoles((s) => s.pagination)
  const queryParams = useStoreRoles((s) => s.queryParams)
  const loading = useStoreRoles((s) => s.operationLoading.list)
  const sortRoles = useStoreRoles((s) => s.sortRoles)
  const goToPage = useStoreRoles((s) => s.goToPage)
  const canUpdateRole = useHasPermission(PermissionModule.Role, PermissionAction.Update)
  const { actionViewDetail, actionUpdateRole, actionToggleStatus } = createRolesActions()

  const rowsById = useMemo(() => createRowsById(rows), [rows])
  const resolveRoleRow = (rowId: string) => findRowById(rowsById, rowId)

  const resolveRowActions = (row: RoleTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => onViewDetail(row)),
    ]
    if (canUpdateRole) {
      actions.push(actionUpdateRole(() => navigate(`${AUTH_ROUTE_ROLES_EDIT}=${row.id}`)))
      actions.push(actionToggleStatus(mapperRoleRowStatus(row), () => onToggleStatus(row)))
    }
    return actions
  }

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = resolveRoleRow(tableRow.id)
    return row ? resolveRowActions(row) : []
  }

  const renderCustomCell = createTableCustomRenderer({
    [ROLE_NAME_COLUMN_INDEX]: ({ row, value }) => renderViewDetailButton(value, () => {
      const roleRow = resolveRoleRow(row.id)
      if (roleRow) onViewDetail(roleRow)
    }),
    [STATUS_COLUMN_INDEX]: ({ row }) => renderStatusBadge(mapperRoleRowStatus(resolveRoleRow(row.id))),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = rolesTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = resolveNextTableSortDir(queryParams.sortBy, queryParams.sortDir, sortBy)
    await sortRoles(sortBy, nextSortDir)
  }

  const sortState = createTableSortState(SORTABLE_COLUMNS, rolesTableSortByColumn, queryParams.sortBy, queryParams.sortDir)

  return (
    <>
      <TableComponent
        columns={rolesTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage={messages.roles.ui.emptyList}
        scrollContainerClassName="roles-table-no-vertical-scrollbar"
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
