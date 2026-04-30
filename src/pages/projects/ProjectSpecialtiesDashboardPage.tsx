import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DetailSidebarComponent,
  InputComponent,
  PaginationComponent,
  ProjectSpecialtyDetailComponent,
  RightSidebarComponent,
  SaveConfirmComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  TableComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AUTH_ROUTE_PROJECT_SPECIALTIES, AUTH_ROUTE_PROJECT_SPECIALTIES_CREATE, AUTH_ROUTE_PROJECT_SPECIALTIES_EDIT } from '@/constant'
import { projectSpecialtiesTableColumns, projectSpecialtiesTableColumnIndex, projectSpecialtiesTableSortByColumn } from '@/factories'
import { mapperProjectSpecialtyDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { projectSpecialtiesService } from '@/services'
import { useStoreAuth, useStoreProjectSpecialties, useStoreSelects } from '@/store'
import type { ProjectSpecialtyTableRow, TableRow, TableSortState } from '@/types'
import { createProjectSpecialtiesActions, createProjectSpecialtiesTableCustomRenderer, downloadBlobFile, formatCsvImportSummary } from '@/utils'
import type { DropdownAction } from '@/utils'

const PROJECT_SPECIALTY_NAME_COLUMN_INDEX = projectSpecialtiesTableColumnIndex.name
const PROJECT_SPECIALTY_STATUS_COLUMN_INDEX = projectSpecialtiesTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = projectSpecialtiesTableColumns.length - 1
const PROJECT_SPECIALTIES_SORTABLE_COLUMNS = Object.keys(projectSpecialtiesTableSortByColumn).map((index) => Number(index))

export default function ProjectSpecialtiesDashboardPage() {
  const navigate = useNavigate()
  const projectSpecialtiesRows = useStoreProjectSpecialties((s) => s.projectSpecialtiesRows)
  const projectSpecialtyDetail = useStoreProjectSpecialties((s) => s.projectSpecialtyDetail)
  const pagination = useStoreProjectSpecialties((s) => s.pagination)
  const queryParams = useStoreProjectSpecialties((s) => s.queryParams)
  const loadingProjectSpecialties = useStoreProjectSpecialties((s) => s.loadingProjectSpecialties)
  const loadingProjectSpecialtyDetail = useStoreProjectSpecialties((s) => s.loadingProjectSpecialtyDetail)
  const loadingToggleStatus = useStoreProjectSpecialties((s) => s.loadingToggleStatus)
  const listError = useStoreProjectSpecialties((s) => s.operationStatus.list.error)
  const detailError = useStoreProjectSpecialties((s) => s.operationStatus.detail.error)
  const toggleError = useStoreProjectSpecialties((s) => s.operationStatus.toggle.error)
  const clearOperationStatus = useStoreProjectSpecialties((s) => s.clearOperationStatus)
  const getProjectSpecialties = useStoreProjectSpecialties((s) => s.getProjectSpecialties)
  const getProjectSpecialtyDetail = useStoreProjectSpecialties((s) => s.getProjectSpecialtyDetail)
  const goToPage = useStoreProjectSpecialties((s) => s.goToPage)
  const setSearch = useStoreProjectSpecialties((s) => s.setSearch)
  const searchProjectSpecialties = useStoreProjectSpecialties((s) => s.searchProjectSpecialties)
  const sortProjectSpecialties = useStoreProjectSpecialties((s) => s.sortProjectSpecialties)
  const setActiveFilter = useStoreProjectSpecialties((s) => s.setActiveFilter)
  const setCreatedDateRange = useStoreProjectSpecialties((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreProjectSpecialties((s) => s.setUpdatedDateRange)
  const clearActiveFilter = useStoreProjectSpecialties((s) => s.clearActiveFilter)
  const clearCreatedDateRange = useStoreProjectSpecialties((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreProjectSpecialties((s) => s.clearUpdatedDateRange)
  const toggleProjectSpecialtyStatus = useStoreProjectSpecialties((s) => s.toggleProjectSpecialtyStatus)
  const clearProjectSpecialtyDetail = useStoreProjectSpecialties((s) => s.clearProjectSpecialtyDetail)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canToggleProjectSpecialtyStatus = hasPermission('PROJECT_SPECIALTY', 'canUpdate')

  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingStatusOptions = useStoreSelects((s) => s.loadingStatusOptions)
  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)

  const { actionViewDetail, actionUpdateProjectSpecialty, actionToggleStatus } = createProjectSpecialtiesActions()

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
  const [pendingToggleRow, setPendingToggleRow] = useState<ProjectSpecialtyTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [uploadingBulk, setUploadingBulk] = useState(false)
  const bulkUploadInputRef = useRef<HTMLInputElement | null>(null)

  const projectSpecialtyDetailView = mapperProjectSpecialtyDetailView(projectSpecialtyDetail)
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const statusSelectOptions = statusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const activeSortColumn = PROJECT_SPECIALTIES_SORTABLE_COLUMNS.find((index) => projectSpecialtiesTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  useEffect(() => {
    void getProjectSpecialties()
    void getStatusOptions()
  }, [getProjectSpecialties, getStatusOptions])

  const handleViewDetail = (row: ProjectSpecialtyTableRow) => {
    setSelectedDetailRowId(row.id)
    setDetailOpen(true)
    void getProjectSpecialtyDetail(row.id)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
    clearProjectSpecialtyDetail()
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getProjectSpecialtyDetail(selectedDetailRowId)
  }

  const handleUpdateProjectSpecialty = (row: ProjectSpecialtyTableRow) => {
    navigate(`${AUTH_ROUTE_PROJECT_SPECIALTIES_EDIT}=${row.id}`)
  }

  const handleToggleStatus = (row: ProjectSpecialtyTableRow) => {
    setPendingToggleRow(row)
    setConfirmOpen(true)
  }

  const resolveRowActions = (row: ProjectSpecialtyTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => handleViewDetail(row)),
      actionUpdateProjectSpecialty(() => handleUpdateProjectSpecialty(row)),
    ]

    if (canToggleProjectSpecialtyStatus) {
      actions.push(actionToggleStatus(row.active === true, () => handleToggleStatus(row)))
    }

    return actions
  }

  const findProjectSpecialtyRowById = (rowId: string) => projectSpecialtiesRows.find((row) => row.id === rowId) ?? null
  const handleViewDetailById = (rowId: string) => {
    const projectSpecialtyRow = findProjectSpecialtyRowById(rowId)
    if (!projectSpecialtyRow) return
    handleViewDetail(projectSpecialtyRow)
  }
  const getProjectSpecialtyStatusEnabled = (rowId: string) => Boolean(findProjectSpecialtyRowById(rowId)?.active)
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const projectSpecialtyRow = findProjectSpecialtyRowById(tableRow.id)
    if (!projectSpecialtyRow) return []
    return resolveRowActions(projectSpecialtyRow)
  }

  const renderCustomCell = createProjectSpecialtiesTableCustomRenderer({
    nameColumnIndex: PROJECT_SPECIALTY_NAME_COLUMN_INDEX,
    statusColumnIndex: PROJECT_SPECIALTY_STATUS_COLUMN_INDEX,
    onViewDetail: handleViewDetailById,
    getStatusEnabled: getProjectSpecialtyStatusEnabled,
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = projectSpecialtiesTableSortByColumn[columnIndex]
    if (!sortBy) return

    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === 'asc' ? 'desc' : 'asc'

    await sortProjectSpecialties(sortBy, nextSortDir)
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
    await searchProjectSpecialties()
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
    await searchProjectSpecialties()
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
    const projectSpecialtyName = pendingToggleRow.values[PROJECT_SPECIALTY_NAME_COLUMN_INDEX]
    const success = await toggleProjectSpecialtyStatus(pendingToggleRow.id, nextStatus)
    if (success) {
      setConfirmOpen(false)
      setPendingToggleRow(null)
      await getProjectSpecialties()
      navigate(AUTH_ROUTE_PROJECT_SPECIALTIES)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActionsMessage(
        `${projectSpecialtyName} ${
          nextStatus ? messages.projectSpecialties.status.success.toggleEnabledSuccess : messages.projectSpecialties.status.success.toggleDisabledSuccess
        }`,
      )
    }
  }

  const handleDownloadReport = async () => {
    if (downloadingReport) return

    try {
      setDownloadingReport(true)
      const csvBlob = await projectSpecialtiesService.exportProjectSpecialtiesCsv()
      downloadBlobFile(csvBlob, 'project-specialties.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch (error) {
      if (projectSpecialtiesService.isAxiosError(error)) {
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
      const result = await projectSpecialtiesService.importProjectSpecialtiesCsv(file)
      setActionsMessage(formatCsvImportSummary(result))
      await getProjectSpecialties()
    } catch (error) {
      if (projectSpecialtiesService.isAxiosError(error)) {
        setActionsMessage(error.response?.data?.message || 'No se pudo realizar la carga masiva.')
      } else {
        setActionsMessage('No se pudo realizar la carga masiva.')
      }
    } finally {
      setUploadingBulk(false)
    }
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.active === true ? 'deshabilitar' : 'habilitar'} la especialidad ${pendingToggleRow.values[PROJECT_SPECIALTY_NAME_COLUMN_INDEX]}?`
    : ''
  const detailTitle = projectSpecialtyDetailView
    ? `Detalle de ${projectSpecialtyDetailView.nameDisplay}`
    : messages.projectSpecialties.ui.detailTitleFallback

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · ESPECIALIDADES</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de especialidades</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total especialidades"
        activeLabel="Especialidades activas"
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
          void searchProjectSpecialties()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingProjectSpecialties || loadingToggleStatus}
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
            disabled={loadingProjectSpecialties || loadingToggleStatus}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingProjectSpecialties ? 'Buscando...' : 'Buscar'}
          />
          <ButtonComponent
            type="button"
            variant="success"
            disabled={loadingProjectSpecialties || loadingToggleStatus}
            className="flex-1 md:flex-none"
            label="Nueva especialidad"
            onClick={() => navigate(AUTH_ROUTE_PROJECT_SPECIALTIES_CREATE)}
          />
          <ToolbarActionsDropdownComponent
            disabled={loadingProjectSpecialties || loadingToggleStatus || downloadingReport || uploadingBulk}
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
        columns={projectSpecialtiesTableColumns}
        rows={projectSpecialtiesRows}
        loading={loadingProjectSpecialties}
        emptyMessage="No hay especialidades de proyecto registradas."
        customRenderer={renderCustomCell}
        actionsConfig={{
          columnIndex: ACTIONS_COLUMN_INDEX,
          resolveRowActions: resolveRowActionsFromTableRow,
          resolveOpenDirection: (activeRowIndex, rowsLength) => (
            activeRowIndex >= Math.max(rowsLength - 2, 0) ? 'up' : 'down'
          ),
        }}
        sortableColumnIndexes={PROJECT_SPECIALTIES_SORTABLE_COLUMNS}
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
          loading={loadingProjectSpecialties || loadingToggleStatus}
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
            <div className="grid gap-2">
              <InputComponent
                id="project-specialties-created-from"
                value={filters.createdFrom}
                label="Desde"
                type="date"
                aria-label="Fecha creación desde"
                onValueChange={handleCreatedFromFilterChange}
              />
              <InputComponent
                id="project-specialties-created-to"
                value={filters.createdTo}
                label="Hasta"
                type="date"
                aria-label="Fecha creación hasta"
                onValueChange={handleCreatedToFilterChange}
              />
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-amber-500/35 bg-amber-50/15 p-3 dark:border-amber-400/25 dark:bg-amber-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
              Fecha actualización
            </p>
            <div className="grid gap-2">
              <InputComponent
                id="project-specialties-updated-from"
                value={filters.updatedFrom}
                label="Desde"
                type="date"
                aria-label="Fecha actualización desde"
                onValueChange={handleUpdatedFromFilterChange}
              />
              <InputComponent
                id="project-specialties-updated-to"
                value={filters.updatedTo}
                label="Hasta"
                type="date"
                aria-label="Fecha actualización hasta"
                onValueChange={handleUpdatedToFilterChange}
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <ButtonComponent
              type="button"
              variant="outline"
              disabled={loadingProjectSpecialties || loadingToggleStatus || loadingStatusOptions}
              label="Limpiar"
              onClick={() => { void handleClearFilters() }}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loadingProjectSpecialties || loadingToggleStatus || loadingStatusOptions}
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
        <ProjectSpecialtyDetailComponent
          key={selectedDetailRowId ?? 'empty-project-specialty-detail'}
          detail={projectSpecialtyDetailView}
          loading={loadingProjectSpecialtyDetail}
          errorMessage={detailError}
          onRetry={handleRetryDetail}
          onEdit={
            selectedDetailRowId
              ? () => navigate(`${AUTH_ROUTE_PROJECT_SPECIALTIES_EDIT}=${selectedDetailRowId}`)
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
