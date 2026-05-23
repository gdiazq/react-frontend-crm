import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow, TableSortState } from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY_EDIT, PermissionAction, PermissionModule, SortDirection } from '@/constant'
import { qualityOfWorkTableColumns, qualityOfWorkTableColumnIndex, qualityOfWorkTableSortByColumn } from '@/factories'
import { useStoreAuth, useStoreQualityOfWork } from '@/store'
import type { QualityOfWorkTableRow } from '@/types'
import { createQualityOfWorkActions, createTableCustomRenderer, renderStatusBadge, renderViewDetailButton } from '@/utils'
import type { DropdownAction } from '@/utils'

const NAME_COLUMN_INDEX = qualityOfWorkTableColumnIndex.name
const STATUS_COLUMN_INDEX = qualityOfWorkTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = qualityOfWorkTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(qualityOfWorkTableSortByColumn).map((index) => Number(index))

interface QualityOfWorkListTableComponentProps {
  onViewDetail: (row: QualityOfWorkTableRow) => void
  onToggleStatus: (row: QualityOfWorkTableRow) => void
  loadingExtra?: boolean
}

export function QualityOfWorkListTableComponent(props: QualityOfWorkListTableComponentProps) {
  const { onViewDetail, onToggleStatus, loadingExtra = false } = props
  const navigate = useNavigate()
  const rows = useStoreQualityOfWork((s) => s.qualityOfWorkRows)
  const pagination = useStoreQualityOfWork((s) => s.pagination)
  const queryParams = useStoreQualityOfWork((s) => s.queryParams)
  const loading = useStoreQualityOfWork((s) => s.operationLoading.list)
  const sortQualityOfWork = useStoreQualityOfWork((s) => s.sortQualityOfWork)
  const goToPage = useStoreQualityOfWork((s) => s.goToPage)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canToggleStatus = hasPermission(PermissionModule.QualityOfWork, PermissionAction.Update)
  const { actionViewDetail, actionUpdateQualityOfWork, actionToggleStatus } = createQualityOfWorkActions()

  const findRowById = (rowId: string) => rows.find((row) => row.id === rowId) ?? null
  const resolveRowActions = (row: QualityOfWorkTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => onViewDetail(row)),
      actionUpdateQualityOfWork(() => navigate(`${AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY_EDIT}=${row.id}`)),
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
      const qualityRow = findRowById(row.id)
      if (qualityRow) onViewDetail(qualityRow)
    }),
    [STATUS_COLUMN_INDEX]: ({ row }) => renderStatusBadge(Boolean(findRowById(row.id)?.active)),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = qualityOfWorkTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortQualityOfWork(sortBy, nextSortDir)
  }

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => qualityOfWorkTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = { columnIndex: activeSortColumn, direction: queryParams.sortDir }

  return (
    <>
      <TableComponent
        columns={qualityOfWorkTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay registros de calidad del trabajo."
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
