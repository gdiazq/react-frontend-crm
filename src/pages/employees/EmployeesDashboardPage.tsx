import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AUTH_ROUTE_EMPLOYEES_CREATE } from '@/constant'
import {
  AlertMessageComponent,
  ButtonComponent,
  EmployeeApprovalStatusBadgeComponent,
  InputComponent,
  PaginationComponent,
  RightSidebarComponent,
  SelectComponent,
  StatsOverviewCardsComponent,
  StatusBadgeComponent,
  TableComponent,
} from '@/components'
import type { TableRow, TableSortState } from '@/components'
import { employeesTableColumns } from '@/factories'
import { useStoreEmployees, useStoreSelects } from '@/store'
import type { EmployeeTableRow, EmployeesSortBy } from '@/types'

const EMPLOYEE_ACTIVE_COLUMN_INDEX = 6
const EMPLOYEE_APPROVAL_STATUS_COLUMN_INDEX = 4

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
  const errorMessage = useStoreEmployees((s) => s.errorMessage)
  const getEmployees = useStoreEmployees((s) => s.getEmployees)
  const goToPage = useStoreEmployees((s) => s.goToPage)
  const setSearch = useStoreEmployees((s) => s.setSearch)
  const setActiveFilter = useStoreEmployees((s) => s.setActiveFilter)
  const clearActiveFilter = useStoreEmployees((s) => s.clearActiveFilter)
  const searchEmployees = useStoreEmployees((s) => s.searchEmployees)
  const sortEmployees = useStoreEmployees((s) => s.sortEmployees)
  const clearStatus = useStoreEmployees((s) => s.clearStatus)

  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingStatusOptions = useStoreSelects((s) => s.loadingStatusOptions)
  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState(() => ({ statusId: queryParams.active }))

  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const statusSelectOptions = useMemo(
    () => statusOptions.map((option) => ({ label: option.name, value: String(option.id) })),
    [statusOptions],
  )
  const activeSortColumn = EMPLOYEES_SORTABLE_COLUMNS.find((index) => EMPLOYEES_SORT_BY_COLUMN[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  useEffect(() => {
    void getEmployees()
    void getStatusOptions()
  }, [getEmployees, getStatusOptions])

  const renderCell = (row: TableRow, value: React.ReactNode, columnIndex: number) => {
    const employeeRow = row as EmployeeTableRow
    if (columnIndex === EMPLOYEE_APPROVAL_STATUS_COLUMN_INDEX) {
      const statusName = typeof value === 'string' ? value : String(value ?? '')
      return <EmployeeApprovalStatusBadgeComponent statusName={statusName} />
    }
    if (columnIndex === EMPLOYEE_ACTIVE_COLUMN_INDEX) {
      return <StatusBadgeComponent enabled={employeeRow.active === true} />
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
            disabled={loadingEmployees}
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
            disabled={loadingEmployees}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loadingEmployees ? 'Buscando...' : 'Buscar'}
          />
          <ButtonComponent
            type="button"
            variant="primary"
            disabled={loadingEmployees}
            className="flex-1 text-white md:flex-none dark:text-white"
            label="Nuevo trabajador"
            onClick={() => navigate(AUTH_ROUTE_EMPLOYEES_CREATE)}
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

      <div className="flex justify-end">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          loading={loadingEmployees}
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
              disabled={loadingEmployees || loadingStatusOptions}
              label="Limpiar"
              onClick={() => { void handleClearFilters() }}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loadingEmployees || loadingStatusOptions}
              className="text-white dark:text-white"
              label={loadingEmployees || loadingStatusOptions ? 'Aplicando...' : 'Aplicar'}
              onClick={() => { void handleApplyFilters() }}
            />
          </div>
        </div>
      </RightSidebarComponent>
    </section>
  )
}
