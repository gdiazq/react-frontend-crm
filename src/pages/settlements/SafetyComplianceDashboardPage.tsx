import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DateRangePickerComponent,
  DetailSidebarComponent,
  InputComponent,
  SafetyComplianceDetailComponent,
  PaginationComponent,
  RightSidebarComponent,
  SaveConfirmComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  TableComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import {
  AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE,
  AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE_CREATE,
  AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE_EDIT,
  PermissionAction,
  PermissionModule,
  SortDirection,
} from '@/constant'
import {
  safetyComplianceTableColumns,
  safetyComplianceTableColumnIndex,
  safetyComplianceTableSortByColumn,
} from '@/factories'
import { mapperSafetyComplianceDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { safetyComplianceService } from '@/services'
import { useStoreAuth, useStoreSafetyCompliance, useStoreSelects } from '@/store'
import type { SafetyComplianceTableRow, TableRow, TableSortState } from '@/types'
import {
  createSafetyComplianceActions,
  createSafetyComplianceTableCustomRenderer,
  downloadBlobFile,
  formatCsvImportSummary,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const NAME_COLUMN_INDEX = safetyComplianceTableColumnIndex.name
const STATUS_COLUMN_INDEX = safetyComplianceTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = safetyComplianceTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(safetyComplianceTableSortByColumn).map((index) => Number(index))

export default function SafetyComplianceDashboardPage() {
  const navigate = useNavigate()
  const safetyComplianceRows = useStoreSafetyCompliance((s) => s.safetyComplianceRows)
  const safetyComplianceDetail = useStoreSafetyCompliance((s) => s.safetyComplianceDetail)
  const pagination = useStoreSafetyCompliance((s) => s.pagination)
  const queryParams = useStoreSafetyCompliance((s) => s.queryParams)
  const loadingSafetyCompliance = useStoreSafetyCompliance((s) => s.loadingSafetyCompliance)
  const loadingSafetyComplianceDetail = useStoreSafetyCompliance((s) => s.loadingSafetyComplianceDetail)
  const loadingToggleStatus = useStoreSafetyCompliance((s) => s.loadingToggleStatus)
  const listError = useStoreSafetyCompliance((s) => s.operationStatus.list.error)
  const detailError = useStoreSafetyCompliance((s) => s.operationStatus.detail.error)
  const toggleError = useStoreSafetyCompliance((s) => s.operationStatus.toggle.error)
  const clearOperationStatus = useStoreSafetyCompliance((s) => s.clearOperationStatus)
  const getSafetyCompliance = useStoreSafetyCompliance((s) => s.getSafetyCompliance)
  const getSafetyComplianceDetail = useStoreSafetyCompliance((s) => s.getSafetyComplianceDetail)
  const goToPage = useStoreSafetyCompliance((s) => s.goToPage)
  const setSearch = useStoreSafetyCompliance((s) => s.setSearch)
  const searchSafetyCompliance = useStoreSafetyCompliance((s) => s.searchSafetyCompliance)
  const sortSafetyCompliance = useStoreSafetyCompliance((s) => s.sortSafetyCompliance)
  const setActiveFilter = useStoreSafetyCompliance((s) => s.setActiveFilter)
  const setCreatedDateRange = useStoreSafetyCompliance((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreSafetyCompliance((s) => s.setUpdatedDateRange)
  const clearActiveFilter = useStoreSafetyCompliance((s) => s.clearActiveFilter)
  const clearCreatedDateRange = useStoreSafetyCompliance((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreSafetyCompliance((s) => s.clearUpdatedDateRange)
  const toggleSafetyComplianceStatus = useStoreSafetyCompliance((s) => s.toggleSafetyComplianceStatus)
  const clearSafetyComplianceDetail = useStoreSafetyCompliance((s) => s.clearSafetyComplianceDetail)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canToggleSafetyComplianceStatus = hasPermission(PermissionModule.SafetyCompliance, PermissionAction.Update)

  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingStatusOptions = useStoreSelects((s) => s.loadingStatusOptions)
  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)

  const {
    actionViewDetail,
    actionUpdateSafetyCompliance,
    actionToggleStatus,
  } = createSafetyComplianceActions()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState(() => ({
    activeId: queryParams.active,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
    updatedFrom: queryParams.updatedFrom,
    updatedTo: queryParams.updatedTo,
  }))
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<SafetyComplianceTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [uploadingBulk, setUploadingBulk] = useState(false)
  const bulkUploadInputRef = useRef<HTMLInputElement | null>(null)

  const safetyComplianceDetailView = mapperSafetyComplianceDetailView(safetyComplianceDetail)
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const statusSelectOptions = statusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const activeSortColumn = SORTABLE_COLUMNS.find((index) => safetyComplianceTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  useEffect(() => {
    void getSafetyCompliance()
    void getStatusOptions()
  }, [getSafetyCompliance, getStatusOptions])

  const handleViewDetail = (row: SafetyComplianceTableRow) => {
    setSelectedDetailRowId(row.id)
    setDetailOpen(true)
    void getSafetyComplianceDetail(row.id)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
    clearSafetyComplianceDetail()
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getSafetyComplianceDetail(selectedDetailRowId)
  }

  const handleUpdateSafetyCompliance = (row: SafetyComplianceTableRow) => {
    navigate(`${AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE_EDIT}=${row.id}`)
  }

  const handleToggleStatus = (row: SafetyComplianceTableRow) => {
    setPendingToggleRow(row)
    setConfirmOpen(true)
  }

  const resolveRowActions = (row: SafetyComplianceTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => handleViewDetail(row)),
      actionUpdateSafetyCompliance(() => handleUpdateSafetyCompliance(row)),
    ]

    if (canToggleSafetyComplianceStatus) {
      actions.push(actionToggleStatus(row.active === true, () => handleToggleStatus(row)))
    }

    return actions
  }

  const findSafetyComplianceRowById = (rowId: string) => safetyComplianceRows.find((row) => row.id === rowId) ?? null
  const handleViewDetailById = (rowId: string) => {
    const safetyComplianceRow = findSafetyComplianceRowById(rowId)
    if (!safetyComplianceRow) return
    handleViewDetail(safetyComplianceRow)
  }
  const getStatusEnabled = (rowId: string) => Boolean(findSafetyComplianceRowById(rowId)?.active)
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const safetyComplianceRow = findSafetyComplianceRowById(tableRow.id)
    if (!safetyComplianceRow) return []
    return resolveRowActions(safetyComplianceRow)
  }

  const renderCustomCell = createSafetyComplianceTableCustomRenderer({
    nameColumnIndex: NAME_COLUMN_INDEX,
    statusColumnIndex: STATUS_COLUMN_INDEX,
    onViewDetail: handleViewDetailById,
    getStatusEnabled,
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = safetyComplianceTableSortByColumn[columnIndex]
    if (!sortBy) return

    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc
    await sortSafetyCompliance(sortBy, nextSortDir)
  }

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }
  const handleActiveFilterChange = (value: string) => handleChangeFilter('activeId', value)

  const handleApplyFilters = async () => {
    const selectedStatus = statusOptions.find((option) => String(option.id) === filters.activeId)
    setActiveFilter(selectedStatus ? String(selectedStatus.id) : '')
    setCreatedDateRange({ createdFrom: filters.createdFrom.trim(), createdTo: filters.createdTo.trim() })
    setUpdatedDateRange({ updatedFrom: filters.updatedFrom.trim(), updatedTo: filters.updatedTo.trim() })
    await searchSafetyCompliance()
    setFiltersOpen(false)
  }

  const handleClearFilters = async () => {
    setFilters({
      activeId: '',
      createdFrom: '',
      createdTo: '',
      updatedFrom: '',
      updatedTo: '',
    })
    clearActiveFilter()
    clearCreatedDateRange()
    clearUpdatedDateRange()
    await searchSafetyCompliance()
    setFiltersOpen(false)
  }

  const handleCloseConfirm = () => {
    if (loadingToggleStatus) return
    setConfirmOpen(false)
    setPendingToggleRow(null)
  }

  const handleConfirmToggleStatus = async () => {
    if (!pendingToggleRow || loadingToggleStatus) return

    const nextStatus = pendingToggleRow.active !== true
    const safetyComplianceName = pendingToggleRow.values[NAME_COLUMN_INDEX]
    const success = await toggleSafetyComplianceStatus(pendingToggleRow.id, nextStatus)
    if (success) {
      setConfirmOpen(false)
      setPendingToggleRow(null)
      await getSafetyCompliance()
      navigate(AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActionsMessage(
        `${safetyComplianceName} ${
          nextStatus
            ? messages.safetyCompliance.status.success.toggleEnabledSuccess
            : messages.safetyCompliance.status.success.toggleDisabledSuccess
        }`,
      )
    }
  }

  const handleDownloadReport = async () => {
    if (downloadingReport) return

    try {
      setDownloadingReport(true)
      const csvBlob = await safetyComplianceService.exportSafetyComplianceCsv()
      downloadBlobFile(csvBlob, 'safety-compliances.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch (error) {
      if (safetyComplianceService.isAxiosError(error)) {
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
      const result = await safetyComplianceService.importSafetyComplianceCsv(file)
      setActionsMessage(formatCsvImportSummary(result))
      await getSafetyCompliance()
    } catch (error) {
      if (safetyComplianceService.isAxiosError(error)) {
        setActionsMessage(error.response?.data?.message || 'No se pudo realizar la carga masiva.')
      } else {
        setActionsMessage('No se pudo realizar la carga masiva.')
      }
    } finally {
      setUploadingBulk(false)
    }
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.active === true ? 'deshabilitar' : 'habilitar'} el cumplimiento ${pendingToggleRow.values[NAME_COLUMN_INDEX]}?`
    : ''
  const detailTitle = safetyComplianceDetailView
    ? `Detalle de ${safetyComplianceDetailView.nameDisplay}`
    : messages.safetyCompliance.ui.detailTitleFallback

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · SEGURIDAD</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de seguridad</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total registros"
        activeLabel="Registros activos"
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

      {statusOptionsErrorMessage && (
        <AlertMessageComponent
          message={statusOptionsErrorMessage}
          tone="error"
          onClose={clearStatusOptionsStatus}
        />
      )}

      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => {
          event.preventDefault()
          void searchSafetyCompliance()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingSafetyCompliance || loadingToggleStatus}
            label="Filtro"
            onClick={() => setFiltersOpen(true)}
          />
          <div className="min-w-0 flex-1">
            <InputComponent
              value={queryParams.search}
              type="text"
              placeholder="Buscar por nombre o descripción"
              onValueChange={setSearch}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loadingSafetyCompliance || loadingToggleStatus}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingSafetyCompliance ? 'Buscando...' : 'Buscar'}
          />
          <ButtonComponent
            type="button"
            variant="success"
            disabled={loadingSafetyCompliance || loadingToggleStatus}
            className="flex-1 md:flex-none"
            label="Nuevo cumplimiento"
            onClick={() => navigate(AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE_CREATE)}
          />
          <ToolbarActionsDropdownComponent
            disabled={loadingSafetyCompliance || loadingToggleStatus || downloadingReport || uploadingBulk}
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
        columns={safetyComplianceTableColumns}
        rows={safetyComplianceRows}
        loading={loadingSafetyCompliance}
        emptyMessage="No hay registros de cumplimiento de seguridad."
        customRenderer={renderCustomCell}
        actionsConfig={{
          columnIndex: ACTIONS_COLUMN_INDEX,
          resolveRowActions: resolveRowActionsFromTableRow,
          resolveOpenDirection: (activeRowIndex, rowsLength) => (
            activeRowIndex >= Math.max(rowsLength - 2, 0) ? 'up' : 'down'
          ),
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
          loading={loadingSafetyCompliance || loadingToggleStatus}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>

      <RightSidebarComponent open={filtersOpen} title="Filtros" onClose={() => setFiltersOpen(false)}>
        <div className="space-y-4">
          <SelectComponent
            value={filters.activeId}
            label="Estado"
            options={statusSelectOptions}
            onValueChange={handleActiveFilterChange}
          />

          <div className="space-y-3 rounded-xl border border-emerald-500/35 bg-emerald-50/20 p-3 dark:border-emerald-400/25 dark:bg-emerald-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Fecha creación
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
              Fecha actualización
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
              disabled={loadingSafetyCompliance || loadingToggleStatus || loadingStatusOptions}
              label="Limpiar"
              onClick={() => { void handleClearFilters() }}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loadingSafetyCompliance || loadingToggleStatus || loadingStatusOptions}
              className="text-white dark:text-white"
              label={loadingStatusOptions ? 'Aplicando...' : 'Aplicar'}
              onClick={() => { void handleApplyFilters() }}
            />
          </div>
        </div>
      </RightSidebarComponent>

      <DetailSidebarComponent open={detailOpen} title={detailTitle} onClose={handleCloseDetail}>
        <SafetyComplianceDetailComponent
          key={selectedDetailRowId ?? 'empty-safety-compliance-detail'}
          detail={safetyComplianceDetailView}
          loading={loadingSafetyComplianceDetail}
          errorMessage={detailError}
          onRetry={handleRetryDetail}
          onEdit={
            selectedDetailRowId
              ? () => navigate(`${AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE_EDIT}=${selectedDetailRowId}`)
              : undefined
          }
        />
      </DetailSidebarComponent>

      <SaveConfirmComponent
        open={confirmOpen}
        title="Confirmar actualización de estado"
        message={confirmMessage}
        confirmLabel={pendingToggleRow?.active === true ? 'Deshabilitar' : 'Habilitar'}
        cancelLabel="Cancelar"
        loading={loadingToggleStatus}
        onClose={handleCloseConfirm}
        onConfirm={() => { void handleConfirmToggleStatus() }}
      />
    </section>
  )
}
