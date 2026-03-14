import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DetailSidebarComponent,
  InputComponent,
  PaginationComponent,
  ProjectTypeDetailComponent,
  RightSidebarComponent,
  SaveConfirmComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  TableComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AUTH_ROUTE_PROJECT_TYPES, AUTH_ROUTE_PROJECT_TYPES_CREATE, AUTH_ROUTE_PROJECT_TYPES_EDIT } from '@/constant'
import { projectTypesTableColumns, projectTypesTableColumnIndex, projectTypesTableSortByColumn } from '@/factories'
import { mapperProjectTypeDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { projectTypesService } from '@/services'
import { useStoreAuth, useStoreProjectTypes, useStoreSelects } from '@/store'
import type { ProjectTypeTableRow, TableRow, TableSortState } from '@/types'
import { createProjectTypesActions, createProjectTypesTableCustomRenderer, downloadBlobFile, formatCsvImportSummary } from '@/utils'
import type { DropdownAction } from '@/utils'

const PROJECT_TYPE_NAME_COLUMN_INDEX = projectTypesTableColumnIndex.name
const PROJECT_TYPE_STATUS_COLUMN_INDEX = projectTypesTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = projectTypesTableColumns.length - 1
const PROJECT_TYPES_SORTABLE_COLUMNS = Object.keys(projectTypesTableSortByColumn).map((index) => Number(index))

export default function ProjectTypesDashboardPage() {
  const navigate = useNavigate()
  const projectTypesRows = useStoreProjectTypes((s) => s.projectTypesRows)
  const projectTypeDetail = useStoreProjectTypes((s) => s.projectTypeDetail)
  const pagination = useStoreProjectTypes((s) => s.pagination)
  const queryParams = useStoreProjectTypes((s) => s.queryParams)
  const loadingProjectTypes = useStoreProjectTypes((s) => s.loadingProjectTypes)
  const loadingProjectTypeDetail = useStoreProjectTypes((s) => s.loadingProjectTypeDetail)
  const loadingToggleStatus = useStoreProjectTypes((s) => s.loadingToggleStatus)
  const listError = useStoreProjectTypes((s) => s.operationStatus.list.error)
  const detailError = useStoreProjectTypes((s) => s.operationStatus.detail.error)
  const toggleError = useStoreProjectTypes((s) => s.operationStatus.toggle.error)
  const clearOperationStatus = useStoreProjectTypes((s) => s.clearOperationStatus)
  const getProjectTypes = useStoreProjectTypes((s) => s.getProjectTypes)
  const getProjectTypeDetail = useStoreProjectTypes((s) => s.getProjectTypeDetail)
  const goToPage = useStoreProjectTypes((s) => s.goToPage)
  const setSearch = useStoreProjectTypes((s) => s.setSearch)
  const searchProjectTypes = useStoreProjectTypes((s) => s.searchProjectTypes)
  const sortProjectTypes = useStoreProjectTypes((s) => s.sortProjectTypes)
  const setActiveFilter = useStoreProjectTypes((s) => s.setActiveFilter)
  const setCreatedDateRange = useStoreProjectTypes((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreProjectTypes((s) => s.setUpdatedDateRange)
  const clearActiveFilter = useStoreProjectTypes((s) => s.clearActiveFilter)
  const clearCreatedDateRange = useStoreProjectTypes((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreProjectTypes((s) => s.clearUpdatedDateRange)
  const toggleProjectTypeStatus = useStoreProjectTypes((s) => s.toggleProjectTypeStatus)
  const clearProjectTypeDetail = useStoreProjectTypes((s) => s.clearProjectTypeDetail)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canToggleProjectTypeStatus = hasPermission('PROJECT_TYPE', 'canUpdate')

  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingStatusOptions = useStoreSelects((s) => s.loadingStatusOptions)
  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)

  const { actionViewDetail, actionUpdateProjectType, actionToggleStatus } = createProjectTypesActions()

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
  const [pendingToggleRow, setPendingToggleRow] = useState<ProjectTypeTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [uploadingBulk, setUploadingBulk] = useState(false)
  const bulkUploadInputRef = useRef<HTMLInputElement | null>(null)

  const projectTypeDetailView = mapperProjectTypeDetailView(projectTypeDetail)
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const statusSelectOptions = statusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const activeSortColumn = PROJECT_TYPES_SORTABLE_COLUMNS.find((index) => projectTypesTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  useEffect(() => {
    void getProjectTypes()
    void getStatusOptions()
  }, [getProjectTypes, getStatusOptions])

  const handleViewDetail = (row: ProjectTypeTableRow) => {
    setSelectedDetailRowId(row.id)
    setDetailOpen(true)
    void getProjectTypeDetail(row.id)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
    clearProjectTypeDetail()
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getProjectTypeDetail(selectedDetailRowId)
  }

  const handleUpdateProjectType = (row: ProjectTypeTableRow) => {
    navigate(`${AUTH_ROUTE_PROJECT_TYPES_EDIT}=${row.id}`)
  }

  const handleToggleStatus = (row: ProjectTypeTableRow) => {
    setPendingToggleRow(row)
    setConfirmOpen(true)
  }

  const resolveRowActions = (row: ProjectTypeTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => handleViewDetail(row)),
      actionUpdateProjectType(() => handleUpdateProjectType(row)),
    ]

    if (canToggleProjectTypeStatus) {
      actions.push(actionToggleStatus(row.active === true, () => handleToggleStatus(row)))
    }

    return actions
  }

  const findProjectTypeRowById = (rowId: string) => projectTypesRows.find((row) => row.id === rowId) ?? null
  const handleViewDetailById = (rowId: string) => {
    const projectTypeRow = findProjectTypeRowById(rowId)
    if (!projectTypeRow) return
    handleViewDetail(projectTypeRow)
  }
  const getProjectTypeStatusEnabled = (rowId: string) => Boolean(findProjectTypeRowById(rowId)?.active)
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const projectTypeRow = findProjectTypeRowById(tableRow.id)
    if (!projectTypeRow) return []
    return resolveRowActions(projectTypeRow)
  }

  const renderCustomCell = createProjectTypesTableCustomRenderer({
    nameColumnIndex: PROJECT_TYPE_NAME_COLUMN_INDEX,
    statusColumnIndex: PROJECT_TYPE_STATUS_COLUMN_INDEX,
    onViewDetail: handleViewDetailById,
    getStatusEnabled: getProjectTypeStatusEnabled,
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = projectTypesTableSortByColumn[columnIndex]
    if (!sortBy) return

    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === 'asc' ? 'desc' : 'asc'

    await sortProjectTypes(sortBy, nextSortDir)
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
    setCreatedDateRange({
      createdFrom: filters.createdFrom.trim(),
      createdTo: filters.createdTo.trim(),
    })
    setUpdatedDateRange({
      updatedFrom: filters.updatedFrom.trim(),
      updatedTo: filters.updatedTo.trim(),
    })
    await searchProjectTypes()
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
    await searchProjectTypes()
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
    const projectTypeName = pendingToggleRow.values[PROJECT_TYPE_NAME_COLUMN_INDEX]
    const success = await toggleProjectTypeStatus(pendingToggleRow.id, nextStatus)
    if (success) {
      setConfirmOpen(false)
      setPendingToggleRow(null)
      await getProjectTypes()
      navigate(AUTH_ROUTE_PROJECT_TYPES)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActionsMessage(
        `${projectTypeName} ${
          nextStatus ? messages.projectTypes.status.success.toggleEnabledSuccess : messages.projectTypes.status.success.toggleDisabledSuccess
        }`,
      )
    }
  }

  const handleDownloadReport = async () => {
    if (downloadingReport) return

    try {
      setDownloadingReport(true)
      const csvBlob = await projectTypesService.exportProjectTypesCsv()
      downloadBlobFile(csvBlob, 'project-types.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch (error) {
      if (projectTypesService.isAxiosError(error)) {
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
      const result = await projectTypesService.importProjectTypesCsv(file)
      setActionsMessage(formatCsvImportSummary(result))
      await getProjectTypes()
    } catch (error) {
      if (projectTypesService.isAxiosError(error)) {
        setActionsMessage(error.response?.data?.message || 'No se pudo realizar la carga masiva.')
      } else {
        setActionsMessage('No se pudo realizar la carga masiva.')
      }
    } finally {
      setUploadingBulk(false)
    }
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.active === true ? 'deshabilitar' : 'habilitar'} al tipo ${pendingToggleRow.values[PROJECT_TYPE_NAME_COLUMN_INDEX]}?`
    : ''
  const detailTitle = projectTypeDetailView
    ? `Detalle de ${projectTypeDetailView.nameDisplay}`
    : messages.projectTypes.ui.detailTitleFallback

  return (
    <section className="min-w-0 space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">Dashboard de tipos de proyecto</h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total tipos"
        activeLabel="Tipos activos"
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
          void searchProjectTypes()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingProjectTypes || loadingToggleStatus}
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
            disabled={loadingProjectTypes || loadingToggleStatus}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingProjectTypes ? 'Buscando...' : 'Buscar'}
          />
          <ButtonComponent
            type="button"
            variant="primary"
            disabled={loadingProjectTypes || loadingToggleStatus}
            className="flex-1 text-white md:flex-none dark:text-white"
            label="Nuevo tipo"
            onClick={() => navigate(AUTH_ROUTE_PROJECT_TYPES_CREATE)}
          />
          <ToolbarActionsDropdownComponent
            disabled={loadingProjectTypes || loadingToggleStatus || downloadingReport || uploadingBulk}
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
        columns={projectTypesTableColumns}
        rows={projectTypesRows}
        loading={loadingProjectTypes}
        emptyMessage="No hay tipos de proyecto registrados."
        customRenderer={renderCustomCell}
        actionsConfig={{
          columnIndex: ACTIONS_COLUMN_INDEX,
          resolveRowActions: resolveRowActionsFromTableRow,
          resolveOpenDirection: (activeRowIndex, rowsLength) => (
            activeRowIndex >= Math.max(rowsLength - 2, 0) ? 'up' : 'down'
          ),
        }}
        sortableColumnIndexes={PROJECT_TYPES_SORTABLE_COLUMNS}
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
          loading={loadingProjectTypes || loadingToggleStatus}
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
              Fecha creacion
            </p>
            <div className="grid gap-2">
              <InputComponent
                id="project-types-created-from"
                value={filters.createdFrom}
                label="Desde"
                type="date"
                aria-label="Fecha creacion desde"
                onValueChange={handleCreatedFromFilterChange}
              />
              <InputComponent
                id="project-types-created-to"
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
                id="project-types-updated-from"
                value={filters.updatedFrom}
                label="Desde"
                type="date"
                aria-label="Fecha actualizacion desde"
                onValueChange={handleUpdatedFromFilterChange}
              />
              <InputComponent
                id="project-types-updated-to"
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
              disabled={loadingProjectTypes || loadingToggleStatus || loadingStatusOptions}
              label="Limpiar"
              onClick={() => { void handleClearFilters() }}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loadingProjectTypes || loadingToggleStatus || loadingStatusOptions}
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
        <ProjectTypeDetailComponent
          key={selectedDetailRowId ?? 'empty-project-type-detail'}
          detail={projectTypeDetailView}
          loading={loadingProjectTypeDetail}
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
