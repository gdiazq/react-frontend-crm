import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { OvertimeDetailComponent } from '@/components/overtime/OvertimeDetailComponent'
import {
  AUTH_ROUTE_OVERTIME_CREATE,
  AUTH_ROUTE_OVERTIME_EDIT,
  PermissionAction,
  PermissionModule,
  SortDirection,
} from '@/constant'
import { overtimeTableColumns, overtimeTableColumnIndex, overtimeTableSortByColumn } from '@/factories'
import { mapperOvertimeDetailView } from '@/mappers'
import {
  useStoreAttendanceSelects,
  useStoreAuth,
  useStoreEmployeeSelects,
  useStoreOvertime,
} from '@/store'
import type { TableSortState } from '@/components'
import type { OvertimeTableRow, TableRow } from '@/types'
import {
  createOvertimeActions,
  createOvertimeTableCustomRenderer,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const OVERTIME_EMPLOYEE_NAME_COLUMN_INDEX = overtimeTableColumnIndex.employeeName
const OVERTIME_STATUS_COLUMN_INDEX = overtimeTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = overtimeTableColumns.length - 1
const OVERTIME_SORTABLE_COLUMNS = Object.keys(overtimeTableSortByColumn).map((index) => Number(index))

export default function OvertimeDashboardPage() {
  const navigate = useNavigate()
  const overtimeRows = useStoreOvertime((s) => s.overtimeRows)
  const overtimeDetail = useStoreOvertime((s) => s.overtimeDetail)
  const overtimeTypes = useStoreOvertime((s) => s.overtimeTypes)
  const pagination = useStoreOvertime((s) => s.pagination)
  const queryParams = useStoreOvertime((s) => s.queryParams)
  const loadingOvertime = useStoreOvertime((s) => s.operationLoading.list)
  const loadingOvertimeDetail = useStoreOvertime((s) => s.operationLoading.detail)
  const loadingOvertimeTypes = useStoreOvertime((s) => s.loadingOvertimeTypes)
  const listError = useStoreOvertime((s) => s.operationStatus.list.error)
  const detailError = useStoreOvertime((s) => s.operationStatus.detail.error)
  const clearOperationStatus = useStoreOvertime((s) => s.clearOperationStatus)
  const getOvertime = useStoreOvertime((s) => s.getOvertime)
  const getOvertimeDetail = useStoreOvertime((s) => s.getOvertimeDetail)
  const clearOvertimeDetail = useStoreOvertime((s) => s.clearOvertimeDetail)
  const getOvertimeTypes = useStoreOvertime((s) => s.getOvertimeTypes)
  const sortOvertime = useStoreOvertime((s) => s.sortOvertime)
  const goToPage = useStoreOvertime((s) => s.goToPage)
  const setEmployeeFilter = useStoreOvertime((s) => s.setEmployeeFilter)
  const setCostCenterFilter = useStoreOvertime((s) => s.setCostCenterFilter)
  const setStatusFilter = useStoreOvertime((s) => s.setStatusFilter)
  const setDateRange = useStoreOvertime((s) => s.setDateRange)
  const setOvertimeTypeFilter = useStoreOvertime((s) => s.setOvertimeTypeFilter)
  const setSearch = useStoreOvertime((s) => s.setSearch)
  const clearEmployeeFilter = useStoreOvertime((s) => s.clearEmployeeFilter)
  const clearCostCenterFilter = useStoreOvertime((s) => s.clearCostCenterFilter)
  const clearStatusFilter = useStoreOvertime((s) => s.clearStatusFilter)
  const clearDateRange = useStoreOvertime((s) => s.clearDateRange)
  const clearOvertimeTypeFilter = useStoreOvertime((s) => s.clearOvertimeTypeFilter)
  const searchOvertime = useStoreOvertime((s) => s.searchOvertime)

  const attendanceEmployeeOptions = useStoreAttendanceSelects((s) => s.attendanceEmployeeOptions)
  const loadingAttendanceEmployeeOptions = useStoreAttendanceSelects((s) => s.loadingAttendanceEmployeeOptions)
  const attendanceEmployeeOptionsErrorMessage = useStoreAttendanceSelects((s) => s.attendanceEmployeeOptionsErrorMessage)
  const getAttendanceEmployeeOptions = useStoreAttendanceSelects((s) => s.getAttendanceEmployeeOptions)
  const clearAttendanceEmployeeOptionsStatus = useStoreAttendanceSelects((s) => s.clearAttendanceEmployeeOptionsStatus)
  const projectCostCenterOptions = useStoreEmployeeSelects((s) => s.projectCostCenterOptions)
  const loadingCostCenterOptions = useStoreEmployeeSelects((s) => s.loadingFormOptions)
  const costCenterOptionsErrorMessage = useStoreEmployeeSelects((s) => s.formOptionsErrorMessage)
  const getCostCenterFormOptions = useStoreEmployeeSelects((s) => s.getFormOptions)
  const clearCostCenterOptionsStatus = useStoreEmployeeSelects((s) => s.clearFormOptionsStatus)
  const hasPermission = useStoreAuth((s) => s.hasPermission)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [selectedDetailName, setSelectedDetailName] = useState('')
  const [filters, setFilters] = useState(() => ({
    employeeId: queryParams.employeeId,
    costCenter: queryParams.costCenter,
    statusId: queryParams.statusId,
    dateFrom: queryParams.dateFrom,
    dateTo: queryParams.dateTo,
    overtimeTypeId: queryParams.overtimeTypeId,
  }))

  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const activeSortColumn = OVERTIME_SORTABLE_COLUMNS.find((index) => overtimeTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }
  const employeeSelectOptions = attendanceEmployeeOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const costCenterSelectOptions = projectCostCenterOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const overtimeTypeSelectOptions = overtimeTypes.map((option) => ({
    label: option.surchargePercent != null ? `${option.name} · ${option.surchargePercent}%` : option.name,
    value: String(option.id),
  }))
  const { actionViewDetail, actionUpdateOvertime } = createOvertimeActions()
  const canCreateOvertime = hasPermission(PermissionModule.Overtime, PermissionAction.Create)
  const canUpdateOvertime = hasPermission(PermissionModule.Overtime, PermissionAction.Update)
  const overtimeDetailView = mapperOvertimeDetailView(overtimeDetail)
  const detailTitle = overtimeDetailView
    ? `Detalle de ${overtimeDetailView.employeeName}`
    : selectedDetailName
      ? `Detalle de ${selectedDetailName}`
      : 'Detalle de hora extra'

  useEffect(() => {
    void getOvertime()
    void getOvertimeTypes()
    void getAttendanceEmployeeOptions()
    void getCostCenterFormOptions()
  }, [getOvertime, getOvertimeTypes, getAttendanceEmployeeOptions, getCostCenterFormOptions])

  const renderCustomCell = createOvertimeTableCustomRenderer({
    employeeNameColumnIndex: OVERTIME_EMPLOYEE_NAME_COLUMN_INDEX,
    statusColumnIndex: OVERTIME_STATUS_COLUMN_INDEX,
    onViewDetail: (rowId) => {
      const overtimeRow = findOvertimeRowById(rowId)
      if (!overtimeRow) return
      handleViewDetail(overtimeRow)
    },
  })

  const handleViewDetail = (row: OvertimeTableRow) => {
    setSelectedDetailRowId(row.id)
    setSelectedDetailName(String(row.values[OVERTIME_EMPLOYEE_NAME_COLUMN_INDEX] ?? 'Hora extra'))
    setDetailOpen(true)
    void getOvertimeDetail(row.id)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
    setSelectedDetailName('')
    clearOvertimeDetail()
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getOvertimeDetail(selectedDetailRowId)
  }

  const handleUpdateOvertime = (rowOrId: { id: string } | string) => {
    const rowId = typeof rowOrId === 'string' ? rowOrId : rowOrId.id
    navigate(`${AUTH_ROUTE_OVERTIME_EDIT}=${rowId}`)
  }

  const resolveRowActions = (row: OvertimeTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [actionViewDetail(() => handleViewDetail(row))]
    if (canUpdateOvertime) actions.push(actionUpdateOvertime(() => handleUpdateOvertime(row)))
    return actions
  }

  const findOvertimeRowById = (rowId: string) => overtimeRows.find((row) => row.id === rowId) ?? null

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const overtimeRow = findOvertimeRowById(tableRow.id)
    if (!overtimeRow) return []
    return resolveRowActions(overtimeRow)
  }

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = overtimeTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc
    await sortOvertime(sortBy, nextSortDir)
  }

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApplyFilters = async () => {
    setEmployeeFilter(filters.employeeId)
    setCostCenterFilter(filters.costCenter.trim())
    setStatusFilter(filters.statusId.trim())
    setDateRange({ dateFrom: filters.dateFrom.trim(), dateTo: filters.dateTo.trim() })
    setOvertimeTypeFilter(filters.overtimeTypeId)
    await searchOvertime()
    setFiltersOpen(false)
  }

  const handleClearFilters = async () => {
    setFilters({
      employeeId: '',
      costCenter: '',
      statusId: '',
      dateFrom: '',
      dateTo: '',
      overtimeTypeId: '',
    })
    clearEmployeeFilter()
    clearCostCenterFilter()
    clearStatusFilter()
    clearDateRange()
    clearOvertimeTypeFilter()
    await searchOvertime()
    setFiltersOpen(false)
  }

  const loadingFilters = loadingOvertime || loadingOvertimeTypes || loadingAttendanceEmployeeOptions || loadingCostCenterOptions

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · HORAS EXTRAS</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de horas extras</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total registros"
        activeLabel="Aprobadas"
        pendingLabel="Pendientes"
        total={pagination.total}
        active={pagination.active}
        pending={pagination.pending}
      />

      {listError && (
        <AlertMessageComponent message={listError} tone="error" onClose={() => clearOperationStatus('list')} />
      )}

      {attendanceEmployeeOptionsErrorMessage && (
        <AlertMessageComponent message={attendanceEmployeeOptionsErrorMessage} tone="error" onClose={clearAttendanceEmployeeOptionsStatus} />
      )}

      {costCenterOptionsErrorMessage && (
        <AlertMessageComponent message={costCenterOptionsErrorMessage} tone="error" onClose={clearCostCenterOptionsStatus} />
      )}

      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => { event.preventDefault(); void searchOvertime() }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent type="button" variant="outline" disabled={loadingOvertime} label="Filtro" onClick={() => setFiltersOpen(true)} />
          <div className="min-w-0 flex-1">
            <InputComponent value={queryParams.search} type="text" placeholder="Buscar por trabajador, proyecto, tipo o motivo" onValueChange={setSearch} />
          </div>
        </div>
        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loadingOvertime}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingOvertime ? 'Buscando...' : 'Buscar'}
          />
          {canCreateOvertime && (
            <ButtonComponent
              type="button"
              variant="success"
              disabled={loadingOvertime}
              className="flex-1 md:flex-none"
              label="Nueva hora extra"
              onClick={() => navigate(AUTH_ROUTE_OVERTIME_CREATE)}
            />
          )}
        </div>
      </form>

      <TableComponent
        columns={overtimeTableColumns}
        rows={overtimeRows}
        loading={loadingOvertime}
        emptyMessage="No hay registros de horas extras."
        preserveHeaderCase
        customRenderer={renderCustomCell}
        actionsConfig={{
          columnIndex: ACTIONS_COLUMN_INDEX,
          resolveRowActions: resolveRowActionsFromTableRow,
          resolveOpenDirection: (activeRowIndex, rowsLength) => (
            activeRowIndex >= Math.max(rowsLength - 2, 0) ? 'up' : 'down'
          ),
        }}
        sortableColumnIndexes={OVERTIME_SORTABLE_COLUMNS}
        sortState={sortState}
        onSortChange={(columnIndex) => { void handleSortChange(columnIndex) }}
      />

      <div className="flex justify-end">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          loading={loadingOvertime}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>

      <RightSidebarComponent open={filtersOpen} title="Filtros" onClose={() => setFiltersOpen(false)}>
        <div className="space-y-4">
          <SelectComponent value={filters.employeeId} label="Trabajador" options={employeeSelectOptions} loading={loadingAttendanceEmployeeOptions} onValueChange={(v) => handleChangeFilter('employeeId', v)} />
          <SelectComponent value={filters.costCenter} label="Centro de costo" options={costCenterSelectOptions} loading={loadingCostCenterOptions} onValueChange={(v) => handleChangeFilter('costCenter', v)} />
          <SelectComponent value={filters.overtimeTypeId} label="Tipo de hora extra" options={overtimeTypeSelectOptions} loading={loadingOvertimeTypes} onValueChange={(v) => handleChangeFilter('overtimeTypeId', v)} />

          <div className="space-y-3 rounded-xl border border-cyan-500/35 bg-cyan-50/20 p-3 dark:border-cyan-400/25 dark:bg-cyan-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Fecha horas extras</p>
            <DateRangePickerComponent
              fromValue={filters.dateFrom}
              toValue={filters.dateTo}
              label="Rango de fecha"
              onRangeChange={({ from, to }) => {
                setFilters((prev) => ({ ...prev, dateFrom: from, dateTo: to }))
              }}
            />
          </div>

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <ButtonComponent type="button" variant="outline" disabled={loadingFilters} label="Limpiar" onClick={() => { void handleClearFilters() }} />
            <ButtonComponent type="button" variant="primary" disabled={loadingFilters} className="text-white dark:text-white" label="Aplicar" onClick={() => { void handleApplyFilters() }} />
          </div>
        </div>
      </RightSidebarComponent>

      <DetailSidebarComponent open={detailOpen} title={detailTitle} onClose={handleCloseDetail}>
        <OvertimeDetailComponent
          key={selectedDetailRowId ?? 'empty-overtime-detail'}
          detail={overtimeDetailView}
          loading={loadingOvertimeDetail}
          errorMessage={detailError}
          onRetry={handleRetryDetail}
          onEdit={canUpdateOvertime && selectedDetailRowId ? () => handleUpdateOvertime(selectedDetailRowId) : undefined}
        />
      </DetailSidebarComponent>
    </section>
  )
}
