import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableSortState } from '@/components'
import {
  AUTH_ROUTE_ATTENDANCE_EDIT,
  PermissionAction,
  PermissionModule,
  SortDirection,
} from '@/constant'
import { attendanceTableColumns, attendanceTableColumnIndex, attendanceTableSortByColumn } from '@/factories'
import { useStoreAttendance } from '@/store'
import { useHasPermission } from '@/hooks'
import type { AttendanceTableRow, TableRow } from '@/types'
import {
  createAttendanceActions,
  createTableCustomRenderer,
  renderEmployeeApprovalStatus,
  renderViewDetailButton,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const EMPLOYEE_NAME_COLUMN_INDEX = attendanceTableColumnIndex.employeeName
const STATUS_COLUMN_INDEX = attendanceTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = attendanceTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(attendanceTableSortByColumn).map((index) => Number(index))

interface AttendanceListTableComponentProps {
  onViewDetail: (row: AttendanceTableRow) => void
}

export function AttendanceListTableComponent(props: AttendanceListTableComponentProps) {
  const { onViewDetail } = props
  const navigate = useNavigate()
  const rows = useStoreAttendance((s) => s.attendanceRows)
  const pagination = useStoreAttendance((s) => s.pagination)
  const queryParams = useStoreAttendance((s) => s.queryParams)
  const loading = useStoreAttendance((s) => s.operationLoading.list)
  const goToPage = useStoreAttendance((s) => s.goToPage)
  const sortAttendance = useStoreAttendance((s) => s.sortAttendance)
  const canUpdate = useHasPermission(PermissionModule.Attendance, PermissionAction.Update)

  const { actionViewDetail, actionUpdateAttendance } = createAttendanceActions()

  const findRowById = (rowId: string) => rows.find((row) => row.id === rowId) ?? null

  const resolveRowActions = (row: AttendanceTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [actionViewDetail(() => onViewDetail(row))]
    if (canUpdate) {
      actions.push(actionUpdateAttendance(() => navigate(`${AUTH_ROUTE_ATTENDANCE_EDIT}=${row.id}`)))
    }
    return actions
  }

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = findRowById(tableRow.id)
    if (!row) return []
    return resolveRowActions(row)
  }

  const renderCustomCell = createTableCustomRenderer({
    [EMPLOYEE_NAME_COLUMN_INDEX]: ({ row, value }) =>
      renderViewDetailButton(value, () => {
        const attendanceRow = findRowById(row.id)
        if (attendanceRow) onViewDetail(attendanceRow)
      }, 'accent'),
    [STATUS_COLUMN_INDEX]: ({ value }) => renderEmployeeApprovalStatus(value),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = attendanceTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortAttendance(sortBy, nextSortDir)
  }

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => attendanceTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = { columnIndex: activeSortColumn, direction: queryParams.sortDir }

  return (
    <>
      <TableComponent
        columns={attendanceTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay registros de asistencia."
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
