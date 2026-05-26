import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow, TableSortState } from '@/components'
import { AUTH_ROUTE_PROJECT_STATUSES_EDIT, PermissionAction, PermissionModule, SortDirection } from '@/constant'
import { projectStatusesTableColumns, projectStatusesTableColumnIndex, projectStatusesTableSortByColumn } from '@/factories'
import { useStoreProjectStatuses } from '@/store'
import { useHasPermission } from '@/hooks'
import type { ProjectStatusTableRow } from '@/types'
import { createProjectStatusesActions, createTableCustomRenderer, renderStatusBadge, renderViewDetailButton } from '@/utils'
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
  const rows = useStoreProjectStatuses((s) => s.projectStatusesRows)
  const pagination = useStoreProjectStatuses((s) => s.pagination)
  const queryParams = useStoreProjectStatuses((s) => s.queryParams)
  const loading = useStoreProjectStatuses((s) => s.operationLoading.list)
  const sortProjectStatuses = useStoreProjectStatuses((s) => s.sortProjectStatuses)
  const goToPage = useStoreProjectStatuses((s) => s.goToPage)
  const canToggleStatus = useHasPermission(PermissionModule.ProjectStatus, PermissionAction.Update)
  const { actionViewDetail, actionUpdateProjectStatus, actionToggleStatus } = createProjectStatusesActions()

  const findRowById = (rowId: string) => rows.find((row) => row.id === rowId) ?? null
  const resolveRowActions = (row: ProjectStatusTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => onViewDetail(row)),
      actionUpdateProjectStatus(() => navigate(`${AUTH_ROUTE_PROJECT_STATUSES_EDIT}=${row.id}`)),
    ]
    if (canToggleStatus) actions.push(actionToggleStatus(row.active === true, () => onToggleStatus(row)))
    return actions
  }
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = findRowById(tableRow.id)
    return row ? resolveRowActions(row) : []
  }
  const renderCustomCell = createTableCustomRenderer({
    [NAME_COLUMN_INDEX]: ({ row, value }) => renderViewDetailButton(value, () => {
      const statusRow = findRowById(row.id)
      if (statusRow) onViewDetail(statusRow)
    }),
    [STATUS_COLUMN_INDEX]: ({ row }) => renderStatusBadge(Boolean(findRowById(row.id)?.active)),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = projectStatusesTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortProjectStatuses(sortBy, nextSortDir)
  }

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => projectStatusesTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = { columnIndex: activeSortColumn, direction: queryParams.sortDir }

  return (
    <>
      <TableComponent
        columns={projectStatusesTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay vigencias registradas."
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
