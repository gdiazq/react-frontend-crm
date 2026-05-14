import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DateRangePickerComponent,
  DetailSidebarComponent,
  InputComponent,
  NoRehireCauseDetailComponent,
  PaginationComponent,
  RightSidebarComponent,
  SaveConfirmComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  TableComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import {
  AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE,
  AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE_CREATE,
  AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE_EDIT,
  PermissionAction,
  PermissionModule,
  SortDirection,
} from '@/constant'
import { noRehireCauseTableColumns, noRehireCauseTableColumnIndex, noRehireCauseTableSortByColumn } from '@/factories'
import { mapperNoRehireCauseDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { noRehireCauseService } from '@/services'
import { useStoreAuth, useStoreNoRehireCause, useStoreSelects } from '@/store'
import type { NoRehireCauseTableRow, TableRow, TableSortState } from '@/types'
import {
  createNoRehireCauseActions,
  createNoRehireCauseTableCustomRenderer,
  downloadBlobFile,
  formatCsvImportSummary,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const NAME_COLUMN_INDEX = noRehireCauseTableColumnIndex.name
const STATUS_COLUMN_INDEX = noRehireCauseTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = noRehireCauseTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(noRehireCauseTableSortByColumn).map((index) => Number(index))

export default function NoRehireCauseDashboardPage() {
  const navigate = useNavigate()
  const noRehireCauseRows = useStoreNoRehireCause((s) => s.noRehireCauseRows)
  const noRehireCauseDetail = useStoreNoRehireCause((s) => s.noRehireCauseDetail)
  const pagination = useStoreNoRehireCause((s) => s.pagination)
  const queryParams = useStoreNoRehireCause((s) => s.queryParams)
  const loadingNoRehireCause = useStoreNoRehireCause((s) => s.loadingNoRehireCause)
  const loadingNoRehireCauseDetail = useStoreNoRehireCause((s) => s.loadingNoRehireCauseDetail)
  const loadingToggleStatus = useStoreNoRehireCause((s) => s.loadingToggleStatus)
  const listError = useStoreNoRehireCause((s) => s.operationStatus.list.error)
  const detailError = useStoreNoRehireCause((s) => s.operationStatus.detail.error)
  const toggleError = useStoreNoRehireCause((s) => s.operationStatus.toggle.error)
  const clearOperationStatus = useStoreNoRehireCause((s) => s.clearOperationStatus)
  const getNoRehireCause = useStoreNoRehireCause((s) => s.getNoRehireCause)
  const getNoRehireCauseDetail = useStoreNoRehireCause((s) => s.getNoRehireCauseDetail)
  const goToPage = useStoreNoRehireCause((s) => s.goToPage)
  const setSearch = useStoreNoRehireCause((s) => s.setSearch)
  const searchNoRehireCause = useStoreNoRehireCause((s) => s.searchNoRehireCause)
  const sortNoRehireCause = useStoreNoRehireCause((s) => s.sortNoRehireCause)
  const setActiveFilter = useStoreNoRehireCause((s) => s.setActiveFilter)
  const setCreatedDateRange = useStoreNoRehireCause((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreNoRehireCause((s) => s.setUpdatedDateRange)
  const clearActiveFilter = useStoreNoRehireCause((s) => s.clearActiveFilter)
  const clearCreatedDateRange = useStoreNoRehireCause((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreNoRehireCause((s) => s.clearUpdatedDateRange)
  const toggleNoRehireCauseStatus = useStoreNoRehireCause((s) => s.toggleNoRehireCauseStatus)
  const clearNoRehireCauseDetail = useStoreNoRehireCause((s) => s.clearNoRehireCauseDetail)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canToggleNoRehireCauseStatus = hasPermission(PermissionModule.NoRehireCause, PermissionAction.Update)

  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingStatusOptions = useStoreSelects((s) => s.loadingStatusOptions)
  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)

  const {
    actionViewDetail,
    actionUpdateNoRehireCause,
    actionToggleStatus,
  } = createNoRehireCauseActions()

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
  const [pendingToggleRow, setPendingToggleRow] = useState<NoRehireCauseTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [uploadingBulk, setUploadingBulk] = useState(false)
  const bulkUploadInputRef = useRef<HTMLInputElement | null>(null)

  const noRehireCauseDetailView = mapperNoRehireCauseDetailView(noRehireCauseDetail)
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const statusSelectOptions = statusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const activeSortColumn = SORTABLE_COLUMNS.find((index) => noRehireCauseTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  useEffect(() => {
    void getNoRehireCause()
    void getStatusOptions()
  }, [getNoRehireCause, getStatusOptions])

  const handleViewDetail = (row: NoRehireCauseTableRow) => {
    setSelectedDetailRowId(row.id)
    setDetailOpen(true)
    void getNoRehireCauseDetail(row.id)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
    clearNoRehireCauseDetail()
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getNoRehireCauseDetail(selectedDetailRowId)
  }

  const handleUpdateNoRehireCause = (row: NoRehireCauseTableRow) => {
    navigate(`${AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE_EDIT}=${row.id}`)
  }

  const handleToggleStatus = (row: NoRehireCauseTableRow) => {
    setPendingToggleRow(row)
    setConfirmOpen(true)
  }

  const resolveRowActions = (row: NoRehireCauseTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => handleViewDetail(row)),
      actionUpdateNoRehireCause(() => handleUpdateNoRehireCause(row)),
    ]

    if (canToggleNoRehireCauseStatus) {
      actions.push(actionToggleStatus(row.active === true, () => handleToggleStatus(row)))
    }

    return actions
  }

  const findNoRehireCauseRowById = (rowId: string) => noRehireCauseRows.find((row) => row.id === rowId) ?? null
  const handleViewDetailById = (rowId: string) => {
    const noRehireCauseRow = findNoRehireCauseRowById(rowId)
    if (!noRehireCauseRow) return
    handleViewDetail(noRehireCauseRow)
  }
  const getStatusEnabled = (rowId: string) => Boolean(findNoRehireCauseRowById(rowId)?.active)
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const noRehireCauseRow = findNoRehireCauseRowById(tableRow.id)
    if (!noRehireCauseRow) return []
    return resolveRowActions(noRehireCauseRow)
  }

  const renderCustomCell = createNoRehireCauseTableCustomRenderer({
    nameColumnIndex: NAME_COLUMN_INDEX,
    statusColumnIndex: STATUS_COLUMN_INDEX,
    onViewDetail: handleViewDetailById,
    getStatusEnabled,
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = noRehireCauseTableSortByColumn[columnIndex]
    if (!sortBy) return

    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc
    await sortNoRehireCause(sortBy, nextSortDir)
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
    await searchNoRehireCause()
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
    await searchNoRehireCause()
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
    const noRehireCauseName = pendingToggleRow.values[NAME_COLUMN_INDEX]
    const success = await toggleNoRehireCauseStatus(pendingToggleRow.id, nextStatus)
    if (success) {
      setConfirmOpen(false)
      setPendingToggleRow(null)
      await getNoRehireCause()
      navigate(AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActionsMessage(
        `${noRehireCauseName} ${
          nextStatus
            ? messages.noRehireCause.status.success.toggleEnabledSuccess
            : messages.noRehireCause.status.success.toggleDisabledSuccess
        }`,
      )
    }
  }

  const handleDownloadReport = async () => {
    if (downloadingReport) return

    try {
      setDownloadingReport(true)
      const csvBlob = await noRehireCauseService.exportNoRehireCauseCsv()
      downloadBlobFile(csvBlob, 'no-re-hired-causes.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch (error) {
      if (noRehireCauseService.isAxiosError(error)) {
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
      const result = await noRehireCauseService.importNoRehireCauseCsv(file)
      setActionsMessage(formatCsvImportSummary(result))
      await getNoRehireCause()
    } catch (error) {
      if (noRehireCauseService.isAxiosError(error)) {
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
  const detailTitle = noRehireCauseDetailView
    ? `Detalle de ${noRehireCauseDetailView.nameDisplay}`
    : messages.noRehireCause.ui.detailTitleFallback

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · NO RECONTRATACIÓN</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de no recontratación</span>
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
          void searchNoRehireCause()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingNoRehireCause || loadingToggleStatus}
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
            disabled={loadingNoRehireCause || loadingToggleStatus}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingNoRehireCause ? 'Buscando...' : 'Buscar'}
          />
          <ButtonComponent
            type="button"
            variant="success"
            disabled={loadingNoRehireCause || loadingToggleStatus}
            className="flex-1 md:flex-none"
            label="Nueva causa"
            onClick={() => navigate(AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE_CREATE)}
          />
          <ToolbarActionsDropdownComponent
            disabled={loadingNoRehireCause || loadingToggleStatus || downloadingReport || uploadingBulk}
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
        columns={noRehireCauseTableColumns}
        rows={noRehireCauseRows}
        loading={loadingNoRehireCause}
        emptyMessage="No hay registros de causas de no recontratación."
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
          loading={loadingNoRehireCause || loadingToggleStatus}
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
              disabled={loadingNoRehireCause || loadingToggleStatus || loadingStatusOptions}
              label="Limpiar"
              onClick={() => { void handleClearFilters() }}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loadingNoRehireCause || loadingToggleStatus || loadingStatusOptions}
              className="text-white dark:text-white"
              label={loadingStatusOptions ? 'Aplicando...' : 'Aplicar'}
              onClick={() => { void handleApplyFilters() }}
            />
          </div>
        </div>
      </RightSidebarComponent>

      <DetailSidebarComponent open={detailOpen} title={detailTitle} onClose={handleCloseDetail}>
        <NoRehireCauseDetailComponent
          key={selectedDetailRowId ?? 'empty-no-rehire-cause-detail'}
          detail={noRehireCauseDetailView}
          loading={loadingNoRehireCauseDetail}
          errorMessage={detailError}
          onRetry={handleRetryDetail}
          onEdit={
            selectedDetailRowId
              ? () => navigate(`${AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE_EDIT}=${selectedDetailRowId}`)
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
