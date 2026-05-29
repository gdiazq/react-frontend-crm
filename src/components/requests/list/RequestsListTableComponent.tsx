import { useMemo } from 'react'
import {
  PaginationComponent,
  TableComponent,
} from '@/components'
import type { TableRow } from '@/components'
import { PermissionAction, PermissionModule } from '@/constant'
import { requestsTableColumns, requestsTableColumnIndex, requestsTableSortByColumn } from '@/factories'
import { useStoreRequests } from '@/store'
import { useHasPermission } from '@/hooks'
import {
  isFinalRequestStatus,
} from '@/mappers'
import messages from '@/messages/messages'
import type { RequestTableRow } from '@/types'
import {
  createRowsById,
  createRequestsActions,
  createTableSortState,
  createTableCustomRenderer,
  findRowById,
  renderEmployeeApprovalStatus,
  renderViewDetailButton,
  resolveNextTableSortDir,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const REQUEST_STATUS_COLUMN_INDEX = requestsTableColumnIndex.status
const REQUEST_NAME_COLUMN_INDEX = requestsTableColumnIndex.name
const ACTIONS_COLUMN_INDEX = requestsTableColumns.length - 1
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
  const canUpdate = useHasPermission(PermissionModule.HrRequest, PermissionAction.Update)
  const { actionViewDetail, actionApproveRequest, actionRejectRequest } = createRequestsActions()

  const rowsById = useMemo(() => createRowsById(requestsRows), [requestsRows])
  const resolveRequestRow = (rowId: string) => findRowById(rowsById, rowId)

  const resolveRowActions = (row: RequestTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [actionViewDetail(() => onViewDetail(row))]
    if (canUpdate && !isFinalRequestStatus(row.statusId)) {
      actions.push(actionApproveRequest(() => onApprove(row)))
      actions.push(actionRejectRequest(() => onReject(row)))
    }
    return actions
  }
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const requestRow = resolveRequestRow(tableRow.id)
    if (!requestRow) return []
    return resolveRowActions(requestRow)
  }
  const renderCustomCell = createTableCustomRenderer({
    [REQUEST_NAME_COLUMN_INDEX]: ({ row, value }) => {
      const requestRow = resolveRequestRow(row.id)
      return renderViewDetailButton(value, () => { if (requestRow) onViewDetail(requestRow) })
    },
    [REQUEST_STATUS_COLUMN_INDEX]: ({ row, value }) => {
      const requestRow = resolveRequestRow(row.id)
      return renderEmployeeApprovalStatus(requestRow?.statusName || String(value ?? ''))
    },
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = requestsTableSortByColumn[columnIndex]
    if (!sortBy) return

    const nextSortDir = resolveNextTableSortDir(queryParams.sortBy, queryParams.sortDir, sortBy)
    await sortRequests(sortBy, nextSortDir)
  }

  const sortState = createTableSortState(REQUESTS_SORTABLE_COLUMNS, requestsTableSortByColumn, queryParams.sortBy, queryParams.sortDir)

  return (
    <>
      <TableComponent
        columns={requestsTableColumns}
        rows={requestsRows}
        loading={loadingRequests}
        emptyMessage={messages.requests.ui.emptyList}
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
