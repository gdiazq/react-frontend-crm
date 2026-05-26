import { useNavigate } from 'react-router-dom'
import { PaginationComponent, TableComponent } from '@/components'
import type { TableSortState } from '@/components'
import { AUTH_ROUTE_CONTRACTS_EDIT, PermissionAction, PermissionModule, SortDirection } from '@/constant'
import { contractsTableColumns, contractsTableColumnIndex, contractsTableSortByColumn } from '@/factories'
import { useStoreContracts } from '@/store'
import { useHasPermission } from '@/hooks'
import type { ContractTableRow, TableRow } from '@/types'
import {
  createContractsActions,
  createTableCustomRenderer,
  renderContractStatus,
  renderContractType,
  renderViewDetailButton,
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

  const findRowById = (rowId: string) => rows.find((row) => row.id === rowId) ?? null

  const resolveRowActions = (row: ContractTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [actionViewDetail(() => onViewDetail(row))]
    if (canUpdate) {
      actions.push(actionUpdateContract(() => navigate(`${AUTH_ROUTE_CONTRACTS_EDIT}=${row.id}`)))
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
        const contractRow = findRowById(row.id)
        if (contractRow) onViewDetail(contractRow)
      }),
    [CONTRACT_TYPE_COLUMN_INDEX]: ({ value }) => renderContractType(value),
    [CONTRACT_STATUS_COLUMN_INDEX]: ({ value }) => renderContractStatus(value),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = contractsTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortContracts(sortBy, nextSortDir)
  }

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => contractsTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = { columnIndex: activeSortColumn, direction: queryParams.sortDir }

  return (
    <>
      <TableComponent
        columns={contractsTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay contratos registrados."
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
