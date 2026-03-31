import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DetailSidebarComponent,
  InputComponent,
  QualityOfWorkDetailComponent,
  PaginationComponent,
  RightSidebarComponent,
  SaveConfirmComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  TableComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import {
  AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY,
  AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY_CREATE,
  AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY_EDIT,
} from '@/constant'
import {
  qualityOfWorkTableColumns,
  qualityOfWorkTableColumnIndex,
  qualityOfWorkTableSortByColumn,
} from '@/factories'
import { mapperQualityOfWorkDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { qualityOfWorkService } from '@/services'
import { useStoreAuth, useStoreQualityOfWork, useStoreSelects } from '@/store'
import type { QualityOfWorkTableRow, TableRow, TableSortState } from '@/types'
import {
  createQualityOfWorkActions,
  createQualityOfWorkTableCustomRenderer,
  downloadBlobFile,
  formatCsvImportSummary,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const NAME_COLUMN_INDEX = qualityOfWorkTableColumnIndex.name
const STATUS_COLUMN_INDEX = qualityOfWorkTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = qualityOfWorkTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(qualityOfWorkTableSortByColumn).map((index) => Number(index))

export default function SettlementsWorkQualityDashboardPage() {
  const navigate = useNavigate()
  const qualityOfWorkRows = useStoreQualityOfWork((s) => s.qualityOfWorkRows)
  const qualityOfWorkDetail = useStoreQualityOfWork((s) => s.qualityOfWorkDetail)
  const pagination = useStoreQualityOfWork((s) => s.pagination)
  const queryParams = useStoreQualityOfWork((s) => s.queryParams)
  const loadingQualityOfWork = useStoreQualityOfWork((s) => s.loadingQualityOfWork)
  const loadingQualityOfWorkDetail = useStoreQualityOfWork((s) => s.loadingQualityOfWorkDetail)
  const loadingToggleStatus = useStoreQualityOfWork((s) => s.loadingToggleStatus)
  const listError = useStoreQualityOfWork((s) => s.operationStatus.list.error)
  const detailError = useStoreQualityOfWork((s) => s.operationStatus.detail.error)
  const toggleError = useStoreQualityOfWork((s) => s.operationStatus.toggle.error)
  const clearOperationStatus = useStoreQualityOfWork((s) => s.clearOperationStatus)
  const getQualityOfWork = useStoreQualityOfWork((s) => s.getQualityOfWork)
  const getQualityOfWorkDetail = useStoreQualityOfWork((s) => s.getQualityOfWorkDetail)
  const goToPage = useStoreQualityOfWork((s) => s.goToPage)
  const setSearch = useStoreQualityOfWork((s) => s.setSearch)
  const searchQualityOfWork = useStoreQualityOfWork((s) => s.searchQualityOfWork)
  const sortQualityOfWork = useStoreQualityOfWork((s) => s.sortQualityOfWork)
  const setActiveFilter = useStoreQualityOfWork((s) => s.setActiveFilter)
  const setCreatedDateRange = useStoreQualityOfWork((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreQualityOfWork((s) => s.setUpdatedDateRange)
  const clearActiveFilter = useStoreQualityOfWork((s) => s.clearActiveFilter)
  const clearCreatedDateRange = useStoreQualityOfWork((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreQualityOfWork((s) => s.clearUpdatedDateRange)
  const toggleQualityOfWorkStatus = useStoreQualityOfWork((s) => s.toggleQualityOfWorkStatus)
  const clearQualityOfWorkDetail = useStoreQualityOfWork((s) => s.clearQualityOfWorkDetail)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canToggleQualityOfWorkStatus = hasPermission('QUALITY_OF_WORK', 'canUpdate')

  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingStatusOptions = useStoreSelects((s) => s.loadingStatusOptions)
  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)

  const {
    actionViewDetail,
    actionUpdateQualityOfWork,
    actionToggleStatus,
  } = createQualityOfWorkActions()

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
  const [pendingToggleRow, setPendingToggleRow] = useState<QualityOfWorkTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [uploadingBulk, setUploadingBulk] = useState(false)
  const bulkUploadInputRef = useRef<HTMLInputElement | null>(null)

  const qualityOfWorkDetailView = mapperQualityOfWorkDetailView(qualityOfWorkDetail)
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const statusSelectOptions = statusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const activeSortColumn = SORTABLE_COLUMNS.find((index) => qualityOfWorkTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  useEffect(() => {
    void getQualityOfWork()
    void getStatusOptions()
  }, [getQualityOfWork, getStatusOptions])

  const handleViewDetail = (row: QualityOfWorkTableRow) => {
    setSelectedDetailRowId(row.id)
    setDetailOpen(true)
    void getQualityOfWorkDetail(row.id)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
    clearQualityOfWorkDetail()
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getQualityOfWorkDetail(selectedDetailRowId)
  }

  const handleUpdateQualityOfWork = (row: QualityOfWorkTableRow) => {
    navigate(`${AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY_EDIT}=${row.id}`)
  }

  const handleToggleStatus = (row: QualityOfWorkTableRow) => {
    setPendingToggleRow(row)
    setConfirmOpen(true)
  }

  const resolveRowActions = (row: QualityOfWorkTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => handleViewDetail(row)),
      actionUpdateQualityOfWork(() => handleUpdateQualityOfWork(row)),
    ]

    if (canToggleQualityOfWorkStatus) {
      actions.push(actionToggleStatus(row.active === true, () => handleToggleStatus(row)))
    }

    return actions
  }

  const findQualityOfWorkRowById = (rowId: string) => qualityOfWorkRows.find((row) => row.id === rowId) ?? null
  const handleViewDetailById = (rowId: string) => {
    const qualityOfWorkRow = findQualityOfWorkRowById(rowId)
    if (!qualityOfWorkRow) return
    handleViewDetail(qualityOfWorkRow)
  }
  const getStatusEnabled = (rowId: string) => Boolean(findQualityOfWorkRowById(rowId)?.active)
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const qualityOfWorkRow = findQualityOfWorkRowById(tableRow.id)
    if (!qualityOfWorkRow) return []
    return resolveRowActions(qualityOfWorkRow)
  }

  const renderCustomCell = createQualityOfWorkTableCustomRenderer({
    nameColumnIndex: NAME_COLUMN_INDEX,
    statusColumnIndex: STATUS_COLUMN_INDEX,
    onViewDetail: handleViewDetailById,
    getStatusEnabled,
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = qualityOfWorkTableSortByColumn[columnIndex]
    if (!sortBy) return

    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === 'asc' ? 'desc' : 'asc'
    await sortQualityOfWork(sortBy, nextSortDir)
  }

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }
  const handleActiveFilterChange = (value: string) => handleChangeFilter('activeId', value)
  const handleCreatedFromFilterChange = (value: string) => handleChangeFilter('createdFrom', value)
  const handleCreatedToFilterChange = (value: string) => handleChangeFilter('createdTo', value)
  const handleUpdatedFromFilterChange = (value: string) => handleChangeFilter('updatedFrom', value)
  const handleUpdatedToFilterChange = (value: string) => handleChangeFilter('updatedTo', value)

  const handleApplyFilters = async () => {
    const selectedStatus = statusOptions.find((option) => String(option.id) === filters.activeId)
    setActiveFilter(selectedStatus ? String(selectedStatus.id) : '')
    setCreatedDateRange({ createdFrom: filters.createdFrom.trim(), createdTo: filters.createdTo.trim() })
    setUpdatedDateRange({ updatedFrom: filters.updatedFrom.trim(), updatedTo: filters.updatedTo.trim() })
    await searchQualityOfWork()
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
    await searchQualityOfWork()
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
    const qualityOfWorkName = pendingToggleRow.values[NAME_COLUMN_INDEX]
    const success = await toggleQualityOfWorkStatus(pendingToggleRow.id, nextStatus)
    if (success) {
      setConfirmOpen(false)
      setPendingToggleRow(null)
      await getQualityOfWork()
      navigate(AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActionsMessage(
        `${qualityOfWorkName} ${
          nextStatus
            ? messages.qualityOfWork.status.success.toggleEnabledSuccess
            : messages.qualityOfWork.status.success.toggleDisabledSuccess
        }`,
      )
    }
  }

  const handleDownloadReport = async () => {
    if (downloadingReport) return

    try {
      setDownloadingReport(true)
      const csvBlob = await qualityOfWorkService.exportQualityOfWorkCsv()
      downloadBlobFile(csvBlob, 'quality-of-work.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch (error) {
      if (qualityOfWorkService.isAxiosError(error)) {
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
      const result = await qualityOfWorkService.importQualityOfWorkCsv(file)
      setActionsMessage(formatCsvImportSummary(result))
      await getQualityOfWork()
    } catch (error) {
      if (qualityOfWorkService.isAxiosError(error)) {
        setActionsMessage(error.response?.data?.message || 'No se pudo realizar la carga masiva.')
      } else {
        setActionsMessage('No se pudo realizar la carga masiva.')
      }
    } finally {
      setUploadingBulk(false)
    }
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.active === true ? 'deshabilitar' : 'habilitar'} la calidad ${pendingToggleRow.values[NAME_COLUMN_INDEX]}?`
    : ''
  const detailTitle = qualityOfWorkDetailView
    ? `Detalle de ${qualityOfWorkDetailView.nameDisplay}`
    : messages.qualityOfWork.ui.detailTitleFallback

  return (
    <section className="min-w-0 space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">Dashboard de calidad del trabajo</h1>
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
          void searchQualityOfWork()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingQualityOfWork || loadingToggleStatus}
            label="Filtro"
            onClick={() => setFiltersOpen(true)}
          />
          <div className="min-w-0 flex-1">
            <InputComponent
              value={queryParams.search}
              type="text"
              placeholder="Buscar por nombre o descripcion"
              onValueChange={setSearch}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loadingQualityOfWork || loadingToggleStatus}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingQualityOfWork ? 'Buscando...' : 'Buscar'}
          />
          <ButtonComponent
            type="button"
            variant="primary"
            disabled={loadingQualityOfWork || loadingToggleStatus}
            className="flex-1 text-white md:flex-none dark:text-white"
            label="Nueva calidad"
            onClick={() => navigate(AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY_CREATE)}
          />
          <ToolbarActionsDropdownComponent
            disabled={loadingQualityOfWork || loadingToggleStatus || downloadingReport || uploadingBulk}
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
        columns={qualityOfWorkTableColumns}
        rows={qualityOfWorkRows}
        loading={loadingQualityOfWork}
        emptyMessage="No hay registros de calidad del trabajo."
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
          loading={loadingQualityOfWork || loadingToggleStatus}
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
              Fecha creacion
            </p>
            <div className="grid gap-2">
              <InputComponent
                id="quality-of-work-created-from"
                value={filters.createdFrom}
                label="Desde"
                type="date"
                aria-label="Fecha creacion desde"
                onValueChange={handleCreatedFromFilterChange}
              />
              <InputComponent
                id="quality-of-work-created-to"
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
                id="quality-of-work-updated-from"
                value={filters.updatedFrom}
                label="Desde"
                type="date"
                aria-label="Fecha actualizacion desde"
                onValueChange={handleUpdatedFromFilterChange}
              />
              <InputComponent
                id="quality-of-work-updated-to"
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
              disabled={loadingQualityOfWork || loadingToggleStatus || loadingStatusOptions}
              label="Limpiar"
              onClick={() => { void handleClearFilters() }}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loadingQualityOfWork || loadingToggleStatus || loadingStatusOptions}
              className="text-white dark:text-white"
              label={loadingStatusOptions ? 'Aplicando...' : 'Aplicar'}
              onClick={() => { void handleApplyFilters() }}
            />
          </div>
        </div>
      </RightSidebarComponent>

      <DetailSidebarComponent open={detailOpen} title={detailTitle} onClose={handleCloseDetail}>
        <QualityOfWorkDetailComponent
          key={selectedDetailRowId ?? 'empty-quality-of-work-detail'}
          detail={qualityOfWorkDetailView}
          loading={loadingQualityOfWorkDetail}
          errorMessage={detailError}
          onRetry={handleRetryDetail}
        />
      </DetailSidebarComponent>

      <SaveConfirmComponent
        open={confirmOpen}
        title="Confirmar actualizacion de estado"
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
