import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DateRangePickerComponent,
  DetailSidebarComponent,
  InputComponent,
  PaginationComponent,
  RightSidebarComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  TableComponent,
  TransferDetailComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { transferTableColumns, transferTableColumnIndex, transferTableSortByColumn } from '@/factories'
import { mapperTransferDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { storageService } from '@/services'
import { useStoreAuth, useStoreEmployeeSelects, useStoreTransfer } from '@/store'
import type { TransferTableRow,
  TableRow,
  TableSortState } from '@/types'
import {
  createTransferActions,
  createTransferTableCustomRenderer,
} from '@/utils'
import type { DropdownAction } from '@/utils'
import {
  AUTH_ROUTE_TRANSFERS_CREATE,
  AUTH_ROUTE_TRANSFERS_EDIT,
  PermissionAction,
  PermissionModule,
  SortDirection,
} from '@/constant'

const EMPLOYEE_NAME_COLUMN_INDEX = transferTableColumnIndex.employeeName
const STATUS_COLUMN_INDEX = transferTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = transferTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(transferTableSortByColumn).map((index) => Number(index))

export default function TransfersDashboardPage() {
  const navigate = useNavigate()

  const transferRows = useStoreTransfer((s) => s.transferRows)
  const transferDetail = useStoreTransfer((s) => s.transferDetail)
  const pagination = useStoreTransfer((s) => s.pagination)
  const queryParams = useStoreTransfer((s) => s.queryParams)
  const loadingTransfers = useStoreTransfer((s) => s.loadingTransfers)
  const loadingTransferDetail = useStoreTransfer((s) => s.loadingTransferDetail)
  const listError = useStoreTransfer((s) => s.operationStatus.list.error)
  const detailError = useStoreTransfer((s) => s.operationStatus.detail.error)
  const clearOperationStatus = useStoreTransfer((s) => s.clearOperationStatus)
  const getTransfers = useStoreTransfer((s) => s.getTransfers)
  const getTransferDetail = useStoreTransfer((s) => s.getTransferDetail)
  const goToPage = useStoreTransfer((s) => s.goToPage)
  const searchTransfers = useStoreTransfer((s) => s.searchTransfers)
  const sortTransfers = useStoreTransfer((s) => s.sortTransfers)
  const setSearch = useStoreTransfer((s) => s.setSearch)
  const setStatusFilter = useStoreTransfer((s) => s.setStatusFilter)
  const setToCostCenterFilter = useStoreTransfer((s) => s.setToCostCenterFilter)
  const setEffectiveDateRange = useStoreTransfer((s) => s.setEffectiveDateRange)
  const setCreatedDateRange = useStoreTransfer((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreTransfer((s) => s.setUpdatedDateRange)
  const clearStatusFilter = useStoreTransfer((s) => s.clearStatusFilter)
  const clearToCostCenterFilter = useStoreTransfer((s) => s.clearToCostCenterFilter)
  const clearEffectiveDateRange = useStoreTransfer((s) => s.clearEffectiveDateRange)
  const clearCreatedDateRange = useStoreTransfer((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreTransfer((s) => s.clearUpdatedDateRange)
  const exportTransfersCsv = useStoreTransfer((s) => s.exportTransfersCsv)
  const clearTransferDetail = useStoreTransfer((s) => s.clearTransferDetail)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canCreateTransfer = hasPermission(PermissionModule.Transfer, PermissionAction.Create)
  const canUpdateTransfer = hasPermission(PermissionModule.Transfer, PermissionAction.Update)

  const approvalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptions)
  const transferToCostCenterOptions = useStoreEmployeeSelects((s) => s.transferToCostCenterOptions)
  const loadingApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.loadingApprovalEmployeeStatusOptions)
  const loadingTransferToCostCenterOptions = useStoreEmployeeSelects((s) => s.loadingTransferToCostCenterOptions)
  const approvalEmployeeStatusOptionsErrorMessage = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptionsErrorMessage)
  const transferToCostCenterOptionsErrorMessage = useStoreEmployeeSelects((s) => s.transferToCostCenterOptionsErrorMessage)
  const getApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.getApprovalEmployeeStatusOptions)
  const getTransferToCostCenterOptions = useStoreEmployeeSelects((s) => s.getTransferToCostCenterOptions)
  const clearApprovalEmployeeStatusOptionsStatus = useStoreEmployeeSelects((s) => s.clearApprovalEmployeeStatusOptionsStatus)
  const clearTransferToCostCenterOptionsStatus = useStoreEmployeeSelects((s) => s.clearTransferToCostCenterOptionsStatus)

  const { actionViewDetail, actionUpdateTransfer } = createTransferActions()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState(() => ({
    status: queryParams.status,
    toCostCenter: queryParams.toCostCenter,
    effectiveDateFrom: queryParams.effectiveDateFrom,
    effectiveDateTo: queryParams.effectiveDateTo,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
    updatedFrom: queryParams.updatedFrom,
    updatedTo: queryParams.updatedTo,
  }))
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [selectedDetailName, setSelectedDetailName] = useState('')
  const [exportingCsv, setExportingCsv] = useState(false)

  const getFiltersFromQueryParams = () => ({
    status: queryParams.status,
    toCostCenter: queryParams.toCostCenter,
    effectiveDateFrom: queryParams.effectiveDateFrom,
    effectiveDateTo: queryParams.effectiveDateTo,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
    updatedFrom: queryParams.updatedFrom,
    updatedTo: queryParams.updatedTo,
  })

  const transferDetailView = mapperTransferDetailView(transferDetail)
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const statusSelectOptions = approvalEmployeeStatusOptions.map((option) => ({ label: option.name, value: option.name }))
  const toCostCenterSelectOptions = transferToCostCenterOptions.map((option) => ({ label: option.name, value: String(option.id) }))

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => transferTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  const detailTitle = transferDetailView
    ? `Detalle de ${transferDetailView.employeeFullNameDisplay}`
    : selectedDetailName
      ? `Detalle de ${selectedDetailName}`
      : messages.transfer.ui.detailTitleFallback

  useEffect(() => {
    void getTransfers()
    void getApprovalEmployeeStatusOptions()
    void getTransferToCostCenterOptions()
  }, [getTransfers, getApprovalEmployeeStatusOptions, getTransferToCostCenterOptions])

  const handleViewDetail = (row: TransferTableRow) => {
    setSelectedDetailRowId(row.id)
    setSelectedDetailName(String(row.values[EMPLOYEE_NAME_COLUMN_INDEX] ?? ''))
    setDetailOpen(true)
    void getTransferDetail(row.id)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
    setSelectedDetailName('')
    clearTransferDetail()
    clearOperationStatus('detail')
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getTransferDetail(selectedDetailRowId)
  }

  const handleDownloadDocument = (fileId: number) => {
    window.open(storageService.getDownloadUrl(fileId), '_blank', 'noopener,noreferrer')
  }

  const resolveRowActions = (row: TransferTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => handleViewDetail(row)),
    ]

    if (canUpdateTransfer) {
      actions.push(actionUpdateTransfer(() => navigate(`${AUTH_ROUTE_TRANSFERS_EDIT}=${row.id}`)))
    }

    return actions
  }

  const findRowById = (rowId: string) => transferRows.find((row) => row.id === rowId) ?? null

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

  const renderCustomCell = createTransferTableCustomRenderer({
    employeeNameColumnIndex: EMPLOYEE_NAME_COLUMN_INDEX,
    statusColumnIndex: STATUS_COLUMN_INDEX,
    onViewDetail: handleViewDetailById,
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = transferTableSortByColumn[columnIndex]
    if (!sortBy) return
    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc
    await sortTransfers(sortBy, nextSortDir)
  }

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }
  const handleOpenFilters = () => {
    setFilters(getFiltersFromQueryParams())
    setFiltersOpen(true)
  }
  const handleStatusFilterChange = (value: string) => handleChangeFilter('status', value)
  const handleToCostCenterFilterChange = (value: string) => handleChangeFilter('toCostCenter', value)

  const handleApplyFilters = async () => {
    setStatusFilter(filters.status.trim())
    setToCostCenterFilter(filters.toCostCenter.trim())
    setEffectiveDateRange({
      effectiveDateFrom: filters.effectiveDateFrom.trim(),
      effectiveDateTo: filters.effectiveDateTo.trim(),
    })
    setCreatedDateRange({
      createdFrom: filters.createdFrom.trim(),
      createdTo: filters.createdTo.trim(),
    })
    setUpdatedDateRange({
      updatedFrom: filters.updatedFrom.trim(),
      updatedTo: filters.updatedTo.trim(),
    })
    await searchTransfers()
    setFiltersOpen(false)
  }

  const handleClearFilters = async () => {
    setFilters({
      status: '',
      toCostCenter: '',
      effectiveDateFrom: '',
      effectiveDateTo: '',
      createdFrom: '',
      createdTo: '',
      updatedFrom: '',
      updatedTo: '',
    })
    clearStatusFilter()
    clearToCostCenterFilter()
    clearEffectiveDateRange()
    clearCreatedDateRange()
    clearUpdatedDateRange()
    await searchTransfers()
    setFiltersOpen(false)
  }

  const handleDownloadCsv = async () => {
    if (exportingCsv) return
    setExportingCsv(true)
    await exportTransfersCsv()
    setExportingCsv(false)
  }

  const handleBulkUpload = () => {}

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · TRASPASOS</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de traspasos</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total traspasos"
        activeLabel="Traspasos activos"
        total={pagination.total}
        active={pagination.active}
      />

      {approvalEmployeeStatusOptionsErrorMessage && (
        <AlertMessageComponent
          message={approvalEmployeeStatusOptionsErrorMessage}
          tone="error"
          onClose={clearApprovalEmployeeStatusOptionsStatus}
        />
      )}

      {transferToCostCenterOptionsErrorMessage && (
        <AlertMessageComponent
          message={transferToCostCenterOptionsErrorMessage}
          tone="error"
          onClose={clearTransferToCostCenterOptionsStatus}
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
          void searchTransfers()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingTransfers}
            label="Filtro"
            onClick={handleOpenFilters}
          />
          <div className="min-w-0 flex-1">
            <InputComponent
              value={queryParams.search}
              type="text"
              placeholder="Buscar por nombre del trabajador"
              onValueChange={setSearch}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loadingTransfers}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingTransfers ? 'Buscando...' : 'Buscar'}
          />
          {canCreateTransfer && (
            <ButtonComponent
              type="button"
              variant="success"
              disabled={loadingTransfers}
              className="flex-1 md:flex-none"
              label="Nuevo traspaso"
              onClick={() => navigate(AUTH_ROUTE_TRANSFERS_CREATE)}
            />
          )}
          <ToolbarActionsDropdownComponent
            disabled={loadingTransfers || exportingCsv}
            showBulkUpload={false}
            onDownloadReport={() => { void handleDownloadCsv() }}
            onBulkUpload={handleBulkUpload}
          />
        </div>
      </form>

      <TableComponent
        columns={transferTableColumns}
        rows={transferRows}
        loading={loadingTransfers}
        emptyMessage="No hay traspasos registrados."
        customRenderer={renderCustomCell}
        actionsConfig={{
          columnIndex: ACTIONS_COLUMN_INDEX,
          resolveRowActions: resolveRowActionsFromTableRow,
        }}
        sortableColumnIndexes={SORTABLE_COLUMNS}
        sortState={sortState}
        onSortChange={(columnIndex) => { void handleSortChange(columnIndex) }}
      />

      <div className="flex justify-end">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          loading={loadingTransfers}
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
            value={filters.status}
            label="Estado"
            options={statusSelectOptions}
            loading={loadingApprovalEmployeeStatusOptions}
            onValueChange={handleStatusFilterChange}
          />
          <SelectComponent
            value={filters.toCostCenter}
            label="Centro destino"
            options={toCostCenterSelectOptions}
            loading={loadingTransferToCostCenterOptions}
            onValueChange={handleToCostCenterFilterChange}
          />
          <div className="space-y-3 rounded-xl border border-cyan-500/35 bg-cyan-50/20 p-3 dark:border-cyan-400/25 dark:bg-cyan-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
              Fecha efectiva
            </p>
            <DateRangePickerComponent
                fromValue={filters.effectiveDateFrom}
                toValue={filters.effectiveDateTo}
                label="Rango de fecha"
                onRangeChange={({ from, to }) => {
                  setFilters((prev) => ({ ...prev, effectiveDateFrom: from, effectiveDateTo: to }))
                }}
              />
          </div>
          <div className="space-y-3 rounded-xl border border-emerald-500/35 bg-emerald-50/20 p-3 dark:border-emerald-400/25 dark:bg-emerald-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Fecha creacion
            </p>
            <DateRangePickerComponent
                fromValue={filters.createdFrom}
                toValue={filters.createdTo}
                label="Rango de creación"
                onRangeChange={({ from, to }) => {
                  setFilters((prev) => ({ ...prev, createdFrom: from, createdTo: to }))
                }}
              />
          </div>
          <div className="space-y-3 rounded-xl border border-amber-500/35 bg-amber-50/15 p-3 dark:border-amber-400/25 dark:bg-amber-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
              Fecha actualizacion
            </p>
            <DateRangePickerComponent
                fromValue={filters.updatedFrom}
                toValue={filters.updatedTo}
                label="Rango de actualización"
                onRangeChange={({ from, to }) => {
                  setFilters((prev) => ({ ...prev, updatedFrom: from, updatedTo: to }))
                }}
              />
          </div>
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <ButtonComponent
              type="button"
              variant="outline"
              disabled={loadingTransfers || loadingApprovalEmployeeStatusOptions || loadingTransferToCostCenterOptions}
              label="Limpiar"
              onClick={() => { void handleClearFilters() }}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loadingTransfers || loadingApprovalEmployeeStatusOptions || loadingTransferToCostCenterOptions}
              className="text-white dark:text-white"
              label={loadingApprovalEmployeeStatusOptions || loadingTransferToCostCenterOptions ? 'Aplicando...' : 'Aplicar'}
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
        <TransferDetailComponent
          key={selectedDetailRowId ?? 'empty-transfer-detail'}
          detail={transferDetailView}
          loading={loadingTransferDetail}
          errorMessage={detailError}
          onRetry={handleRetryDetail}
          onDownloadDocument={handleDownloadDocument}
          onEdit={
            selectedDetailRowId && canUpdateTransfer
              ? () => navigate(`${AUTH_ROUTE_TRANSFERS_EDIT}=${selectedDetailRowId}`)
              : undefined
          }
          moreActions={
            selectedDetailRowId
              ? (findRowById(selectedDetailRowId)
                  ? resolveRowActions(findRowById(selectedDetailRowId)!).filter(
                      (action) => action.id !== 'view-detail' && action.id !== 'update-transfer',
                    )
                  : [])
              : []
          }
        />
      </DetailSidebarComponent>
    </section>
  )
}
