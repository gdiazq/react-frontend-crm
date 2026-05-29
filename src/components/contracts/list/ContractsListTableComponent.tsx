import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import { AUTH_ROUTE_CONTRACTS_EDIT, PermissionAction, PermissionModule } from '@/constant'
import { contractsTableColumns, contractsTableColumnIndex, contractsTableSortByColumn } from '@/factories'
import { useStoreContracts } from '@/store'
import { useHasPermission } from '@/hooks'
import messages from '@/messages/messages'
import type { ContractTableRow, TableRow } from '@/types'
import {
  createContractsActions,
  createRowsById,
  createTableSortState,
  createTableCustomRenderer,
  findRowById,
  renderContractStatus,
  renderContractType,
  renderViewDetailButton,
  resolveNextTableSortDir,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const EMPLOYEE_NAME_COLUMN_INDEX = contractsTableColumnIndex.employeeName
const CONTRACT_TYPE_COLUMN_INDEX = contractsTableColumnIndex.contractType
const CONTRACT_STATUS_COLUMN_INDEX = contractsTableColumnIndex.contractStatus
const ACTIONS_COLUMN_INDEX = contractsTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(contractsTableSortByColumn).map((index) => Number(index))

interface ContractsListTableComponentProps {
  onViewDetail: (row: ContractTableRow) => void
}

export function ContractsListTableComponent(props: ContractsListTableComponentProps) {
  const { onViewDetail } = props
  const navigate = useNavigate()
  const rows = useStoreContracts((s) => s.contractsRows)
  const pagination = useStoreContracts((s) => s.pagination)
  const queryParams = useStoreContracts((s) => s.queryParams)
  const loading = useStoreContracts((s) => s.operationLoading.list)
  const goToPage = useStoreContracts((s) => s.goToPage)
  const sortContracts = useStoreContracts((s) => s.sortContracts)
  const canUpdate = useHasPermission(PermissionModule.Contract, PermissionAction.Update)
  const { actionViewDetail, actionUpdateContract } = createContractsActions()

  const rowsById = useMemo(() => createRowsById(rows), [rows])
  const resolveContractRow = (rowId: string) => findRowById(rowsById, rowId)

  const resolveRowActions = (row: ContractTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [actionViewDetail(() => onViewDetail(row))]
    if (canUpdate) {
      actions.push(actionUpdateContract(() => navigate(`${AUTH_ROUTE_CONTRACTS_EDIT}=${row.id}`)))
    }
    return actions
  }

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = resolveContractRow(tableRow.id)
    if (!row) return []
    return resolveRowActions(row)
  }

  const renderCustomCell = createTableCustomRenderer({
    [EMPLOYEE_NAME_COLUMN_INDEX]: ({ row, value }) =>
      renderViewDetailButton(value, () => {
        const contractRow = resolveContractRow(row.id)
        if (contractRow) onViewDetail(contractRow)
      }),
    [CONTRACT_TYPE_COLUMN_INDEX]: ({ value }) => renderContractType(value),
    [CONTRACT_STATUS_COLUMN_INDEX]: ({ value }) => renderContractStatus(value),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = contractsTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = resolveNextTableSortDir(queryParams.sortBy, queryParams.sortDir, sortBy)
    await sortContracts(sortBy, nextSortDir)
  }

  const sortState = createTableSortState(SORTABLE_COLUMNS, contractsTableSortByColumn, queryParams.sortBy, queryParams.sortDir)

  return (
    <>
      <TableComponent
        columns={contractsTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage={messages.contracts.ui.emptyList}
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
