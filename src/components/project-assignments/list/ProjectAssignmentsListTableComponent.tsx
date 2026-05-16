import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow, TableSortState } from '@/components'
import { SortDirection } from '@/constant'
import {
  projectAssignmentsTableColumns,
  projectAssignmentsTableColumnIndex,
  projectAssignmentsTableSortByColumn,
} from '@/factories'
import { useStoreProjectAssignments } from '@/store'
import type { ProjectAssignmentTableRow } from '@/types'
import {
  createProjectAssignmentsActions,
  createTableCustomRenderer,
  renderStatusBadge,
  renderViewDetailButton,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const EMPLOYEE_COLUMN_INDEX = projectAssignmentsTableColumnIndex.employeeName
const PROJECT_COLUMN_INDEX = projectAssignmentsTableColumnIndex.projectName
const STATUS_COLUMN_INDEX = projectAssignmentsTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = projectAssignmentsTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(projectAssignmentsTableSortByColumn).map((index) => Number(index))

interface ProjectAssignmentsListTableComponentProps {
  onViewEmployeeDetail: (row: ProjectAssignmentTableRow) => void
  onViewCostCenterDetail: (row: ProjectAssignmentTableRow) => void
}

export function ProjectAssignmentsListTableComponent(props: ProjectAssignmentsListTableComponentProps) {
  const { onViewEmployeeDetail, onViewCostCenterDetail } = props
  const rows = useStoreProjectAssignments((s) => s.projectAssignmentsRows)
  const pagination = useStoreProjectAssignments((s) => s.pagination)
  const queryParams = useStoreProjectAssignments((s) => s.queryParams)
  const loading = useStoreProjectAssignments((s) => s.operationLoading.list)
  const sortProjectAssignments = useStoreProjectAssignments((s) => s.sortProjectAssignments)
  const goToPage = useStoreProjectAssignments((s) => s.goToPage)
  const { actionViewEmployeeDetail, actionViewCostCenterDetail } = createProjectAssignmentsActions()

  const findRowById = (rowId: string) => rows.find((row) => row.id === rowId) ?? null
  const resolveRowActions = (row: ProjectAssignmentTableRow): DropdownAction[] => [
    actionViewEmployeeDetail(() => onViewEmployeeDetail(row)),
    actionViewCostCenterDetail(() => onViewCostCenterDetail(row)),
  ]
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = findRowById(tableRow.id)
    return row ? resolveRowActions(row) : []
  }
  const renderCustomCell = createTableCustomRenderer({
    [EMPLOYEE_COLUMN_INDEX]: ({ row, value }) => renderViewDetailButton(value, () => {
      const assignmentRow = findRowById(row.id)
      if (assignmentRow) onViewEmployeeDetail(assignmentRow)
    }),
    [PROJECT_COLUMN_INDEX]: ({ row, value }) => renderViewDetailButton(value, () => {
      const assignmentRow = findRowById(row.id)
      if (assignmentRow) onViewCostCenterDetail(assignmentRow)
    }),
    [STATUS_COLUMN_INDEX]: ({ row }) => renderStatusBadge(Boolean(findRowById(row.id)?.active)),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = projectAssignmentsTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortProjectAssignments(sortBy, nextSortDir)
  }

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => projectAssignmentsTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = { columnIndex: activeSortColumn, direction: queryParams.sortDir }

  return (
    <>
      <TableComponent
        columns={projectAssignmentsTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay registros históricos de asignación."
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
