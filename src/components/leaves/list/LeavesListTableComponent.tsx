import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow } from '@/components'
import { AUTH_ROUTE_LEAVES_EDIT, PermissionAction, PermissionModule } from '@/constant'
import { leavesTableColumns, leavesTableColumnIndex, leavesTableSortByColumn } from '@/factories'
import messages from '@/messages/messages'
import { useStoreLeaves } from '@/store'
import { useHasPermission } from '@/hooks'
import type { LeaveTableRow } from '@/types'
import {
  createLeavesActions,
  createRowsById,
  createTableSortState,
  createTableCustomRenderer,
  findRowById,
  renderEmployeeApprovalStatus,
  renderViewDetailButton,
  resolveNextTableSortDir,
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

  const rowsById = useMemo(() => createRowsById(rows), [rows])
  const resolveLeaveRow = (rowId: string) => findRowById(rowsById, rowId)
  const resolveRowActions = (row: LeaveTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [actionViewDetail(() => onViewDetail(row))]
    if (canUpdate) {
      actions.push(actionUpdateLeave(() => navigate(`${AUTH_ROUTE_LEAVES_EDIT}=${row.id}`)))
    }
    return actions
  }
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = resolveLeaveRow(tableRow.id)
    return row ? resolveRowActions(row) : []
  }
  const renderCustomCell = createTableCustomRenderer({
    [EMPLOYEE_NAME_COLUMN_INDEX]: ({ row, value }) =>
      renderViewDetailButton(value, () => {
        const leaveRow = resolveLeaveRow(row.id)
        if (leaveRow) onViewDetail(leaveRow)
      }),
    [STATUS_COLUMN_INDEX]: ({ value }) => renderEmployeeApprovalStatus(value),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = leavesTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = resolveNextTableSortDir(queryParams.sortBy, queryParams.sortDir, sortBy)
    await sortLeaves(sortBy, nextSortDir)
  }

  const sortState = createTableSortState(SORTABLE_COLUMNS, leavesTableSortByColumn, queryParams.sortBy, queryParams.sortDir)

  return (
    <>
      <TableComponent
        columns={leavesTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage={messages.leaves.ui.emptyList}
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
