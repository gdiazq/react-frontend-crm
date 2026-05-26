import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableSortState } from '@/components'
import {
  AUTH_ROUTE_OVERTIME_EDIT,
  PermissionAction,
  PermissionModule,
  SortDirection,
} from '@/constant'
import { overtimeTableColumns, overtimeTableColumnIndex, overtimeTableSortByColumn } from '@/factories'
import { useStoreOvertime } from '@/store'
import { useHasPermission } from '@/hooks'
import type { OvertimeTableRow, TableRow } from '@/types'
import {
  createOvertimeActions,
  createTableCustomRenderer,
  renderEmployeeApprovalStatus,
  renderViewDetailButton,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const EMPLOYEE_NAME_COLUMN_INDEX = overtimeTableColumnIndex.employeeName
const STATUS_COLUMN_INDEX = overtimeTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = overtimeTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(overtimeTableSortByColumn).map((index) => Number(index))

interface OvertimeListTableComponentProps {
  onViewDetail: (row: OvertimeTableRow) => void
}

export function OvertimeListTableComponent({ onViewDetail }: OvertimeListTableComponentProps) {
  const navigate = useNavigate()
  const rows = useStoreOvertime((s) => s.overtimeRows)
  const pagination = useStoreOvertime((s) => s.pagination)
  const queryParams = useStoreOvertime((s) => s.queryParams)
  const loading = useStoreOvertime((s) => s.operationLoading.list)
  const goToPage = useStoreOvertime((s) => s.goToPage)
  const sortOvertime = useStoreOvertime((s) => s.sortOvertime)
  const canUpdate = useHasPermission(PermissionModule.Overtime, PermissionAction.Update)

  const { actionViewDetail, actionUpdateOvertime } = createOvertimeActions()

  const findRowById = (rowId: string) => rows.find((row) => row.id === rowId) ?? null

  const resolveRowActions = (row: OvertimeTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [actionViewDetail(() => onViewDetail(row))]
    if (canUpdate) {
      actions.push(actionUpdateOvertime(() => navigate(`${AUTH_ROUTE_OVERTIME_EDIT}=${row.id}`)))
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
        const overtimeRow = findRowById(row.id)
        if (overtimeRow) onViewDetail(overtimeRow)
      }),
    [STATUS_COLUMN_INDEX]: ({ value }) => renderEmployeeApprovalStatus(value),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = overtimeTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortOvertime(sortBy, nextSortDir)
  }

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => overtimeTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = { columnIndex: activeSortColumn, direction: queryParams.sortDir }

  return (
    <>
      <TableComponent
        columns={overtimeTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay registros de horas extras."
        preserveHeaderCase
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
