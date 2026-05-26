import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow, TableSortState } from '@/components'
import { AUTH_ROUTE_LEAVES_EDIT, PermissionAction, PermissionModule, SortDirection } from '@/constant'
import { leavesTableColumns, leavesTableColumnIndex, leavesTableSortByColumn } from '@/factories'
import { useStoreLeaves } from '@/store'
import { useHasPermission } from '@/hooks'
import type { LeaveTableRow } from '@/types'
import {
  createLeavesActions,
  createTableCustomRenderer,
  renderEmployeeApprovalStatus,
  renderViewDetailButton,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const EMPLOYEE_NAME_COLUMN_INDEX = leavesTableColumnIndex.employeeName
const STATUS_COLUMN_INDEX = leavesTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = leavesTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(leavesTableSortByColumn).map((index) => Number(index))

interface LeavesListTableComponentProps {
  onViewDetail: (row: LeaveTableRow) => void
}

export function LeavesListTableComponent({ onViewDetail }: LeavesListTableComponentProps) {
  const navigate = useNavigate()
  const rows = useStoreLeaves((s) => s.leavesRows)
  const pagination = useStoreLeaves((s) => s.pagination)
  const queryParams = useStoreLeaves((s) => s.queryParams)
  const loading = useStoreLeaves((s) => s.operationLoading.list)
  const sortLeaves = useStoreLeaves((s) => s.sortLeaves)
  const goToPage = useStoreLeaves((s) => s.goToPage)
  const canUpdate = useHasPermission(PermissionModule.Leave, PermissionAction.Update)
  const { actionViewDetail, actionUpdateLeave } = createLeavesActions()

  const findRowById = (rowId: string) => rows.find((row) => row.id === rowId) ?? null
  const resolveRowActions = (row: LeaveTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [actionViewDetail(() => onViewDetail(row))]
    if (canUpdate) {
      actions.push(actionUpdateLeave(() => navigate(`${AUTH_ROUTE_LEAVES_EDIT}=${row.id}`)))
    }
    return actions
  }
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = findRowById(tableRow.id)
    return row ? resolveRowActions(row) : []
  }
  const renderCustomCell = createTableCustomRenderer({
    [EMPLOYEE_NAME_COLUMN_INDEX]: ({ row, value }) =>
      renderViewDetailButton(value, () => {
        const leaveRow = findRowById(row.id)
        if (leaveRow) onViewDetail(leaveRow)
      }),
    [STATUS_COLUMN_INDEX]: ({ value }) => renderEmployeeApprovalStatus(value),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = leavesTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortLeaves(sortBy, nextSortDir)
  }

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => leavesTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = { columnIndex: activeSortColumn, direction: queryParams.sortDir }

  return (
    <>
      <TableComponent
        columns={leavesTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay permisos registrados."
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
