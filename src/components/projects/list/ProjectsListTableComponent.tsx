import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow } from '@/components'
import {
  AUTH_ROUTE_PROJECTS_EDIT,
  PermissionAction,
  PermissionModule,
} from '@/constant'
import { projectsTableColumns, projectsTableColumnIndex, projectsTableSortByColumn } from '@/factories'
import { useStoreProjects, useStoreSelects } from '@/store'
import { useHasPermission } from '@/hooks'
import {
  mapperProjectOptionName,
  mapperProjectSelectOptionsById,
} from '@/mappers'
import messages from '@/messages/messages'
import type { ProjectTableRow } from '@/types'
import {
  createProjectsActions,
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
  const canReadProject = useHasPermission(PermissionModule.Project, PermissionAction.Read)
  const canUpdateProject = useHasPermission(PermissionModule.Project, PermissionAction.Update)
  const { actionViewDetail, actionUpdateProject, actionToggleStatus } = createProjectsActions()

  // Store state used to render the table.
  const rows = useStoreProjects((s) => s.projectsRows)
  const pagination = useStoreProjects((s) => s.pagination)
  const queryParams = useStoreProjects((s) => s.queryParams)
  const loading = useStoreProjects((s) => s.operationLoading.list)

  // Store actions triggered by table interactions.
  const sortProjects = useStoreProjects((s) => s.sortProjects)
  const goToPage = useStoreProjects((s) => s.goToPage)

  // Shared select state used to render option names.
  const projectTypeOptions = useStoreSelects((s) => s.projectTypeOptions)
  const projectStatusOptions = useStoreSelects((s) => s.projectStatusOptions)
  const projectSpecialtyOptions = useStoreSelects((s) => s.projectSpecialtyOptions)

  // Derived lookup for callbacks that receive the generic TableRow shape.
  const rowsById = useMemo(() => createRowsById(rows), [rows])
  const projectTypeNamesById = useMemo(() => mapperProjectSelectOptionsById(projectTypeOptions), [projectTypeOptions])
  const projectStatusNamesById = useMemo(() => mapperProjectSelectOptionsById(projectStatusOptions), [projectStatusOptions])
  const projectSpecialtyNamesById = useMemo(() => mapperProjectSelectOptionsById(projectSpecialtyOptions), [projectSpecialtyOptions])
  const resolveProjectRow = (rowId: string) => findRowById(rowsById, rowId)
  const resolveRowActive = (rowId: string) => isTableRowActive(resolveProjectRow(rowId))

  const resolveRowActions = (row: ProjectTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = []
    if (canReadProject) actions.push(actionViewDetail(() => onViewDetail(row)))
    if (canUpdateProject) {
      actions.push(
        actionUpdateProject(() => navigate(`${AUTH_ROUTE_PROJECTS_EDIT}=${row.id}`)),
        actionToggleStatus(isTableRowActive(row), () => onToggleStatus(row)),
      )
    }
    return actions
  }

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = resolveProjectRow(tableRow.id)
    return row ? resolveRowActions(row) : []
  }

  const renderCustomCell = createTableCustomRenderer({
    [NAME_COLUMN_INDEX]: ({ row, value }) => renderViewDetailButton(value, () => {
      const projectRow = resolveProjectRow(row.id)
      if (projectRow) onViewDetail(projectRow)
    }),
    [TYPE_COLUMN_INDEX]: ({ row }) => mapperProjectOptionName(projectTypeNamesById, resolveProjectRow(row.id)?.typeId),
    [STATUS_COLUMN_INDEX]: ({ row }) => mapperProjectOptionName(projectStatusNamesById, resolveProjectRow(row.id)?.statusId),
    [SPECIALTY_COLUMN_INDEX]: ({ row }) => mapperProjectOptionName(projectSpecialtyNamesById, resolveProjectRow(row.id)?.specialtyId),
    [ACTIVE_COLUMN_INDEX]: ({ row }) => renderStatusBadge(resolveRowActive(row.id)),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = projectsTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = resolveNextTableSortDir(queryParams.sortBy, queryParams.sortDir, sortBy)
    await sortProjects(sortBy, nextSortDir)
  }

  const sortState = createTableSortState(SORTABLE_COLUMNS, projectsTableSortByColumn, queryParams.sortBy, queryParams.sortDir)

  return (
    <>
      <TableComponent
        columns={projectsTableColumns}
        rows={rows as ProjectTableRow[]}
        loading={loading}
        emptyMessage={messages.projects.ui.emptyList}
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
