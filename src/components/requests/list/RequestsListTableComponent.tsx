import {
  PaginationComponent,
  TableComponent,
} from '@/components'
import type { TableRow, TableSortState } from '@/components'
import { SortDirection } from '@/constant'
import { requestsTableColumns, requestsTableColumnIndex, requestsTableSortByColumn } from '@/factories'
import { useStoreRequests } from '@/store'
import type { RequestTableRow } from '@/types'
import {
  createRequestsActions,
  createTableCustomRenderer,
  renderEmployeeApprovalStatus,
  renderViewDetailButton,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const REQUEST_STATUS_COLUMN_INDEX = requestsTableColumnIndex.status
const REQUEST_NAME_COLUMN_INDEX = requestsTableColumnIndex.name
const ACTIONS_COLUMN_INDEX = requestsTableColumns.length - 1
const FINAL_REQUEST_STATUS_IDS = new Set([3, 4])
const REQUESTS_SORTABLE_COLUMNS = Object.keys(requestsTableSortByColumn).map((index) => Number(index))

interface RequestsListTableComponentProps {
  onViewDetail: (row: RequestTableRow) => void
  onApprove: (row: RequestTableRow) => void
  onReject: (row: RequestTableRow) => void
  loadingExtra?: boolean
}

export function RequestsListTableComponent(props: RequestsListTableComponentProps) {
  const { onViewDetail, onApprove, onReject, loadingExtra = false } = props
  const requestsRows = useStoreRequests((s) => s.requestsRows)
  const pagination = useStoreRequests((s) => s.pagination)
  const queryParams = useStoreRequests((s) => s.queryParams)
  const loadingRequests = useStoreRequests((s) => s.operationLoading.list)
  const goToPage = useStoreRequests((s) => s.goToPage)
  const sortRequests = useStoreRequests((s) => s.sortRequests)
  const { actionViewDetail, actionApproveRequest, actionRejectRequest } = createRequestsActions()

  const findRequestRowById = (rowId: string) => requestsRows.find((row) => row.id === rowId) ?? null
  const resolveRowActions = (row: RequestTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [actionViewDetail(() => onViewDetail(row))]
    if (!FINAL_REQUEST_STATUS_IDS.has(row.statusId)) {
      actions.push(actionApproveRequest(() => onApprove(row)))
      actions.push(actionRejectRequest(() => onReject(row)))
    }
    return actions
  }
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const requestRow = findRequestRowById(tableRow.id)
    if (!requestRow) return []
    return resolveRowActions(requestRow)
  }
  const renderCustomCell = createTableCustomRenderer({
    [REQUEST_NAME_COLUMN_INDEX]: ({ row, value }) => {
      const requestRow = findRequestRowById(row.id)
      return renderViewDetailButton(value, () => { if (requestRow) onViewDetail(requestRow) })
    },
    [REQUEST_STATUS_COLUMN_INDEX]: ({ row, value }) => {
      const requestRow = findRequestRowById(row.id)
      return renderEmployeeApprovalStatus(requestRow?.statusName || String(value ?? ''))
    },
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = requestsTableSortByColumn[columnIndex]
    if (!sortBy) return

    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortRequests(sortBy, nextSortDir)
  }

  const activeSortColumn = REQUESTS_SORTABLE_COLUMNS.find((index) => requestsTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  return (
    <>
      <TableComponent
        columns={requestsTableColumns}
        rows={requestsRows}
        loading={loadingRequests}
        emptyMessage="No hay solicitudes registradas."
        customRenderer={renderCustomCell}
        actionsConfig={{
          columnIndex: ACTIONS_COLUMN_INDEX,
          resolveRowActions: resolveRowActionsFromTableRow,
        }}
        sortableColumnIndexes={REQUESTS_SORTABLE_COLUMNS}
        sortState={sortState}
        onSortChange={(columnIndex) => { void handleSortChange(columnIndex) }}
      />

      <div className="flex justify-end">
        <PaginationComponent
          currentPage={pagination.page + 1}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalElements}
          pageSize={pagination.size}
          loading={loadingRequests || loadingExtra}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>
    </>
  )
}
