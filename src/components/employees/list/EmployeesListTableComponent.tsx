import { useMemo } from 'react'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow } from '@/components'
import { employeesTableColumns, employeesTableColumnIndex, employeesTableSortByColumn } from '@/factories'
import messages from '@/messages/messages'
import { useStoreEmployees } from '@/store'
import type { EmployeeTableRow } from '@/types'
import {
  createRowsById,
  createTableSortState,
  createTableCustomRenderer,
  findRowById,
  isTableRowActive,
  renderEmployeeApprovalStatus,
  renderStatusBadge,
  renderViewDetailButton,
  resolveNextTableSortDir,
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

  // Store state used to render the table.
  const rows = useStoreEmployees((s) => s.employeesRows)
  const pagination = useStoreEmployees((s) => s.pagination)
  const queryParams = useStoreEmployees((s) => s.queryParams)
  const loading = useStoreEmployees((s) => s.operationLoading.list)

  // Store actions triggered by table interactions.
  const goToPage = useStoreEmployees((s) => s.goToPage)
  const sortEmployees = useStoreEmployees((s) => s.sortEmployees)

  // Derived lookup for callbacks that receive the generic TableRow shape.
  const rowsById = useMemo(() => createRowsById(rows), [rows])
  const resolveEmployeeRow = (rowId: string) => findRowById(rowsById, rowId)
  const resolveRowActive = (rowId: string) => isTableRowActive(resolveEmployeeRow(rowId))
  const resolveRowHasContract = (rowId: string) => resolveEmployeeRow(rowId)?.hasContract === true

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = resolveEmployeeRow(tableRow.id)
    return row ? resolveRowActions(row) : []
  }

  const renderCustomCell = createTableCustomRenderer({
    [EMPLOYEE_NAME_COLUMN_INDEX]: ({ row, value }) =>
      renderViewDetailButton(value, () => {
        const employeeRow = resolveEmployeeRow(row.id)
        if (employeeRow) onViewDetail(employeeRow)
      }),
    [EMPLOYEE_APPROVAL_STATUS_COLUMN_INDEX]: ({ value }) => renderEmployeeApprovalStatus(value),
    [EMPLOYEE_CONTRACT_COLUMN_INDEX]: ({ row }) => renderStatusBadge(resolveRowHasContract(row.id), { activeLabel: 'Si', inactiveLabel: 'No' }),
    [EMPLOYEE_ACTIVE_COLUMN_INDEX]: ({ row }) => renderStatusBadge(resolveRowActive(row.id)),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = employeesTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = resolveNextTableSortDir(queryParams.sortBy, queryParams.sortDir, sortBy)
    await sortEmployees(sortBy, nextSortDir)
  }

  const sortState = createTableSortState(SORTABLE_COLUMNS, employeesTableSortByColumn, queryParams.sortBy, queryParams.sortDir)

  return (
    <>
      <TableComponent
        columns={employeesTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage={messages.employees.ui.emptyList}
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
