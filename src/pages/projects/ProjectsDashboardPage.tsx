import { useEffect, useState } from 'react'
import {
  AlertMessageComponent,
  ButtonComponent,
  InputComponent,
  PaginationComponent,
  RightSidebarComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  TableComponent,
} from '@/components'
import { projectsTableColumns, projectsTableColumnIndex, projectsTableSortByColumn } from '@/factories'
import { useStoreProjects, useStoreSelects } from '@/store'
import type { ProjectTableRow, TableSortState } from '@/types'
import { createProjectsTableCustomRenderer } from '@/utils'

const PROJECT_TYPE_COLUMN_INDEX = projectsTableColumnIndex.type
const PROJECT_STATUS_COLUMN_INDEX = projectsTableColumnIndex.status
const PROJECT_SPECIALTY_COLUMN_INDEX = projectsTableColumnIndex.specialty
const PROJECT_ACTIVE_COLUMN_INDEX = projectsTableColumnIndex.active
const PROJECTS_SORTABLE_COLUMNS = Object.keys(projectsTableSortByColumn).map((index) => Number(index))

export default function ProjectsDashboardPage() {
  const projectsRows = useStoreProjects((s) => s.projectsRows)
  const pagination = useStoreProjects((s) => s.pagination)
  const queryParams = useStoreProjects((s) => s.queryParams)
  const loadingProjects = useStoreProjects((s) => s.loadingProjects)
  const listError = useStoreProjects((s) => s.operationStatus.list.error)
  const clearOperationStatus = useStoreProjects((s) => s.clearOperationStatus)
  const getProjects = useStoreProjects((s) => s.getProjects)
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

  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const statusSelectOptions = statusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const projectTypeSelectOptions = projectTypeOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const projectStatusSelectOptions = projectStatusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const projectSpecialtySelectOptions = projectSpecialtyOptions.map((option) => ({ label: option.name, value: String(option.id) }))
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

  const findProjectRowById = (rowId: string) => projectsRows.find((row) => row.id === rowId) ?? null

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

  const renderCustomCell = createProjectsTableCustomRenderer({
    typeColumnIndex: PROJECT_TYPE_COLUMN_INDEX,
    statusColumnIndex: PROJECT_STATUS_COLUMN_INDEX,
    specialtyColumnIndex: PROJECT_SPECIALTY_COLUMN_INDEX,
    activeColumnIndex: PROJECT_ACTIVE_COLUMN_INDEX,
    getTypeName: getProjectTypeName,
    getStatusName: getProjectStatusName,
    getSpecialtyName: getProjectSpecialtyName,
    getActive: getProjectActive,
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = projectsTableSortByColumn[columnIndex]
    if (!sortBy) return

    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === 'asc' ? 'desc' : 'asc'
    await sortProjects(sortBy, nextSortDir)
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

  return (
    <section className="min-w-0 space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">Dashboard de proyectos</h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total proyectos"
        activeLabel="Proyectos activos"
        total={pagination.total}
        active={pagination.active}
      />

      {listError && (
        <AlertMessageComponent
          message={listError}
          tone="error"
          onClose={() => clearOperationStatus('list')}
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
            disabled={loadingProjects}
            label="Filtro"
            onClick={() => setFiltersOpen(true)}
          />
          <div className="min-w-0 flex-1">
            <InputComponent
              value={queryParams.search}
              type="text"
              placeholder="Buscar por nombre, descripcion o direccion"
              onValueChange={setSearch}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loadingProjects}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingProjects ? 'Buscando...' : 'Buscar'}
          />
        </div>
      </form>

      <TableComponent
        columns={projectsTableColumns}
        rows={projectsRows as ProjectTableRow[]}
        loading={loadingProjects}
        emptyMessage="No hay proyectos registrados."
        customRenderer={renderCustomCell}
        sortableColumnIndexes={PROJECTS_SORTABLE_COLUMNS}
        sortState={sortState}
        onSortChange={(columnIndex) => { void handleSortChange(columnIndex) }}
      />

      <div className="flex justify-end">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          loading={loadingProjects}
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
              Fecha creacion
            </p>
            <div className="grid gap-2">
              <InputComponent
                id="projects-created-from"
                value={filters.createdFrom}
                type="date"
                label="Desde"
                aria-label="Fecha creacion desde"
                onValueChange={handleCreatedFromFilterChange}
              />
              <InputComponent
                id="projects-created-to"
                value={filters.createdTo}
                type="date"
                label="Hasta"
                aria-label="Fecha creacion hasta"
                onValueChange={handleCreatedToFilterChange}
              />
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-cyan-500/35 bg-cyan-50/20 p-3 dark:border-cyan-400/25 dark:bg-cyan-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
              Fecha actualizacion
            </p>
            <div className="grid gap-2">
              <InputComponent
                id="projects-updated-from"
                value={filters.updatedFrom}
                type="date"
                label="Desde"
                aria-label="Fecha actualizacion desde"
                onValueChange={handleUpdatedFromFilterChange}
              />
              <InputComponent
                id="projects-updated-to"
                value={filters.updatedTo}
                type="date"
                label="Hasta"
                aria-label="Fecha actualizacion hasta"
                onValueChange={handleUpdatedToFilterChange}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <ButtonComponent
              type="button"
              variant="outline"
              disabled={loadingProjects || loadingStatusOptions || loadingProjectTypeOptions || loadingProjectStatusOptions || loadingProjectSpecialtyOptions}
              label="Limpiar"
              onClick={() => { void handleClearFilters() }}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loadingProjects || loadingStatusOptions || loadingProjectTypeOptions || loadingProjectStatusOptions || loadingProjectSpecialtyOptions}
              className="text-white dark:text-white"
              label={
                loadingProjects || loadingStatusOptions || loadingProjectTypeOptions || loadingProjectStatusOptions || loadingProjectSpecialtyOptions
                  ? 'Aplicando...'
                  : 'Aplicar'
              }
              onClick={() => { void handleApplyFilters() }}
            />
          </div>
        </div>
      </RightSidebarComponent>
    </section>
  )
}
