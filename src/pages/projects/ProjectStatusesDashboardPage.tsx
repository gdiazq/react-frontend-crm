import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DateRangePickerComponent,
  DetailSidebarComponent,
  InputComponent,
  PaginationComponent,
  ProjectStatusDetailComponent,
  RightSidebarComponent,
  SaveConfirmComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  TableComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AUTH_ROUTE_PROJECT_STATUSES, AUTH_ROUTE_PROJECT_STATUSES_CREATE, AUTH_ROUTE_PROJECT_STATUSES_EDIT } from '@/constant'
import { projectStatusesTableColumns, projectStatusesTableColumnIndex, projectStatusesTableSortByColumn } from '@/factories'
import { mapperProjectStatusDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { projectStatusesService } from '@/services'
import { useStoreAuth, useStoreProjectStatuses, useStoreSelects } from '@/store'
import type { ProjectStatusTableRow, TableRow, TableSortState } from '@/types'
import { createProjectStatusesActions, createProjectStatusesTableCustomRenderer, downloadBlobFile, formatCsvImportSummary } from '@/utils'
import type { DropdownAction } from '@/utils'

const PROJECT_STATUS_NAME_COLUMN_INDEX = projectStatusesTableColumnIndex.name
const PROJECT_STATUS_STATUS_COLUMN_INDEX = projectStatusesTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = projectStatusesTableColumns.length - 1
const PROJECT_STATUSES_SORTABLE_COLUMNS = Object.keys(projectStatusesTableSortByColumn).map((index) => Number(index))

export default function ProjectStatusesDashboardPage() {
  const navigate = useNavigate()
  const projectStatusesRows = useStoreProjectStatuses((s) => s.projectStatusesRows)
  const projectStatusDetail = useStoreProjectStatuses((s) => s.projectStatusDetail)
  const pagination = useStoreProjectStatuses((s) => s.pagination)
  const queryParams = useStoreProjectStatuses((s) => s.queryParams)
  const loadingProjectStatuses = useStoreProjectStatuses((s) => s.loadingProjectStatuses)
  const loadingProjectStatusDetail = useStoreProjectStatuses((s) => s.loadingProjectStatusDetail)
  const loadingToggleStatus = useStoreProjectStatuses((s) => s.loadingToggleStatus)
  const listError = useStoreProjectStatuses((s) => s.operationStatus.list.error)
  const detailError = useStoreProjectStatuses((s) => s.operationStatus.detail.error)
  const toggleError = useStoreProjectStatuses((s) => s.operationStatus.toggle.error)
  const clearOperationStatus = useStoreProjectStatuses((s) => s.clearOperationStatus)
  const getProjectStatuses = useStoreProjectStatuses((s) => s.getProjectStatuses)
  const getProjectStatusDetail = useStoreProjectStatuses((s) => s.getProjectStatusDetail)
  const goToPage = useStoreProjectStatuses((s) => s.goToPage)
  const setSearch = useStoreProjectStatuses((s) => s.setSearch)
  const searchProjectStatuses = useStoreProjectStatuses((s) => s.searchProjectStatuses)
  const sortProjectStatuses = useStoreProjectStatuses((s) => s.sortProjectStatuses)
  const setActiveFilter = useStoreProjectStatuses((s) => s.setActiveFilter)
  const setCreatedDateRange = useStoreProjectStatuses((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreProjectStatuses((s) => s.setUpdatedDateRange)
  const clearActiveFilter = useStoreProjectStatuses((s) => s.clearActiveFilter)
  const clearCreatedDateRange = useStoreProjectStatuses((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreProjectStatuses((s) => s.clearUpdatedDateRange)
  const toggleProjectStatusStatus = useStoreProjectStatuses((s) => s.toggleProjectStatusStatus)
  const clearProjectStatusDetail = useStoreProjectStatuses((s) => s.clearProjectStatusDetail)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canToggleProjectStatusStatus = hasPermission('PROJECT_STATUS', 'canUpdate')

  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingStatusOptions = useStoreSelects((s) => s.loadingStatusOptions)
  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)

  const { actionViewDetail, actionUpdateProjectStatus, actionToggleStatus } = createProjectStatusesActions()

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
  const [pendingToggleRow, setPendingToggleRow] = useState<ProjectStatusTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [uploadingBulk, setUploadingBulk] = useState(false)
  const bulkUploadInputRef = useRef<HTMLInputElement | null>(null)

  const projectStatusDetailView = mapperProjectStatusDetailView(projectStatusDetail)
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const statusSelectOptions = statusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const activeSortColumn = PROJECT_STATUSES_SORTABLE_COLUMNS.find((index) => projectStatusesTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  useEffect(() => {
    void getProjectStatuses()
    void getStatusOptions()
  }, [getProjectStatuses, getStatusOptions])

  const handleViewDetail = (row: ProjectStatusTableRow) => {
    setSelectedDetailRowId(row.id)
    setDetailOpen(true)
    void getProjectStatusDetail(row.id)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
    clearProjectStatusDetail()
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getProjectStatusDetail(selectedDetailRowId)
  }

  const handleUpdateProjectStatus = (row: ProjectStatusTableRow) => {
    navigate(`${AUTH_ROUTE_PROJECT_STATUSES_EDIT}=${row.id}`)
  }

  const handleToggleStatus = (row: ProjectStatusTableRow) => {
    setPendingToggleRow(row)
    setConfirmOpen(true)
  }

  const resolveRowActions = (row: ProjectStatusTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => handleViewDetail(row)),
      actionUpdateProjectStatus(() => handleUpdateProjectStatus(row)),
    ]

    if (canToggleProjectStatusStatus) {
      actions.push(actionToggleStatus(row.active === true, () => handleToggleStatus(row)))
    }

    return actions
  }

  const findProjectStatusRowById = (rowId: string) => projectStatusesRows.find((row) => row.id === rowId) ?? null
  const handleViewDetailById = (rowId: string) => {
    const projectStatusRow = findProjectStatusRowById(rowId)
    if (!projectStatusRow) return
    handleViewDetail(projectStatusRow)
  }
  const getProjectStatusStatusEnabled = (rowId: string) => Boolean(findProjectStatusRowById(rowId)?.active)
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const projectStatusRow = findProjectStatusRowById(tableRow.id)
    if (!projectStatusRow) return []
    return resolveRowActions(projectStatusRow)
  }

  const renderCustomCell = createProjectStatusesTableCustomRenderer({
    nameColumnIndex: PROJECT_STATUS_NAME_COLUMN_INDEX,
    statusColumnIndex: PROJECT_STATUS_STATUS_COLUMN_INDEX,
    onViewDetail: handleViewDetailById,
    getStatusEnabled: getProjectStatusStatusEnabled,
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = projectStatusesTableSortByColumn[columnIndex]
    if (!sortBy) return

    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === 'asc' ? 'desc' : 'asc'

    await sortProjectStatuses(sortBy, nextSortDir)
  }

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }
  const handleActiveFilterChange = (value: string) => handleChangeFilter('activeId', value)
  const handleApplyFilters = async () => {
    const selectedStatus = statusOptions.find((option) => String(option.id) === filters.activeId)
    setActiveFilter(selectedStatus ? String(selectedStatus.id) : '')
    setCreatedDateRange({
      createdFrom: filters.createdFrom.trim(),
      createdTo: filters.createdTo.trim(),
    })
    setUpdatedDateRange({
      updatedFrom: filters.updatedFrom.trim(),
      updatedTo: filters.updatedTo.trim(),
    })
    await searchProjectStatuses()
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
    await searchProjectStatuses()
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
    const projectStatusName = pendingToggleRow.values[PROJECT_STATUS_NAME_COLUMN_INDEX]
    const success = await toggleProjectStatusStatus(pendingToggleRow.id, nextStatus)
    if (success) {
      setConfirmOpen(false)
      setPendingToggleRow(null)
      await getProjectStatuses()
      navigate(AUTH_ROUTE_PROJECT_STATUSES)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActionsMessage(
        `${projectStatusName} ${
          nextStatus ? messages.projectStatuses.status.success.toggleEnabledSuccess : messages.projectStatuses.status.success.toggleDisabledSuccess
        }`,
      )
    }
  }

  const handleDownloadReport = async () => {
    if (downloadingReport) return

    try {
      setDownloadingReport(true)
      const csvBlob = await projectStatusesService.exportProjectStatusesCsv()
      downloadBlobFile(csvBlob, 'project-statuses.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch (error) {
      if (projectStatusesService.isAxiosError(error)) {
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
      const result = await projectStatusesService.importProjectStatusesCsv(file)
      setActionsMessage(formatCsvImportSummary(result))
      await getProjectStatuses()
    } catch (error) {
      if (projectStatusesService.isAxiosError(error)) {
        setActionsMessage(error.response?.data?.message || 'No se pudo realizar la carga masiva.')
      } else {
        setActionsMessage('No se pudo realizar la carga masiva.')
      }
    } finally {
      setUploadingBulk(false)
    }
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.active === true ? 'deshabilitar' : 'habilitar'} la vigencia ${pendingToggleRow.values[PROJECT_STATUS_NAME_COLUMN_INDEX]}?`
    : ''
  const detailTitle = projectStatusDetailView
    ? `Detalle de ${projectStatusDetailView.nameDisplay}`
    : messages.projectStatuses.ui.detailTitleFallback

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · VIGENCIAS</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de vigencias</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total vigencias"
        activeLabel="Vigencias activas"
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
          void searchProjectStatuses()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingProjectStatuses || loadingToggleStatus}
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
            disabled={loadingProjectStatuses || loadingToggleStatus}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingProjectStatuses ? 'Buscando...' : 'Buscar'}
          />
          <ButtonComponent
            type="button"
            variant="success"
            disabled={loadingProjectStatuses || loadingToggleStatus}
            className="flex-1 md:flex-none"
            label="Nueva vigencia"
            onClick={() => navigate(AUTH_ROUTE_PROJECT_STATUSES_CREATE)}
          />
          <ToolbarActionsDropdownComponent
            disabled={loadingProjectStatuses || loadingToggleStatus || downloadingReport || uploadingBulk}
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
        columns={projectStatusesTableColumns}
        rows={projectStatusesRows}
        loading={loadingProjectStatuses}
        emptyMessage="No hay vigencias de proyecto registradas."
        customRenderer={renderCustomCell}
        actionsConfig={{
          columnIndex: ACTIONS_COLUMN_INDEX,
          resolveRowActions: resolveRowActionsFromTableRow,
          resolveOpenDirection: (activeRowIndex, rowsLength) => (
            activeRowIndex >= Math.max(rowsLength - 2, 0) ? 'up' : 'down'
          ),
        }}
        sortableColumnIndexes={PROJECT_STATUSES_SORTABLE_COLUMNS}
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
          loading={loadingProjectStatuses || loadingToggleStatus}
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
              disabled={loadingProjectStatuses || loadingToggleStatus || loadingStatusOptions}
              label="Limpiar"
              onClick={() => { void handleClearFilters() }}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loadingProjectStatuses || loadingToggleStatus || loadingStatusOptions}
              className="text-white dark:text-white"
              label={loadingStatusOptions ? 'Aplicando...' : 'Aplicar'}
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
        <ProjectStatusDetailComponent
          key={selectedDetailRowId ?? 'empty-project-status-detail'}
          detail={projectStatusDetailView}
          loading={loadingProjectStatusDetail}
          errorMessage={detailError}
          onRetry={handleRetryDetail}
          onEdit={
            selectedDetailRowId
              ? () => navigate(`${AUTH_ROUTE_PROJECT_STATUSES_EDIT}=${selectedDetailRowId}`)
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
