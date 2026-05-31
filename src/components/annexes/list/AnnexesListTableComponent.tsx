import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import { AUTH_ROUTE_ANNEXES_EDIT, PermissionAction, PermissionModule } from '@/constant'
import { annexesTableColumns, annexesTableColumnIndex, annexesTableSortByColumn } from '@/factories'
import messages from '@/messages/messages'
import { useStoreAnnexes } from '@/store'
import { useHasPermission } from '@/hooks'
import type { AnnexTableRow, TableRow } from '@/types'
import {
  createAnnexesActions,
  createRowsById,
  createTableSortState,
  createTableCustomRenderer,
  findRowById,
  renderEmployeeApprovalStatus,
  renderViewDetailButton,
  resolveNextTableSortDir,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const EMPLOYEE_NAME_COLUMN_INDEX = annexesTableColumnIndex.employeeName
const STATUS_COLUMN_INDEX = annexesTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = annexesTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(annexesTableSortByColumn).map((index) => Number(index))

interface AnnexesListTableComponentProps {
  onViewDetail: (row: AnnexTableRow) => void
}

export function AnnexesListTableComponent(props: AnnexesListTableComponentProps) {
  const { onViewDetail } = props
  const navigate = useNavigate()
  const rows = useStoreAnnexes((s) => s.annexesRows)
  const pagination = useStoreAnnexes((s) => s.pagination)
  const queryParams = useStoreAnnexes((s) => s.queryParams)
  const loading = useStoreAnnexes((s) => s.operationLoading.list)
  const goToPage = useStoreAnnexes((s) => s.goToPage)
  const sortAnnexes = useStoreAnnexes((s) => s.sortAnnexes)
  const canUpdate = useHasPermission(PermissionModule.Annex, PermissionAction.Update)
  const { actionViewDetail, actionUpdateAnnex } = createAnnexesActions()

  const rowsById = useMemo(() => createRowsById(rows), [rows])
  const resolveAnnexRow = (rowId: string) => findRowById(rowsById, rowId)

  const resolveRowActions = (row: AnnexTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [actionViewDetail(() => onViewDetail(row))]
    if (canUpdate) {
      actions.push(actionUpdateAnnex(() => navigate(`${AUTH_ROUTE_ANNEXES_EDIT}=${row.id}`)))
    }
    return actions
  }

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = resolveAnnexRow(tableRow.id)
    if (!row) return []
    return resolveRowActions(row)
  }

  const renderCustomCell = createTableCustomRenderer({
    [EMPLOYEE_NAME_COLUMN_INDEX]: ({ row, value }) =>
      renderViewDetailButton(value, () => {
        const annexRow = resolveAnnexRow(row.id)
        if (annexRow) onViewDetail(annexRow)
      }),
    [STATUS_COLUMN_INDEX]: ({ value }) => renderEmployeeApprovalStatus(value),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = annexesTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = resolveNextTableSortDir(queryParams.sortBy, queryParams.sortDir, sortBy)
    await sortAnnexes(sortBy, nextSortDir)
  }

  const sortState = createTableSortState(SORTABLE_COLUMNS, annexesTableSortByColumn, queryParams.sortBy, queryParams.sortDir)

  return (
    <>
      <TableComponent
        columns={annexesTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage={messages.annexes.ui.emptyList}
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
          loading={loading}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>
    </>
  )
}
