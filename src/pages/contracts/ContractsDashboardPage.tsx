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
  StatsOverviewCardsComponent,
  StatusBadgeComponent,
  TableComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AUTH_ROUTE_CONTRACTS_CREATE } from '@/constant'
import { contractsTableColumns } from '@/factories'
import { useStoreContracts } from '@/store'
import type { ContractTableRow, TableRow } from '@/types'
import { createContractsActions } from '@/utils'
import type { DropdownAction } from '@/utils'
import messages from '@/messages/messages'

const CONTRACT_ACTIVE_COLUMN_INDEX = 6
const CONTRACT_TYPE_COLUMN_INDEX = 2
const CONTRACT_STATUS_COLUMN_INDEX = 3
const CONTRACT_NAME_COLUMN_INDEX = 0
const ACTIONS_COLUMN_INDEX = contractsTableColumns.length - 1

export default function ContractsDashboardPage() {
  const navigate = useNavigate()
  const contractsRows = useStoreContracts((s) => s.contractsRows) as ContractTableRow[]
  const pagination = useStoreContracts((s) => s.pagination)
  const loadingContracts = useStoreContracts((s) => s.loadingContracts)
  const errorMessage = useStoreContracts((s) => s.errorMessage)
  const getContracts = useStoreContracts((s) => s.getContracts)
  const goToPage = useStoreContracts((s) => s.goToPage)
  const clearStatus = useStoreContracts((s) => s.clearStatus)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [openActionsRowId, setOpenActionsRowId] = useState<string | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)
  const { actionViewDetail, actionUpdateContract, actionToggleStatus } = createContractsActions()

  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size

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
    setActionsMessage(`${row.values[CONTRACT_NAME_COLUMN_INDEX]}: ${messages.contracts.ui.updateContractComingSoon}`)
    setOpenActionsRowId(null)
  }

  const handleToggleStatus = (row: ContractTableRow) => {
    setActionsMessage(`${row.values[CONTRACT_NAME_COLUMN_INDEX]}: ${messages.contracts.ui.toggleStatusComingSoon}`)
    setOpenActionsRowId(null)
  }

  const resolveRowActions = (row: ContractTableRow): DropdownAction[] => [
    actionViewDetail(() => handleViewDetail(row)),
    actionUpdateContract(() => handleUpdateContract(row)),
    actionToggleStatus(row.active === true, () => handleToggleStatus(row)),
  ]

  const handleSearchSubmit = async () => {
    await getContracts()
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
    </section>
  )
}
