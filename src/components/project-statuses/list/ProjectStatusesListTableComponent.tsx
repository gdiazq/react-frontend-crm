import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow } from '@/components'
import { AUTH_ROUTE_PROJECT_STATUSES_EDIT, PermissionAction, PermissionModule } from '@/constant'
import { projectStatusesTableColumns, projectStatusesTableColumnIndex, projectStatusesTableSortByColumn } from '@/factories'
import { useStoreProjectStatuses } from '@/store'
import { useHasPermission } from '@/hooks'
import messages from '@/messages/messages'
import type { ProjectStatusTableRow } from '@/types'
import {
  createProjectStatusesActions,
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

const NAME_COLUMN_INDEX = projectStatusesTableColumnIndex.name
const STATUS_COLUMN_INDEX = projectStatusesTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = projectStatusesTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(projectStatusesTableSortByColumn).map((index) => Number(index))

interface ProjectStatusesListTableComponentProps {
  onViewDetail: (row: ProjectStatusTableRow) => void
  onToggleStatus: (row: ProjectStatusTableRow) => void
  loadingExtra?: boolean
}

export function ProjectStatusesListTableComponent(props: ProjectStatusesListTableComponentProps) {
  const { onViewDetail, onToggleStatus, loadingExtra = false } = props

  const navigate = useNavigate()
  const canToggleStatus = useHasPermission(PermissionModule.ProjectStatus, PermissionAction.Update)
  const { actionViewDetail, actionUpdateProjectStatus, actionToggleStatus } = createProjectStatusesActions()

  // Store state used to render the table.
  const rows = useStoreProjectStatuses((s) => s.projectStatusesRows)
  const pagination = useStoreProjectStatuses((s) => s.pagination)
  const queryParams = useStoreProjectStatuses((s) => s.queryParams)
  const loading = useStoreProjectStatuses((s) => s.operationLoading.list)

  // Store actions triggered by table interactions.
  const sortProjectStatuses = useStoreProjectStatuses((s) => s.sortProjectStatuses)
  const goToPage = useStoreProjectStatuses((s) => s.goToPage)

  // Derived lookup for callbacks that receive the generic TableRow shape.
  const rowsById = useMemo(() => createRowsById(rows), [rows])
  const resolveProjectStatusRow = (rowId: string) => findRowById(rowsById, rowId)
  const resolveRowActive = (rowId: string) => isTableRowActive(resolveProjectStatusRow(rowId))

  const resolveRowActions = (row: ProjectStatusTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => onViewDetail(row)),
      actionUpdateProjectStatus(() => navigate(`${AUTH_ROUTE_PROJECT_STATUSES_EDIT}=${row.id}`)),
    ]
    if (canToggleStatus) actions.push(actionToggleStatus(isTableRowActive(row), () => onToggleStatus(row)))
    return actions
  }

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = resolveProjectStatusRow(tableRow.id)
    return row ? resolveRowActions(row) : []
  }

  const renderCustomCell = createTableCustomRenderer({
    [NAME_COLUMN_INDEX]: ({ row, value }) => renderViewDetailButton(value, () => {
      const statusRow = resolveProjectStatusRow(row.id)
      if (statusRow) onViewDetail(statusRow)
    }),
    [STATUS_COLUMN_INDEX]: ({ row }) => renderStatusBadge(resolveRowActive(row.id)),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = projectStatusesTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = resolveNextTableSortDir(queryParams.sortBy, queryParams.sortDir, sortBy)
    await sortProjectStatuses(sortBy, nextSortDir)
  }

  const sortState = createTableSortState(SORTABLE_COLUMNS, projectStatusesTableSortByColumn, queryParams.sortBy, queryParams.sortDir)

  return (
    <>
      <TableComponent
        columns={projectStatusesTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage={messages.projectStatuses.ui.emptyList}
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
