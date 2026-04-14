import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  DetailSidebarComponent,
  InputComponent,
  PaginationComponent,
  RightSidebarComponent,
  SaveConfirmComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  TableComponent,
  TerminationQuizQuestionDetailComponent,
} from '@/components'
import {
  AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION,
  AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION_CREATE,
  AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION_EDIT,
} from '@/constant'
import {
  terminationQuizQuestionTableColumns,
  terminationQuizQuestionTableColumnIndex,
  terminationQuizQuestionTableSortByColumn,
} from '@/factories'
import { mapperTerminationQuizQuestionDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreAuth, useStoreTerminationQuizQuestion, useStoreSelects } from '@/store'
import type { TerminationQuizQuestionTableRow, TableRow, TableSortState } from '@/types'
import {
  createTerminationQuizQuestionActions,
  createTerminationQuizQuestionTableCustomRenderer,
} from '@/utils'
import type { DropdownAction } from '@/utils'

const QUESTION_COLUMN_INDEX = terminationQuizQuestionTableColumnIndex.question
const STATUS_COLUMN_INDEX = terminationQuizQuestionTableColumnIndex.status
const ACTIONS_COLUMN_INDEX = terminationQuizQuestionTableColumns.length - 1
const SORTABLE_COLUMNS = Object.keys(terminationQuizQuestionTableSortByColumn).map((index) => Number(index))

export default function TerminationQuizQuestionDashboardPage() {
  const navigate = useNavigate()
  const terminationQuizQuestionRows = useStoreTerminationQuizQuestion((s) => s.terminationQuizQuestionRows)
  const terminationQuizQuestionDetail = useStoreTerminationQuizQuestion((s) => s.terminationQuizQuestionDetail)
  const pagination = useStoreTerminationQuizQuestion((s) => s.pagination)
  const queryParams = useStoreTerminationQuizQuestion((s) => s.queryParams)
  const loadingTerminationQuizQuestion = useStoreTerminationQuizQuestion((s) => s.loadingTerminationQuizQuestion)
  const loadingTerminationQuizQuestionDetail = useStoreTerminationQuizQuestion((s) => s.loadingTerminationQuizQuestionDetail)
  const loadingToggleStatus = useStoreTerminationQuizQuestion((s) => s.loadingToggleStatus)
  const listError = useStoreTerminationQuizQuestion((s) => s.operationStatus.list.error)
  const detailError = useStoreTerminationQuizQuestion((s) => s.operationStatus.detail.error)
  const toggleError = useStoreTerminationQuizQuestion((s) => s.operationStatus.toggle.error)
  const clearOperationStatus = useStoreTerminationQuizQuestion((s) => s.clearOperationStatus)
  const getTerminationQuizQuestion = useStoreTerminationQuizQuestion((s) => s.getTerminationQuizQuestion)
  const getTerminationQuizQuestionDetail = useStoreTerminationQuizQuestion((s) => s.getTerminationQuizQuestionDetail)
  const goToPage = useStoreTerminationQuizQuestion((s) => s.goToPage)
  const setSearch = useStoreTerminationQuizQuestion((s) => s.setSearch)
  const searchTerminationQuizQuestion = useStoreTerminationQuizQuestion((s) => s.searchTerminationQuizQuestion)
  const sortTerminationQuizQuestion = useStoreTerminationQuizQuestion((s) => s.sortTerminationQuizQuestion)
  const setActiveFilter = useStoreTerminationQuizQuestion((s) => s.setActiveFilter)
  const setCreatedDateRange = useStoreTerminationQuizQuestion((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreTerminationQuizQuestion((s) => s.setUpdatedDateRange)
  const setQuestionGroupFilter = useStoreTerminationQuizQuestion((s) => s.setQuestionGroupFilter)
  const setEmployeeIdFilter = useStoreTerminationQuizQuestion((s) => s.setEmployeeIdFilter)
  const clearActiveFilter = useStoreTerminationQuizQuestion((s) => s.clearActiveFilter)
  const clearCreatedDateRange = useStoreTerminationQuizQuestion((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreTerminationQuizQuestion((s) => s.clearUpdatedDateRange)
  const toggleTerminationQuizQuestionStatus = useStoreTerminationQuizQuestion((s) => s.toggleTerminationQuizQuestionStatus)
  const clearTerminationQuizQuestionDetail = useStoreTerminationQuizQuestion((s) => s.clearTerminationQuizQuestionDetail)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canToggleStatus = hasPermission('TERMINATION_QUIZ_QUESTION', 'canUpdate')

  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingStatusOptions = useStoreSelects((s) => s.loadingStatusOptions)
  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)

  const {
    actionViewDetail,
    actionUpdateTerminationQuizQuestion,
    actionToggleStatus,
  } = createTerminationQuizQuestionActions()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState(() => ({
    activeId: queryParams.active,
    questionGroup: queryParams.questionGroup,
    employeeId: queryParams.employeeId,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
    updatedFrom: queryParams.updatedFrom,
    updatedTo: queryParams.updatedTo,
  }))
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<TerminationQuizQuestionTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')

  const terminationQuizQuestionDetailView = mapperTerminationQuizQuestionDetailView(terminationQuizQuestionDetail)
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const statusSelectOptions = statusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const activeSortColumn = SORTABLE_COLUMNS.find((index) => terminationQuizQuestionTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  useEffect(() => {
    void getTerminationQuizQuestion()
    void getStatusOptions()
  }, [getTerminationQuizQuestion, getStatusOptions])

  const handleViewDetail = (row: TerminationQuizQuestionTableRow) => {
    setSelectedDetailRowId(row.id)
    setDetailOpen(true)
    void getTerminationQuizQuestionDetail(row.id)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
    clearTerminationQuizQuestionDetail()
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getTerminationQuizQuestionDetail(selectedDetailRowId)
  }

  const handleUpdateTerminationQuizQuestion = (row: TerminationQuizQuestionTableRow) => {
    navigate(`${AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION_EDIT}=${row.id}`)
  }

  const handleToggleStatus = (row: TerminationQuizQuestionTableRow) => {
    setPendingToggleRow(row)
    setConfirmOpen(true)
  }

  const resolveRowActions = (row: TerminationQuizQuestionTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => handleViewDetail(row)),
      actionUpdateTerminationQuizQuestion(() => handleUpdateTerminationQuizQuestion(row)),
    ]

    if (canToggleStatus) {
      actions.push(actionToggleStatus(row.active === true, () => handleToggleStatus(row)))
    }

    return actions
  }

  const findRowById = (rowId: string) => terminationQuizQuestionRows.find((row) => row.id === rowId) ?? null
  const handleViewDetailById = (rowId: string) => {
    const row = findRowById(rowId)
    if (!row) return
    handleViewDetail(row)
  }
  const getStatusEnabled = (rowId: string) => Boolean(findRowById(rowId)?.active)
  const resolveRowActionsFromTableRow = (tableRow: TableRow): DropdownAction[] => {
    const row = findRowById(tableRow.id)
    if (!row) return []
    return resolveRowActions(row)
  }

  const renderCustomCell = createTerminationQuizQuestionTableCustomRenderer({
    questionColumnIndex: QUESTION_COLUMN_INDEX,
    statusColumnIndex: STATUS_COLUMN_INDEX,
    onViewDetail: handleViewDetailById,
    getStatusEnabled,
  })

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = terminationQuizQuestionTableSortByColumn[columnIndex]
    if (!sortBy) return

    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === 'asc' ? 'desc' : 'asc'
    await sortTerminationQuizQuestion(sortBy, nextSortDir)
  }

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }
  const handleActiveFilterChange = (value: string) => handleChangeFilter('activeId', value)
  const handleQuestionGroupFilterChange = (value: string) => handleChangeFilter('questionGroup', value)
  const handleEmployeeIdFilterChange = (value: string) => handleChangeFilter('employeeId', value)
  const handleCreatedFromFilterChange = (value: string) => handleChangeFilter('createdFrom', value)
  const handleCreatedToFilterChange = (value: string) => handleChangeFilter('createdTo', value)
  const handleUpdatedFromFilterChange = (value: string) => handleChangeFilter('updatedFrom', value)
  const handleUpdatedToFilterChange = (value: string) => handleChangeFilter('updatedTo', value)

  const handleApplyFilters = async () => {
    const selectedStatus = statusOptions.find((option) => String(option.id) === filters.activeId)
    setActiveFilter(selectedStatus ? String(selectedStatus.id) : '')
    setQuestionGroupFilter(filters.questionGroup.trim())
    setEmployeeIdFilter(filters.employeeId.trim())
    setCreatedDateRange({ createdFrom: filters.createdFrom.trim(), createdTo: filters.createdTo.trim() })
    setUpdatedDateRange({ updatedFrom: filters.updatedFrom.trim(), updatedTo: filters.updatedTo.trim() })
    await searchTerminationQuizQuestion()
    setFiltersOpen(false)
  }

  const handleClearFilters = async () => {
    setFilters({
      activeId: '',
      questionGroup: '',
      employeeId: '',
      createdFrom: '',
      createdTo: '',
      updatedFrom: '',
      updatedTo: '',
    })
    clearActiveFilter()
    setQuestionGroupFilter('')
    setEmployeeIdFilter('')
    clearCreatedDateRange()
    clearUpdatedDateRange()
    await searchTerminationQuizQuestion()
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
    const questionText = pendingToggleRow.values[QUESTION_COLUMN_INDEX]
    const success = await toggleTerminationQuizQuestionStatus(pendingToggleRow.id, nextStatus)
    if (success) {
      setConfirmOpen(false)
      setPendingToggleRow(null)
      await getTerminationQuizQuestion()
      navigate(AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActionsMessage(
        `${questionText} ${
          nextStatus
            ? messages.terminationQuizQuestion.status.success.toggleEnabledSuccess
            : messages.terminationQuizQuestion.status.success.toggleDisabledSuccess
        }`,
      )
    }
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.active === true ? 'deshabilitar' : 'habilitar'} la pregunta "${pendingToggleRow.values[QUESTION_COLUMN_INDEX]}"?`
    : ''
  const detailTitle = terminationQuizQuestionDetailView
    ? `Detalle de pregunta`
    : messages.terminationQuizQuestion.ui.detailTitleFallback

  return (
    <section className="min-w-0 space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">Dashboard de quiz de salida</h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total preguntas"
        activeLabel="Preguntas activas del quiz"
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
          void searchTerminationQuizQuestion()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingTerminationQuizQuestion || loadingToggleStatus}
            label="Filtro"
            onClick={() => setFiltersOpen(true)}
          />
          <div className="min-w-0 flex-1">
            <InputComponent
              value={queryParams.search}
              type="text"
              placeholder="Buscar por pregunta o grupo"
              onValueChange={setSearch}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loadingTerminationQuizQuestion || loadingToggleStatus}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingTerminationQuizQuestion ? 'Buscando...' : 'Buscar'}
          />
          <ButtonComponent
            type="button"
            variant="primary"
            disabled={loadingTerminationQuizQuestion || loadingToggleStatus}
            className="flex-1 text-white md:flex-none dark:text-white"
            label="Nueva pregunta"
            onClick={() => navigate(AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION_CREATE)}
          />
        </div>
      </form>

      <TableComponent
        columns={terminationQuizQuestionTableColumns}
        rows={terminationQuizQuestionRows}
        loading={loadingTerminationQuizQuestion}
        emptyMessage="No hay preguntas del quiz de salida registradas."
        customRenderer={renderCustomCell}
        actionsConfig={{
          columnIndex: ACTIONS_COLUMN_INDEX,
          resolveRowActions: resolveRowActionsFromTableRow,
          resolveOpenDirection: (activeRowIndex, rowsLength) => (
            activeRowIndex >= Math.max(rowsLength - 2, 0) ? 'up' : 'down'
          ),
        }}
        sortableColumnIndexes={SORTABLE_COLUMNS}
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
          loading={loadingTerminationQuizQuestion || loadingToggleStatus}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>

      <RightSidebarComponent open={filtersOpen} title="Filtros" onClose={() => setFiltersOpen(false)}>
        <div className="space-y-4">
          <SelectComponent
            value={filters.activeId}
            label="Estado"
            options={statusSelectOptions}
            onValueChange={handleActiveFilterChange}
          />

          <InputComponent
            id="tqq-question-group"
            value={filters.questionGroup}
            label="Grupo de pregunta"
            type="text"
            placeholder="Ej: Ambiente Laboral"
            onValueChange={handleQuestionGroupFilterChange}
          />

          <InputComponent
            id="tqq-employee-id"
            value={filters.employeeId}
            label="ID Empleado"
            type="number"
            placeholder="Dejar en blanco para todos"
            onValueChange={handleEmployeeIdFilterChange}
          />

          <div className="space-y-3 rounded-xl border border-emerald-500/35 bg-emerald-50/20 p-3 dark:border-emerald-400/25 dark:bg-emerald-950/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Fecha creacion
            </p>
            <div className="grid gap-2">
              <InputComponent
                id="tqq-created-from"
                value={filters.createdFrom}
                label="Desde"
                type="date"
                aria-label="Fecha creacion desde"
                onValueChange={handleCreatedFromFilterChange}
              />
              <InputComponent
                id="tqq-created-to"
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
                id="tqq-updated-from"
                value={filters.updatedFrom}
                label="Desde"
                type="date"
                aria-label="Fecha actualizacion desde"
                onValueChange={handleUpdatedFromFilterChange}
              />
              <InputComponent
                id="tqq-updated-to"
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
              disabled={loadingTerminationQuizQuestion || loadingToggleStatus || loadingStatusOptions}
              label="Limpiar"
              onClick={() => { void handleClearFilters() }}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loadingTerminationQuizQuestion || loadingToggleStatus || loadingStatusOptions}
              className="text-white dark:text-white"
              label={loadingStatusOptions ? 'Aplicando...' : 'Aplicar'}
              onClick={() => { void handleApplyFilters() }}
            />
          </div>
        </div>
      </RightSidebarComponent>

      <DetailSidebarComponent open={detailOpen} title={detailTitle} onClose={handleCloseDetail}>
        <TerminationQuizQuestionDetailComponent
          key={selectedDetailRowId ?? 'empty-tqq-detail'}
          detail={terminationQuizQuestionDetailView}
          loading={loadingTerminationQuizQuestionDetail}
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
