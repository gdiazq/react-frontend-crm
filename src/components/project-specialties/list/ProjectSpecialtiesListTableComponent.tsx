import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow } from '@/components'
import { AUTH_ROUTE_PROJECT_SPECIALTIES_EDIT, PermissionAction, PermissionModule } from '@/constant'
import { projectSpecialtiesTableColumns, projectSpecialtiesTableColumnIndex, projectSpecialtiesTableSortByColumn } from '@/factories'
import { useStoreProjectSpecialties } from '@/store'
import { useHasPermission } from '@/hooks'
import messages from '@/messages/messages'
import type { ProjectSpecialtyTableRow } from '@/types'
import {
  createProjectSpecialtiesActions,
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

const NAME_COLUMN_INDEX = projectSpecialtiesTableColumnIndex.name
const STATUS_COLUMN_INDEX = projectSpecialtiesTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = projectSpecialtiesTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(projectSpecialtiesTableSortByColumn).map((index) => Number(index))

interface ProjectSpecialtiesListTableComponentProps {
  onViewDetail: (row: ProjectSpecialtyTableRow) => void
  onToggleStatus: (row: ProjectSpecialtyTableRow) => void
  loadingExtra?: boolean
}

export function ProjectSpecialtiesListTableComponent(props: ProjectSpecialtiesListTableComponentProps) {
  const { onViewDetail, onToggleStatus, loadingExtra = false } = props

  const navigate = useNavigate()
  const canToggleStatus = useHasPermission(PermissionModule.ProjectSpecialty, PermissionAction.Update)
  const { actionViewDetail, actionUpdateProjectSpecialty, actionToggleStatus } = createProjectSpecialtiesActions()

  // Store state used to render the table.
  const rows = useStoreProjectSpecialties((s) => s.projectSpecialtiesRows)
  const pagination = useStoreProjectSpecialties((s) => s.pagination)
  const queryParams = useStoreProjectSpecialties((s) => s.queryParams)
  const loading = useStoreProjectSpecialties((s) => s.operationLoading.list)

  // Store actions triggered by table interactions.
  const sortProjectSpecialties = useStoreProjectSpecialties((s) => s.sortProjectSpecialties)
  const goToPage = useStoreProjectSpecialties((s) => s.goToPage)

  // Derived lookup for callbacks that receive the generic TableRow shape.
  const rowsById = useMemo(() => createRowsById(rows), [rows])
  const resolveProjectSpecialtyRow = (rowId: string) => findRowById(rowsById, rowId)
  const resolveRowActive = (rowId: string) => isTableRowActive(resolveProjectSpecialtyRow(rowId))

  const resolveRowActions = (row: ProjectSpecialtyTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => onViewDetail(row)),
      actionUpdateProjectSpecialty(() => navigate(`${AUTH_ROUTE_PROJECT_SPECIALTIES_EDIT}=${row.id}`)),
    ]
    if (canToggleStatus) actions.push(actionToggleStatus(isTableRowActive(row), () => onToggleStatus(row)))
    return actions
  }

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = resolveProjectSpecialtyRow(tableRow.id)
    return row ? resolveRowActions(row) : []
  }

  const renderCustomCell = createTableCustomRenderer({
    [NAME_COLUMN_INDEX]: ({ row, value }) => renderViewDetailButton(value, () => {
      const specialtyRow = resolveProjectSpecialtyRow(row.id)
      if (specialtyRow) onViewDetail(specialtyRow)
    }),
    [STATUS_COLUMN_INDEX]: ({ row }) => renderStatusBadge(resolveRowActive(row.id)),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = projectSpecialtiesTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = resolveNextTableSortDir(queryParams.sortBy, queryParams.sortDir, sortBy)
    await sortProjectSpecialties(sortBy, nextSortDir)
  }

  const sortState = createTableSortState(SORTABLE_COLUMNS, projectSpecialtiesTableSortByColumn, queryParams.sortBy, queryParams.sortDir)

  return (
    <>
      <TableComponent
        columns={projectSpecialtiesTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage={messages.projectSpecialties.ui.emptyList}
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
