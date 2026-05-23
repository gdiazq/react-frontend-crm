import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow, TableSortState } from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE_EDIT, PermissionAction, PermissionModule, SortDirection } from '@/constant'
import { safetyComplianceTableColumns, safetyComplianceTableColumnIndex, safetyComplianceTableSortByColumn } from '@/factories'
import { useStoreAuth, useStoreSafetyCompliance } from '@/store'
import type { SafetyComplianceTableRow } from '@/types'
import { createSafetyComplianceActions, createTableCustomRenderer, renderStatusBadge, renderViewDetailButton } from '@/utils'
import type { DropdownAction } from '@/utils'

const NAME_COLUMN_INDEX = safetyComplianceTableColumnIndex.name
const STATUS_COLUMN_INDEX = safetyComplianceTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = safetyComplianceTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(safetyComplianceTableSortByColumn).map((index) => Number(index))

interface SafetyComplianceListTableComponentProps {
  onViewDetail: (row: SafetyComplianceTableRow) => void
  onToggleStatus: (row: SafetyComplianceTableRow) => void
  loadingExtra?: boolean
}

export function SafetyComplianceListTableComponent(props: SafetyComplianceListTableComponentProps) {
  const { onViewDetail, onToggleStatus, loadingExtra = false } = props
  const navigate = useNavigate()
  const rows = useStoreSafetyCompliance((s) => s.safetyComplianceRows)
  const pagination = useStoreSafetyCompliance((s) => s.pagination)
  const queryParams = useStoreSafetyCompliance((s) => s.queryParams)
  const loading = useStoreSafetyCompliance((s) => s.operationLoading.list)
  const sortSafetyCompliance = useStoreSafetyCompliance((s) => s.sortSafetyCompliance)
  const goToPage = useStoreSafetyCompliance((s) => s.goToPage)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canToggleStatus = hasPermission(PermissionModule.SafetyCompliance, PermissionAction.Update)
  const { actionViewDetail, actionUpdateSafetyCompliance, actionToggleStatus } = createSafetyComplianceActions()

  const findRowById = (rowId: string) => rows.find((row) => row.id === rowId) ?? null
  const resolveRowActions = (row: SafetyComplianceTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => onViewDetail(row)),
      actionUpdateSafetyCompliance(() => navigate(`${AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE_EDIT}=${row.id}`)),
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
      const safetyRow = findRowById(row.id)
      if (safetyRow) onViewDetail(safetyRow)
    }),
    [STATUS_COLUMN_INDEX]: ({ row }) => renderStatusBadge(Boolean(findRowById(row.id)?.active)),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = safetyComplianceTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortSafetyCompliance(sortBy, nextSortDir)
  }

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => safetyComplianceTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = { columnIndex: activeSortColumn, direction: queryParams.sortDir }

  return (
    <>
      <TableComponent
        columns={safetyComplianceTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay registros de cumplimiento de seguridad."
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
