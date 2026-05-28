import { useMemo } from 'react'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow } from '@/components'
import {
  projectAssignmentsTableColumns,
  projectAssignmentsTableColumnIndex,
  projectAssignmentsTableSortByColumn,
} from '@/factories'
import messages from '@/messages/messages'
import { useStoreProjectAssignments } from '@/store'
import type { ProjectAssignmentTableRow } from '@/types'
import {
  createProjectAssignmentsActions,
  createRowsById,
  createTableSortState,
  createTableCustomRenderer,
  findRowById,
  isTableRowActive,
  renderStatusBadge,
  renderViewDetailButton,
  resolveNextTableSortDir,
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

  const { actionViewEmployeeDetail, actionViewCostCenterDetail } = createProjectAssignmentsActions()

  // Store state used to render the table.
  const rows = useStoreProjectAssignments((s) => s.projectAssignmentsRows)
  const pagination = useStoreProjectAssignments((s) => s.pagination)
  const queryParams = useStoreProjectAssignments((s) => s.queryParams)
  const loading = useStoreProjectAssignments((s) => s.operationLoading.list)

  // Store actions triggered by table interactions.
  const sortProjectAssignments = useStoreProjectAssignments((s) => s.sortProjectAssignments)
  const goToPage = useStoreProjectAssignments((s) => s.goToPage)

  // Derived lookup for callbacks that receive the generic TableRow shape.
  const rowsById = useMemo(() => createRowsById(rows), [rows])
  const resolveAssignmentRow = (rowId: string) => findRowById(rowsById, rowId)
  const resolveRowActive = (rowId: string) => isTableRowActive(resolveAssignmentRow(rowId))

  const resolveRowActions = (row: ProjectAssignmentTableRow): DropdownAction[] => [
    actionViewEmployeeDetail(() => onViewEmployeeDetail(row)),
    actionViewCostCenterDetail(() => onViewCostCenterDetail(row)),
  ]

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = resolveAssignmentRow(tableRow.id)
    return row ? resolveRowActions(row) : []
  }
  
  const renderCustomCell = createTableCustomRenderer({
    [EMPLOYEE_COLUMN_INDEX]: ({ row, value }) => renderViewDetailButton(value, () => {
      const assignmentRow = resolveAssignmentRow(row.id)
      if (assignmentRow) onViewEmployeeDetail(assignmentRow)
    }),
    [PROJECT_COLUMN_INDEX]: ({ row, value }) => renderViewDetailButton(value, () => {
      const assignmentRow = resolveAssignmentRow(row.id)
      if (assignmentRow) onViewCostCenterDetail(assignmentRow)
    }),
    [STATUS_COLUMN_INDEX]: ({ row }) => renderStatusBadge(resolveRowActive(row.id)),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = projectAssignmentsTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = resolveNextTableSortDir(queryParams.sortBy, queryParams.sortDir, sortBy)
    await sortProjectAssignments(sortBy, nextSortDir)
  }

  const sortState = createTableSortState(SORTABLE_COLUMNS, projectAssignmentsTableSortByColumn, queryParams.sortBy, queryParams.sortDir)

  return (
    <>
      <TableComponent
        columns={projectAssignmentsTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage={messages.projectAssignments.ui.emptyList}
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
