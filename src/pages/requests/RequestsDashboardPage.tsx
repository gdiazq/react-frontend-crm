import { useEffect, useState } from 'react'
import {
  AlertMessageComponent,
  ButtonComponent,
  DetailSidebarComponent,
  InputComponent,
  PaginationComponent,
  RequestDetailComponent,
  RightSidebarComponent,
  SaveConfirmComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  TableComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { requestsTableColumns, requestsTableColumnIndex, requestsTableSortByColumn } from '@/factories'
import { mapperRequestDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { requestsService } from '@/services'
import { useStoreEmployeeSelects, useStoreRequests } from '@/store'
import type { RequestTableRow, TableRow, TableSortState } from '@/types'
import { createRequestsActions, createRequestsTableCustomRenderer, downloadBlobFile } from '@/utils'
import type { DropdownAction } from '@/utils'

const REQUEST_STATUS_COLUMN_INDEX = requestsTableColumnIndex.status
const REQUEST_NAME_COLUMN_INDEX = requestsTableColumnIndex.name
const ACTIONS_COLUMN_INDEX = requestsTableColumns.length - 1
const FINAL_REQUEST_STATUS_IDS = new Set([3, 4])
const REQUESTS_SORTABLE_COLUMNS = Object.keys(requestsTableSortByColumn).map((index) => Number(index))

export default function RequestsDashboardPage() {
  // --- Store ---
  const requestsRows = useStoreRequests((s) => s.requestsRows)
  const requestDetail = useStoreRequests((s) => s.requestDetail)
  const pagination = useStoreRequests((s) => s.pagination)
  const queryParams = useStoreRequests((s) => s.queryParams)
  const loadingRequests = useStoreRequests((s) => s.loadingRequests)
  const loadingRequestDetail = useStoreRequests((s) => s.loadingRequestDetail)
  const loadingApproveRequest = useStoreRequests((s) => s.loadingApproveRequest)
  const loadingRejectRequest = useStoreRequests((s) => s.loadingRejectRequest)
  const listError = useStoreRequests((s) => s.operationStatus.list.error)
  const detailError = useStoreRequests((s) => s.operationStatus.detail.error)
  const clearOperationStatus = useStoreRequests((s) => s.clearOperationStatus)
  const getRequests = useStoreRequests((s) => s.getRequests)
  const getRequestDetail = useStoreRequests((s) => s.getRequestDetail)
  const clearRequestDetail = useStoreRequests((s) => s.clearRequestDetail)
  const goToPage = useStoreRequests((s) => s.goToPage)
  const setSearch = useStoreRequests((s) => s.setSearch)
  const setStatusFilter = useStoreRequests((s) => s.setStatusFilter)
  const setModuleFilter = useStoreRequests((s) => s.setModuleFilter)
  const setCreatedDateRange = useStoreRequests((s) => s.setCreatedDateRange)
  const setApprovalDateRange = useStoreRequests((s) => s.setApprovalDateRange)
  const clearStatusFilter = useStoreRequests((s) => s.clearStatusFilter)
  const clearModuleFilter = useStoreRequests((s) => s.clearModuleFilter)
  const clearCreatedDateRange = useStoreRequests((s) => s.clearCreatedDateRange)
  const clearApprovalDateRange = useStoreRequests((s) => s.clearApprovalDateRange)
  const searchRequests = useStoreRequests((s) => s.searchRequests)
  const sortRequests = useStoreRequests((s) => s.sortRequests)
  const approveRequest = useStoreRequests((s) => s.approveRequest)
  const rejectRequest = useStoreRequests((s) => s.rejectRequest)

  const approvalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptions)
  const loadingApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.loadingApprovalEmployeeStatusOptions)
  const approvalEmployeeStatusOptionsErrorMessage = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptionsErrorMessage)
  const getApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.getApprovalEmployeeStatusOptions)
  const clearApprovalEmployeeStatusOptionsStatus = useStoreEmployeeSelects((s) => s.clearApprovalEmployeeStatusOptionsStatus)
  const hrRequestTypeOptions = useStoreEmployeeSelects((s) => s.hrRequestTypeOptions)
  const loadingHrRequestTypeOptions = useStoreEmployeeSelects((s) => s.loadingHrRequestTypeOptions)
  const hrRequestTypeOptionsErrorMessage = useStoreEmployeeSelects((s) => s.hrRequestTypeOptionsErrorMessage)
  const getHrRequestTypeOptions = useStoreEmployeeSelects((s) => s.getHrRequestTypeOptions)
  const clearHrRequestTypeOptionsStatus = useStoreEmployeeSelects((s) => s.clearHrRequestTypeOptionsStatus)

  const { actionViewDetail, actionApproveRequest, actionRejectRequest } = createRequestsActions()

  // --- State ---
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState(() => ({
    statusId: queryParams.statusId,
    moduleId: queryParams.idModule,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
    approvalFrom: queryParams.approvalFrom,
    approvalTo: queryParams.approvalTo,
  }))
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [selectedDetailName, setSelectedDetailName] = useState('')
  const [confirmApproveOpen, setConfirmApproveOpen] = useState(false)
  const [pendingApproveRow, setPendingApproveRow] = useState<RequestTableRow | null>(null)
  const [confirmRejectOpen, setConfirmRejectOpen] = useState(false)
  const [pendingRejectRow, setPendingRejectRow] = useState<RequestTableRow | null>(null)
  const [rejectDetail, setRejectDetail] = useState('')
  const [actionsMessage, setActionsMessage] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)

  // --- Derived ---
  const requestDetailView = mapperRequestDetailView(requestDetail)
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const activeSortColumn = REQUESTS_SORTABLE_COLUMNS.find((index) => requestsTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }
  const statusSelectOptions = approvalEmployeeStatusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const moduleSelectOptions = hrRequestTypeOptions.map((option) => ({ label: option.name, value: String(option.id) }))

  // --- Effects ---
  useEffect(() => {
    void getRequests()
    void getApprovalEmployeeStatusOptions()
    void getHrRequestTypeOptions()
  }, [getRequests, getApprovalEmployeeStatusOptions, getHrRequestTypeOptions])

  // --- Handlers: Detail ---
  const handleViewDetail = (row: RequestTableRow) => {
    setSelectedDetailRowId(row.id)
    setSelectedDetailName(String(row.values[REQUEST_NAME_COLUMN_INDEX] ?? 'Solicitud'))
    setDetailOpen(true)
    void getRequestDetail(row.id)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
    setSelectedDetailName('')
    clearRequestDetail()
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getRequestDetail(selectedDetailRowId)
  }

  // --- Handlers: Approve & Reject ---
  const handleApproveRequest = (row: RequestTableRow) => {
    setPendingApproveRow(row)
    setConfirmApproveOpen(true)
  }

  const handleRejectRequest = (row: RequestTableRow) => {
    setPendingRejectRow(row)
    setRejectDetail('')
    setConfirmRejectOpen(true)
  }

  // --- Row actions & table helpers ---
  const resolveRowActions = (row: RequestTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [actionViewDetail(() => handleViewDetail(row))]
    if (!FINAL_REQUEST_STATUS_IDS.has(row.statusId)) {
      actions.push(actionApproveRequest(() => handleApproveRequest(row)))
      actions.push(actionRejectRequest(() => handleRejectRequest(row)))
    }
    return actions
  }

  const findRequestRowById = (rowId: string) => requestsRows.find((row) => row.id === rowId) ?? null
  const handleViewDetailById = (rowId: string) => {
    const requestRow = findRequestRowById(rowId)
    if (!requestRow) return
    handleViewDetail(requestRow)
  }
  const getRequestStatusName = (rowId: string, fallbackStatusName: string) => {
    const requestRow = findRequestRowById(rowId)
    return requestRow?.statusName || fallbackStatusName
  }
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const requestRow = findRequestRowById(tableRow.id)
    if (!requestRow) return []
    return resolveRowActions(requestRow)
  }

  const renderCustomCell = createRequestsTableCustomRenderer({
    requestNameColumnIndex: REQUEST_NAME_COLUMN_INDEX,
    statusColumnIndex: REQUEST_STATUS_COLUMN_INDEX,
    onViewDetail: handleViewDetailById,
    getStatusName: getRequestStatusName,
  })

  // --- Handlers: Sort ---
  const handleSortChange = async (columnIndex: number) => {
    const sortBy = requestsTableSortByColumn[columnIndex]
    if (!sortBy) return

    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === 'asc' ? 'desc' : 'asc'

    await sortRequests(sortBy, nextSortDir)
  }

  // --- Handlers: Filters ---
  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }
  const handleStatusFilterChange = (value: string) => handleChangeFilter('statusId', value)
  const handleModuleFilterChange = (value: string) => handleChangeFilter('moduleId', value)
  const handleApprovalFromFilterChange = (value: string) => handleChangeFilter('approvalFrom', value)
  const handleApprovalToFilterChange = (value: string) => handleChangeFilter('approvalTo', value)
  const handleCreatedFromFilterChange = (value: string) => handleChangeFilter('createdFrom', value)
  const handleCreatedToFilterChange = (value: string) => handleChangeFilter('createdTo', value)

  const handleApplyFilters = async () => {
    const selectedStatus = approvalEmployeeStatusOptions.find((option) => String(option.id) === filters.statusId)
    const selectedModule = hrRequestTypeOptions.find((option) => String(option.id) === filters.moduleId)

    setStatusFilter(selectedStatus ? String(selectedStatus.id) : '')
    setModuleFilter(selectedModule ? String(selectedModule.id) : '')
    setCreatedDateRange({
      createdFrom: filters.createdFrom.trim(),
      createdTo: filters.createdTo.trim(),
    })
    setApprovalDateRange({
      approvalFrom: filters.approvalFrom.trim(),
      approvalTo: filters.approvalTo.trim(),
    })
    await searchRequests()
    setFiltersOpen(false)
  }

  const handleClearFilters = async () => {
    setFilters({
      statusId: '',
      moduleId: '',
      createdFrom: '',
      createdTo: '',
      approvalFrom: '',
      approvalTo: '',
    })
    clearStatusFilter()
    clearModuleFilter()
    clearCreatedDateRange()
    clearApprovalDateRange()
    await searchRequests()
    setFiltersOpen(false)
  }

  // --- Handlers: Confirm ---
  const handleCloseConfirmApprove = () => {
    if (loadingApproveRequest) return
    setConfirmApproveOpen(false)
    setPendingApproveRow(null)
  }

  const handleConfirmApproveRequest = async () => {
    if (!pendingApproveRow || loadingApproveRequest) return

    const success = await approveRequest(pendingApproveRow.id)
    if (success) {
      const requestName = pendingApproveRow.values[REQUEST_NAME_COLUMN_INDEX]
      setConfirmApproveOpen(false)
      setPendingApproveRow(null)
      await getRequests()
      setActionsMessage(`${requestName}: ${messages.requests.status.success.approveSuccess}`)
    }
  }

  const handleCloseConfirmReject = () => {
    if (loadingRejectRequest) return
    setConfirmRejectOpen(false)
    setPendingRejectRow(null)
    setRejectDetail('')
  }

  const handleConfirmRejectRequest = async () => {
    if (!pendingRejectRow || loadingRejectRequest) return

    const success = await rejectRequest(pendingRejectRow.id, rejectDetail.trim())
    if (success) {
      const requestName = pendingRejectRow.values[REQUEST_NAME_COLUMN_INDEX]
      setConfirmRejectOpen(false)
      setPendingRejectRow(null)
      setRejectDetail('')
      await getRequests()
      setActionsMessage(`${requestName}: ${messages.requests.status.success.rejectSuccess}`)
    }
  }

  // --- Handlers: Download & Upload ---
  const handleDownloadReport = async () => {
    if (downloadingReport) return

    try {
      setDownloadingReport(true)
      const csvBlob = await requestsService.exportRequestsCsv()
      downloadBlobFile(csvBlob, 'hr-requests.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch (error) {
      if (requestsService.isAxiosError(error)) {
        setActionsMessage(error.response?.data?.message || 'No se pudo descargar el reporte.')
      } else {
        setActionsMessage('No se pudo descargar el reporte.')
      }
    } finally {
      setDownloadingReport(false)
    }
  }

  const handleBulkUpload = () => {
    setActionsMessage('Carga masiva disponible proximamente.')
  }

  // --- Computed messages ---
  const confirmApproveMessage = pendingApproveRow
    ? `¿Seguro que deseas aprobar la solicitud de ${pendingApproveRow.values[REQUEST_NAME_COLUMN_INDEX]}?`
    : ''
  const detailTitle = requestDetailView
    ? `Detalle de ${requestDetailView.fullName}`
    : selectedDetailName
      ? `Detalle de ${selectedDetailName}`
      : 'Detalle de solicitud'

  return (
    <section className="min-w-0 space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">Dashboard de solicitudes RRHH</h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total solicitudes"
        activeLabel="Solicitudes aprobadas"
        pendingLabel="Solicitudes pendientes"
        total={pagination.total}
        active={pagination.active}
        pending={pagination.pending}
        showRatios={false}
      />

      {listError && (
        <AlertMessageComponent
          message={listError}
          tone="error"
          onClose={() => clearOperationStatus('list')}
        />
      )}

      {approvalEmployeeStatusOptionsErrorMessage && (
        <AlertMessageComponent
          message={approvalEmployeeStatusOptionsErrorMessage}
          tone="error"
          onClose={clearApprovalEmployeeStatusOptionsStatus}
        />
      )}

      {hrRequestTypeOptionsErrorMessage && (
        <AlertMessageComponent
          message={hrRequestTypeOptionsErrorMessage}
          tone="error"
          onClose={clearHrRequestTypeOptionsStatus}
        />
      )}

      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => {
          event.preventDefault()
          void searchRequests()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingRequests}
            label="Filtro"
            onClick={() => setFiltersOpen(true)}
          />
          <div className="min-w-0 flex-1">
            <InputComponent
              value={queryParams.search}
              type="text"
              placeholder="Buscar por nombre"
              onValueChange={setSearch}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loadingRequests}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingRequests ? 'Buscando...' : 'Buscar'}
          />
          <ToolbarActionsDropdownComponent
            disabled={loadingRequests || downloadingReport}
            showBulkUpload={false}
            onDownloadReport={() => { void handleDownloadReport() }}
            onBulkUpload={handleBulkUpload}
          />
        </div>
      </form>

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
          loading={loadingRequests}
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
            value={filters.moduleId}
            label="Tipo solicitud"
            options={moduleSelectOptions}
            loading={loadingHrRequestTypeOptions}
            onValueChange={handleModuleFilterChange}
          />
          <div className="space-y-3 rounded-xl border border-cyan-500/35 bg-cyan-50/30 p-3 dark:border-cyan-400/25 dark:bg-cyan-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
              Fecha aprobacion
            </p>
            <div className="grid gap-2">
              <InputComponent
                id="requests-approval-from"
                value={filters.approvalFrom}
                label="Desde"
                type="date"
                aria-label="Fecha aprobacion desde"
                onValueChange={handleApprovalFromFilterChange}
              />
              <InputComponent
                id="requests-approval-to"
                value={filters.approvalTo}
                label="Hasta"
                type="date"
                aria-label="Fecha aprobacion hasta"
                onValueChange={handleApprovalToFilterChange}
              />
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-emerald-500/35 bg-emerald-50/20 p-3 dark:border-emerald-400/25 dark:bg-emerald-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Fecha creacion
            </p>
            <div className="grid gap-2">
              <InputComponent
                id="requests-created-from"
                value={filters.createdFrom}
                label="Desde"
                type="date"
                aria-label="Fecha creacion desde"
                onValueChange={handleCreatedFromFilterChange}
              />
              <InputComponent
                id="requests-created-to"
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
              disabled={loadingRequests || loadingApprovalEmployeeStatusOptions || loadingHrRequestTypeOptions}
              label="Limpiar"
              onClick={() => { void handleClearFilters() }}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loadingRequests || loadingApprovalEmployeeStatusOptions || loadingHrRequestTypeOptions}
              className="text-white dark:text-white"
              label={loadingApprovalEmployeeStatusOptions || loadingHrRequestTypeOptions ? 'Aplicando...' : 'Aplicar'}
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
        {(() => {
          const selectedRow = selectedDetailRowId ? findRequestRowById(selectedDetailRowId) : null
          const canAct = selectedRow ? !FINAL_REQUEST_STATUS_IDS.has(selectedRow.statusId) : false
          return (
            <RequestDetailComponent
              key={selectedDetailRowId ?? 'empty-request-detail'}
              detail={requestDetailView}
              loading={loadingRequestDetail}
              errorMessage={detailError}
              onRetry={handleRetryDetail}
              onApprove={canAct && selectedRow ? () => handleApproveRequest(selectedRow) : undefined}
              onReject={canAct && selectedRow ? () => handleRejectRequest(selectedRow) : undefined}
            />
          )
        })()}
      </DetailSidebarComponent>

      <SaveConfirmComponent
        open={confirmApproveOpen}
        title="Confirmar aprobacion"
        message={confirmApproveMessage}
        confirmLabel="Aprobar"
        cancelLabel="Cancelar"
        loading={loadingApproveRequest}
        onClose={handleCloseConfirmApprove}
        onConfirm={() => { void handleConfirmApproveRequest() }}
      />

      <SaveConfirmComponent
        open={confirmRejectOpen}
        title="Confirmar rechazo"
        message={pendingRejectRow ? `¿Seguro que deseas rechazar la solicitud de ${pendingRejectRow.values[REQUEST_NAME_COLUMN_INDEX]}?` : ''}
        confirmLabel="Rechazar"
        cancelLabel="Cancelar"
        loading={loadingRejectRequest}
        confirmDisabled={rejectDetail.trim().length === 0}
        onClose={handleCloseConfirmReject}
        onConfirm={() => { void handleConfirmRejectRequest() }}
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {messages.requests.ui.rejectRequestReasonLabel}
          </label>
          <textarea
            value={rejectDetail}
            rows={4}
            placeholder={messages.requests.ui.rejectRequestReasonPlaceholder}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
            onChange={(event) => setRejectDetail(event.target.value)}
          />
        </div>
      </SaveConfirmComponent>
    </section>
  )
}
