import { SortDirection } from '@/constant'
import { useEffect, useState } from 'react'
import {
  AlertMessageComponent,
  ButtonComponent,
  DateRangePickerComponent,
  DetailSidebarComponent,
  InputComponent,
  PaginationComponent,
  RightSidebarComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  TableComponent,
} from '@/components'
import {
  ProjectAssignmentCostCenterDetailComponent,
} from '@/components/project-assignments/ProjectAssignmentCostCenterDetailComponent'
import {
  ProjectAssignmentEmployeeDetailComponent,
} from '@/components/project-assignments/ProjectAssignmentEmployeeDetailComponent'
import {
  projectAssignmentActiveFilterOptions,
  projectAssignmentsTableColumns,
  projectAssignmentsTableColumnIndex,
  projectAssignmentsTableSortByColumn,
} from '@/factories'
import {
  mapperProjectAssignmentDetailViews,
} from '@/mappers'
import messages from '@/messages/messages'
import { useStoreProjectAssignments } from '@/store'
import type { ProjectAssignmentTableRow, TableRow, TableSortState } from '@/types'
import {
  createProjectAssignmentsActions,
  createProjectAssignmentsTableCustomRenderer,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const ASSIGNMENT_EMPLOYEE_COLUMN_INDEX = projectAssignmentsTableColumnIndex.employeeName
const ASSIGNMENT_PROJECT_COLUMN_INDEX = projectAssignmentsTableColumnIndex.projectName
const ASSIGNMENT_STATUS_COLUMN_INDEX = projectAssignmentsTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = projectAssignmentsTableColumns.length - 1
const PROJECT_ASSIGNMENTS_SORTABLE_COLUMNS = Object.keys(projectAssignmentsTableSortByColumn).map((index) => Number(index))

export default function ProjectAssignmentsDashboardPage() {
  const projectAssignmentsRows = useStoreProjectAssignments((s) => s.projectAssignmentsRows)
  const employeeProjectAssignments = useStoreProjectAssignments((s) => s.employeeProjectAssignments)
  const costCenterProjectAssignments = useStoreProjectAssignments((s) => s.costCenterProjectAssignments)
  const pagination = useStoreProjectAssignments((s) => s.pagination)
  const queryParams = useStoreProjectAssignments((s) => s.queryParams)
  const loadingProjectAssignments = useStoreProjectAssignments((s) => s.loadingProjectAssignments)
  const loadingEmployeeProjectAssignments = useStoreProjectAssignments((s) => s.loadingEmployeeProjectAssignments)
  const loadingCostCenterProjectAssignments = useStoreProjectAssignments((s) => s.loadingCostCenterProjectAssignments)
  const listError = useStoreProjectAssignments((s) => s.operationStatus.list.error)
  const detailError = useStoreProjectAssignments((s) => s.operationStatus.detail.error)
  const clearOperationStatus = useStoreProjectAssignments((s) => s.clearOperationStatus)
  const getProjectAssignments = useStoreProjectAssignments((s) => s.getProjectAssignments)
  const getProjectAssignmentsByEmployee = useStoreProjectAssignments((s) => s.getProjectAssignmentsByEmployee)
  const getProjectAssignmentsByCostCenter = useStoreProjectAssignments((s) => s.getProjectAssignmentsByCostCenter)
  const clearEmployeeProjectAssignments = useStoreProjectAssignments((s) => s.clearEmployeeProjectAssignments)
  const clearCostCenterProjectAssignments = useStoreProjectAssignments((s) => s.clearCostCenterProjectAssignments)
  const goToPage = useStoreProjectAssignments((s) => s.goToPage)
  const setSearch = useStoreProjectAssignments((s) => s.setSearch)
  const setEmployeeFilter = useStoreProjectAssignments((s) => s.setEmployeeFilter)
  const setCostCenterFilter = useStoreProjectAssignments((s) => s.setCostCenterFilter)
  const setActiveFilter = useStoreProjectAssignments((s) => s.setActiveFilter)
  const setAssignmentDateRange = useStoreProjectAssignments((s) => s.setAssignmentDateRange)
  const setCreatedDateRange = useStoreProjectAssignments((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreProjectAssignments((s) => s.setUpdatedDateRange)
  const clearEmployeeFilter = useStoreProjectAssignments((s) => s.clearEmployeeFilter)
  const clearCostCenterFilter = useStoreProjectAssignments((s) => s.clearCostCenterFilter)
  const clearActiveFilter = useStoreProjectAssignments((s) => s.clearActiveFilter)
  const clearAssignmentDateRange = useStoreProjectAssignments((s) => s.clearAssignmentDateRange)
  const clearCreatedDateRange = useStoreProjectAssignments((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreProjectAssignments((s) => s.clearUpdatedDateRange)
  const searchProjectAssignments = useStoreProjectAssignments((s) => s.searchProjectAssignments)
  const sortProjectAssignments = useStoreProjectAssignments((s) => s.sortProjectAssignments)
  const { actionViewEmployeeDetail, actionViewCostCenterDetail } = createProjectAssignmentsActions()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState(() => ({
    employeeId: queryParams.employeeId,
    costCenter: queryParams.costCenter,
    active: queryParams.active,
    dateFrom: queryParams.dateFrom,
    dateTo: queryParams.dateTo,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
    updatedFrom: queryParams.updatedFrom,
    updatedTo: queryParams.updatedTo,
  }))
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailMode, setDetailMode] = useState<'employee' | 'costCenter'>('employee')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null)
  const [selectedCostCenter, setSelectedCostCenter] = useState<number | null>(null)
  const [selectedDetailName, setSelectedDetailName] = useState('')

  const employeeProjectAssignmentViews = mapperProjectAssignmentDetailViews(employeeProjectAssignments)
  const costCenterProjectAssignmentViews = mapperProjectAssignmentDetailViews(costCenterProjectAssignments)
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const activeSortColumn = PROJECT_ASSIGNMENTS_SORTABLE_COLUMNS.find((index) => projectAssignmentsTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }
  const detailTitle = selectedDetailName
    ? `Detalle de ${selectedDetailName}`
    : messages.projectAssignments.ui.detailTitleFallback

  useEffect(() => {
    void getProjectAssignments()
  }, [getProjectAssignments])

  const handleViewEmployeeDetail = (row: ProjectAssignmentTableRow) => {
    setDetailMode('employee')
    setSelectedEmployeeId(row.employeeId)
    setSelectedCostCenter(null)
    setSelectedDetailName(row.employeeName || 'Trabajador')
    setDetailOpen(true)
    clearCostCenterProjectAssignments()
    void getProjectAssignmentsByEmployee(row.employeeId)
  }

  const handleViewCostCenterDetail = (row: ProjectAssignmentTableRow) => {
    setDetailMode('costCenter')
    setSelectedCostCenter(row.costCenter)
    setSelectedEmployeeId(null)
    setSelectedDetailName(row.projectName || `CC ${row.costCenter}`)
    setDetailOpen(true)
    clearEmployeeProjectAssignments()
    void getProjectAssignmentsByCostCenter(row.costCenter)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedEmployeeId(null)
    setSelectedCostCenter(null)
    setSelectedDetailName('')
    clearEmployeeProjectAssignments()
    clearCostCenterProjectAssignments()
  }

  const handleRetryDetail = () => {
    if (detailMode === 'employee' && selectedEmployeeId) {
      void getProjectAssignmentsByEmployee(selectedEmployeeId)
      return
    }
    if (detailMode === 'costCenter' && selectedCostCenter) {
      void getProjectAssignmentsByCostCenter(selectedCostCenter)
    }
  }

  const findProjectAssignmentRowById = (rowId: string) => projectAssignmentsRows.find((row) => row.id === rowId) ?? null
  const handleViewEmployeeDetailById = (rowId: string) => {
    const assignmentRow = findProjectAssignmentRowById(rowId)
    if (!assignmentRow) return
    handleViewEmployeeDetail(assignmentRow)
  }
  const handleViewCostCenterDetailById = (rowId: string) => {
    const assignmentRow = findProjectAssignmentRowById(rowId)
    if (!assignmentRow) return
    handleViewCostCenterDetail(assignmentRow)
  }
  const getProjectAssignmentActive = (rowId: string) => Boolean(findProjectAssignmentRowById(rowId)?.active)
  const resolveRowActions = (row: ProjectAssignmentTableRow): DropdownAction[] => [
    actionViewEmployeeDetail(() => handleViewEmployeeDetail(row)),
    actionViewCostCenterDetail(() => handleViewCostCenterDetail(row)),
  ]
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const assignmentRow = findProjectAssignmentRowById(tableRow.id)
    if (!assignmentRow) return []
    return resolveRowActions(assignmentRow)
  }

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = projectAssignmentsTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc
    await sortProjectAssignments(sortBy, nextSortDir)
  }

  const renderCustomCell = createProjectAssignmentsTableCustomRenderer({
    employeeNameColumnIndex: ASSIGNMENT_EMPLOYEE_COLUMN_INDEX,
    projectNameColumnIndex: ASSIGNMENT_PROJECT_COLUMN_INDEX,
    statusColumnIndex: ASSIGNMENT_STATUS_COLUMN_INDEX,
    onViewEmployeeDetail: handleViewEmployeeDetailById,
    onViewCostCenterDetail: handleViewCostCenterDetailById,
    getActive: getProjectAssignmentActive,
  })

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApplyFilters = async () => {
    setEmployeeFilter(filters.employeeId.trim())
    setCostCenterFilter(filters.costCenter.trim())
    setActiveFilter(filters.active)
    setAssignmentDateRange({ dateFrom: filters.dateFrom.trim(), dateTo: filters.dateTo.trim() })
    setCreatedDateRange({ createdFrom: filters.createdFrom.trim(), createdTo: filters.createdTo.trim() })
    setUpdatedDateRange({ updatedFrom: filters.updatedFrom.trim(), updatedTo: filters.updatedTo.trim() })
    await searchProjectAssignments()
    setFiltersOpen(false)
  }

  const handleClearFilters = async () => {
    setFilters({
      employeeId: '',
      costCenter: '',
      active: '',
      dateFrom: '',
      dateTo: '',
      createdFrom: '',
      createdTo: '',
      updatedFrom: '',
      updatedTo: '',
    })
    clearEmployeeFilter()
    clearCostCenterFilter()
    clearActiveFilter()
    clearAssignmentDateRange()
    clearCreatedDateRange()
    clearUpdatedDateRange()
    await searchProjectAssignments()
    setFiltersOpen(false)
  }

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · HISTÓRICO</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> histórico</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total asignaciones"
        activeLabel="Asignaciones activas"
        pendingLabel="Pendientes"
        total={pagination.total}
        active={pagination.active}
        pending={pagination.pending}
      />

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
          void searchProjectAssignments()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent type="button" variant="outline" disabled={loadingProjectAssignments} label="Filtro" onClick={() => setFiltersOpen(true)} />
          <div className="min-w-0 flex-1">
            <InputComponent value={queryParams.search} type="text" placeholder="Buscar por trabajador, identificación, proyecto o rol" onValueChange={setSearch} />
          </div>
        </div>

        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loadingProjectAssignments}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingProjectAssignments ? 'Buscando...' : 'Buscar'}
          />
        </div>
      </form>

      <TableComponent
        columns={projectAssignmentsTableColumns}
        rows={projectAssignmentsRows}
        loading={loadingProjectAssignments}
        emptyMessage="No hay registros históricos de asignación."
        customRenderer={renderCustomCell}
        actionsConfig={{
          columnIndex: ACTIONS_COLUMN_INDEX,
          resolveRowActions: resolveRowActionsFromTableRow,
          resolveOpenDirection: (activeRowIndex, rowsLength) => (
            activeRowIndex >= Math.max(rowsLength - 2, 0) ? 'up' : 'down'
          ),
        }}
        sortableColumnIndexes={PROJECT_ASSIGNMENTS_SORTABLE_COLUMNS}
        sortState={sortState}
        onSortChange={(columnIndex) => { void handleSortChange(columnIndex) }}
      />

      <div className="flex justify-end">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          loading={loadingProjectAssignments}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>

      <RightSidebarComponent open={filtersOpen} title="Filtros" onClose={() => setFiltersOpen(false)}>
        <div className="space-y-4">
          <InputComponent value={filters.employeeId} label="ID trabajador" type="number" placeholder="Ej: 12" onValueChange={(v) => handleChangeFilter('employeeId', v)} />
          <InputComponent value={filters.costCenter} label="Centro de costo" type="number" placeholder="Ej: 1001" onValueChange={(v) => handleChangeFilter('costCenter', v)} />
          <SelectComponent value={filters.active} label="Estado" options={projectAssignmentActiveFilterOptions} onValueChange={(v) => handleChangeFilter('active', v)} />

          <div className="space-y-3 rounded-xl border border-cyan-500/35 bg-cyan-50/20 p-3 dark:border-cyan-400/25 dark:bg-cyan-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Vigencia</p>
            <DateRangePickerComponent
              fromValue={filters.dateFrom}
              toValue={filters.dateTo}
              label="Rango de vigencia"
              onRangeChange={({ from, to }) => {
                setFilters((prev) => ({ ...prev, dateFrom: from, dateTo: to }))
              }}
            />
          </div>
          <div className="space-y-3 rounded-xl border border-emerald-500/35 bg-emerald-50/20 p-3 dark:border-emerald-400/25 dark:bg-emerald-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Fecha creación</p>
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
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Fecha actualización</p>
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
            <ButtonComponent type="button" variant="outline" disabled={loadingProjectAssignments} label="Limpiar" onClick={() => { void handleClearFilters() }} />
            <ButtonComponent type="button" variant="primary" disabled={loadingProjectAssignments} className="text-white dark:text-white" label="Aplicar" onClick={() => { void handleApplyFilters() }} />
          </div>
        </div>
      </RightSidebarComponent>

      <DetailSidebarComponent open={detailOpen} title={detailTitle} onClose={handleCloseDetail}>
        {detailMode === 'employee' ? (
          <ProjectAssignmentEmployeeDetailComponent
            key={selectedEmployeeId ?? 'empty-project-assignment-employee-detail'}
            items={employeeProjectAssignmentViews}
            loading={loadingEmployeeProjectAssignments}
            errorMessage={detailError}
            onRetry={handleRetryDetail}
          />
        ) : (
          <ProjectAssignmentCostCenterDetailComponent
            key={selectedCostCenter ?? 'empty-project-assignment-cost-center-detail'}
            items={costCenterProjectAssignmentViews}
            loading={loadingCostCenterProjectAssignments}
            errorMessage={detailError}
            onRetry={handleRetryDetail}
          />
        )}
      </DetailSidebarComponent>
    </section>
  )
}
