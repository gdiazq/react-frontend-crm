import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DetailSidebarComponent,
  InputComponent,
  PaginationComponent,
  ProjectCostCenterEmployeesTabComponent,
  ProjectDetailComponent,
  RightSidebarComponent,
  SaveConfirmComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  TableComponent,
  TabsComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AUTH_ROUTE_PROJECTS, AUTH_ROUTE_PROJECTS_CREATE, AUTH_ROUTE_PROJECTS_EDIT } from '@/constant'
import { projectsTableColumns, projectsTableColumnIndex, projectsTableSortByColumn } from '@/factories'
import { mapperProjectDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { projectsService } from '@/services'
import { useStoreAuth, useStoreProjects, useStoreSelects } from '@/store'
import type { ProjectTableRow, TableRow, TableSortState } from '@/types'
import { createProjectsActions, createProjectsTableCustomRenderer, downloadBlobFile, formatCsvImportSummary } from '@/utils'
import type { DropdownAction } from '@/utils'

const PROJECT_TYPE_COLUMN_INDEX = projectsTableColumnIndex.type
const PROJECT_STATUS_COLUMN_INDEX = projectsTableColumnIndex.status
const PROJECT_SPECIALTY_COLUMN_INDEX = projectsTableColumnIndex.specialty
const PROJECT_ACTIVE_COLUMN_INDEX = projectsTableColumnIndex.active
const PROJECT_NAME_COLUMN_INDEX = projectsTableColumnIndex.name
const ACTIONS_COLUMN_INDEX = projectsTableColumns.length - 1
const PROJECTS_SORTABLE_COLUMNS = Object.keys(projectsTableSortByColumn).map((index) => Number(index))
type ProjectDetailTabKey = 'detail' | 'employees'

const projectDetailTabs: { key: ProjectDetailTabKey, label: string }[] = [
  { key: 'detail', label: 'Detalle' },
  { key: 'employees', label: 'Trabajadores' },
]

export default function ProjectsDashboardPage() {
  const navigate = useNavigate()

  const projectsRows = useStoreProjects((s) => s.projectsRows)
  const projectDetail = useStoreProjects((s) => s.projectDetail)
  const pagination = useStoreProjects((s) => s.pagination)
  const queryParams = useStoreProjects((s) => s.queryParams)
  const loadingProjects = useStoreProjects((s) => s.loadingProjects)
  const loadingProjectDetail = useStoreProjects((s) => s.loadingProjectDetail)
  const loadingToggleStatus = useStoreProjects((s) => s.loadingToggleStatus)
  const listError = useStoreProjects((s) => s.operationStatus.list.error)
  const detailError = useStoreProjects((s) => s.operationStatus.detail.error)
  const toggleError = useStoreProjects((s) => s.operationStatus.toggle.error)
  const clearOperationStatus = useStoreProjects((s) => s.clearOperationStatus)
  const getProjects = useStoreProjects((s) => s.getProjects)
  const getProjectDetail = useStoreProjects((s) => s.getProjectDetail)
  const clearProjectDetail = useStoreProjects((s) => s.clearProjectDetail)
  const goToPage = useStoreProjects((s) => s.goToPage)
  const setSearch = useStoreProjects((s) => s.setSearch)
  const setActiveFilter = useStoreProjects((s) => s.setActiveFilter)
  const setTypeFilter = useStoreProjects((s) => s.setTypeFilter)
  const setStatusFilter = useStoreProjects((s) => s.setStatusFilter)
  const setSpecialtyFilter = useStoreProjects((s) => s.setSpecialtyFilter)
  const setCreatedDateRange = useStoreProjects((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreProjects((s) => s.setUpdatedDateRange)
  const clearActiveFilter = useStoreProjects((s) => s.clearActiveFilter)
  const clearTypeFilter = useStoreProjects((s) => s.clearTypeFilter)
  const clearStatusFilter = useStoreProjects((s) => s.clearStatusFilter)
  const clearSpecialtyFilter = useStoreProjects((s) => s.clearSpecialtyFilter)
  const clearCreatedDateRange = useStoreProjects((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreProjects((s) => s.clearUpdatedDateRange)
  const searchProjects = useStoreProjects((s) => s.searchProjects)
  const sortProjects = useStoreProjects((s) => s.sortProjects)
  const toggleProjectStatus = useStoreProjects((s) => s.toggleProjectStatus)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canReadProject = hasPermission('PROJECT', 'canRead')
  const canUpdateProject = hasPermission('PROJECT', 'canUpdate')

  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingStatusOptions = useStoreSelects((s) => s.loadingStatusOptions)
  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)
  const projectTypeOptions = useStoreSelects((s) => s.projectTypeOptions)
  const loadingProjectTypeOptions = useStoreSelects((s) => s.loadingProjectTypeOptions)
  const projectTypeOptionsErrorMessage = useStoreSelects((s) => s.projectTypeOptionsErrorMessage)
  const getProjectTypeOptions = useStoreSelects((s) => s.getProjectTypeOptions)
  const clearProjectTypeOptionsStatus = useStoreSelects((s) => s.clearProjectTypeOptionsStatus)
  const projectStatusOptions = useStoreSelects((s) => s.projectStatusOptions)
  const loadingProjectStatusOptions = useStoreSelects((s) => s.loadingProjectStatusOptions)
  const projectStatusOptionsErrorMessage = useStoreSelects((s) => s.projectStatusOptionsErrorMessage)
  const getProjectStatusOptions = useStoreSelects((s) => s.getProjectStatusOptions)
  const clearProjectStatusOptionsStatus = useStoreSelects((s) => s.clearProjectStatusOptionsStatus)
  const projectSpecialtyOptions = useStoreSelects((s) => s.projectSpecialtyOptions)
  const loadingProjectSpecialtyOptions = useStoreSelects((s) => s.loadingProjectSpecialtyOptions)
  const projectSpecialtyOptionsErrorMessage = useStoreSelects((s) => s.projectSpecialtyOptionsErrorMessage)
  const getProjectSpecialtyOptions = useStoreSelects((s) => s.getProjectSpecialtyOptions)
  const clearProjectSpecialtyOptionsStatus = useStoreSelects((s) => s.clearProjectSpecialtyOptionsStatus)

  const { actionViewDetail, actionUpdateProject, actionToggleStatus } = createProjectsActions()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState(() => ({
    activeId: queryParams.active,
    typeId: queryParams.typeId,
    statusId: queryParams.statusId,
    specialtyId: queryParams.specialtyId,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
    updatedFrom: queryParams.updatedFrom,
    updatedTo: queryParams.updatedTo,
  }))
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailTab, setDetailTab] = useState<ProjectDetailTabKey>('detail')
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [selectedDetailName, setSelectedDetailName] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<ProjectTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [uploadingBulk, setUploadingBulk] = useState(false)
  const bulkUploadInputRef = useRef<HTMLInputElement | null>(null)

  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const statusSelectOptions = statusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const projectTypeSelectOptions = projectTypeOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const projectStatusSelectOptions = projectStatusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const projectSpecialtySelectOptions = projectSpecialtyOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const projectDetailView = mapperProjectDetailView(projectDetail)
  const activeSortColumn = PROJECTS_SORTABLE_COLUMNS.find((index) => projectsTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  useEffect(() => {
    void getProjects()
    void getStatusOptions()
    void getProjectTypeOptions()
    void getProjectStatusOptions()
    void getProjectSpecialtyOptions()
  }, [getProjects, getStatusOptions, getProjectTypeOptions, getProjectStatusOptions, getProjectSpecialtyOptions])

  const handleViewDetail = (row: ProjectTableRow) => {
    setSelectedDetailRowId(row.id)
    setSelectedDetailName(String(row.values[PROJECT_NAME_COLUMN_INDEX] ?? 'Proyecto'))
    setDetailTab('detail')
    setDetailOpen(true)
    void getProjectDetail(row.id)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setDetailTab('detail')
    setSelectedDetailRowId(null)
    setSelectedDetailName('')
    clearProjectDetail()
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getProjectDetail(selectedDetailRowId)
  }

  const findProjectRowById = (rowId: string) => projectsRows.find((row) => row.id === rowId) ?? null
  const handleViewDetailById = (rowId: string) => {
    const projectRow = findProjectRowById(rowId)
    if (!projectRow) return
    handleViewDetail(projectRow)
  }

  const getProjectTypeName = (rowId: string) => {
    const row = findProjectRowById(rowId)
    if (!row || !row.typeId) return '-'
    return projectTypeOptions.find((option) => option.id === row.typeId)?.name || '-'
  }

  const getProjectStatusName = (rowId: string) => {
    const row = findProjectRowById(rowId)
    if (!row || !row.statusId) return '-'
    return projectStatusOptions.find((option) => option.id === row.statusId)?.name || '-'
  }

  const getProjectSpecialtyName = (rowId: string) => {
    const row = findProjectRowById(rowId)
    if (!row || !row.specialtyId) return '-'
    return projectSpecialtyOptions.find((option) => option.id === row.specialtyId)?.name || '-'
  }

  const getProjectActive = (rowId: string) => Boolean(findProjectRowById(rowId)?.active)

  const handleUpdateProject = (row: ProjectTableRow) => {
    navigate(`${AUTH_ROUTE_PROJECTS_EDIT}=${row.id}`)
  }

  const handleToggleStatus = (row: ProjectTableRow) => {
    setPendingToggleRow(row)
    setConfirmOpen(true)
  }

  const resolveRowActions = (row: ProjectTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = []

    if (canReadProject) {
      actions.push(actionViewDetail(() => handleViewDetail(row)))
    }

    if (canUpdateProject) {
      actions.push(
        actionUpdateProject(() => handleUpdateProject(row)),
        actionToggleStatus(row.active === true, () => handleToggleStatus(row)),
      )
    }

    return actions
  }

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const projectRow = findProjectRowById(tableRow.id)
    if (!projectRow) return []
    return resolveRowActions(projectRow)
  }

  const renderCustomCell = createProjectsTableCustomRenderer({
    nameColumnIndex: PROJECT_NAME_COLUMN_INDEX,
    typeColumnIndex: PROJECT_TYPE_COLUMN_INDEX,
    statusColumnIndex: PROJECT_STATUS_COLUMN_INDEX,
    specialtyColumnIndex: PROJECT_SPECIALTY_COLUMN_INDEX,
    activeColumnIndex: PROJECT_ACTIVE_COLUMN_INDEX,
    onViewDetail: handleViewDetailById,
    getTypeName: getProjectTypeName,
    getStatusName: getProjectStatusName,
    getSpecialtyName: getProjectSpecialtyName,
    getActive: getProjectActive,
  })

  const handleCloseConfirm = () => {
    if (loadingToggleStatus) return
    setConfirmOpen(false)
    setPendingToggleRow(null)
  }

  const handleConfirmToggleStatus = async () => {
    if (!pendingToggleRow || loadingToggleStatus) return

    const nextStatus = pendingToggleRow.active !== true
    const projectName = pendingToggleRow.values[PROJECT_NAME_COLUMN_INDEX]
    const success = await toggleProjectStatus(pendingToggleRow.id, nextStatus)
    if (success) {
      setConfirmOpen(false)
      setPendingToggleRow(null)
      await getProjects()
      if (selectedDetailRowId === pendingToggleRow.id && detailOpen) {
        void getProjectDetail(pendingToggleRow.id)
      }
      navigate(AUTH_ROUTE_PROJECTS)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActionsMessage(
        `${projectName} ${nextStatus ? messages.projects.status.success.toggleEnabledSuccess : messages.projects.status.success.toggleDisabledSuccess}`,
      )
    }
  }

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = projectsTableSortByColumn[columnIndex]
    if (!sortBy) return

    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === 'asc' ? 'desc' : 'asc'
    await sortProjects(sortBy, nextSortDir)
  }

  const handleDownloadReport = async () => {
    if (downloadingReport) return

    try {
      setDownloadingReport(true)
      const csvBlob = await projectsService.exportProjectsCsv()
      downloadBlobFile(csvBlob, 'projects.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch (error) {
      if (projectsService.isAxiosError(error)) {
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
      const result = await projectsService.importProjectsCsv(file)
      setActionsMessage(formatCsvImportSummary(result))
      await getProjects()
    } catch (error) {
      if (projectsService.isAxiosError(error)) {
        setActionsMessage(error.response?.data?.message || 'No se pudo realizar la carga masiva.')
      } else {
        setActionsMessage('No se pudo realizar la carga masiva.')
      }
    } finally {
      setUploadingBulk(false)
    }
  }

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }
  const handleActiveFilterChange = (value: string) => handleChangeFilter('activeId', value)
  const handleTypeFilterChange = (value: string) => handleChangeFilter('typeId', value)
  const handleStatusFilterChange = (value: string) => handleChangeFilter('statusId', value)
  const handleSpecialtyFilterChange = (value: string) => handleChangeFilter('specialtyId', value)
  const handleCreatedFromFilterChange = (value: string) => handleChangeFilter('createdFrom', value)
  const handleCreatedToFilterChange = (value: string) => handleChangeFilter('createdTo', value)
  const handleUpdatedFromFilterChange = (value: string) => handleChangeFilter('updatedFrom', value)
  const handleUpdatedToFilterChange = (value: string) => handleChangeFilter('updatedTo', value)

  const handleApplyFilters = async () => {
    const selectedStatus = statusOptions.find((option) => String(option.id) === filters.activeId)
    const selectedType = projectTypeOptions.find((option) => String(option.id) === filters.typeId)
    const selectedProjectStatus = projectStatusOptions.find((option) => String(option.id) === filters.statusId)
    const selectedSpecialty = projectSpecialtyOptions.find((option) => String(option.id) === filters.specialtyId)

    setActiveFilter(selectedStatus ? String(selectedStatus.id) : '')
    setTypeFilter(selectedType ? String(selectedType.id) : '')
    setStatusFilter(selectedProjectStatus ? String(selectedProjectStatus.id) : '')
    setSpecialtyFilter(selectedSpecialty ? String(selectedSpecialty.id) : '')
    setCreatedDateRange({
      createdFrom: filters.createdFrom.trim(),
      createdTo: filters.createdTo.trim(),
    })
    setUpdatedDateRange({
      updatedFrom: filters.updatedFrom.trim(),
      updatedTo: filters.updatedTo.trim(),
    })

    await searchProjects()
    setFiltersOpen(false)
  }

  const handleClearFilters = async () => {
    setFilters({
      activeId: '',
      typeId: '',
      statusId: '',
      specialtyId: '',
      createdFrom: '',
      createdTo: '',
      updatedFrom: '',
      updatedTo: '',
    })
    clearActiveFilter()
    clearTypeFilter()
    clearStatusFilter()
    clearSpecialtyFilter()
    clearCreatedDateRange()
    clearUpdatedDateRange()
    await searchProjects()
    setFiltersOpen(false)
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.active === true ? 'deshabilitar' : 'habilitar'} al proyecto ${pendingToggleRow.values[PROJECT_NAME_COLUMN_INDEX]}?`
    : ''

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · PROYECTOS</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de proyectos</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total proyectos"
        activeLabel="Proyectos activos"
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

      {projectTypeOptionsErrorMessage && (
        <AlertMessageComponent
          message={projectTypeOptionsErrorMessage}
          tone="error"
          onClose={clearProjectTypeOptionsStatus}
        />
      )}

      {projectStatusOptionsErrorMessage && (
        <AlertMessageComponent
          message={projectStatusOptionsErrorMessage}
          tone="error"
          onClose={clearProjectStatusOptionsStatus}
        />
      )}

      {projectSpecialtyOptionsErrorMessage && (
        <AlertMessageComponent
          message={projectSpecialtyOptionsErrorMessage}
          tone="error"
          onClose={clearProjectSpecialtyOptionsStatus}
        />
      )}

      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => {
          event.preventDefault()
          void searchProjects()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingProjects || loadingToggleStatus || downloadingReport || uploadingBulk}
            label="Filtro"
            onClick={() => setFiltersOpen(true)}
          />
          <div className="min-w-0 flex-1">
            <InputComponent
              value={queryParams.search}
              type="text"
              placeholder="Buscar por nombre, descripción o dirección"
              onValueChange={setSearch}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loadingProjects || loadingToggleStatus || downloadingReport || uploadingBulk}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingProjects ? 'Buscando...' : 'Buscar'}
          />
          <ButtonComponent
            type="button"
            variant="success"
            disabled={loadingProjects || loadingToggleStatus || downloadingReport || uploadingBulk}
            className="flex-1 md:flex-none"
            label="Nuevo proyecto"
            onClick={() => navigate(AUTH_ROUTE_PROJECTS_CREATE)}
          />
          <ToolbarActionsDropdownComponent
            disabled={loadingProjects || loadingToggleStatus || downloadingReport || uploadingBulk}
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
        columns={projectsTableColumns}
        rows={projectsRows as ProjectTableRow[]}
        loading={loadingProjects}
        emptyMessage="No hay proyectos registrados."
        customRenderer={renderCustomCell}
        actionsConfig={canReadProject || canUpdateProject
          ? {
              columnIndex: ACTIONS_COLUMN_INDEX,
              resolveRowActions: resolveRowActionsFromTableRow,
              resolveOpenDirection: (activeRowIndex, rowsLength) => (
                activeRowIndex >= Math.max(rowsLength - 2, 0) ? 'up' : 'down'
              ),
            }
          : undefined}
        sortableColumnIndexes={PROJECTS_SORTABLE_COLUMNS}
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
          loading={loadingProjects || loadingToggleStatus}
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
          <SelectComponent
            value={filters.typeId}
            label="Tipo"
            options={projectTypeSelectOptions}
            onValueChange={handleTypeFilterChange}
          />
          <SelectComponent
            value={filters.statusId}
            label="Vigencia"
            options={projectStatusSelectOptions}
            onValueChange={handleStatusFilterChange}
          />
          <SelectComponent
            value={filters.specialtyId}
            label="Especialidad"
            options={projectSpecialtySelectOptions}
            onValueChange={handleSpecialtyFilterChange}
          />

          <div className="space-y-3 rounded-xl border border-emerald-500/35 bg-emerald-50/20 p-3 dark:border-emerald-400/25 dark:bg-emerald-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Fecha creación
            </p>
            <div className="grid gap-2">
              <InputComponent
                id="projects-created-from"
                value={filters.createdFrom}
                type="date"
                label="Desde"
                aria-label="Fecha creación desde"
                onValueChange={handleCreatedFromFilterChange}
              />
              <InputComponent
                id="projects-created-to"
                value={filters.createdTo}
                type="date"
                label="Hasta"
                aria-label="Fecha creación hasta"
                onValueChange={handleCreatedToFilterChange}
              />
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-cyan-500/35 bg-cyan-50/20 p-3 dark:border-cyan-400/25 dark:bg-cyan-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
              Fecha actualización
            </p>
            <div className="grid gap-2">
              <InputComponent
                id="projects-updated-from"
                value={filters.updatedFrom}
                type="date"
                label="Desde"
                aria-label="Fecha actualización desde"
                onValueChange={handleUpdatedFromFilterChange}
              />
              <InputComponent
                id="projects-updated-to"
                value={filters.updatedTo}
                type="date"
                label="Hasta"
                aria-label="Fecha actualización hasta"
                onValueChange={handleUpdatedToFilterChange}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <ButtonComponent
              type="button"
              variant="outline"
              disabled={loadingProjects || loadingToggleStatus || loadingStatusOptions || loadingProjectTypeOptions || loadingProjectStatusOptions || loadingProjectSpecialtyOptions}
              label="Limpiar"
              onClick={() => { void handleClearFilters() }}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loadingProjects || loadingToggleStatus || loadingStatusOptions || loadingProjectTypeOptions || loadingProjectStatusOptions || loadingProjectSpecialtyOptions}
              className="text-white dark:text-white"
              label={
                loadingProjects || loadingToggleStatus || loadingStatusOptions || loadingProjectTypeOptions || loadingProjectStatusOptions || loadingProjectSpecialtyOptions
                  ? 'Aplicando...'
                  : 'Aplicar'
              }
              onClick={() => { void handleApplyFilters() }}
            />
          </div>
        </div>
      </RightSidebarComponent>

      <DetailSidebarComponent
        open={detailOpen}
        title=""
        size={detailTab === 'employees' ? 'wide' : 'default'}
        headerContent={<TabsComponent tabs={projectDetailTabs} activeTab={detailTab} onTabChange={setDetailTab} />}
        onClose={handleCloseDetail}
      >
        {detailTab === 'detail' ? (
          <ProjectDetailComponent
            key={selectedDetailRowId ?? 'empty-project-detail'}
            detail={projectDetailView}
            loading={loadingProjectDetail}
            errorMessage={detailError}
            onRetry={handleRetryDetail}
            onEdit={
              canUpdateProject && selectedDetailRowId
                ? () => navigate(`${AUTH_ROUTE_PROJECTS_EDIT}=${selectedDetailRowId}`)
                : undefined
            }
          />
        ) : (
          <ProjectCostCenterEmployeesTabComponent
            active={detailTab === 'employees'}
            costCenter={projectDetailView?.costCenter ?? null}
            projectName={projectDetailView?.projectName ?? selectedDetailName}
          />
        )}
      </DetailSidebarComponent>

      <SaveConfirmComponent
        open={confirmOpen}
        title="Confirmar cambio de estado"
        message={confirmMessage}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        loading={loadingToggleStatus}
        onClose={handleCloseConfirm}
        onConfirm={() => { void handleConfirmToggleStatus() }}
      />
    </section>
  )
}
