import { type ReactNode, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ActionsDropdownComponent,
  AlertMessageComponent,
  ButtonComponent,
  ContractStatusBadgeComponent,
  ContractTypeBadgeComponent,
  InputComponent,
  PaginationComponent,
  RightSidebarComponent,
  SaveConfirmComponent,
  StatsOverviewCardsComponent,
  StatusBadgeComponent,
  TableComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AUTH_ROUTE_CONTRACTS_CREATE, AUTH_ROUTE_CONTRACTS_EDIT } from '@/constant'
import { contractsTableColumns } from '@/factories'
import { useStoreAuth, useStoreContracts } from '@/store'
import type { ContractTableRow, ContractsSortBy, TableRow, TableSortState } from '@/types'
import { createContractsActions } from '@/utils'
import type { DropdownAction } from '@/utils'
import messages from '@/messages/messages'

const CONTRACT_ACTIVE_COLUMN_INDEX = 8
const CONTRACT_TYPE_COLUMN_INDEX = 4
const CONTRACT_STATUS_COLUMN_INDEX = 5
const CONTRACT_NAME_COLUMN_INDEX = 2
const ACTIONS_COLUMN_INDEX = contractsTableColumns.length - 1

const CONTRACTS_SORT_BY_COLUMN: Partial<Record<number, ContractsSortBy>> = {
  0: 'employeeName',
  1: 'employeeIdentification',
  2: 'name',
  3: 'companyId',
  4: 'contractTypeId',
  5: 'contractStatusId',
  6: 'startDate',
  7: 'endDate',
  8: 'active',
  9: 'createdAt',
}

const CONTRACTS_SORTABLE_COLUMNS = Object.keys(CONTRACTS_SORT_BY_COLUMN).map((index) => Number(index))

export default function ContractsDashboardPage() {
  const navigate = useNavigate()
  const contractsRows = useStoreContracts((s) => s.contractsRows) as ContractTableRow[]
  const pagination = useStoreContracts((s) => s.pagination)
  const queryParams = useStoreContracts((s) => s.queryParams)
  const loadingContracts = useStoreContracts((s) => s.loadingContracts)
  const loadingToggleStatus = useStoreContracts((s) => s.loadingToggleStatus)
  const errorMessage = useStoreContracts((s) => s.errorMessage)
  const getContracts = useStoreContracts((s) => s.getContracts)
  const sortContracts = useStoreContracts((s) => s.sortContracts)
  const mutationToggleContractStatus = useStoreContracts((s) => s.mutationToggleContractStatus)
  const goToPage = useStoreContracts((s) => s.goToPage)
  const clearStatus = useStoreContracts((s) => s.clearStatus)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canToggleContractStatus = hasPermission('CONTRACT', 'canUpdate')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [openActionsRowId, setOpenActionsRowId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<ContractTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)
  const { actionViewDetail, actionUpdateContract, actionToggleStatus } = createContractsActions()

  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const activeSortColumn = CONTRACTS_SORTABLE_COLUMNS.find((index) => CONTRACTS_SORT_BY_COLUMN[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  useEffect(() => {
    void getContracts()
  }, [getContracts])

  useEffect(() => {
    const closeActions = () => setOpenActionsRowId(null)
    window.addEventListener('click', closeActions)
    return () => window.removeEventListener('click', closeActions)
  }, [])

  const handleViewDetail = (row: ContractTableRow) => {
    setActionsMessage(`${row.values[CONTRACT_NAME_COLUMN_INDEX]}: ${messages.contracts.ui.viewDetailComingSoon}`)
    setOpenActionsRowId(null)
  }

  const handleUpdateContract = (row: ContractTableRow) => {
    navigate(`${AUTH_ROUTE_CONTRACTS_EDIT}=${row.id}`)
    setOpenActionsRowId(null)
  }

  const handleToggleStatus = (row: ContractTableRow) => {
    setPendingToggleRow(row)
    setConfirmOpen(true)
    setOpenActionsRowId(null)
  }

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

  const handleCloseConfirm = () => {
    if (loadingToggleStatus) return
    setConfirmOpen(false)
    setPendingToggleRow(null)
  }

  const handleConfirmToggleStatus = async () => {
    if (!pendingToggleRow || loadingToggleStatus) return
    const nextStatus = !pendingToggleRow.active
    const success = await mutationToggleContractStatus(pendingToggleRow.id, nextStatus)
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

  const handleSearchSubmit = async () => {
    await getContracts()
  }

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = CONTRACTS_SORT_BY_COLUMN[columnIndex]
    if (!sortBy) return

    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === 'asc' ? 'desc' : 'asc'

    await sortContracts(sortBy, nextSortDir)
  }

  const handleDownloadReport = () => {
    if (downloadingReport) return
    setDownloadingReport(true)
    setActionsMessage('Descarga de reporte de contratos disponible proximamente.')
    setDownloadingReport(false)
  }

  const handleBulkUpload = () => {
    setActionsMessage('Carga masiva de contratos disponible proximamente.')
  }

  const renderCell = (row: TableRow, value: ReactNode, columnIndex: number, rowIndex: number) => {
    const contractRow = row as ContractTableRow
    if (columnIndex === CONTRACT_TYPE_COLUMN_INDEX) {
      const contractType = typeof value === 'string' ? value : String(value ?? '')
      return <ContractTypeBadgeComponent contractType={contractType} />
    }
    if (columnIndex === CONTRACT_STATUS_COLUMN_INDEX) {
      const contractStatus = typeof value === 'string' ? value : String(value ?? '')
      return <ContractStatusBadgeComponent contractStatus={contractStatus} />
    }
    if (columnIndex === CONTRACT_ACTIVE_COLUMN_INDEX) {
      return <StatusBadgeComponent enabled={contractRow.active === true} />
    }
    if (columnIndex === ACTIONS_COLUMN_INDEX) {
      const openDirection = contractsRows.length > 2 && rowIndex >= contractsRows.length - 2 ? 'up' : 'down'
      return (
        <ActionsDropdownComponent
          open={openActionsRowId === row.id}
          actions={resolveRowActions(contractRow)}
          openDirection={openDirection}
          onToggle={() => setOpenActionsRowId((id) => (id === row.id ? null : row.id))}
        />
      )
    }
    return <span>{value}</span>
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

      {errorMessage && (
        <AlertMessageComponent
          message={errorMessage}
          tone="error"
          onClose={clearStatus}
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
        renderCell={renderCell}
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
