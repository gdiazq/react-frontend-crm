import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  ContractDetailComponent,
  DetailSidebarComponent,
  InputComponent,
  PaginationComponent,
  RightSidebarComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  TableComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AUTH_ROUTE_CONTRACTS_CREATE, AUTH_ROUTE_CONTRACTS_EDIT } from '@/constant'
import { contractsTableColumns, contractsTableColumnIndex, contractsTableSortByColumn } from '@/factories'
import { mapperContractDetailView } from '@/mappers'
import { contractsService } from '@/services'
import { useStoreContractSelects, useStoreContracts, useStoreEmployeeSelects } from '@/store'
import type { ContractTableRow, TableRow, TableSortState } from '@/types'
import { createContractsActions, createContractsTableCustomRenderer, downloadBlobFile, formatCsvImportSummary } from '@/utils'
import type { DropdownAction } from '@/utils'

const CONTRACT_EMPLOYEE_NAME_COLUMN_INDEX = contractsTableColumnIndex.employeeName
const CONTRACT_TYPE_COLUMN_INDEX = contractsTableColumnIndex.contractType
const CONTRACT_STATUS_COLUMN_INDEX = contractsTableColumnIndex.contractStatus
const CONTRACT_NAME_COLUMN_INDEX = contractsTableColumnIndex.name
const ACTIONS_COLUMN_INDEX = contractsTableColumns.length - 1
const CONTRACTS_SORTABLE_COLUMNS = Object.keys(contractsTableSortByColumn).map((index) => Number(index))

export default function ContractsDashboardPage() {
  // --- Store ---
  const navigate = useNavigate()
  const contractsRows = useStoreContracts((s) => s.contractsRows)
  const contractDetail = useStoreContracts((s) => s.contractDetail)
  const pagination = useStoreContracts((s) => s.pagination)
  const queryParams = useStoreContracts((s) => s.queryParams)
  const loadingContracts = useStoreContracts((s) => s.loadingContracts)
  const loadingContractDetail = useStoreContracts((s) => s.loadingContractDetail)
  const listError = useStoreContracts((s) => s.operationStatus.list.error)
  const detailError = useStoreContracts((s) => s.operationStatus.detail.error)
  const clearOperationStatus = useStoreContracts((s) => s.clearOperationStatus)
  const getContracts = useStoreContracts((s) => s.getContracts)
  const getContractDetail = useStoreContracts((s) => s.getContractDetail)
  const clearContractDetail = useStoreContracts((s) => s.clearContractDetail)
  const sortContracts = useStoreContracts((s) => s.sortContracts)
  const goToPage = useStoreContracts((s) => s.goToPage)
  const setSearch = useStoreContracts((s) => s.setSearch)
  const setStatusFilter = useStoreContracts((s) => s.setStatusFilter)
  const setContractStatusFilter = useStoreContracts((s) => s.setContractStatusFilter)
  const setContractTypeFilter = useStoreContracts((s) => s.setContractTypeFilter)
  const setCreatedDateRange = useStoreContracts((s) => s.setCreatedDateRange)
  const setStartDateRange = useStoreContracts((s) => s.setStartDateRange)
  const setEndDateRange = useStoreContracts((s) => s.setEndDateRange)
  const setUpdatedDateRange = useStoreContracts((s) => s.setUpdatedDateRange)
  const clearStatusFilter = useStoreContracts((s) => s.clearStatusFilter)
  const clearContractStatusFilter = useStoreContracts((s) => s.clearContractStatusFilter)
  const clearContractTypeFilter = useStoreContracts((s) => s.clearContractTypeFilter)
  const clearCreatedDateRange = useStoreContracts((s) => s.clearCreatedDateRange)
  const clearStartDateRange = useStoreContracts((s) => s.clearStartDateRange)
  const clearEndDateRange = useStoreContracts((s) => s.clearEndDateRange)
  const clearUpdatedDateRange = useStoreContracts((s) => s.clearUpdatedDateRange)
  const searchContracts = useStoreContracts((s) => s.searchContracts)

  const contractTypeFilterOptions = useStoreContractSelects((s) => s.contractTypeFilterOptions)
  const contractStatusFilterOptions = useStoreContractSelects((s) => s.contractStatusFilterOptions)
  const loadingContractFilterOptions = useStoreContractSelects((s) => s.loadingContractFilterOptions)
  const contractFilterOptionsErrorMessage = useStoreContractSelects((s) => s.contractFilterOptionsErrorMessage)
  const getContractFilterOptions = useStoreContractSelects((s) => s.getContractFilterOptions)
  const clearContractFilterOptionsStatus = useStoreContractSelects((s) => s.clearContractFilterOptionsStatus)

  const approvalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptions)
  const loadingApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.loadingApprovalEmployeeStatusOptions)
  const approvalEmployeeStatusOptionsErrorMessage = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptionsErrorMessage)
  const getApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.getApprovalEmployeeStatusOptions)
  const clearApprovalEmployeeStatusOptionsStatus = useStoreEmployeeSelects((s) => s.clearApprovalEmployeeStatusOptionsStatus)

  const { actionViewDetail, actionUpdateContract } = createContractsActions()

  // --- State ---
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState(() => ({
    statusId: queryParams.statusId,
    contractStatusId: queryParams.contractStatusId,
    contractTypeId: queryParams.contractTypeId,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
    startDateFrom: queryParams.startDateFrom,
    startDateTo: queryParams.startDateTo,
    endDateFrom: queryParams.endDateFrom,
    endDateTo: queryParams.endDateTo,
    updatedFrom: queryParams.updatedFrom,
    updatedTo: queryParams.updatedTo,
  }))
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [selectedDetailName, setSelectedDetailName] = useState('')
  const [actionsMessage, setActionsMessage] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [uploadingBulk, setUploadingBulk] = useState(false)
  const bulkUploadInputRef = useRef<HTMLInputElement | null>(null)

  // --- Derived ---
  const contractDetailView = mapperContractDetailView(contractDetail)
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const activeSortColumn = CONTRACTS_SORTABLE_COLUMNS.find((index) => contractsTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }
  const statusSelectOptions = approvalEmployeeStatusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const contractStatusSelectOptions = contractStatusFilterOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const contractTypeSelectOptions = contractTypeFilterOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const detailTitle = contractDetailView
    ? `Detalle de ${contractDetailView.contractName}`
    : selectedDetailName
      ? `Detalle de ${selectedDetailName}`
      : 'Detalle de contrato'

  // --- Effects ---
  useEffect(() => {
    void getContracts()
    void getContractFilterOptions()
    void getApprovalEmployeeStatusOptions()
  }, [getContracts, getContractFilterOptions, getApprovalEmployeeStatusOptions])

  useEffect(() => {
    setFilters({
      statusId: queryParams.statusId,
      contractStatusId: queryParams.contractStatusId,
      contractTypeId: queryParams.contractTypeId,
      createdFrom: queryParams.createdFrom,
      createdTo: queryParams.createdTo,
      startDateFrom: queryParams.startDateFrom,
      startDateTo: queryParams.startDateTo,
      endDateFrom: queryParams.endDateFrom,
      endDateTo: queryParams.endDateTo,
      updatedFrom: queryParams.updatedFrom,
      updatedTo: queryParams.updatedTo,
    })
  }, [
    queryParams.statusId,
    queryParams.contractStatusId,
    queryParams.contractTypeId,
    queryParams.createdFrom,
    queryParams.createdTo,
    queryParams.startDateFrom,
    queryParams.startDateTo,
    queryParams.endDateFrom,
    queryParams.endDateTo,
    queryParams.updatedFrom,
    queryParams.updatedTo,
  ])

  // --- Handlers: Detail ---
  const handleViewDetail = (row: ContractTableRow) => {
    setSelectedDetailRowId(row.id)
    setSelectedDetailName(String(row.values[CONTRACT_NAME_COLUMN_INDEX] ?? 'Contrato'))
    setDetailOpen(true)
    void getContractDetail(row.id)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
    setSelectedDetailName('')
    clearContractDetail()
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getContractDetail(selectedDetailRowId)
  }

  // --- Handlers: Navigate ---
  const handleUpdateContract = (row: ContractTableRow) => {
    navigate(`${AUTH_ROUTE_CONTRACTS_EDIT}=${row.id}`)
  }

  // --- Row actions & table helpers ---
  const resolveRowActions = (row: ContractTableRow): DropdownAction[] => {
    return [
      actionViewDetail(() => handleViewDetail(row)),
      actionUpdateContract(() => handleUpdateContract(row)),
    ]
  }

  const findContractRowById = (rowId: string) => contractsRows.find((row) => row.id === rowId) ?? null
  const handleViewDetailById = (rowId: string) => {
    const contractRow = findContractRowById(rowId)
    if (!contractRow) return
    handleViewDetail(contractRow)
  }
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const contractRow = findContractRowById(tableRow.id)
    if (!contractRow) return []
    return resolveRowActions(contractRow)
  }

  const renderCustomCell = createContractsTableCustomRenderer({
    employeeNameColumnIndex: CONTRACT_EMPLOYEE_NAME_COLUMN_INDEX,
    contractTypeColumnIndex: CONTRACT_TYPE_COLUMN_INDEX,
    contractStatusColumnIndex: CONTRACT_STATUS_COLUMN_INDEX,
    onViewDetail: handleViewDetailById,
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
    await searchContracts()
  }

  // --- Handlers: Filters ---
  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }
  const handleStatusFilterChange = (value: string) => handleChangeFilter('statusId', value)
  const handleContractStatusFilterChange = (value: string) => handleChangeFilter('contractStatusId', value)
  const handleContractTypeFilterChange = (value: string) => handleChangeFilter('contractTypeId', value)
  const handleCreatedFromFilterChange = (value: string) => handleChangeFilter('createdFrom', value)
  const handleCreatedToFilterChange = (value: string) => handleChangeFilter('createdTo', value)
  const handleStartDateFromFilterChange = (value: string) => handleChangeFilter('startDateFrom', value)
  const handleStartDateToFilterChange = (value: string) => handleChangeFilter('startDateTo', value)
  const handleEndDateFromFilterChange = (value: string) => handleChangeFilter('endDateFrom', value)
  const handleEndDateToFilterChange = (value: string) => handleChangeFilter('endDateTo', value)
  const handleUpdatedFromFilterChange = (value: string) => handleChangeFilter('updatedFrom', value)
  const handleUpdatedToFilterChange = (value: string) => handleChangeFilter('updatedTo', value)

  const handleApplyFilters = async () => {
    const selectedStatus = approvalEmployeeStatusOptions.find((option) => String(option.id) === filters.statusId)
    const selectedContractStatus = contractStatusFilterOptions.find((option) => String(option.id) === filters.contractStatusId)
    const selectedContractType = contractTypeFilterOptions.find((option) => String(option.id) === filters.contractTypeId)

    setStatusFilter(selectedStatus ? String(selectedStatus.id) : '')
    setContractStatusFilter(selectedContractStatus ? String(selectedContractStatus.id) : '')
    setContractTypeFilter(selectedContractType ? String(selectedContractType.id) : '')
    setCreatedDateRange({
      createdFrom: filters.createdFrom.trim(),
      createdTo: filters.createdTo.trim(),
    })
    setStartDateRange({
      startDateFrom: filters.startDateFrom.trim(),
      startDateTo: filters.startDateTo.trim(),
    })
    setEndDateRange({
      endDateFrom: filters.endDateFrom.trim(),
      endDateTo: filters.endDateTo.trim(),
    })
    setUpdatedDateRange({
      updatedFrom: filters.updatedFrom.trim(),
      updatedTo: filters.updatedTo.trim(),
    })
    await searchContracts()
    setFiltersOpen(false)
  }

  const handleClearFilters = async () => {
    setFilters({
      statusId: '',
      contractStatusId: '',
      contractTypeId: '',
      createdFrom: '',
      createdTo: '',
      startDateFrom: '',
      startDateTo: '',
      endDateFrom: '',
      endDateTo: '',
      updatedFrom: '',
      updatedTo: '',
    })
    clearStatusFilter()
    clearContractStatusFilter()
    clearContractTypeFilter()
    clearCreatedDateRange()
    clearStartDateRange()
    clearEndDateRange()
    clearUpdatedDateRange()
    await searchContracts()
    setFiltersOpen(false)
  }

  // --- Handlers: Download & Upload ---
  const handleDownloadReport = async () => {
    if (downloadingReport) return

    try {
      setDownloadingReport(true)
      const csvBlob = await contractsService.exportContractsCsv()
      downloadBlobFile(csvBlob, 'contracts.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch (error) {
      if (contractsService.isAxiosError(error)) {
        setActionsMessage(error.response?.data?.message || 'No se pudo descargar el reporte.')
      } else {
        setActionsMessage('No se pudo descargar el reporte.')
      }
    } finally {
      setDownloadingReport(false)
    }
  }

  const handleBulkUpload = () => {
    if (uploadingBulk) return
    bulkUploadInputRef.current?.click()
  }

  const handleBulkUploadFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || uploadingBulk) return

    try {
      setUploadingBulk(true)
      const result = await contractsService.importContractsCsv(file)
      setActionsMessage(formatCsvImportSummary(result))
      await getContracts()
    } catch (error) {
      if (contractsService.isAxiosError(error)) {
        setActionsMessage(error.response?.data?.message || 'No se pudo realizar la carga masiva.')
      } else {
        setActionsMessage('No se pudo realizar la carga masiva.')
      }
    } finally {
      setUploadingBulk(false)
    }
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

      {listError && (
        <AlertMessageComponent
          message={listError}
          tone="error"
          onClose={() => clearOperationStatus('list')}
        />
      )}

      {contractFilterOptionsErrorMessage && (
        <AlertMessageComponent
          message={contractFilterOptionsErrorMessage}
          tone="error"
          onClose={clearContractFilterOptionsStatus}
        />
      )}

      {approvalEmployeeStatusOptionsErrorMessage && (
        <AlertMessageComponent
          message={approvalEmployeeStatusOptionsErrorMessage}
          tone="error"
          onClose={clearApprovalEmployeeStatusOptionsStatus}
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
              value={queryParams.search}
              type="text"
              placeholder="Buscar por nombre trabajador"
              onValueChange={setSearch}
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
            disabled={loadingContracts || downloadingReport || uploadingBulk}
            onDownloadReport={() => { void handleDownloadReport() }}
            onBulkUpload={handleBulkUpload}
          />
        </div>
      </form>

      <input
        ref={bulkUploadInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(event) => { void handleBulkUploadFileChange(event) }}
      />

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
          <SelectComponent
            value={filters.statusId}
            label="Estado de aprobacion"
            options={statusSelectOptions}
            loading={loadingApprovalEmployeeStatusOptions}
            onValueChange={handleStatusFilterChange}
          />
          <SelectComponent
            value={filters.contractStatusId}
            label="Estado contrato"
            options={contractStatusSelectOptions}
            loading={loadingContractFilterOptions}
            onValueChange={handleContractStatusFilterChange}
          />
          <SelectComponent
            value={filters.contractTypeId}
            label="Tipo contrato"
            options={contractTypeSelectOptions}
            loading={loadingContractFilterOptions}
            onValueChange={handleContractTypeFilterChange}
          />
          <div className="space-y-3 rounded-xl border border-cyan-500/35 bg-cyan-50/20 p-3 dark:border-cyan-400/25 dark:bg-cyan-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
              Fecha inicio contrato
            </p>
            <div className="grid gap-2">
              <InputComponent
                id="contracts-start-date-from"
                value={filters.startDateFrom}
                label="Desde"
                type="date"
                aria-label="Fecha inicio contrato desde"
                onValueChange={handleStartDateFromFilterChange}
              />
              <InputComponent
                id="contracts-start-date-to"
                value={filters.startDateTo}
                label="Hasta"
                type="date"
                aria-label="Fecha inicio contrato hasta"
                onValueChange={handleStartDateToFilterChange}
              />
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-fuchsia-500/35 bg-fuchsia-50/15 p-3 dark:border-fuchsia-400/25 dark:bg-fuchsia-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-700 dark:text-fuchsia-300">
              Fecha fin contrato
            </p>
            <div className="grid gap-2">
              <InputComponent
                id="contracts-end-date-from"
                value={filters.endDateFrom}
                label="Desde"
                type="date"
                aria-label="Fecha fin contrato desde"
                onValueChange={handleEndDateFromFilterChange}
              />
              <InputComponent
                id="contracts-end-date-to"
                value={filters.endDateTo}
                label="Hasta"
                type="date"
                aria-label="Fecha fin contrato hasta"
                onValueChange={handleEndDateToFilterChange}
              />
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-emerald-500/35 bg-emerald-50/20 p-3 dark:border-emerald-400/25 dark:bg-emerald-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Fecha creacion
            </p>
            <div className="grid gap-2">
              <InputComponent
                id="contracts-created-from"
                value={filters.createdFrom}
                label="Desde"
                type="date"
                aria-label="Fecha creacion desde"
                onValueChange={handleCreatedFromFilterChange}
              />
              <InputComponent
                id="contracts-created-to"
                value={filters.createdTo}
                label="Hasta"
                type="date"
                aria-label="Fecha creacion hasta"
                onValueChange={handleCreatedToFilterChange}
              />
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-amber-500/35 bg-amber-50/15 p-3 dark:border-amber-400/25 dark:bg-amber-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
              Fecha actualizacion
            </p>
            <div className="grid gap-2">
              <InputComponent
                id="contracts-updated-from"
                value={filters.updatedFrom}
                label="Desde"
                type="date"
                aria-label="Fecha actualizacion desde"
                onValueChange={handleUpdatedFromFilterChange}
              />
              <InputComponent
                id="contracts-updated-to"
                value={filters.updatedTo}
                label="Hasta"
                type="date"
                aria-label="Fecha actualizacion hasta"
                onValueChange={handleUpdatedToFilterChange}
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <ButtonComponent
              type="button"
              variant="outline"
              disabled={loadingContracts || loadingContractFilterOptions || loadingApprovalEmployeeStatusOptions}
              label="Limpiar"
              onClick={() => { void handleClearFilters() }}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loadingContracts || loadingContractFilterOptions || loadingApprovalEmployeeStatusOptions}
              className="text-white dark:text-white"
              label={loadingContractFilterOptions || loadingApprovalEmployeeStatusOptions ? 'Aplicando...' : 'Aplicar'}
              onClick={() => { void handleApplyFilters() }}
            />
          </div>
        </div>
      </RightSidebarComponent>

      <DetailSidebarComponent
        open={detailOpen}
        title={detailTitle}
        onClose={handleCloseDetail}
      >
        <ContractDetailComponent
          key={selectedDetailRowId ?? 'empty-contract-detail'}
          detail={contractDetailView}
          loading={loadingContractDetail}
          errorMessage={detailError}
          onRetry={handleRetryDetail}
        />
      </DetailSidebarComponent>
    </section>
  )
}
