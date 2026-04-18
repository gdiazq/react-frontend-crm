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
  TransferDetailComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import {
  transferTableColumns,
  transferTableColumnIndex,
  transferTableSortByColumn,
} from '@/factories'
import { mapperTransferDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreAuth, useStoreEmployeeSelects, useStoreTransfer } from '@/store'
import type { TransferTableRow, TableRow, TableSortState } from '@/types'
import { createTransferActions, createTransferTableCustomRenderer } from '@/utils'
import type { DropdownAction } from '@/utils'
import { AUTH_ROUTE_TRANSFERS_CREATE, AUTH_ROUTE_TRANSFERS_EDIT } from '@/constant'

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
  const toggleError = useStoreTransfer((s) => s.operationStatus.toggle.error)
  const toggleSuccess = useStoreTransfer((s) => s.operationStatus.toggle.success)
  const clearOperationStatus = useStoreTransfer((s) => s.clearOperationStatus)
  const getTransfers = useStoreTransfer((s) => s.getTransfers)
  const getTransferDetail = useStoreTransfer((s) => s.getTransferDetail)
  const goToPage = useStoreTransfer((s) => s.goToPage)
  const searchTransfers = useStoreTransfer((s) => s.searchTransfers)
  const sortTransfers = useStoreTransfer((s) => s.sortTransfers)
  const setSearch = useStoreTransfer((s) => s.setSearch)
  const setStatusFilter = useStoreTransfer((s) => s.setStatusFilter)
  const clearStatusFilter = useStoreTransfer((s) => s.clearStatusFilter)
  const deleteTransferDocument = useStoreTransfer((s) => s.deleteTransferDocument)
  const exportTransfersCsv = useStoreTransfer((s) => s.exportTransfersCsv)
  const clearTransferDetail = useStoreTransfer((s) => s.clearTransferDetail)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canCreateTransfer = hasPermission('TRANSFER', 'canCreate')
  const canUpdateTransfer = hasPermission('TRANSFER', 'canUpdate')

  const approvalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptions)
  const loadingApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.loadingApprovalEmployeeStatusOptions)
  const approvalEmployeeStatusOptionsErrorMessage = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptionsErrorMessage)
  const getApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.getApprovalEmployeeStatusOptions)
  const clearApprovalEmployeeStatusOptionsStatus = useStoreEmployeeSelects((s) => s.clearApprovalEmployeeStatusOptionsStatus)

  const { actionViewDetail, actionUpdateTransfer } = createTransferActions()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState(() => ({ status: queryParams.status }))
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [selectedDetailName, setSelectedDetailName] = useState('')
  const [deletingDocumentId, setDeletingDocumentId] = useState<number | null>(null)
  const [exportingCsv, setExportingCsv] = useState(false)

  const transferDetailView = mapperTransferDetailView(transferDetail)
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const statusSelectOptions = approvalEmployeeStatusOptions.map((option) => ({ label: option.name, value: String(option.id) }))

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
  }, [getTransfers, getApprovalEmployeeStatusOptions])

  useEffect(() => {
    setFilters({ status: queryParams.status })
  }, [queryParams.status])

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
    clearOperationStatus('toggle')
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getTransferDetail(selectedDetailRowId)
  }

  const handleDeleteDocument = async (fileId: number) => {
    if (!selectedDetailRowId) return
    setDeletingDocumentId(fileId)
    await deleteTransferDocument(Number(selectedDetailRowId), fileId)
    setDeletingDocumentId(null)
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
    const nextSortDir = currentSortBy === sortBy && currentSortDir === 'asc' ? 'desc' : 'asc'
    await sortTransfers(sortBy, nextSortDir)
  }

  const handleApplyFilters = async () => {
    setStatusFilter(filters.status)
    await searchTransfers()
    setFiltersOpen(false)
  }

  const handleClearFilters = async () => {
    setFilters({ status: '' })
    clearStatusFilter()
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
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">Dashboard de traspasos</h1>
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
            onClick={() => setFiltersOpen(true)}
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
              variant="primary"
              disabled={loadingTransfers}
              className="flex-1 text-white md:flex-none dark:text-white"
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
            onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
          />
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <ButtonComponent
              type="button"
              variant="outline"
              disabled={loadingTransfers}
              label="Limpiar"
              onClick={() => { void handleClearFilters() }}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loadingTransfers || loadingApprovalEmployeeStatusOptions}
              className="text-white dark:text-white"
              label={loadingApprovalEmployeeStatusOptions ? 'Cargando...' : 'Aplicar'}
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
        {toggleSuccess && (
          <AlertMessageComponent
            message={toggleSuccess}
            tone="success"
            onClose={() => clearOperationStatus('toggle')}
          />
        )}
        {toggleError && (
          <AlertMessageComponent
            message={toggleError}
            tone="error"
            onClose={() => clearOperationStatus('toggle')}
          />
        )}
        <TransferDetailComponent
          key={selectedDetailRowId ?? 'empty-transfer-detail'}
          detail={transferDetailView}
          loading={loadingTransferDetail}
          errorMessage={detailError}
          deletingDocumentId={deletingDocumentId}
          onRetry={handleRetryDetail}
          onDeleteDocument={(fileId) => { void handleDeleteDocument(fileId) }}
        />
      </DetailSidebarComponent>
    </section>
  )
}
