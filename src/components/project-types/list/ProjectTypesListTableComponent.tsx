import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow, TableSortState } from '@/components'
import { AUTH_ROUTE_PROJECT_TYPES_EDIT, PermissionAction, PermissionModule, SortDirection } from '@/constant'
import { projectTypesTableColumns, projectTypesTableColumnIndex, projectTypesTableSortByColumn } from '@/factories'
import { useStoreProjectTypes } from '@/store'
import { useHasPermission } from '@/hooks'
import type { ProjectTypeTableRow } from '@/types'
import { createProjectTypesActions, createTableCustomRenderer, renderStatusBadge, renderViewDetailButton } from '@/utils'
import type { DropdownAction } from '@/utils'

const NAME_COLUMN_INDEX = projectTypesTableColumnIndex.name
const STATUS_COLUMN_INDEX = projectTypesTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = projectTypesTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(projectTypesTableSortByColumn).map((index) => Number(index))

interface ProjectTypesListTableComponentProps {
  onViewDetail: (row: ProjectTypeTableRow) => void
  onToggleStatus: (row: ProjectTypeTableRow) => void
  loadingExtra?: boolean
}

export function ProjectTypesListTableComponent(props: ProjectTypesListTableComponentProps) {
  const { onViewDetail, onToggleStatus, loadingExtra = false } = props
  const navigate = useNavigate()
  const rows = useStoreProjectTypes((s) => s.projectTypesRows)
  const pagination = useStoreProjectTypes((s) => s.pagination)
  const queryParams = useStoreProjectTypes((s) => s.queryParams)
  const loading = useStoreProjectTypes((s) => s.operationLoading.list)
  const sortProjectTypes = useStoreProjectTypes((s) => s.sortProjectTypes)
  const goToPage = useStoreProjectTypes((s) => s.goToPage)
  const canToggleStatus = useHasPermission(PermissionModule.ProjectType, PermissionAction.Update)
  const { actionViewDetail, actionUpdateProjectType, actionToggleStatus } = createProjectTypesActions()

  const findRowById = (rowId: string) => rows.find((row) => row.id === rowId) ?? null
  const resolveRowActions = (row: ProjectTypeTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => onViewDetail(row)),
      actionUpdateProjectType(() => navigate(`${AUTH_ROUTE_PROJECT_TYPES_EDIT}=${row.id}`)),
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
      const typeRow = findRowById(row.id)
      if (typeRow) onViewDetail(typeRow)
    }),
    [STATUS_COLUMN_INDEX]: ({ row }) => renderStatusBadge(Boolean(findRowById(row.id)?.active)),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = projectTypesTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortProjectTypes(sortBy, nextSortDir)
  }

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => projectTypesTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = { columnIndex: activeSortColumn, direction: queryParams.sortDir }

  return (
    <>
      <TableComponent
        columns={projectTypesTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay tipos registrados."
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
