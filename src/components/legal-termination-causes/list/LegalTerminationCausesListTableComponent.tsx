import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableRow } from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES_EDIT, PermissionAction, PermissionModule } from '@/constant'
import { legalTerminationCausesTableColumns, legalTerminationCausesTableColumnIndex, legalTerminationCausesTableSortByColumn } from '@/factories'
import { useStoreLegalTerminationCauses } from '@/store'
import { useHasPermission } from '@/hooks'
import type { LegalTerminationCauseTableRow } from '@/types'
import {
  createLegalTerminationCausesActions,
  createRowsById,
  createTableCustomRenderer,
  createTableSortState,
  findRowById,
  isTableRowActive,
  renderStatusBadge,
  renderViewDetailButton,
  resolveNextTableSortDir,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const NAME_COLUMN_INDEX = legalTerminationCausesTableColumnIndex.name
const STATUS_COLUMN_INDEX = legalTerminationCausesTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = legalTerminationCausesTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(legalTerminationCausesTableSortByColumn).map((index) => Number(index))

interface LegalTerminationCausesListTableComponentProps {
  onViewDetail: (row: LegalTerminationCauseTableRow) => void
  onToggleStatus: (row: LegalTerminationCauseTableRow) => void
  loadingExtra?: boolean
}

export function LegalTerminationCausesListTableComponent(props: LegalTerminationCausesListTableComponentProps) {
  const { onViewDetail, onToggleStatus, loadingExtra = false } = props
  const navigate = useNavigate()
  const rows = useStoreLegalTerminationCauses((s) => s.legalTerminationCausesRows)
  const pagination = useStoreLegalTerminationCauses((s) => s.pagination)
  const queryParams = useStoreLegalTerminationCauses((s) => s.queryParams)
  const loading = useStoreLegalTerminationCauses((s) => s.operationLoading.list)
  const sortLegalTerminationCauses = useStoreLegalTerminationCauses((s) => s.sortLegalTerminationCauses)
  const goToPage = useStoreLegalTerminationCauses((s) => s.goToPage)
  const canToggleStatus = useHasPermission(PermissionModule.LegalTerminationCause, PermissionAction.Update)
  const { actionViewDetail, actionUpdateLegalTerminationCause, actionToggleStatus } = createLegalTerminationCausesActions()
  const rowsById = useMemo(() => createRowsById(rows), [rows])
  const resolveLegalTerminationCauseRow = (rowId: string) => findRowById(rowsById, rowId)
  const resolveRowActive = (rowId: string) => isTableRowActive(resolveLegalTerminationCauseRow(rowId))

  const resolveRowActions = (row: LegalTerminationCauseTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => onViewDetail(row)),
      actionUpdateLegalTerminationCause(() => navigate(`${AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES_EDIT}=${row.id}`)),
    ]
    if (canToggleStatus) actions.push(actionToggleStatus(isTableRowActive(row), () => onToggleStatus(row)))
    return actions
  }
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = resolveLegalTerminationCauseRow(tableRow.id)
    return row ? resolveRowActions(row) : []
  }
  const renderCustomCell = createTableCustomRenderer({
    [NAME_COLUMN_INDEX]: ({ row, value }) => renderViewDetailButton(value, () => {
      const legalCauseRow = resolveLegalTerminationCauseRow(row.id)
      if (legalCauseRow) onViewDetail(legalCauseRow)
    }),
    [STATUS_COLUMN_INDEX]: ({ row }) => renderStatusBadge(resolveRowActive(row.id)),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = legalTerminationCausesTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = resolveNextTableSortDir(queryParams.sortBy, queryParams.sortDir, sortBy)
    await sortLegalTerminationCauses(sortBy, nextSortDir)
  }

  const sortState = createTableSortState(SORTABLE_COLUMNS, legalTerminationCausesTableSortByColumn, queryParams.sortBy, queryParams.sortDir)

  return (
    <>
      <TableComponent
        columns={legalTerminationCausesTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay causas legales de terminación registradas."
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
