import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  AnnexDetailComponent,
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
import { AUTH_ROUTE_ANNEXES_CREATE, AUTH_ROUTE_ANNEXES_EDIT, SortDirection } from '@/constant'
import { annexesTableColumns, annexesTableColumnIndex, annexesTableSortByColumn } from '@/factories'
import { mapperAnnexDetailView } from '@/mappers'
import { annexesService, storageService } from '@/services'
import { useStoreAnnexes } from '@/store'
import { useStoreEmployeeSelects } from '@/store'
import type { AnnexTableRow, TableRow, TableSortState } from '@/types'
import { createAnnexesActions, createAnnexesTableCustomRenderer, downloadBlobFile } from '@/utils'
import type { DropdownAction } from '@/utils'

const ANNEX_EMPLOYEE_NAME_COLUMN_INDEX = annexesTableColumnIndex.employeeName
const ANNEX_STATUS_COLUMN_INDEX = annexesTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = annexesTableColumns.length - 1
const ANNEXES_SORTABLE_COLUMNS = Object.keys(annexesTableSortByColumn).map((index) => Number(index))

export default function AnnexesDashboardPage() {
  const navigate = useNavigate()

  const annexesRows = useStoreAnnexes((s) => s.annexesRows)
  const annexDetail = useStoreAnnexes((s) => s.annexDetail)
  const pagination = useStoreAnnexes((s) => s.pagination)
  const queryParams = useStoreAnnexes((s) => s.queryParams)
  const loadingAnnexes = useStoreAnnexes((s) => s.loadingAnnexes)
  const loadingAnnexDetail = useStoreAnnexes((s) => s.loadingAnnexDetail)
  const listError = useStoreAnnexes((s) => s.operationStatus.list.error)
  const detailError = useStoreAnnexes((s) => s.operationStatus.detail.error)
  const clearOperationStatus = useStoreAnnexes((s) => s.clearOperationStatus)
  const getAnnexes = useStoreAnnexes((s) => s.getAnnexes)
  const getAnnexDetail = useStoreAnnexes((s) => s.getAnnexDetail)
  const clearAnnexDetail = useStoreAnnexes((s) => s.clearAnnexDetail)
  const sortAnnexes = useStoreAnnexes((s) => s.sortAnnexes)
  const goToPage = useStoreAnnexes((s) => s.goToPage)
  const setSearch = useStoreAnnexes((s) => s.setSearch)
  const setStatusFilter = useStoreAnnexes((s) => s.setStatusFilter)
  const setDateRange = useStoreAnnexes((s) => s.setDateRange)
  const setCreatedDateRange = useStoreAnnexes((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreAnnexes((s) => s.setUpdatedDateRange)
  const clearStatusFilter = useStoreAnnexes((s) => s.clearStatusFilter)
  const clearDateRange = useStoreAnnexes((s) => s.clearDateRange)
  const clearCreatedDateRange = useStoreAnnexes((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreAnnexes((s) => s.clearUpdatedDateRange)
  const searchAnnexes = useStoreAnnexes((s) => s.searchAnnexes)

  const approvalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptions)
  const loadingApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.loadingApprovalEmployeeStatusOptions)
  const approvalEmployeeStatusOptionsErrorMessage = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptionsErrorMessage)
  const getApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.getApprovalEmployeeStatusOptions)
  const clearApprovalEmployeeStatusOptionsStatus = useStoreEmployeeSelects((s) => s.clearApprovalEmployeeStatusOptionsStatus)

  const { actionViewDetail, actionUpdateAnnex } = createAnnexesActions()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState(() => ({
    statusId: queryParams.status,
    dateFrom: queryParams.dateFrom,
    dateTo: queryParams.dateTo,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
    updatedFrom: queryParams.updatedFrom,
    updatedTo: queryParams.updatedTo,
  }))
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [selectedDetailName, setSelectedDetailName] = useState('')
  const [actionsMessage, setActionsMessage] = useState('')
  const [downloadingReport, setDownloadingReport] = useState(false)

  const annexDetailView = mapperAnnexDetailView(annexDetail)
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const activeSortColumn = ANNEXES_SORTABLE_COLUMNS.find((index) => annexesTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }
  const statusSelectOptions = approvalEmployeeStatusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const detailTitle = annexDetailView
    ? `Detalle de ${annexDetailView.annexTypeName}`
    : selectedDetailName
      ? `Detalle de ${selectedDetailName}`
      : 'Detalle de anexo'

  useEffect(() => {
    void getAnnexes()
    void getApprovalEmployeeStatusOptions()
  }, [getAnnexes, getApprovalEmployeeStatusOptions])

  useEffect(() => {
    setFilters({
      statusId: queryParams.status,
      dateFrom: queryParams.dateFrom,
      dateTo: queryParams.dateTo,
      createdFrom: queryParams.createdFrom,
      createdTo: queryParams.createdTo,
      updatedFrom: queryParams.updatedFrom,
      updatedTo: queryParams.updatedTo,
    })
  }, [
    queryParams.status,
    queryParams.dateFrom,
    queryParams.dateTo,
    queryParams.createdFrom,
    queryParams.createdTo,
    queryParams.updatedFrom,
    queryParams.updatedTo,
  ])

  const handleViewDetail = (row: AnnexTableRow) => {
    setSelectedDetailRowId(row.id)
    setSelectedDetailName(String(row.values[ANNEX_EMPLOYEE_NAME_COLUMN_INDEX] ?? 'Anexo'))
    setDetailOpen(true)
    void getAnnexDetail(row.id)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
    setSelectedDetailName('')
    clearAnnexDetail()
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getAnnexDetail(selectedDetailRowId)
  }

  const handleUpdateAnnex = (row: AnnexTableRow) => {
    navigate(`${AUTH_ROUTE_ANNEXES_EDIT}=${row.id}`)
  }

  const resolveRowActions = (row: AnnexTableRow): DropdownAction[] => [
    actionViewDetail(() => handleViewDetail(row)),
    actionUpdateAnnex(() => handleUpdateAnnex(row)),
  ]

  const findAnnexRowById = (rowId: string) => annexesRows.find((row) => row.id === rowId) ?? null

  const handleViewDetailById = (rowId: string) => {
    const annexRow = findAnnexRowById(rowId)
    if (!annexRow) return
    handleViewDetail(annexRow)
  }

  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const annexRow = findAnnexRowById(tableRow.id)
    if (!annexRow) return []
    return resolveRowActions(annexRow)
  }

  const renderCustomCell = createAnnexesTableCustomRenderer({
    employeeNameColumnIndex: ANNEX_EMPLOYEE_NAME_COLUMN_INDEX,
    statusColumnIndex: ANNEX_STATUS_COLUMN_INDEX,
    onViewDetail: handleViewDetailById,
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = annexesTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc
    await sortAnnexes(sortBy, nextSortDir)
  }

  const handleSearchSubmit = async () => {
    await searchAnnexes()
  }

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApplyFilters = async () => {
    const selectedStatus = approvalEmployeeStatusOptions.find((option) => String(option.id) === filters.statusId)
    setStatusFilter(selectedStatus ? String(selectedStatus.id) : '')
    setDateRange({ dateFrom: filters.dateFrom.trim(), dateTo: filters.dateTo.trim() })
    setCreatedDateRange({ createdFrom: filters.createdFrom.trim(), createdTo: filters.createdTo.trim() })
    setUpdatedDateRange({ updatedFrom: filters.updatedFrom.trim(), updatedTo: filters.updatedTo.trim() })
    await searchAnnexes()
    setFiltersOpen(false)
  }

  const handleClearFilters = async () => {
    setFilters({ statusId: '', dateFrom: '', dateTo: '', createdFrom: '', createdTo: '', updatedFrom: '', updatedTo: '' })
    clearStatusFilter()
    clearDateRange()
    clearCreatedDateRange()
    clearUpdatedDateRange()
    await searchAnnexes()
    setFiltersOpen(false)
  }

  const handleDownloadReport = async () => {
    if (downloadingReport) return
    try {
      setDownloadingReport(true)
      const csvBlob = await annexesService.exportAnnexesCsv()
      downloadBlobFile(csvBlob, 'annexes.csv')
      setActionsMessage('Reporte descargado correctamente.')
    } catch {
      setActionsMessage('No se pudo descargar el reporte.')
    } finally {
      setDownloadingReport(false)
    }
  }

  const handleDownloadDocument = (fileId: number) => {
    window.open(storageService.getDownloadUrl(fileId), '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · ANEXOS</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de anexos</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total anexos"
        activeLabel="Anexos aprobados"
        total={pagination.total}
        active={pagination.active}
      />

      {listError && (
        <AlertMessageComponent message={listError} tone="error" onClose={() => clearOperationStatus('list')} />
      )}

      {approvalEmployeeStatusOptionsErrorMessage && (
        <AlertMessageComponent message={approvalEmployeeStatusOptionsErrorMessage} tone="error" onClose={clearApprovalEmployeeStatusOptionsStatus} />
      )}

      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => { event.preventDefault(); void handleSearchSubmit() }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent type="button" variant="outline" disabled={loadingAnnexes} label="Filtro" onClick={() => setFiltersOpen(true)} />
          <div className="min-w-0 flex-1">
            <InputComponent value={queryParams.search} type="text" placeholder="Buscar por trabajador" onValueChange={setSearch} />
          </div>
        </div>
        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loadingAnnexes}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingAnnexes ? 'Buscando...' : 'Buscar'}
          />
          <ButtonComponent
            type="button"
            variant="success"
            disabled={loadingAnnexes}
            className="flex-1 md:flex-none"
            label="Nuevo anexo"
            onClick={() => navigate(AUTH_ROUTE_ANNEXES_CREATE)}
          />
          <ToolbarActionsDropdownComponent
            disabled={loadingAnnexes || downloadingReport}
            showBulkUpload={false}
            onDownloadReport={() => { void handleDownloadReport() }}
            onBulkUpload={() => {}}
          />
        </div>
      </form>

      <TableComponent
        columns={annexesTableColumns}
        rows={annexesRows}
        loading={loadingAnnexes}
        emptyMessage="No hay anexos registrados."
        customRenderer={renderCustomCell}
        actionsConfig={{ columnIndex: ACTIONS_COLUMN_INDEX, resolveRowActions: resolveRowActionsFromTableRow }}
        sortableColumnIndexes={ANNEXES_SORTABLE_COLUMNS}
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
          loading={loadingAnnexes}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>

      <RightSidebarComponent open={filtersOpen} title="Filtros" onClose={() => setFiltersOpen(false)}>
        <div className="space-y-4">
          <SelectComponent
            value={filters.statusId}
            label="Estado de aprobacion"
            options={statusSelectOptions}
            loading={loadingApprovalEmployeeStatusOptions}
            onValueChange={(v) => handleChangeFilter('statusId', v)}
          />
          <div className="space-y-3 rounded-xl border border-cyan-500/35 bg-cyan-50/20 p-3 dark:border-cyan-400/25 dark:bg-cyan-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Fecha del anexo</p>
            <DateRangePickerComponent
                fromValue={filters.dateFrom}
                toValue={filters.dateTo}
                label="Rango de fecha"
                onRangeChange={({ from, to }) => {
                  setFilters((prev) => ({ ...prev, dateFrom: from, dateTo: to }))
                }}
              />
          </div>
          <div className="space-y-3 rounded-xl border border-emerald-500/35 bg-emerald-50/20 p-3 dark:border-emerald-400/25 dark:bg-emerald-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Fecha creacion</p>
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
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Fecha actualizacion</p>
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
            <ButtonComponent type="button" variant="outline" disabled={loadingAnnexes || loadingApprovalEmployeeStatusOptions} label="Limpiar" onClick={() => { void handleClearFilters() }} />
            <ButtonComponent type="button" variant="primary" disabled={loadingAnnexes || loadingApprovalEmployeeStatusOptions} className="text-white dark:text-white" label="Aplicar" onClick={() => { void handleApplyFilters() }} />
          </div>
        </div>
      </RightSidebarComponent>

      <DetailSidebarComponent open={detailOpen} title={detailTitle} onClose={handleCloseDetail}>
        <AnnexDetailComponent
          key={selectedDetailRowId ?? 'empty-annex-detail'}
          detail={annexDetailView}
          loading={loadingAnnexDetail}
          errorMessage={detailError}
          onRetry={handleRetryDetail}
          onEdit={selectedDetailRowId ? () => navigate(`${AUTH_ROUTE_ANNEXES_EDIT}=${selectedDetailRowId}`) : undefined}
          onDownloadDocument={handleDownloadDocument}
        />
      </DetailSidebarComponent>
    </section>
  )
}
