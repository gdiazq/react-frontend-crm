import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow, TableSortState } from '@/components'
import { AUTH_ROUTE_PROJECT_SPECIALTIES_EDIT, PermissionAction, PermissionModule, SortDirection } from '@/constant'
import { projectSpecialtiesTableColumns, projectSpecialtiesTableColumnIndex, projectSpecialtiesTableSortByColumn } from '@/factories'
import { useStoreProjectSpecialties } from '@/store'
import { useHasPermission } from '@/hooks'
import type { ProjectSpecialtyTableRow } from '@/types'
import { createProjectSpecialtiesActions, createTableCustomRenderer, renderStatusBadge, renderViewDetailButton } from '@/utils'
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
  const rows = useStoreProjectSpecialties((s) => s.projectSpecialtiesRows)
  const pagination = useStoreProjectSpecialties((s) => s.pagination)
  const queryParams = useStoreProjectSpecialties((s) => s.queryParams)
  const loading = useStoreProjectSpecialties((s) => s.operationLoading.list)
  const sortProjectSpecialties = useStoreProjectSpecialties((s) => s.sortProjectSpecialties)
  const goToPage = useStoreProjectSpecialties((s) => s.goToPage)
  const canToggleStatus = useHasPermission(PermissionModule.ProjectSpecialty, PermissionAction.Update)
  const { actionViewDetail, actionUpdateProjectSpecialty, actionToggleStatus } = createProjectSpecialtiesActions()

  const findRowById = (rowId: string) => rows.find((row) => row.id === rowId) ?? null
  const resolveRowActions = (row: ProjectSpecialtyTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => onViewDetail(row)),
      actionUpdateProjectSpecialty(() => navigate(`${AUTH_ROUTE_PROJECT_SPECIALTIES_EDIT}=${row.id}`)),
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
      const specialtyRow = findRowById(row.id)
      if (specialtyRow) onViewDetail(specialtyRow)
    }),
    [STATUS_COLUMN_INDEX]: ({ row }) => renderStatusBadge(Boolean(findRowById(row.id)?.active)),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = projectSpecialtiesTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortProjectSpecialties(sortBy, nextSortDir)
  }

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => projectSpecialtiesTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = { columnIndex: activeSortColumn, direction: queryParams.sortDir }

  return (
    <>
      <TableComponent
        columns={projectSpecialtiesTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay especialidades registradas."
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
