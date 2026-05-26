import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow, TableSortState } from '@/components'
import {
  AUTH_ROUTE_PROJECTS_EDIT,
  PermissionAction,
  PermissionModule,
  SortDirection,
} from '@/constant'
import { projectsTableColumns, projectsTableColumnIndex, projectsTableSortByColumn } from '@/factories'
import { useStoreProjects, useStoreSelects } from '@/store'
import { useHasPermission } from '@/hooks'
import type { ProjectTableRow } from '@/types'
import {
  createProjectsActions,
  createTableCustomRenderer,
  renderStatusBadge,
  renderViewDetailButton,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const TYPE_COLUMN_INDEX = projectsTableColumnIndex.type
const STATUS_COLUMN_INDEX = projectsTableColumnIndex.status
const SPECIALTY_COLUMN_INDEX = projectsTableColumnIndex.specialty
const ACTIVE_COLUMN_INDEX = projectsTableColumnIndex.active
const NAME_COLUMN_INDEX = projectsTableColumnIndex.name
const ACTIONS_COLUMN_INDEX = projectsTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(projectsTableSortByColumn).map((index) => Number(index))

interface ProjectsListTableComponentProps {
  onViewDetail: (row: ProjectTableRow) => void
  onToggleStatus: (row: ProjectTableRow) => void
  loadingExtra?: boolean
}

export function ProjectsListTableComponent(props: ProjectsListTableComponentProps) {
  const { onViewDetail, onToggleStatus, loadingExtra = false } = props
  const navigate = useNavigate()
  const rows = useStoreProjects((s) => s.projectsRows)
  const pagination = useStoreProjects((s) => s.pagination)
  const queryParams = useStoreProjects((s) => s.queryParams)
  const loading = useStoreProjects((s) => s.operationLoading.list)
  const sortProjects = useStoreProjects((s) => s.sortProjects)
  const goToPage = useStoreProjects((s) => s.goToPage)
  const canReadProject = useHasPermission(PermissionModule.Project, PermissionAction.Read)
  const canUpdateProject = useHasPermission(PermissionModule.Project, PermissionAction.Update)
  const projectTypeOptions = useStoreSelects((s) => s.projectTypeOptions)
  const projectStatusOptions = useStoreSelects((s) => s.projectStatusOptions)
  const projectSpecialtyOptions = useStoreSelects((s) => s.projectSpecialtyOptions)
  const { actionViewDetail, actionUpdateProject, actionToggleStatus } = createProjectsActions()

  const findRowById = (rowId: string) => rows.find((row) => row.id === rowId) ?? null
  const resolveOptionName = (options: { id: number, name: string }[], optionId?: number | null): string => {
    if (!optionId) return '-'
    return options.find((option) => option.id === optionId)?.name || '-'
  }
  const resolveRowActions = (row: ProjectTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = []
    if (canReadProject) actions.push(actionViewDetail(() => onViewDetail(row)))
    if (canUpdateProject) {
      actions.push(
        actionUpdateProject(() => navigate(`${AUTH_ROUTE_PROJECTS_EDIT}=${row.id}`)),
        actionToggleStatus(row.active === true, () => onToggleStatus(row)),
      )
    }
    return actions
  }
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = findRowById(tableRow.id)
    return row ? resolveRowActions(row) : []
  }
  const renderCustomCell = createTableCustomRenderer({
    [NAME_COLUMN_INDEX]: ({ row, value }) => renderViewDetailButton(value, () => {
      const projectRow = findRowById(row.id)
      if (projectRow) onViewDetail(projectRow)
    }),
    [TYPE_COLUMN_INDEX]: ({ row }) => resolveOptionName(projectTypeOptions, (row as ProjectTableRow).typeId),
    [STATUS_COLUMN_INDEX]: ({ row }) => resolveOptionName(projectStatusOptions, (row as ProjectTableRow).statusId),
    [SPECIALTY_COLUMN_INDEX]: ({ row }) => resolveOptionName(projectSpecialtyOptions, (row as ProjectTableRow).specialtyId),
    [ACTIVE_COLUMN_INDEX]: ({ row }) => renderStatusBadge(Boolean(findRowById(row.id)?.active)),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = projectsTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortProjects(sortBy, nextSortDir)
  }

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => projectsTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = { columnIndex: activeSortColumn, direction: queryParams.sortDir }

  return (
    <>
      <TableComponent
        columns={projectsTableColumns}
        rows={rows as ProjectTableRow[]}
        loading={loading}
        emptyMessage="No hay proyectos registrados."
        customRenderer={renderCustomCell}
        actionsConfig={canReadProject || canUpdateProject
          ? {
              columnIndex: ACTIONS_COLUMN_INDEX,
              resolveRowActions: resolveRowActionsFromTableRow,
              resolveOpenDirection: (activeRowIndex, rowsLength) => (
                activeRowIndex >= Math.max(rowsLength - 2, 0) ? 'up' : 'down'
              ),
            }
          : undefined}
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
