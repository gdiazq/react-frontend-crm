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
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AttendanceDetailComponent } from '@/components/attendance/AttendanceDetailComponent'
import {
  AUTH_ROUTE_ATTENDANCE_CREATE,
  AUTH_ROUTE_ATTENDANCE_EDIT,
  PermissionAction,
  PermissionModule,
  SortDirection,
} from '@/constant'
import { attendanceTableColumns, attendanceTableColumnIndex, attendanceTableSortByColumn } from '@/factories'
import { mapperAttendanceDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { attendanceService } from '@/services'
import {
  useStoreAttendance,
  useStoreAttendanceSelects,
  useStoreAuth,
  useStoreEmployeeSelects,
} from '@/store'
import type { TableRow, TableSortState } from '@/components'
import type { AttendanceTableRow } from '@/types'
import {
  createAttendanceActions,
  createTableCustomRenderer,
  downloadBlobFile,
  renderEmployeeApprovalStatus,
  renderViewDetailButton,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const ATTENDANCE_EMPLOYEE_NAME_COLUMN_INDEX = attendanceTableColumnIndex.employeeName
const ATTENDANCE_STATUS_COLUMN_INDEX = attendanceTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = attendanceTableColumns.length - 1
const ATTENDANCE_SORTABLE_COLUMNS = Object.keys(attendanceTableSortByColumn).map((index) => Number(index))

export default function AttendanceDashboardPage() {
  const navigate = useNavigate()

  const attendanceRows = useStoreAttendance((s) => s.attendanceRows)
  const attendanceDetail = useStoreAttendance((s) => s.attendanceDetail)
  const pagination = useStoreAttendance((s) => s.pagination)
  const queryParams = useStoreAttendance((s) => s.queryParams)
  const loadingAttendance = useStoreAttendance((s) => s.operationLoading.list)
  const loadingAttendanceDetail = useStoreAttendance((s) => s.operationLoading.detail)
  const listError = useStoreAttendance((s) => s.operationStatus.list.error)
  const detailError = useStoreAttendance((s) => s.operationStatus.detail.error)
  const clearOperationStatus = useStoreAttendance((s) => s.clearOperationStatus)
  const getAttendance = useStoreAttendance((s) => s.getAttendance)
  const getAttendanceDetail = useStoreAttendance((s) => s.getAttendanceDetail)
  const clearAttendanceDetail = useStoreAttendance((s) => s.clearAttendanceDetail)
  const sortAttendance = useStoreAttendance((s) => s.sortAttendance)
  const goToPage = useStoreAttendance((s) => s.goToPage)
  const setSearch = useStoreAttendance((s) => s.setSearch)
  const setEmployeeFilter = useStoreAttendance((s) => s.setEmployeeFilter)
  const setCostCenterFilter = useStoreAttendance((s) => s.setCostCenterFilter)
  const setStatusFilter = useStoreAttendance((s) => s.setStatusFilter)
  const setDateRange = useStoreAttendance((s) => s.setDateRange)
  const setCreatedDateRange = useStoreAttendance((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreAttendance((s) => s.setUpdatedDateRange)
  const clearEmployeeFilter = useStoreAttendance((s) => s.clearEmployeeFilter)
  const clearCostCenterFilter = useStoreAttendance((s) => s.clearCostCenterFilter)
  const clearStatusFilter = useStoreAttendance((s) => s.clearStatusFilter)
  const clearDateRange = useStoreAttendance((s) => s.clearDateRange)
  const clearCreatedDateRange = useStoreAttendance((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreAttendance((s) => s.clearUpdatedDateRange)
  const searchAttendance = useStoreAttendance((s) => s.searchAttendance)

  const employeeWithContractOptions = useStoreAttendanceSelects((s) => s.employeeWithContractOptions)
  const attendanceStatusOptions = useStoreAttendanceSelects((s) => s.attendanceStatusOptions)
  const loadingAttendanceFormOptions = useStoreAttendanceSelects((s) => s.loadingAttendanceFormOptions)
  const attendanceFormOptionsErrorMessage = useStoreAttendanceSelects((s) => s.attendanceFormOptionsErrorMessage)
  const getAttendanceFormOptions = useStoreAttendanceSelects((s) => s.getAttendanceFormOptions)
  const clearAttendanceFormOptionsStatus = useStoreAttendanceSelects((s) => s.clearAttendanceFormOptionsStatus)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const projectCostCenterOptions = useStoreEmployeeSelects((s) => s.projectCostCenterOptions)
  const loadingCostCenterOptions = useStoreEmployeeSelects((s) => s.loadingFormOptions)
  const costCenterOptionsErrorMessage = useStoreEmployeeSelects((s) => s.formOptionsErrorMessage)
  const getCostCenterFormOptions = useStoreEmployeeSelects((s) => s.getFormOptions)
  const clearCostCenterOptionsStatus = useStoreEmployeeSelects((s) => s.clearFormOptionsStatus)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState(() => ({
    employeeId: queryParams.employeeId,
    costCenter: queryParams.costCenter,
    statusId: queryParams.statusId,
    dateFrom: queryParams.dateFrom,
    dateTo: queryParams.dateTo,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
    updatedFrom: queryParams.updatedFrom,
    updatedTo: queryParams.updatedTo,
  }))
  const [actionsMessage, setActionsMessage] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [selectedDetailName, setSelectedDetailName] = useState('')
  const { actionViewDetail, actionUpdateAttendance } = createAttendanceActions()
  const canCreateAttendance = hasPermission(PermissionModule.Attendance, PermissionAction.Create)
  const canUpdateAttendance = hasPermission(PermissionModule.Attendance, PermissionAction.Update)

  const attendanceDetailView = mapperAttendanceDetailView(attendanceDetail)
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const activeSortColumn = ATTENDANCE_SORTABLE_COLUMNS.find((index) => attendanceTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }
  const employeeSelectOptions = employeeWithContractOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const attendanceStatusSelectOptions = attendanceStatusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const costCenterSelectOptions = projectCostCenterOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const detailTitle = attendanceDetailView
    ? `Detalle de ${attendanceDetailView.employeeName}`
    : selectedDetailName
      ? `Detalle de ${selectedDetailName}`
      : messages.attendance.ui.detailTitleFallback

  useEffect(() => {
    void getAttendance()
    void getAttendanceFormOptions()
    void getCostCenterFormOptions()
  }, [getAttendance, getAttendanceFormOptions, getCostCenterFormOptions])

  useEffect(() => {
    setFilters({
      employeeId: queryParams.employeeId,
      costCenter: queryParams.costCenter,
      statusId: queryParams.statusId,
      dateFrom: queryParams.dateFrom,
      dateTo: queryParams.dateTo,
      createdFrom: queryParams.createdFrom,
      createdTo: queryParams.createdTo,
      updatedFrom: queryParams.updatedFrom,
      updatedTo: queryParams.updatedTo,
    })
  }, [
    queryParams.employeeId,
    queryParams.costCenter,
    queryParams.statusId,
    queryParams.dateFrom,
    queryParams.dateTo,
    queryParams.createdFrom,
    queryParams.createdTo,
    queryParams.updatedFrom,
    queryParams.updatedTo,
  ])

  const handleViewDetail = (row: AttendanceTableRow) => {
    setSelectedDetailRowId(row.id)
    setSelectedDetailName(String(row.values[ATTENDANCE_EMPLOYEE_NAME_COLUMN_INDEX] ?? 'Asistencia'))
    setDetailOpen(true)
    void getAttendanceDetail(row.id)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
    setSelectedDetailName('')
    clearAttendanceDetail()
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getAttendanceDetail(selectedDetailRowId)
  }

  const handleUpdateAttendance = (rowOrId: AttendanceTableRow | string) => {
    const rowId = typeof rowOrId === 'string' ? rowOrId : rowOrId.id
    navigate(`${AUTH_ROUTE_ATTENDANCE_EDIT}=${rowId}`)
  }

  const resolveRowActions = (row: AttendanceTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [actionViewDetail(() => handleViewDetail(row))]
    if (canUpdateAttendance) actions.push(actionUpdateAttendance(() => handleUpdateAttendance(row)))
    return actions
  }

  const findAttendanceRowById = (rowId: string) => attendanceRows.find((row) => row.id === rowId) ?? null

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const attendanceRow = findAttendanceRowById(tableRow.id)
    if (!attendanceRow) return []
    return resolveRowActions(attendanceRow)
  }

  const renderCustomCell = createTableCustomRenderer({
    [ATTENDANCE_EMPLOYEE_NAME_COLUMN_INDEX]: ({ row, value }) =>
      renderViewDetailButton(value, () => {
        const attendanceRow = findAttendanceRowById(row.id)
        if (!attendanceRow) return
        handleViewDetail(attendanceRow)
      }, 'accent'),
    [ATTENDANCE_STATUS_COLUMN_INDEX]: ({ value }) => renderEmployeeApprovalStatus(value),
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = attendanceTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc
    await sortAttendance(sortBy, nextSortDir)
  }

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApplyFilters = async () => {
    setEmployeeFilter(filters.employeeId)
    setCostCenterFilter(filters.costCenter.trim())
    setStatusFilter(filters.statusId)
    setDateRange({ dateFrom: filters.dateFrom.trim(), dateTo: filters.dateTo.trim() })
    setCreatedDateRange({ createdFrom: filters.createdFrom.trim(), createdTo: filters.createdTo.trim() })
    setUpdatedDateRange({ updatedFrom: filters.updatedFrom.trim(), updatedTo: filters.updatedTo.trim() })
    await searchAttendance()
    setFiltersOpen(false)
  }

  const handleClearFilters = async () => {
    setFilters({
      employeeId: '',
      costCenter: '',
      statusId: '',
      dateFrom: '',
      dateTo: '',
      createdFrom: '',
      createdTo: '',
      updatedFrom: '',
      updatedTo: '',
    })
    clearEmployeeFilter()
    clearCostCenterFilter()
    clearStatusFilter()
    clearDateRange()
    clearCreatedDateRange()
    clearUpdatedDateRange()
    await searchAttendance()
    setFiltersOpen(false)
  }

  const handleDownloadReport = async () => {
    if (downloadingReport) return
    try {
      setDownloadingReport(true)
      const csvBlob = await attendanceService.exportAttendanceCsv(queryParams)
      downloadBlobFile(csvBlob, 'attendance.csv')
      setActionsMessage(messages.attendance.status.success.exportSuccess)
    } catch {
      setActionsMessage(messages.attendance.status.errors.exportError)
    } finally {
      setDownloadingReport(false)
    }
  }

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · ASISTENCIA</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de asistencia</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total registros"
        activeLabel="Presentes"
        pendingLabel="Pendientes"
        total={pagination.total}
        active={pagination.active}
        pending={pagination.pending}
      />

      {listError && (
        <AlertMessageComponent message={listError} tone="error" onClose={() => clearOperationStatus('list')} />
      )}

      {attendanceFormOptionsErrorMessage && (
        <AlertMessageComponent message={attendanceFormOptionsErrorMessage} tone="error" onClose={clearAttendanceFormOptionsStatus} />
      )}

      {costCenterOptionsErrorMessage && (
        <AlertMessageComponent message={costCenterOptionsErrorMessage} tone="error" onClose={clearCostCenterOptionsStatus} />
      )}

      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => { event.preventDefault(); void searchAttendance() }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent type="button" variant="outline" disabled={loadingAttendance} label="Filtro" onClick={() => setFiltersOpen(true)} />
          <div className="min-w-0 flex-1">
            <InputComponent value={queryParams.search} type="text" placeholder="Buscar por trabajador, identificación, proyecto o notas" onValueChange={setSearch} />
          </div>
        </div>
        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loadingAttendance}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingAttendance ? 'Buscando...' : 'Buscar'}
          />
          {canCreateAttendance && (
            <ButtonComponent
              type="button"
              variant="success"
              disabled={loadingAttendance}
              className="flex-1 md:flex-none"
              label="Nueva asistencia"
              onClick={() => navigate(AUTH_ROUTE_ATTENDANCE_CREATE)}
            />
          )}
          <ToolbarActionsDropdownComponent
            disabled={loadingAttendance || downloadingReport}
            showBulkUpload={false}
            onDownloadReport={() => { void handleDownloadReport() }}
            onBulkUpload={() => {}}
          />
        </div>
      </form>

      <TableComponent
        columns={attendanceTableColumns}
        rows={attendanceRows}
        loading={loadingAttendance}
        emptyMessage="No hay registros de asistencia."
        customRenderer={renderCustomCell}
        actionsConfig={{
          columnIndex: ACTIONS_COLUMN_INDEX,
          resolveRowActions: resolveRowActionsFromTableRow,
          resolveOpenDirection: (activeRowIndex, rowsLength) => (
            activeRowIndex >= Math.max(rowsLength - 2, 0) ? 'up' : 'down'
          ),
        }}
        sortableColumnIndexes={ATTENDANCE_SORTABLE_COLUMNS}
        sortState={sortState}
        onSortChange={(columnIndex) => { void handleSortChange(columnIndex) }}
      />

      {actionsMessage && (
        <AlertMessageComponent message={actionsMessage} tone="info" onClose={() => setActionsMessage('')} />
      )}

      <div className="flex justify-end">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          loading={loadingAttendance}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>

      <RightSidebarComponent open={filtersOpen} title="Filtros" onClose={() => setFiltersOpen(false)}>
        <div className="space-y-4">
          <SelectComponent value={filters.statusId} label="Estado" options={attendanceStatusSelectOptions} loading={loadingAttendanceFormOptions} onValueChange={(v) => handleChangeFilter('statusId', v)} />
          <SelectComponent value={filters.employeeId} label="Trabajador" options={employeeSelectOptions} loading={loadingAttendanceFormOptions} onValueChange={(v) => handleChangeFilter('employeeId', v)} />
          <SelectComponent value={filters.costCenter} label="Centro de costo" options={costCenterSelectOptions} loading={loadingCostCenterOptions} onValueChange={(v) => handleChangeFilter('costCenter', v)} />

          <div className="space-y-3 rounded-xl border border-cyan-500/35 bg-cyan-50/20 p-3 dark:border-cyan-400/25 dark:bg-cyan-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Fecha asistencia</p>
            <DateRangePickerComponent
              fromValue={filters.dateFrom}
              toValue={filters.dateTo}
              label="Rango de asistencia"
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
            <ButtonComponent type="button" variant="outline" disabled={loadingAttendance || loadingAttendanceFormOptions || loadingCostCenterOptions} label="Limpiar" onClick={() => { void handleClearFilters() }} />
            <ButtonComponent type="button" variant="primary" disabled={loadingAttendance || loadingAttendanceFormOptions || loadingCostCenterOptions} className="text-white dark:text-white" label="Aplicar" onClick={() => { void handleApplyFilters() }} />
          </div>
        </div>
      </RightSidebarComponent>

      <DetailSidebarComponent open={detailOpen} title={detailTitle} onClose={handleCloseDetail}>
        <AttendanceDetailComponent
          key={selectedDetailRowId ?? 'empty-attendance-detail'}
          detail={attendanceDetailView}
          loading={loadingAttendanceDetail}
          errorMessage={detailError}
          onRetry={handleRetryDetail}
          onEdit={canUpdateAttendance && selectedDetailRowId ? () => handleUpdateAttendance(selectedDetailRowId) : undefined}
        />
      </DetailSidebarComponent>

    </section>
  )
}
