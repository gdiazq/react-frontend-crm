import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow, TableSortState } from '@/components'
import { AUTH_ROUTE_ROLES_EDIT, PermissionAction, PermissionModule, SortDirection } from '@/constant'
import { rolesTableColumns, rolesTableColumnIndex, rolesTableSortByColumn } from '@/factories'
import { useStoreAuth, useStoreRoles } from '@/store'
import type { RoleTableRow } from '@/types'
import { createRolesActions, createTableCustomRenderer, renderStatusBadge, renderViewDetailButton } from '@/utils'
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
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canToggleRoleStatus = hasPermission(PermissionModule.Role, PermissionAction.Update)
  const { actionViewDetail, actionUpdateRole, actionToggleStatus } = createRolesActions()

  const findRowById = (rowId: string) => rows.find((row) => row.id === rowId) ?? null
  const resolveRowActions = (row: RoleTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => onViewDetail(row)),
      actionUpdateRole(() => navigate(`${AUTH_ROUTE_ROLES_EDIT}=${row.id}`)),
    ]
    if (canToggleRoleStatus) actions.push(actionToggleStatus(row.status === true, () => onToggleStatus(row)))
    return actions
  }
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = findRowById(tableRow.id)
    return row ? resolveRowActions(row) : []
  }
  const renderCustomCell = createTableCustomRenderer({
    [ROLE_NAME_COLUMN_INDEX]: ({ row, value }) => renderViewDetailButton(value, () => {
      const roleRow = findRowById(row.id)
      if (roleRow) onViewDetail(roleRow)
    }),
    [STATUS_COLUMN_INDEX]: ({ row }) => renderStatusBadge(Boolean(findRowById(row.id)?.status)),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = rolesTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortRoles(sortBy, nextSortDir)
  }

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => rolesTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = { columnIndex: activeSortColumn, direction: queryParams.sortDir }

  return (
    <>
      <TableComponent
        columns={rolesTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay roles registrados."
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
