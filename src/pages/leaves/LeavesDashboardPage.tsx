import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DateRangePickerComponent,
  DetailSidebarComponent,
  InputComponent,
  LeaveDetailComponent,
  PaginationComponent,
  RightSidebarComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  TableComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import { AUTH_ROUTE_LEAVES_CREATE, AUTH_ROUTE_LEAVES_EDIT, SortDirection } from '@/constant'
import {
  leaveStatusFilterOptions,
  leavesTableColumns,
  leavesTableColumnIndex,
  leavesTableSortByColumn,
} from '@/factories'
import { mapperLeaveDetailView } from '@/mappers'
import { leavesService, storageService } from '@/services'
import { useStoreLeaveSelects, useStoreLeaves } from '@/store'
import type { TableRow, TableSortState } from '@/components'
import type { LeaveTableRow } from '@/types'
import { createLeavesActions, createLeavesTableCustomRenderer, downloadBlobFile } from '@/utils'
import type { DropdownAction } from '@/utils'

const LEAVE_EMPLOYEE_NAME_COLUMN_INDEX = leavesTableColumnIndex.employeeName
const LEAVE_STATUS_COLUMN_INDEX = leavesTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = leavesTableColumns.length - 1
const LEAVES_SORTABLE_COLUMNS = Object.keys(leavesTableSortByColumn).map((index) => Number(index))

export default function LeavesDashboardPage() {
  const navigate = useNavigate()

  const leavesRows = useStoreLeaves((s) => s.leavesRows)
  const leaveDetail = useStoreLeaves((s) => s.leaveDetail)
  const pagination = useStoreLeaves((s) => s.pagination)
  const queryParams = useStoreLeaves((s) => s.queryParams)
  const loadingLeaves = useStoreLeaves((s) => s.loadingLeaves)
  const loadingLeaveDetail = useStoreLeaves((s) => s.loadingLeaveDetail)
  const listError = useStoreLeaves((s) => s.operationStatus.list.error)
  const detailError = useStoreLeaves((s) => s.operationStatus.detail.error)
  const clearOperationStatus = useStoreLeaves((s) => s.clearOperationStatus)
  const getLeaves = useStoreLeaves((s) => s.getLeaves)
  const getLeaveDetail = useStoreLeaves((s) => s.getLeaveDetail)
  const clearLeaveDetail = useStoreLeaves((s) => s.clearLeaveDetail)
  const sortLeaves = useStoreLeaves((s) => s.sortLeaves)
  const goToPage = useStoreLeaves((s) => s.goToPage)
  const setSearch = useStoreLeaves((s) => s.setSearch)
  const setStatusFilter = useStoreLeaves((s) => s.setStatusFilter)
  const setLeaveTypeFilter = useStoreLeaves((s) => s.setLeaveTypeFilter)
  const setEmployeeFilter = useStoreLeaves((s) => s.setEmployeeFilter)
  const setStartDateRange = useStoreLeaves((s) => s.setStartDateRange)
  const setEndDateRange = useStoreLeaves((s) => s.setEndDateRange)
  const setCreatedDateRange = useStoreLeaves((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreLeaves((s) => s.setUpdatedDateRange)
  const clearStatusFilter = useStoreLeaves((s) => s.clearStatusFilter)
  const clearLeaveTypeFilter = useStoreLeaves((s) => s.clearLeaveTypeFilter)
  const clearEmployeeFilter = useStoreLeaves((s) => s.clearEmployeeFilter)
  const clearStartDateRange = useStoreLeaves((s) => s.clearStartDateRange)
  const clearEndDateRange = useStoreLeaves((s) => s.clearEndDateRange)
  const clearCreatedDateRange = useStoreLeaves((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreLeaves((s) => s.clearUpdatedDateRange)
  const searchLeaves = useStoreLeaves((s) => s.searchLeaves)

  const employeeWithContractOptions = useStoreLeaveSelects((s) => s.employeeWithContractOptions)
  const leaveTypeOptions = useStoreLeaveSelects((s) => s.leaveTypeOptions)
  const loadingLeaveFormOptions = useStoreLeaveSelects((s) => s.loadingLeaveFormOptions)
  const leaveFormOptionsErrorMessage = useStoreLeaveSelects((s) => s.leaveFormOptionsErrorMessage)
  const getLeaveFormOptions = useStoreLeaveSelects((s) => s.getLeaveFormOptions)
  const clearLeaveFormOptionsStatus = useStoreLeaveSelects((s) => s.clearLeaveFormOptionsStatus)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState(() => ({
    status: queryParams.status,
    leaveTypeId: queryParams.leaveTypeId,
    employeeId: queryParams.employeeId,
    startFrom: queryParams.startFrom,
    startTo: queryParams.startTo,
    endFrom: queryParams.endFrom,
    endTo: queryParams.endTo,
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
  const { actionViewDetail, actionUpdateLeave } = createLeavesActions()

  const leaveDetailView = mapperLeaveDetailView(leaveDetail)
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const activeSortColumn = LEAVES_SORTABLE_COLUMNS.find((index) => leavesTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }
  const employeeSelectOptions = employeeWithContractOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const leaveTypeSelectOptions = leaveTypeOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const detailTitle = leaveDetailView
    ? `Detalle de ${leaveDetailView.leaveTypeName}`
    : selectedDetailName
      ? `Detalle de ${selectedDetailName}`
      : 'Detalle de permiso'

  useEffect(() => {
    void getLeaves()
    void getLeaveFormOptions()
  }, [getLeaves, getLeaveFormOptions])

  useEffect(() => {
    setFilters({
      status: queryParams.status,
      leaveTypeId: queryParams.leaveTypeId,
      employeeId: queryParams.employeeId,
      startFrom: queryParams.startFrom,
      startTo: queryParams.startTo,
      endFrom: queryParams.endFrom,
      endTo: queryParams.endTo,
      createdFrom: queryParams.createdFrom,
      createdTo: queryParams.createdTo,
      updatedFrom: queryParams.updatedFrom,
      updatedTo: queryParams.updatedTo,
    })
  }, [
    queryParams.status,
    queryParams.leaveTypeId,
    queryParams.employeeId,
    queryParams.startFrom,
    queryParams.startTo,
    queryParams.endFrom,
    queryParams.endTo,
    queryParams.createdFrom,
    queryParams.createdTo,
    queryParams.updatedFrom,
    queryParams.updatedTo,
  ])

  const handleViewDetail = (row: LeaveTableRow) => {
    setSelectedDetailRowId(row.id)
    setSelectedDetailName(String(row.values[LEAVE_EMPLOYEE_NAME_COLUMN_INDEX] ?? 'Permiso'))
    setDetailOpen(true)
    void getLeaveDetail(row.id)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
    setSelectedDetailName('')
    clearLeaveDetail()
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getLeaveDetail(selectedDetailRowId)
  }

  const handleUpdateLeave = (rowOrId: LeaveTableRow | string) => {
    const rowId = typeof rowOrId === 'string' ? rowOrId : rowOrId.id
    navigate(`${AUTH_ROUTE_LEAVES_EDIT}=${rowId}`)
  }

  const resolveRowActions = (row: LeaveTableRow): DropdownAction[] => [
    actionViewDetail(() => handleViewDetail(row)),
    actionUpdateLeave(() => handleUpdateLeave(row)),
  ]

  const findLeaveRowById = (rowId: string) => leavesRows.find((row) => row.id === rowId) ?? null

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const leaveRow = findLeaveRowById(tableRow.id)
    if (!leaveRow) return []
    return resolveRowActions(leaveRow)
  }

  const renderCustomCell = createLeavesTableCustomRenderer({
    employeeNameColumnIndex: LEAVE_EMPLOYEE_NAME_COLUMN_INDEX,
    statusColumnIndex: LEAVE_STATUS_COLUMN_INDEX,
    onViewDetail: (rowId) => {
      const leaveRow = findLeaveRowById(rowId)
      if (!leaveRow) return
      handleViewDetail(leaveRow)
    },
  })

  const handleDownloadDocument = (fileId: number) => {
    window.open(storageService.getDownloadUrl(fileId), '_blank', 'noopener,noreferrer')
  }

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = leavesTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc
    await sortLeaves(sortBy, nextSortDir)
  }

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApplyFilters = async () => {
    setStatusFilter(filters.status.trim())
    setLeaveTypeFilter(filters.leaveTypeId)
    setEmployeeFilter(filters.employeeId)
    setStartDateRange({ startFrom: filters.startFrom.trim(), startTo: filters.startTo.trim() })
    setEndDateRange({ endFrom: filters.endFrom.trim(), endTo: filters.endTo.trim() })
    setCreatedDateRange({ createdFrom: filters.createdFrom.trim(), createdTo: filters.createdTo.trim() })
    setUpdatedDateRange({ updatedFrom: filters.updatedFrom.trim(), updatedTo: filters.updatedTo.trim() })
    await searchLeaves()
    setFiltersOpen(false)
  }

  const handleClearFilters = async () => {
    setFilters({
      status: '',
      leaveTypeId: '',
      employeeId: '',
      startFrom: '',
      startTo: '',
      endFrom: '',
      endTo: '',
      createdFrom: '',
      createdTo: '',
      updatedFrom: '',
      updatedTo: '',
    })
    clearStatusFilter()
    clearLeaveTypeFilter()
    clearEmployeeFilter()
    clearStartDateRange()
    clearEndDateRange()
    clearCreatedDateRange()
    clearUpdatedDateRange()
    await searchLeaves()
    setFiltersOpen(false)
  }

  const handleDownloadReport = async () => {
    if (downloadingReport) return
    try {
      setDownloadingReport(true)
      const csvBlob = await leavesService.exportLeavesCsv()
      downloadBlobFile(csvBlob, 'leaves.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch {
      setActionsMessage('No se pudo descargar el reporte.')
    } finally {
      setDownloadingReport(false)
    }
  }

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · PERMISOS</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de permisos</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total permisos"
        activeLabel="Permisos aprobados"
        pendingLabel="Pendientes"
        total={pagination.total}
        active={pagination.active}
        pending={pagination.pending}
      />

      {listError && (
        <AlertMessageComponent
          message={listError}
          tone="error"
          onClose={() => {
            clearOperationStatus('list')
          }}
        />
      )}

      {leaveFormOptionsErrorMessage && (
        <AlertMessageComponent message={leaveFormOptionsErrorMessage} tone="error" onClose={clearLeaveFormOptionsStatus} />
      )}

      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => { event.preventDefault(); void searchLeaves() }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent type="button" variant="outline" disabled={loadingLeaves} label="Filtro" onClick={() => setFiltersOpen(true)} />
          <div className="min-w-0 flex-1">
            <InputComponent value={queryParams.search} type="text" placeholder="Buscar por trabajador, identificación o motivo" onValueChange={setSearch} />
          </div>
        </div>
        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loadingLeaves}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingLeaves ? 'Buscando...' : 'Buscar'}
          />
          <ButtonComponent
            type="button"
            variant="success"
            disabled={loadingLeaves}
            className="flex-1 md:flex-none"
            label="Nuevo permiso"
            onClick={() => navigate(AUTH_ROUTE_LEAVES_CREATE)}
          />
          <ToolbarActionsDropdownComponent
            disabled={loadingLeaves || downloadingReport}
            showBulkUpload={false}
            onDownloadReport={() => { void handleDownloadReport() }}
            onBulkUpload={() => {}}
          />
        </div>
      </form>

      <TableComponent
        columns={leavesTableColumns}
        rows={leavesRows}
        loading={loadingLeaves}
        emptyMessage="No hay permisos registrados."
        customRenderer={renderCustomCell}
        actionsConfig={{
          columnIndex: ACTIONS_COLUMN_INDEX,
          resolveRowActions: resolveRowActionsFromTableRow,
          resolveOpenDirection: (activeRowIndex, rowsLength) => (
            activeRowIndex >= Math.max(rowsLength - 2, 0) ? 'up' : 'down'
          ),
        }}
        sortableColumnIndexes={LEAVES_SORTABLE_COLUMNS}
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
          loading={loadingLeaves}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>

      <RightSidebarComponent open={filtersOpen} title="Filtros" onClose={() => setFiltersOpen(false)}>
        <div className="space-y-4">
          <SelectComponent value={filters.status} label="Estado" options={leaveStatusFilterOptions} onValueChange={(v) => handleChangeFilter('status', v)} />
          <SelectComponent value={filters.leaveTypeId} label="Tipo de permiso" options={leaveTypeSelectOptions} loading={loadingLeaveFormOptions} onValueChange={(v) => handleChangeFilter('leaveTypeId', v)} />
          <SelectComponent value={filters.employeeId} label="Trabajador" options={employeeSelectOptions} loading={loadingLeaveFormOptions} onValueChange={(v) => handleChangeFilter('employeeId', v)} />

          <div className="space-y-3 rounded-xl border border-cyan-500/35 bg-cyan-50/20 p-3 dark:border-cyan-400/25 dark:bg-cyan-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Inicio del permiso</p>
            <DateRangePickerComponent
              fromValue={filters.startFrom}
              toValue={filters.startTo}
              label="Rango de inicio"
              onRangeChange={({ from, to }) => {
                setFilters((prev) => ({ ...prev, startFrom: from, startTo: to }))
              }}
            />
          </div>
          <div className="space-y-3 rounded-xl border border-sky-500/35 bg-sky-50/20 p-3 dark:border-sky-400/25 dark:bg-sky-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">Fin del permiso</p>
            <DateRangePickerComponent
              fromValue={filters.endFrom}
              toValue={filters.endTo}
              label="Rango de fin"
              onRangeChange={({ from, to }) => {
                setFilters((prev) => ({ ...prev, endFrom: from, endTo: to }))
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
            <ButtonComponent type="button" variant="outline" disabled={loadingLeaves || loadingLeaveFormOptions} label="Limpiar" onClick={() => { void handleClearFilters() }} />
            <ButtonComponent type="button" variant="primary" disabled={loadingLeaves || loadingLeaveFormOptions} className="text-white dark:text-white" label="Aplicar" onClick={() => { void handleApplyFilters() }} />
          </div>
        </div>
      </RightSidebarComponent>

      <DetailSidebarComponent open={detailOpen} title={detailTitle} onClose={handleCloseDetail}>
        <LeaveDetailComponent
          key={selectedDetailRowId ?? 'empty-leave-detail'}
          detail={leaveDetailView}
          loading={loadingLeaveDetail}
          errorMessage={detailError}
          onRetry={handleRetryDetail}
          onEdit={selectedDetailRowId ? () => handleUpdateLeave(selectedDetailRowId) : undefined}
          onDownloadDocument={handleDownloadDocument}
        />
      </DetailSidebarComponent>
    </section>
  )
}
