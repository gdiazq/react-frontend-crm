import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DateRangePickerComponent,
  DetailSidebarComponent,
  InputComponent,
  LegalTerminationCauseDetailComponent,
  PaginationComponent,
  RightSidebarComponent,
  SaveConfirmComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  TableComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import {
  AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES,
  AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES_CREATE,
  AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES_EDIT,
  PermissionAction,
  PermissionModule,
  SortDirection,
} from '@/constant'
import {
  legalTerminationCausesTableColumns,
  legalTerminationCausesTableColumnIndex,
  legalTerminationCausesTableSortByColumn,
} from '@/factories'
import {
  mapperLegalTerminationCauseDetailView,
} from '@/mappers'
import messages from '@/messages/messages'
import { legalTerminationCausesService } from '@/services'
import { useStoreAuth, useStoreLegalTerminationCauses, useStoreSelects } from '@/store'
import type { LegalTerminationCauseTableRow, TableRow, TableSortState } from '@/types'
import {
  createLegalTerminationCausesActions,
  createTableCustomRenderer,
  downloadBlobFile,
  formatCsvImportSummary,
  renderStatusBadge,
  renderViewDetailButton,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const NAME_COLUMN_INDEX = legalTerminationCausesTableColumnIndex.name
const STATUS_COLUMN_INDEX = legalTerminationCausesTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = legalTerminationCausesTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(legalTerminationCausesTableSortByColumn).map((index) => Number(index))

export default function SettlementsTerminationDashboardPage() {
  const navigate = useNavigate()
  const legalTerminationCausesRows = useStoreLegalTerminationCauses((s) => s.legalTerminationCausesRows)
  const legalTerminationCauseDetail = useStoreLegalTerminationCauses((s) => s.legalTerminationCauseDetail)
  const pagination = useStoreLegalTerminationCauses((s) => s.pagination)
  const queryParams = useStoreLegalTerminationCauses((s) => s.queryParams)
  const loadingLegalTerminationCauses = useStoreLegalTerminationCauses((s) => s.operationLoading.list)
  const loadingLegalTerminationCauseDetail = useStoreLegalTerminationCauses((s) => s.operationLoading.detail)
  const loadingToggleStatus = useStoreLegalTerminationCauses((s) => s.operationLoading.toggle)
  const listError = useStoreLegalTerminationCauses((s) => s.operationStatus.list.error)
  const detailError = useStoreLegalTerminationCauses((s) => s.operationStatus.detail.error)
  const toggleError = useStoreLegalTerminationCauses((s) => s.operationStatus.toggle.error)
  const clearOperationStatus = useStoreLegalTerminationCauses((s) => s.clearOperationStatus)
  const getLegalTerminationCauses = useStoreLegalTerminationCauses((s) => s.getLegalTerminationCauses)
  const getLegalTerminationCauseDetail = useStoreLegalTerminationCauses((s) => s.getLegalTerminationCauseDetail)
  const goToPage = useStoreLegalTerminationCauses((s) => s.goToPage)
  const setSearch = useStoreLegalTerminationCauses((s) => s.setSearch)
  const searchLegalTerminationCauses = useStoreLegalTerminationCauses((s) => s.searchLegalTerminationCauses)
  const sortLegalTerminationCauses = useStoreLegalTerminationCauses((s) => s.sortLegalTerminationCauses)
  const setActiveFilter = useStoreLegalTerminationCauses((s) => s.setActiveFilter)
  const setCreatedDateRange = useStoreLegalTerminationCauses((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreLegalTerminationCauses((s) => s.setUpdatedDateRange)
  const clearActiveFilter = useStoreLegalTerminationCauses((s) => s.clearActiveFilter)
  const clearCreatedDateRange = useStoreLegalTerminationCauses((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreLegalTerminationCauses((s) => s.clearUpdatedDateRange)
  const toggleLegalTerminationCauseStatus = useStoreLegalTerminationCauses((s) => s.toggleLegalTerminationCauseStatus)
  const clearLegalTerminationCauseDetail = useStoreLegalTerminationCauses((s) => s.clearLegalTerminationCauseDetail)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canToggleLegalTerminationCauseStatus = hasPermission(PermissionModule.LegalTerminationCause, PermissionAction.Update)

  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingStatusOptions = useStoreSelects((s) => s.loadingStatusOptions)
  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)

  const {
    actionViewDetail,
    actionUpdateLegalTerminationCause,
    actionToggleStatus,
  } = createLegalTerminationCausesActions()

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
  const [pendingToggleRow, setPendingToggleRow] = useState<LegalTerminationCauseTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [uploadingBulk, setUploadingBulk] = useState(false)
  const bulkUploadInputRef = useRef<HTMLInputElement | null>(null)

  const legalTerminationCauseDetailView = mapperLegalTerminationCauseDetailView(legalTerminationCauseDetail)
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const statusSelectOptions = statusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const activeSortColumn = SORTABLE_COLUMNS.find((index) => legalTerminationCausesTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  useEffect(() => {
    void getLegalTerminationCauses()
    void getStatusOptions()
  }, [getLegalTerminationCauses, getStatusOptions])

  const handleViewDetail = (row: LegalTerminationCauseTableRow) => {
    setSelectedDetailRowId(row.id)
    setDetailOpen(true)
    void getLegalTerminationCauseDetail(row.id)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
    clearLegalTerminationCauseDetail()
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getLegalTerminationCauseDetail(selectedDetailRowId)
  }

  const handleUpdateLegalTerminationCause = (row: LegalTerminationCauseTableRow) => {
    navigate(`${AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES_EDIT}=${row.id}`)
  }

  const handleToggleStatus = (row: LegalTerminationCauseTableRow) => {
    setPendingToggleRow(row)
    setConfirmOpen(true)
  }

  const resolveRowActions = (row: LegalTerminationCauseTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => handleViewDetail(row)),
      actionUpdateLegalTerminationCause(() => handleUpdateLegalTerminationCause(row)),
    ]

    if (canToggleLegalTerminationCauseStatus) {
      actions.push(actionToggleStatus(row.active === true, () => handleToggleStatus(row)))
    }

    return actions
  }

  const findLegalTerminationCauseRowById = (rowId: string) => legalTerminationCausesRows.find((row) => row.id === rowId) ?? null
  const handleViewDetailById = (rowId: string) => {
    const legalTerminationCauseRow = findLegalTerminationCauseRowById(rowId)
    if (!legalTerminationCauseRow) return
    handleViewDetail(legalTerminationCauseRow)
  }
  const getStatusEnabled = (rowId: string) => Boolean(findLegalTerminationCauseRowById(rowId)?.active)
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const legalTerminationCauseRow = findLegalTerminationCauseRowById(tableRow.id)
    if (!legalTerminationCauseRow) return []
    return resolveRowActions(legalTerminationCauseRow)
  }

  const renderCustomCell = createTableCustomRenderer({
    [NAME_COLUMN_INDEX]: ({ row, value }) => renderViewDetailButton(value, () => handleViewDetailById(row.id)),
    [STATUS_COLUMN_INDEX]: ({ row }) => renderStatusBadge(getStatusEnabled(row.id)),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = legalTerminationCausesTableSortByColumn[columnIndex]
    if (!sortBy) return

    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc
    await sortLegalTerminationCauses(sortBy, nextSortDir)
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
    await searchLegalTerminationCauses()
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
    await searchLegalTerminationCauses()
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
    const legalTerminationCauseName = pendingToggleRow.values[NAME_COLUMN_INDEX]
    const success = await toggleLegalTerminationCauseStatus(pendingToggleRow.id, nextStatus)
    if (success) {
      setConfirmOpen(false)
      setPendingToggleRow(null)
      await getLegalTerminationCauses()
      navigate(AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActionsMessage(
        `${legalTerminationCauseName} ${
          nextStatus ? messages.legalTerminationCauses.status.success.toggleEnabledSuccess : messages.legalTerminationCauses.status.success.toggleDisabledSuccess
        }`,
      )
    }
  }

  const handleDownloadReport = async () => {
    if (downloadingReport) return

    try {
      setDownloadingReport(true)
      const csvBlob = await legalTerminationCausesService.exportLegalTerminationCausesCsv()
      downloadBlobFile(csvBlob, 'legal-termination-causes.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch (error) {
      if (legalTerminationCausesService.isAxiosError(error)) {
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
      const result = await legalTerminationCausesService.importLegalTerminationCausesCsv(file)
      setActionsMessage(formatCsvImportSummary(result))
      await getLegalTerminationCauses()
    } catch (error) {
      if (legalTerminationCausesService.isAxiosError(error)) {
        setActionsMessage(error.response?.data?.message || 'No se pudo realizar la carga masiva.')
      } else {
        setActionsMessage('No se pudo realizar la carga masiva.')
      }
    } finally {
      setUploadingBulk(false)
    }
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.active === true ? 'deshabilitar' : 'habilitar'} la causa ${pendingToggleRow.values[NAME_COLUMN_INDEX]}?`
    : ''
  const detailTitle = legalTerminationCauseDetailView
    ? `Detalle de ${legalTerminationCauseDetailView.nameDisplay}`
    : messages.legalTerminationCauses.ui.detailTitleFallback

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · TERMINACIÓN</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de terminación</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total causas"
        activeLabel="Causas activas"
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
          void searchLegalTerminationCauses()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingLegalTerminationCauses || loadingToggleStatus}
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
            disabled={loadingLegalTerminationCauses || loadingToggleStatus}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingLegalTerminationCauses ? 'Buscando...' : 'Buscar'}
          />
          <ButtonComponent
            type="button"
            variant="success"
            disabled={loadingLegalTerminationCauses || loadingToggleStatus}
            className="flex-1 md:flex-none"
            label="Nueva causa"
            onClick={() => navigate(AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES_CREATE)}
          />
          <ToolbarActionsDropdownComponent
            disabled={loadingLegalTerminationCauses || loadingToggleStatus || downloadingReport || uploadingBulk}
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
        columns={legalTerminationCausesTableColumns}
        rows={legalTerminationCausesRows}
        loading={loadingLegalTerminationCauses}
        emptyMessage="No hay causas legales de terminación registradas."
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
          loading={loadingLegalTerminationCauses || loadingToggleStatus}
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
              disabled={loadingLegalTerminationCauses || loadingToggleStatus || loadingStatusOptions}
              label="Limpiar"
              onClick={() => { void handleClearFilters() }}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loadingLegalTerminationCauses || loadingToggleStatus || loadingStatusOptions}
              className="text-white dark:text-white"
              label={loadingStatusOptions ? 'Aplicando...' : 'Aplicar'}
              onClick={() => { void handleApplyFilters() }}
            />
          </div>
        </div>
      </RightSidebarComponent>

      <DetailSidebarComponent open={detailOpen} title={detailTitle} onClose={handleCloseDetail}>
        <LegalTerminationCauseDetailComponent
          key={selectedDetailRowId ?? 'empty-legal-termination-cause-detail'}
          detail={legalTerminationCauseDetailView}
          loading={loadingLegalTerminationCauseDetail}
          errorMessage={detailError}
          onRetry={handleRetryDetail}
          onEdit={
            selectedDetailRowId
              ? () => navigate(`${AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES_EDIT}=${selectedDetailRowId}`)
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
