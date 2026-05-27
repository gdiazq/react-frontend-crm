import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow } from '@/components'
import { AUTH_ROUTE_PROJECT_TYPES_EDIT, PermissionAction, PermissionModule } from '@/constant'
import { projectTypesTableColumns, projectTypesTableColumnIndex, projectTypesTableSortByColumn } from '@/factories'
import { useStoreProjectTypes } from '@/store'
import { useHasPermission } from '@/hooks'
import messages from '@/messages/messages'
import type { ProjectTypeTableRow } from '@/types'
import {
  createProjectTypesActions,
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
  const canToggleStatus = useHasPermission(PermissionModule.ProjectType, PermissionAction.Update)
  const { actionViewDetail, actionUpdateProjectType, actionToggleStatus } = createProjectTypesActions()

  // Store state used to render the table.
  const rows = useStoreProjectTypes((s) => s.projectTypesRows)
  const pagination = useStoreProjectTypes((s) => s.pagination)
  const queryParams = useStoreProjectTypes((s) => s.queryParams)
  const loading = useStoreProjectTypes((s) => s.operationLoading.list)

  // Store actions triggered by table interactions.
  const sortProjectTypes = useStoreProjectTypes((s) => s.sortProjectTypes)
  const goToPage = useStoreProjectTypes((s) => s.goToPage)

  // Derived lookup for callbacks that receive the generic TableRow shape.
  const rowsById = useMemo(() => createRowsById(rows), [rows])
  const resolveProjectTypeRow = (rowId: string) => findRowById(rowsById, rowId)
  const resolveRowActive = (rowId: string) => isTableRowActive(resolveProjectTypeRow(rowId))

  const resolveRowActions = (row: ProjectTypeTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => onViewDetail(row)),
      actionUpdateProjectType(() => navigate(`${AUTH_ROUTE_PROJECT_TYPES_EDIT}=${row.id}`)),
    ]
    if (canToggleStatus) actions.push(actionToggleStatus(isTableRowActive(row), () => onToggleStatus(row)))
    return actions
  }

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = resolveProjectTypeRow(tableRow.id)
    return row ? resolveRowActions(row) : []
  }

  const renderCustomCell = createTableCustomRenderer({
    [NAME_COLUMN_INDEX]: ({ row, value }) => renderViewDetailButton(value, () => {
      const typeRow = resolveProjectTypeRow(row.id)
      if (typeRow) onViewDetail(typeRow)
    }),
    [STATUS_COLUMN_INDEX]: ({ row }) => renderStatusBadge(resolveRowActive(row.id)),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = projectTypesTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = resolveNextTableSortDir(queryParams.sortBy, queryParams.sortDir, sortBy)
    await sortProjectTypes(sortBy, nextSortDir)
  }

  const sortState = createTableSortState(SORTABLE_COLUMNS, projectTypesTableSortByColumn, queryParams.sortBy, queryParams.sortDir)

  return (
    <>
      <TableComponent
        columns={projectTypesTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage={messages.projectTypes.ui.emptyList}
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
