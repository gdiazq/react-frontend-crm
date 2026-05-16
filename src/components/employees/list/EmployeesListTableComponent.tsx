import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow, TableSortState } from '@/components'
import { SortDirection } from '@/constant'
import { employeesTableColumns, employeesTableColumnIndex, employeesTableSortByColumn } from '@/factories'
import { useStoreEmployees } from '@/store'
import type { EmployeeTableRow } from '@/types'
import {
  createTableCustomRenderer,
  renderEmployeeApprovalStatus,
  renderStatusBadge,
  renderViewDetailButton,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const EMPLOYEE_ACTIVE_COLUMN_INDEX = employeesTableColumnIndex.active
const EMPLOYEE_APPROVAL_STATUS_COLUMN_INDEX = employeesTableColumnIndex.approvalStatus
const EMPLOYEE_CONTRACT_COLUMN_INDEX = employeesTableColumnIndex.contract
const EMPLOYEE_NAME_COLUMN_INDEX = employeesTableColumnIndex.name
const ACTIONS_COLUMN_INDEX = employeesTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(employeesTableSortByColumn).map((index) => Number(index))

interface EmployeesListTableComponentProps {
  onViewDetail: (row: EmployeeTableRow) => void
  resolveRowActions: (row: EmployeeTableRow) => DropdownAction[]
  loadingExtra?: boolean
}

export function EmployeesListTableComponent(props: EmployeesListTableComponentProps) {
  const { onViewDetail, resolveRowActions, loadingExtra = false } = props
  const rows = useStoreEmployees((s) => s.employeesRows)
  const pagination = useStoreEmployees((s) => s.pagination)
  const queryParams = useStoreEmployees((s) => s.queryParams)
  const loading = useStoreEmployees((s) => s.operationLoading.list)
  const goToPage = useStoreEmployees((s) => s.goToPage)
  const sortEmployees = useStoreEmployees((s) => s.sortEmployees)

  const findRowById = (rowId: string) => rows.find((row) => row.id === rowId) ?? null
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = findRowById(tableRow.id)
    return row ? resolveRowActions(row) : []
  }

  const renderCustomCell = createTableCustomRenderer({
    [EMPLOYEE_NAME_COLUMN_INDEX]: ({ row, value }) =>
      renderViewDetailButton(value, () => {
        const employeeRow = findRowById(row.id)
        if (employeeRow) onViewDetail(employeeRow)
      }),
    [EMPLOYEE_APPROVAL_STATUS_COLUMN_INDEX]: ({ value }) => renderEmployeeApprovalStatus(value),
    [EMPLOYEE_CONTRACT_COLUMN_INDEX]: ({ row }) => renderStatusBadge(Boolean(findRowById(row.id)?.hasContract), { activeLabel: 'Si', inactiveLabel: 'No' }),
    [EMPLOYEE_ACTIVE_COLUMN_INDEX]: ({ row }) => renderStatusBadge(Boolean(findRowById(row.id)?.active)),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = employeesTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortEmployees(sortBy, nextSortDir)
  }

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => employeesTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = { columnIndex: activeSortColumn, direction: queryParams.sortDir }

  return (
    <>
      <TableComponent
        columns={employeesTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay trabajadores registrados."
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
          loading={loading || loadingExtra}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>
    </>
  )
}
