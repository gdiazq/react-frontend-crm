import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableSortState } from '@/components'
import { AUTH_ROUTE_ANNEXES_EDIT, PermissionAction, PermissionModule, SortDirection } from '@/constant'
import { annexesTableColumns, annexesTableColumnIndex, annexesTableSortByColumn } from '@/factories'
import { useStoreAnnexes } from '@/store'
import { useHasPermission } from '@/hooks'
import type { AnnexTableRow, TableRow } from '@/types'
import {
  createAnnexesActions,
  createTableCustomRenderer,
  renderEmployeeApprovalStatus,
  renderViewDetailButton,
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

  const findRowById = (rowId: string) => rows.find((row) => row.id === rowId) ?? null

  const resolveRowActions = (row: AnnexTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [actionViewDetail(() => onViewDetail(row))]
    if (canUpdate) {
      actions.push(actionUpdateAnnex(() => navigate(`${AUTH_ROUTE_ANNEXES_EDIT}=${row.id}`)))
    }
    return actions
  }

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = findRowById(tableRow.id)
    if (!row) return []
    return resolveRowActions(row)
  }

  const renderCustomCell = createTableCustomRenderer({
    [EMPLOYEE_NAME_COLUMN_INDEX]: ({ row, value }) =>
      renderViewDetailButton(value, () => {
        const annexRow = findRowById(row.id)
        if (annexRow) onViewDetail(annexRow)
      }),
    [STATUS_COLUMN_INDEX]: ({ value }) => renderEmployeeApprovalStatus(value),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = annexesTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortAnnexes(sortBy, nextSortDir)
  }

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => annexesTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = { columnIndex: activeSortColumn, direction: queryParams.sortDir }

  return (
    <>
      <TableComponent
        columns={annexesTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay anexos registrados."
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
