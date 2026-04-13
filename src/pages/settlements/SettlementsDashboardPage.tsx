import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DetailSidebarComponent,
  InputComponent,
  PaginationComponent,
  RightSidebarComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  TableComponent,
  SettlementDetailComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import {
  settlementTableColumns,
  settlementTableColumnIndex,
  settlementTableSortByColumn,
} from '@/factories'
import { mapperSettlementDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { settlementService } from '@/services'
import { useStoreEmployeeSelects, useStoreSettlement, useStoreSettlementSelects } from '@/store'
import type { SettlementTableRow, TableRow, TableSortState } from '@/types'
import {
  createSettlementActions,
  createSettlementTableCustomRenderer,
  downloadBlobFile,
} from '@/utils'
import type { DropdownAction } from '@/utils'
import { AUTH_ROUTE_SETTLEMENTS_CREATE, AUTH_ROUTE_SETTLEMENTS_EDIT } from '@/constant'

const EMPLOYEE_NAME_COLUMN_INDEX = settlementTableColumnIndex.employeeName
const STATUS_COLUMN_INDEX = settlementTableColumnIndex.status
const REHIRE_COLUMN_INDEX = settlementTableColumnIndex.rehire
const ACTIONS_COLUMN_INDEX = settlementTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(settlementTableSortByColumn).map((index) => Number(index))

const REHIRE_ELIGIBLE_OPTIONS = [
  { label: 'Si', value: 'true' },
  { label: 'No', value: 'false' },
]

export default function SettlementsDashboardPage() {
  const navigate = useNavigate()
  const settlementRows = useStoreSettlement((s) => s.settlementRows)
  const settlementDetail = useStoreSettlement((s) => s.settlementDetail)
  const pagination = useStoreSettlement((s) => s.pagination)
  const queryParams = useStoreSettlement((s) => s.queryParams)
  const loadingSettlements = useStoreSettlement((s) => s.loadingSettlements)
  const loadingSettlementDetail = useStoreSettlement((s) => s.loadingSettlementDetail)
  const listError = useStoreSettlement((s) => s.operationStatus.list.error)
  const detailError = useStoreSettlement((s) => s.operationStatus.detail.error)
  const clearOperationStatus = useStoreSettlement((s) => s.clearOperationStatus)
  const getSettlements = useStoreSettlement((s) => s.getSettlements)
  const getSettlementDetail = useStoreSettlement((s) => s.getSettlementDetail)
  const goToPage = useStoreSettlement((s) => s.goToPage)
  const setSearch = useStoreSettlement((s) => s.setSearch)
  const searchSettlements = useStoreSettlement((s) => s.searchSettlements)
  const sortSettlements = useStoreSettlement((s) => s.sortSettlements)
  const setStatusFilter = useStoreSettlement((s) => s.setStatusFilter)
  const setLegalTerminationCauseIdFilter = useStoreSettlement((s) => s.setLegalTerminationCauseIdFilter)
  const setQualityOfWorkIdFilter = useStoreSettlement((s) => s.setQualityOfWorkIdFilter)
  const setSafetyComplianceIdFilter = useStoreSettlement((s) => s.setSafetyComplianceIdFilter)
  const setNoReHiredCauseIdFilter = useStoreSettlement((s) => s.setNoReHiredCauseIdFilter)
  const setRehireEligibleFilter = useStoreSettlement((s) => s.setRehireEligibleFilter)
  const setEndDateRange = useStoreSettlement((s) => s.setEndDateRange)
  const setCreatedDateRange = useStoreSettlement((s) => s.setCreatedDateRange)
  const clearStatusFilter = useStoreSettlement((s) => s.clearStatusFilter)
  const clearLegalTerminationCauseIdFilter = useStoreSettlement((s) => s.clearLegalTerminationCauseIdFilter)
  const clearQualityOfWorkIdFilter = useStoreSettlement((s) => s.clearQualityOfWorkIdFilter)
  const clearSafetyComplianceIdFilter = useStoreSettlement((s) => s.clearSafetyComplianceIdFilter)
  const clearNoReHiredCauseIdFilter = useStoreSettlement((s) => s.clearNoReHiredCauseIdFilter)
  const clearRehireEligibleFilter = useStoreSettlement((s) => s.clearRehireEligibleFilter)
  const clearEndDateRange = useStoreSettlement((s) => s.clearEndDateRange)
  const clearCreatedDateRange = useStoreSettlement((s) => s.clearCreatedDateRange)
  const clearSettlementDetail = useStoreSettlement((s) => s.clearSettlementDetail)

  const approvalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptions)
  const loadingApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.loadingApprovalEmployeeStatusOptions)
  const approvalEmployeeStatusOptionsErrorMessage = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptionsErrorMessage)
  const getApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.getApprovalEmployeeStatusOptions)
  const clearApprovalEmployeeStatusOptionsStatus = useStoreEmployeeSelects((s) => s.clearApprovalEmployeeStatusOptionsStatus)

  const legalTerminationCauseFilterOptions = useStoreSettlementSelects((s) => s.legalTerminationCauseFilterOptions)
  const qualityOfWorkFilterOptions = useStoreSettlementSelects((s) => s.qualityOfWorkFilterOptions)
  const safetyComplianceFilterOptions = useStoreSettlementSelects((s) => s.safetyComplianceFilterOptions)
  const noRehireCauseFilterOptions = useStoreSettlementSelects((s) => s.noRehireCauseFilterOptions)
  const loadingFilterOptions = useStoreSettlementSelects((s) => s.loadingFilterOptions)
  const filterOptionsErrorMessage = useStoreSettlementSelects((s) => s.filterOptionsErrorMessage)
  const getFilterOptions = useStoreSettlementSelects((s) => s.getFilterOptions)
  const clearFilterOptionsStatus = useStoreSettlementSelects((s) => s.clearFilterOptionsStatus)

  const { actionViewDetail, actionEdit } = createSettlementActions()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState(() => ({
    statusId: queryParams.statusId,
    legalTerminationCauseId: queryParams.legalTerminationCauseId,
    qualityOfWorkId: queryParams.qualityOfWorkId,
    safetyComplianceId: queryParams.safetyComplianceId,
    noReHiredCauseId: queryParams.noReHiredCauseId,
    rehireEligible: queryParams.rehireEligible,
    endDateFrom: queryParams.endDateFrom,
    endDateTo: queryParams.endDateTo,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
  }))
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [selectedDetailName, setSelectedDetailName] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [actionsMessage, setActionsMessage] = useState('')

  const settlementDetailView = mapperSettlementDetailView(settlementDetail)
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const statusSelectOptions = approvalEmployeeStatusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const legalCauseSelectOptions = legalTerminationCauseFilterOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const qualityOfWorkSelectOptions = qualityOfWorkFilterOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const safetyComplianceSelectOptions = safetyComplianceFilterOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const noRehireCauseSelectOptions = noRehireCauseFilterOptions.map((option) => ({ label: option.name, value: String(option.id) }))

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => settlementTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }
  const detailTitle = settlementDetailView
    ? `Detalle de ${settlementDetailView.employeeFullNameDisplay}`
    : selectedDetailName
      ? `Detalle de ${selectedDetailName}`
      : messages.settlement.ui.detailTitleFallback

  useEffect(() => {
    void getSettlements()
    void getApprovalEmployeeStatusOptions()
    void getFilterOptions()
  }, [getSettlements, getApprovalEmployeeStatusOptions, getFilterOptions])

  useEffect(() => {
    setFilters({
      statusId: queryParams.statusId,
      legalTerminationCauseId: queryParams.legalTerminationCauseId,
      qualityOfWorkId: queryParams.qualityOfWorkId,
      safetyComplianceId: queryParams.safetyComplianceId,
      noReHiredCauseId: queryParams.noReHiredCauseId,
      rehireEligible: queryParams.rehireEligible,
      endDateFrom: queryParams.endDateFrom,
      endDateTo: queryParams.endDateTo,
      createdFrom: queryParams.createdFrom,
      createdTo: queryParams.createdTo,
    })
  }, [
    queryParams.statusId,
    queryParams.legalTerminationCauseId,
    queryParams.qualityOfWorkId,
    queryParams.safetyComplianceId,
    queryParams.noReHiredCauseId,
    queryParams.rehireEligible,
    queryParams.endDateFrom,
    queryParams.endDateTo,
    queryParams.createdFrom,
    queryParams.createdTo,
  ])

  const handleViewDetail = (row: SettlementTableRow) => {
    setSelectedDetailRowId(row.id)
    setSelectedDetailName(String(row.values[EMPLOYEE_NAME_COLUMN_INDEX] ?? ''))
    setDetailOpen(true)
    void getSettlementDetail(row.id)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
    setSelectedDetailName('')
    clearSettlementDetail()
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getSettlementDetail(selectedDetailRowId)
  }

  const resolveRowActions = (row: SettlementTableRow): DropdownAction[] => {
    return [
      actionViewDetail(() => handleViewDetail(row)),
      actionEdit(() => navigate(`${AUTH_ROUTE_SETTLEMENTS_EDIT}=${row.id}`)),
    ]
  }

  const findRowById = (rowId: string) => settlementRows.find((row) => row.id === rowId) ?? null

  const handleViewDetailById = (rowId: string) => {
    const row = findRowById(rowId)
    if (!row) return
    handleViewDetail(row)
  }

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = findRowById(tableRow.id)
    if (!row) return []
    return resolveRowActions(row)
  }

  const renderCustomCell = createSettlementTableCustomRenderer({
    employeeNameColumnIndex: EMPLOYEE_NAME_COLUMN_INDEX,
    statusColumnIndex: STATUS_COLUMN_INDEX,
    rehireColumnIndex: REHIRE_COLUMN_INDEX,
    onViewDetail: handleViewDetailById,
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = settlementTableSortByColumn[columnIndex]
    if (!sortBy) return
    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === 'asc' ? 'desc' : 'asc'
    await sortSettlements(sortBy, nextSortDir)
  }

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }
  const handleStatusFilterChange = (value: string) => handleChangeFilter('statusId', value)
  const handleLegalCauseIdFilterChange = (value: string) => handleChangeFilter('legalTerminationCauseId', value)
  const handleQualityOfWorkIdFilterChange = (value: string) => handleChangeFilter('qualityOfWorkId', value)
  const handleSafetyComplianceIdFilterChange = (value: string) => handleChangeFilter('safetyComplianceId', value)
  const handleNoReHiredCauseIdFilterChange = (value: string) => handleChangeFilter('noReHiredCauseId', value)
  const handleRehireEligibleFilterChange = (value: string) => handleChangeFilter('rehireEligible', value)
  const handleEndDateFromFilterChange = (value: string) => handleChangeFilter('endDateFrom', value)
  const handleEndDateToFilterChange = (value: string) => handleChangeFilter('endDateTo', value)
  const handleCreatedFromFilterChange = (value: string) => handleChangeFilter('createdFrom', value)
  const handleCreatedToFilterChange = (value: string) => handleChangeFilter('createdTo', value)

  const handleApplyFilters = async () => {
    const selectedStatus = approvalEmployeeStatusOptions.find((option) => String(option.id) === filters.statusId)
    const selectedLegalCause = legalTerminationCauseFilterOptions.find((option) => String(option.id) === filters.legalTerminationCauseId)
    const selectedQualityOfWork = qualityOfWorkFilterOptions.find((option) => String(option.id) === filters.qualityOfWorkId)
    const selectedSafetyCompliance = safetyComplianceFilterOptions.find((option) => String(option.id) === filters.safetyComplianceId)
    const selectedNoReHiredCause = noRehireCauseFilterOptions.find((option) => String(option.id) === filters.noReHiredCauseId)
    setStatusFilter(selectedStatus ? String(selectedStatus.id) : '')
    setLegalTerminationCauseIdFilter(selectedLegalCause ? String(selectedLegalCause.id) : '')
    setQualityOfWorkIdFilter(selectedQualityOfWork ? String(selectedQualityOfWork.id) : '')
    setSafetyComplianceIdFilter(selectedSafetyCompliance ? String(selectedSafetyCompliance.id) : '')
    setNoReHiredCauseIdFilter(selectedNoReHiredCause ? String(selectedNoReHiredCause.id) : '')
    setRehireEligibleFilter(filters.rehireEligible)
    setEndDateRange({ endDateFrom: filters.endDateFrom.trim(), endDateTo: filters.endDateTo.trim() })
    setCreatedDateRange({ createdFrom: filters.createdFrom.trim(), createdTo: filters.createdTo.trim() })
    await searchSettlements()
    setFiltersOpen(false)
  }

  const handleClearFilters = async () => {
    setFilters({
      statusId: '',
      legalTerminationCauseId: '',
      qualityOfWorkId: '',
      safetyComplianceId: '',
      noReHiredCauseId: '',
      rehireEligible: '',
      endDateFrom: '',
      endDateTo: '',
      createdFrom: '',
      createdTo: '',
    })
    clearStatusFilter()
    clearLegalTerminationCauseIdFilter()
    clearQualityOfWorkIdFilter()
    clearSafetyComplianceIdFilter()
    clearNoReHiredCauseIdFilter()
    clearRehireEligibleFilter()
    clearEndDateRange()
    clearCreatedDateRange()
    await searchSettlements()
    setFiltersOpen(false)
  }

  const handleDownloadReport = async () => {
    if (downloadingReport) return

    try {
      setDownloadingReport(true)
      const csvBlob = await settlementService.exportSettlementsCsv()
      downloadBlobFile(csvBlob, 'settlements.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch (error) {
      if (settlementService.isAxiosError(error)) {
        setActionsMessage(error.response?.data?.message || 'No se pudo descargar el reporte.')
      } else {
        setActionsMessage('No se pudo descargar el reporte.')
      }
    } finally {
      setDownloadingReport(false)
    }
  }

  const handleBulkUpload = () => {
    setActionsMessage('Carga masiva no disponible para finiquitos.')
  }

  return (
    <section className="min-w-0 space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">Dashboard de finiquito</h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total acuerdos"
        activeLabel="Acuerdos activos"
        total={pagination.total}
        active={pagination.active}
      />

      {filterOptionsErrorMessage && (
        <AlertMessageComponent
          message={filterOptionsErrorMessage}
          tone="error"
          onClose={clearFilterOptionsStatus}
        />
      )}

      {approvalEmployeeStatusOptionsErrorMessage && (
        <AlertMessageComponent
          message={approvalEmployeeStatusOptionsErrorMessage}
          tone="error"
          onClose={clearApprovalEmployeeStatusOptionsStatus}
        />
      )}

      {listError && (
        <AlertMessageComponent
          message={listError}
          tone="error"
          onClose={() => clearOperationStatus('list')}
        />
      )}

      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => {
          event.preventDefault()
          void searchSettlements()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingSettlements}
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
            disabled={loadingSettlements}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingSettlements ? 'Buscando...' : 'Buscar'}
          />
          <ButtonComponent
            type="button"
            variant="primary"
            disabled={loadingSettlements}
            className="flex-1 text-white md:flex-none dark:text-white"
            label="Nuevo finiquito"
            onClick={() => navigate(AUTH_ROUTE_SETTLEMENTS_CREATE)}
          />
          <ToolbarActionsDropdownComponent
            disabled={loadingSettlements || downloadingReport}
            showBulkUpload={false}
            onDownloadReport={() => { void handleDownloadReport() }}
            onBulkUpload={handleBulkUpload}
          />
        </div>
      </form>

      <TableComponent
        columns={settlementTableColumns}
        rows={settlementRows}
        loading={loadingSettlements}
        emptyMessage="No hay acuerdos de termino registrados."
        customRenderer={renderCustomCell}
        actionsConfig={{
          columnIndex: ACTIONS_COLUMN_INDEX,
          resolveRowActions: resolveRowActionsFromTableRow,
        }}
        sortableColumnIndexes={SORTABLE_COLUMNS}
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
          loading={loadingSettlements}
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
            label="Estado"
            options={statusSelectOptions}
            loading={loadingApprovalEmployeeStatusOptions}
            onValueChange={handleStatusFilterChange}
          />
          <SelectComponent
            value={filters.rehireEligible}
            label="Recontratable"
            options={REHIRE_ELIGIBLE_OPTIONS}
            onValueChange={handleRehireEligibleFilterChange}
          />
          <SelectComponent
            value={filters.legalTerminationCauseId}
            label="Causa terminacion"
            options={legalCauseSelectOptions}
            loading={loadingFilterOptions}
            onValueChange={handleLegalCauseIdFilterChange}
          />
          <SelectComponent
            value={filters.qualityOfWorkId}
            label="Calidad del trabajo"
            options={qualityOfWorkSelectOptions}
            loading={loadingFilterOptions}
            onValueChange={handleQualityOfWorkIdFilterChange}
          />
          <SelectComponent
            value={filters.safetyComplianceId}
            label="Cumplimiento seguridad"
            options={safetyComplianceSelectOptions}
            loading={loadingFilterOptions}
            onValueChange={handleSafetyComplianceIdFilterChange}
          />
          <SelectComponent
            value={filters.noReHiredCauseId}
            label="Causa no recontrato"
            options={noRehireCauseSelectOptions}
            loading={loadingFilterOptions}
            onValueChange={handleNoReHiredCauseIdFilterChange}
          />
          <div className="space-y-3 rounded-xl border border-fuchsia-500/35 bg-fuchsia-50/15 p-3 dark:border-fuchsia-400/25 dark:bg-fuchsia-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-700 dark:text-fuchsia-300">
              Fecha fin
            </p>
            <div className="grid gap-2">
              <InputComponent
                id="termination-end-date-from"
                value={filters.endDateFrom}
                label="Desde"
                type="date"
                aria-label="Fecha fin desde"
                onValueChange={handleEndDateFromFilterChange}
              />
              <InputComponent
                id="termination-end-date-to"
                value={filters.endDateTo}
                label="Hasta"
                type="date"
                aria-label="Fecha fin hasta"
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
                id="termination-created-from"
                value={filters.createdFrom}
                label="Desde"
                type="date"
                aria-label="Fecha creacion desde"
                onValueChange={handleCreatedFromFilterChange}
              />
              <InputComponent
                id="termination-created-to"
                value={filters.createdTo}
                label="Hasta"
                type="date"
                aria-label="Fecha creacion hasta"
                onValueChange={handleCreatedToFilterChange}
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <ButtonComponent
              type="button"
              variant="outline"
              disabled={loadingSettlements}
              label="Limpiar"
              onClick={() => { void handleClearFilters() }}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loadingSettlements || loadingApprovalEmployeeStatusOptions || loadingFilterOptions}
              className="text-white dark:text-white"
              label={loadingApprovalEmployeeStatusOptions || loadingFilterOptions ? 'Aplicando...' : 'Aplicar'}
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
        <SettlementDetailComponent
          key={selectedDetailRowId ?? 'empty-settlement-detail'}
          detail={settlementDetailView}
          loading={loadingSettlementDetail}
          errorMessage={detailError}
          onRetry={handleRetryDetail}
        />
      </DetailSidebarComponent>
    </section>
  )
}
