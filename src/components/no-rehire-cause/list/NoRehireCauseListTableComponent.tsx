import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow, TableSortState } from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE_EDIT, PermissionAction, PermissionModule, SortDirection } from '@/constant'
import { noRehireCauseTableColumns, noRehireCauseTableColumnIndex, noRehireCauseTableSortByColumn } from '@/factories'
import { useStoreAuth, useStoreNoRehireCause } from '@/store'
import type { NoRehireCauseTableRow } from '@/types'
import { createNoRehireCauseActions, createTableCustomRenderer, renderStatusBadge, renderViewDetailButton } from '@/utils'
import type { DropdownAction } from '@/utils'

const NAME_COLUMN_INDEX = noRehireCauseTableColumnIndex.name
const STATUS_COLUMN_INDEX = noRehireCauseTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = noRehireCauseTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(noRehireCauseTableSortByColumn).map((index) => Number(index))

interface NoRehireCauseListTableComponentProps {
  onViewDetail: (row: NoRehireCauseTableRow) => void
  onToggleStatus: (row: NoRehireCauseTableRow) => void
  loadingExtra?: boolean
}

export function NoRehireCauseListTableComponent(props: NoRehireCauseListTableComponentProps) {
  const { onViewDetail, onToggleStatus, loadingExtra = false } = props
  const navigate = useNavigate()
  const rows = useStoreNoRehireCause((s) => s.noRehireCauseRows)
  const pagination = useStoreNoRehireCause((s) => s.pagination)
  const queryParams = useStoreNoRehireCause((s) => s.queryParams)
  const loading = useStoreNoRehireCause((s) => s.operationLoading.list)
  const sortNoRehireCause = useStoreNoRehireCause((s) => s.sortNoRehireCause)
  const goToPage = useStoreNoRehireCause((s) => s.goToPage)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canToggleStatus = hasPermission(PermissionModule.NoRehireCause, PermissionAction.Update)
  const { actionViewDetail, actionUpdateNoRehireCause, actionToggleStatus } = createNoRehireCauseActions()

  const findRowById = (rowId: string) => rows.find((row) => row.id === rowId) ?? null
  const resolveRowActions = (row: NoRehireCauseTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => onViewDetail(row)),
      actionUpdateNoRehireCause(() => navigate(`${AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE_EDIT}=${row.id}`)),
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
      const noRehireRow = findRowById(row.id)
      if (noRehireRow) onViewDetail(noRehireRow)
    }),
    [STATUS_COLUMN_INDEX]: ({ row }) => renderStatusBadge(Boolean(findRowById(row.id)?.active)),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = noRehireCauseTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortNoRehireCause(sortBy, nextSortDir)
  }

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => noRehireCauseTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = { columnIndex: activeSortColumn, direction: queryParams.sortDir }

  return (
    <>
      <TableComponent
        columns={noRehireCauseTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay registros de causas de no recontratación."
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
          loading={loading || loadingExtra}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>
    </>
  )
}
