import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  PaginationComponent,
  RightSidebarComponent,
  SaveConfirmComponent,
  StatsOverviewCardsComponent,
  TableComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AUTH_ROUTE_CONTRACTS_CREATE, AUTH_ROUTE_CONTRACTS_EDIT } from '@/constant'
import { contractsTableColumns, contractsTableColumnIndex, contractsTableSortByColumn } from '@/factories'
import messages from '@/messages/messages'
import { useStoreAuth, useStoreContracts } from '@/store'
import type { ContractTableRow, TableRow, TableSortState } from '@/types'
import { createContractsActions, createContractsTableCustomRenderer } from '@/utils'
import type { DropdownAction } from '@/utils'

const CONTRACT_ACTIVE_COLUMN_INDEX = contractsTableColumnIndex.active
const CONTRACT_TYPE_COLUMN_INDEX = contractsTableColumnIndex.contractType
const CONTRACT_STATUS_COLUMN_INDEX = contractsTableColumnIndex.contractStatus
const CONTRACT_NAME_COLUMN_INDEX = contractsTableColumnIndex.name
const ACTIONS_COLUMN_INDEX = contractsTableColumns.length - 1
const CONTRACTS_SORTABLE_COLUMNS = Object.keys(contractsTableSortByColumn).map((index) => Number(index))

export default function ContractsDashboardPage() {
  // --- Store ---
  const navigate = useNavigate()
  const contractsRows = useStoreContracts((s) => s.contractsRows)
  const pagination = useStoreContracts((s) => s.pagination)
  const queryParams = useStoreContracts((s) => s.queryParams)
  const loadingContracts = useStoreContracts((s) => s.loadingContracts)
  const loadingToggleStatus = useStoreContracts((s) => s.loadingToggleStatus)
  const listError = useStoreContracts((s) => s.operationStatus.list.error)
  const toggleError = useStoreContracts((s) => s.operationStatus.toggle.error)
  const clearOperationStatus = useStoreContracts((s) => s.clearOperationStatus)
  const getContracts = useStoreContracts((s) => s.getContracts)
  const sortContracts = useStoreContracts((s) => s.sortContracts)
  const toggleContractStatus = useStoreContracts((s) => s.toggleContractStatus)
  const goToPage = useStoreContracts((s) => s.goToPage)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canToggleContractStatus = hasPermission('CONTRACT', 'canUpdate')

  const { actionViewDetail, actionUpdateContract, actionToggleStatus } = createContractsActions()

  // --- State ---
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<ContractTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)

  // --- Derived ---
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const activeSortColumn = CONTRACTS_SORTABLE_COLUMNS.find((index) => contractsTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  // --- Effects ---
  useEffect(() => {
    void getContracts()
  }, [getContracts])

  // --- Handlers: Detail ---
  const handleViewDetail = (row: ContractTableRow) => {
    setActionsMessage(`${row.values[CONTRACT_NAME_COLUMN_INDEX]}: ${messages.contracts.ui.viewDetailComingSoon}`)
  }

  // --- Handlers: Navigate ---
  const handleUpdateContract = (row: ContractTableRow) => {
    navigate(`${AUTH_ROUTE_CONTRACTS_EDIT}=${row.id}`)
  }

  // --- Handlers: Toggle status ---
  const handleToggleStatus = (row: ContractTableRow) => {
    setPendingToggleRow(row)
    setConfirmOpen(true)
  }

  // --- Row actions & table helpers ---
  const resolveRowActions = (row: ContractTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => handleViewDetail(row)),
      actionUpdateContract(() => handleUpdateContract(row)),
    ]

    if (canToggleContractStatus) {
      actions.push(actionToggleStatus(row.active === true, () => handleToggleStatus(row)))
    }

    return actions
  }

  const getContractIsActive = (rowId: string) => Boolean(contractsRows.find((row) => row.id === rowId)?.active)
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const contractRow = contractsRows.find((row) => row.id === tableRow.id)
    if (!contractRow) return []
    return resolveRowActions(contractRow)
  }

  const renderCustomCell = createContractsTableCustomRenderer({
    contractTypeColumnIndex: CONTRACT_TYPE_COLUMN_INDEX,
    contractStatusColumnIndex: CONTRACT_STATUS_COLUMN_INDEX,
    contractActiveColumnIndex: CONTRACT_ACTIVE_COLUMN_INDEX,
    getIsActive: getContractIsActive,
  })

  // --- Handlers: Sort ---
  const handleSortChange = async (columnIndex: number) => {
    const sortBy = contractsTableSortByColumn[columnIndex]
    if (!sortBy) return

    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === 'asc' ? 'desc' : 'asc'

    await sortContracts(sortBy, nextSortDir)
  }

  // --- Handlers: Search ---
  const handleSearchSubmit = async () => {
    await getContracts()
  }

  // --- Handlers: Confirm ---
  const handleCloseConfirm = () => {
    if (loadingToggleStatus) return
    setConfirmOpen(false)
    setPendingToggleRow(null)
  }

  const handleConfirmToggleStatus = async () => {
    if (!pendingToggleRow || loadingToggleStatus) return
    const nextStatus = !pendingToggleRow.active
    const success = await toggleContractStatus(pendingToggleRow.id, nextStatus)
    if (success) {
      const contractName = pendingToggleRow.values[CONTRACT_NAME_COLUMN_INDEX]
      await getContracts()
      setActionsMessage(
        `${contractName}: ${
          nextStatus
            ? messages.contracts.status.success.toggleEnabledSuccess
            : messages.contracts.status.success.toggleDisabledSuccess
        }`,
      )
      setConfirmOpen(false)
      setPendingToggleRow(null)
    }
  }

  // --- Handlers: Download & Upload ---
  const handleDownloadReport = () => {
    if (downloadingReport) return
    setDownloadingReport(true)
    setActionsMessage('Descarga de reporte de contratos disponible proximamente.')
    setDownloadingReport(false)
  }

  const handleBulkUpload = () => {
    setActionsMessage('Carga masiva de contratos disponible proximamente.')
  }

  return (
    <section className="min-w-0 space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">Dashboard de contratos</h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total contratos"
        activeLabel="Contratos activos"
        total={pagination.total}
        active={pagination.active}
      />

      {(listError || toggleError) && (
        <AlertMessageComponent
          message={(listError || toggleError)!}
          tone="error"
          onClose={() => {
            if (listError) clearOperationStatus('list')
            if (toggleError) clearOperationStatus('toggle')
          }}
        />
      )}

      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => {
          event.preventDefault()
          void handleSearchSubmit()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingContracts}
            label="Filtro"
            onClick={() => setFiltersOpen(true)}
          />
          <div className="min-w-0 flex-1">
            <InputComponent
              value={searchValue}
              type="text"
              placeholder="Buscar contrato"
              onValueChange={setSearchValue}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loadingContracts}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingContracts ? 'Buscando...' : 'Buscar'}
          />
          <ButtonComponent
            type="button"
            variant="primary"
            disabled={loadingContracts}
            className="flex-1 text-white md:flex-none dark:text-white"
            label="Nuevo contrato"
            onClick={() => navigate(AUTH_ROUTE_CONTRACTS_CREATE)}
          />
          <ToolbarActionsDropdownComponent
            disabled={loadingContracts || downloadingReport}
            onDownloadReport={handleDownloadReport}
            onBulkUpload={handleBulkUpload}
          />
        </div>
      </form>

      <TableComponent
        columns={contractsTableColumns}
        rows={contractsRows}
        loading={loadingContracts}
        emptyMessage="No hay contratos registrados."
        customRenderer={renderCustomCell}
        actionsConfig={{
          columnIndex: ACTIONS_COLUMN_INDEX,
          resolveRowActions: resolveRowActionsFromTableRow,
        }}
        sortableColumnIndexes={CONTRACTS_SORTABLE_COLUMNS}
        sortState={sortState}
        onSortChange={(columnIndex) => { void handleSortChange(columnIndex) }}
      />

      {actionsMessage && (
        <AlertMessageComponent
          message={actionsMessage}
          tone="info"
          onClose={() => setActionsMessage('')}
        />
      )}

      <div className="flex justify-end">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          loading={loadingContracts}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>

      <RightSidebarComponent
        open={filtersOpen}
        title="Filtros"
        onClose={() => setFiltersOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {messages.contracts.ui.filtersComingSoon}
          </p>
          <div className="flex justify-end">
            <ButtonComponent
              type="button"
              variant="outline"
              label="Cerrar"
              onClick={() => setFiltersOpen(false)}
            />
          </div>
        </div>
      </RightSidebarComponent>

      <SaveConfirmComponent
        open={confirmOpen}
        title="Confirmar cambio de estado"
        message={pendingToggleRow
          ? `¿Seguro que deseas ${pendingToggleRow.active ? 'deshabilitar' : 'habilitar'} el contrato ${pendingToggleRow.values[CONTRACT_NAME_COLUMN_INDEX]}?`
          : ''}
        confirmLabel={pendingToggleRow?.active ? 'Deshabilitar' : 'Habilitar'}
        cancelLabel="Cancelar"
        loading={loadingToggleStatus}
        onClose={handleCloseConfirm}
        onConfirm={() => { void handleConfirmToggleStatus() }}
      />
    </section>
  )
}
