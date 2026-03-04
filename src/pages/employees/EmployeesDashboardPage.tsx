import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AUTH_ROUTE_EMPLOYEES, AUTH_ROUTE_EMPLOYEES_CREATE } from '@/constant'
import {
  ActionsDropdownComponent,
  AlertMessageComponent,
  ButtonComponent,
  DetailSidebarComponent,
  EmployeeApprovalStatusBadgeComponent,
  InputComponent,
  PaginationComponent,
  RightSidebarComponent,
  SaveConfirmComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  StatusBadgeComponent,
  TableComponent,
  ToolbarActionsDropdownComponent,
} from '@/components'
import type { TableRow, TableSortState } from '@/components'
import { employeesTableColumns } from '@/factories'
import messages from '@/messages/messages'
import { useStoreAuth, useStoreEmployees, useStoreSelects } from '@/store'
import type { EmployeeTableRow, EmployeesSortBy } from '@/types'
import { createEmployeesActions } from '@/utils'
import type { DropdownAction } from '@/utils'

const EMPLOYEE_ACTIVE_COLUMN_INDEX = 6
const EMPLOYEE_APPROVAL_STATUS_COLUMN_INDEX = 4
const EMPLOYEE_NAME_COLUMN_INDEX = 1
const ACTIONS_COLUMN_INDEX = employeesTableColumns.length - 1

const EMPLOYEES_SORT_BY_COLUMN: Partial<Record<number, EmployeesSortBy>> = {
  0: 'identification',
  1: 'firstName',
  2: 'corporateEmail',
  3: 'phone',
  4: 'statusName',
  5: 'rehireEligible',
  6: 'active',
  7: 'createdAt',
  8: 'updatedAt',
}

const EMPLOYEES_SORTABLE_COLUMNS = Object.keys(EMPLOYEES_SORT_BY_COLUMN).map((index) => Number(index))

export default function EmployeesDashboardPage() {
  const navigate = useNavigate()
  const employeesRows = useStoreEmployees((s) => s.employeesRows) as EmployeeTableRow[]
  const pagination = useStoreEmployees((s) => s.pagination)
  const queryParams = useStoreEmployees((s) => s.queryParams)
  const loadingEmployees = useStoreEmployees((s) => s.loadingEmployees)
  const loadingToggleStatus = useStoreEmployees((s) => s.loadingToggleStatus)
  const errorMessage = useStoreEmployees((s) => s.errorMessage)
  const getEmployees = useStoreEmployees((s) => s.getEmployees)
  const goToPage = useStoreEmployees((s) => s.goToPage)
  const setSearch = useStoreEmployees((s) => s.setSearch)
  const setActiveFilter = useStoreEmployees((s) => s.setActiveFilter)
  const clearActiveFilter = useStoreEmployees((s) => s.clearActiveFilter)
  const searchEmployees = useStoreEmployees((s) => s.searchEmployees)
  const sortEmployees = useStoreEmployees((s) => s.sortEmployees)
  const mutationToggleEmployeeStatus = useStoreEmployees((s) => s.mutationToggleEmployeeStatus)
  const clearStatus = useStoreEmployees((s) => s.clearStatus)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canToggleEmployeeStatus = hasPermission('EMPLOYEE', 'canUpdate')

  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingStatusOptions = useStoreSelects((s) => s.loadingStatusOptions)
  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState(() => ({ statusId: queryParams.active }))
  const [openActionsRowId, setOpenActionsRowId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedDetailName, setSelectedDetailName] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<EmployeeTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')
  const { actionViewDetail, actionUpdateEmployee, actionToggleStatus } = createEmployeesActions()

  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const statusSelectOptions = statusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const activeSortColumn = EMPLOYEES_SORTABLE_COLUMNS.find((index) => EMPLOYEES_SORT_BY_COLUMN[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  useEffect(() => {
    void getEmployees()
    void getStatusOptions()
  }, [getEmployees, getStatusOptions])

  useEffect(() => {
    const closeActions = () => setOpenActionsRowId(null)
    window.addEventListener('click', closeActions)
    return () => window.removeEventListener('click', closeActions)
  }, [])

  const handleViewDetail = (row: EmployeeTableRow) => {
    setSelectedDetailName(String(row.values[EMPLOYEE_NAME_COLUMN_INDEX] ?? 'Trabajador'))
    setDetailOpen(true)
    setOpenActionsRowId(null)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailName('')
  }

  const handleUpdateEmployee = (row: EmployeeTableRow) => {
    setActionsMessage(`${row.values[1]}: ${messages.employees.ui.updateEmployeeComingSoon}`)
    setOpenActionsRowId(null)
  }

  const handleToggleStatus = (row: EmployeeTableRow) => {
    setPendingToggleRow(row)
    setConfirmOpen(true)
    setOpenActionsRowId(null)
  }

  const resolveRowActions = (row: EmployeeTableRow): DropdownAction[] => {
    const actions: DropdownAction[] = [
      actionViewDetail(() => handleViewDetail(row)),
      actionUpdateEmployee(() => handleUpdateEmployee(row)),
    ]

    if (canToggleEmployeeStatus) {
      actions.push(actionToggleStatus(row.active === true, () => handleToggleStatus(row)))
    }

    return actions
  }

  const renderCell = (row: TableRow, value: React.ReactNode, columnIndex: number, rowIndex: number) => {
    const employeeRow = row as EmployeeTableRow
    if (columnIndex === EMPLOYEE_NAME_COLUMN_INDEX) {
      return (
        <button
          type="button"
          className="text-cyan-700 transition hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
          onClick={() => handleViewDetail(employeeRow)}
        >
          {value}
        </button>
      )
    }
    if (columnIndex === EMPLOYEE_APPROVAL_STATUS_COLUMN_INDEX) {
      const statusName = typeof value === 'string' ? value : String(value ?? '')
      return <EmployeeApprovalStatusBadgeComponent statusName={statusName} />
    }
    if (columnIndex === EMPLOYEE_ACTIVE_COLUMN_INDEX) {
      return <StatusBadgeComponent enabled={employeeRow.active === true} />
    }
    if (columnIndex === ACTIONS_COLUMN_INDEX) {
      const openDirection = employeesRows.length > 2 && rowIndex >= employeesRows.length - 2 ? 'up' : 'down'
      return (
        <ActionsDropdownComponent
          open={openActionsRowId === row.id}
          actions={resolveRowActions(employeeRow)}
          openDirection={openDirection}
          onToggle={() => setOpenActionsRowId((id) => (id === row.id ? null : row.id))}
        />
      )
    }
    return <span>{value}</span>
  }

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = EMPLOYEES_SORT_BY_COLUMN[columnIndex]
    if (!sortBy) return

    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === 'asc' ? 'desc' : 'asc'

    await sortEmployees(sortBy, nextSortDir)
  }

  const handleApplyFilters = async () => {
    const selectedStatus = statusOptions.find((option) => String(option.id) === filters.statusId)
    setActiveFilter(selectedStatus ? String(selectedStatus.id) : '')
    await searchEmployees()
    setFiltersOpen(false)
  }

  const handleClearFilters = async () => {
    setFilters({ statusId: '' })
    clearActiveFilter()
    await searchEmployees()
    setFiltersOpen(false)
  }

  const handleConfirmToggleStatus = async () => {
    if (!pendingToggleRow || loadingToggleStatus) return

    const nextStatus = pendingToggleRow.active !== true
    const employeeName = pendingToggleRow.values[EMPLOYEE_NAME_COLUMN_INDEX]
    const success = await mutationToggleEmployeeStatus(pendingToggleRow.id, nextStatus)
    if (success) {
      setConfirmOpen(false)
      setPendingToggleRow(null)
      await getEmployees()
      navigate(AUTH_ROUTE_EMPLOYEES)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActionsMessage(
        `${employeeName} ${nextStatus ? messages.employees.status.success.toggleEnabledSuccess : messages.employees.status.success.toggleDisabledSuccess}`,
      )
    }
  }

  const handleCloseConfirm = () => {
    if (loadingToggleStatus) return
    setConfirmOpen(false)
    setPendingToggleRow(null)
  }

  const handleDownloadReport = () => {
    setActionsMessage('Descarga de reporte disponible proximamente.')
  }

  const handleBulkUpload = () => {
    setActionsMessage('Carga masiva disponible proximamente.')
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.active === true ? 'deshabilitar' : 'habilitar'} al trabajador ${pendingToggleRow.values[EMPLOYEE_NAME_COLUMN_INDEX]}?`
    : ''

  return (
    <section className="min-w-0 space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">Dashboard de trabajadores</h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total trabajadores"
        activeLabel="Trabajadores activos"
        total={pagination.total}
        active={pagination.active}
      />

      {errorMessage && (
        <AlertMessageComponent
          message={errorMessage}
          tone="error"
          onClose={clearStatus}
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
          void searchEmployees()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingEmployees || loadingToggleStatus}
            label="Filtro"
            onClick={() => setFiltersOpen(true)}
          />
          <div className="min-w-0 flex-1">
            <InputComponent
              value={queryParams.search}
              type="text"
              placeholder="Buscar por nombre, apellido, rut o correo"
              onValueChange={setSearch}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loadingEmployees || loadingToggleStatus}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingEmployees ? 'Buscando...' : 'Buscar'}
          />
          <ButtonComponent
            type="button"
            variant="primary"
            disabled={loadingEmployees || loadingToggleStatus}
            className="flex-1 text-white md:flex-none dark:text-white"
            label="Nuevo trabajador"
            onClick={() => navigate(AUTH_ROUTE_EMPLOYEES_CREATE)}
          />
          <ToolbarActionsDropdownComponent
            disabled={loadingEmployees || loadingToggleStatus}
            onDownloadReport={handleDownloadReport}
            onBulkUpload={handleBulkUpload}
          />
        </div>
      </form>

      <TableComponent
        columns={employeesTableColumns}
        rows={employeesRows}
        loading={loadingEmployees}
        emptyMessage="No hay trabajadores registrados."
        renderCell={renderCell}
        sortableColumnIndexes={EMPLOYEES_SORTABLE_COLUMNS}
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
          loading={loadingEmployees || loadingToggleStatus}
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
            value={filters.statusId}
            label="Estado"
            options={statusSelectOptions}
            onValueChange={(value) => setFilters({ statusId: value })}
          />
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <ButtonComponent
              type="button"
              variant="outline"
              disabled={loadingEmployees || loadingToggleStatus || loadingStatusOptions}
              label="Limpiar"
              onClick={() => { void handleClearFilters() }}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loadingEmployees || loadingToggleStatus || loadingStatusOptions}
              className="text-white dark:text-white"
              label={loadingEmployees || loadingStatusOptions ? 'Aplicando...' : 'Aplicar'}
              onClick={() => { void handleApplyFilters() }}
            />
          </div>
        </div>
      </RightSidebarComponent>

      <DetailSidebarComponent
        open={detailOpen}
        title={selectedDetailName ? `Detalle de ${selectedDetailName}` : 'Detalle de trabajador'}
        onClose={handleCloseDetail}
      />

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
