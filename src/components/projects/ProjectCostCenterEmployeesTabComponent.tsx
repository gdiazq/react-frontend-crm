import { useEffect, useState } from 'react'
import { AlertMessageComponent } from '@/components/ui/alert/AlertMessageComponent'
import { ButtonComponent } from '@/components/ui/button/ButtonComponent'
import { InputComponent } from '@/components/ui/input/InputComponent'
import { PaginationComponent } from '@/components/ui/pagination/PaginationComponent'
import { SelectComponent } from '@/components/ui/select/SelectComponent'
import { StatsOverviewCardsComponent } from '@/components/ui/stats/StatsOverviewCardsComponent'
import { StatusBadgeComponent } from '@/components/ui/status/StatusBadgeComponent'
import { TableComponent } from '@/components/ui/table/TableComponent'
import type { TableCellCustomRenderer } from '@/components/ui/table/TableCellRendererComponent'
import { RightSidebarComponent } from '@/components/layout/RightSidebarComponent'
import { mapperProjectCostCenterEmployeesPagination, mapperProjectCostCenterEmployeesRows } from '@/mappers'
import messages from '@/messages/messages'
import { projectsService } from '@/services'
import { useStoreSelects } from '@/store'
import type {
  Pagination,
  ProjectCostCenterEmployeesQueryParams,
  ProjectCostCenterEmployeesSortBy,
  TableRow,
  TableSortState,
} from '@/types'

interface ProjectCostCenterEmployeesTabComponentProps {
  active: boolean
  costCenter: number | null
  projectName: string
}

interface CostCenterEmployeesPagination extends Pagination {
  pending: number
}

const columns = [
  'Identificación',
  'Trabajador',
  'Email',
  'Teléfono',
  'Estado',
  'Activo',
  'Contrato',
  'Creado',
]

const STATE_COLUMN_INDEX = 4
const ACTIVE_COLUMN_INDEX = 5
const CONTRACT_COLUMN_INDEX = 6

const activeOptions = [
  { label: 'Activo', value: 'true' },
  { label: 'Inactivo', value: 'false' },
]

const sortableColumns: Partial<Record<number, ProjectCostCenterEmployeesSortBy>> = {
  0: 'identification',
  1: 'firstName',
  4: 'statusName',
  7: 'createdAt',
}

const sortableColumnIndexes = Object.keys(sortableColumns).map((index) => Number(index))

const initialQueryParams: ProjectCostCenterEmployeesQueryParams = {
  page: 0,
  size: 10,
  search: '',
  active: '',
  statusId: '',
  sortBy: 'createdAt',
  sortDir: 'desc',
}

const initialPagination: CostCenterEmployeesPagination = {
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  pending: 0,
  first: true,
  last: true,
}

export function ProjectCostCenterEmployeesTabComponent({
  active,
  costCenter,
  projectName,
}: ProjectCostCenterEmployeesTabComponentProps) {
  const employeeStatusOptions = useStoreSelects((s) => s.employeeStatusOptions)
  const getEmployeeStatusOptions = useStoreSelects((s) => s.getEmployeeStatusOptions)

  const [queryParams, setQueryParams] = useState<ProjectCostCenterEmployeesQueryParams>(initialQueryParams)
  const [searchValue, setSearchValue] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({ active: '', statusId: '' })
  const [rows, setRows] = useState<TableRow[]>([])
  const [pagination, setPagination] = useState<CostCenterEmployeesPagination>(initialPagination)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    setQueryParams(initialQueryParams)
    setSearchValue('')
    setFilters({ active: '', statusId: '' })
    setRows([])
    setPagination(initialPagination)
    setErrorMessage(null)
  }, [costCenter])

  useEffect(() => {
    void getEmployeeStatusOptions()
  }, [getEmployeeStatusOptions])

  useEffect(() => {
    let cancelled = false

    const loadEmployees = async () => {
      if (!active) return
      if (!Number.isInteger(costCenter) || !costCenter || costCenter <= 0) {
        setRows([])
        setPagination(initialPagination)
        return
      }

      try {
        setLoading(true)
        setErrorMessage(null)
        const data = await projectsService.getCostCenterEmployees(costCenter, queryParams)
        if (cancelled) return
        setRows(mapperProjectCostCenterEmployeesRows(data.content))
        setPagination({
          ...mapperProjectCostCenterEmployeesPagination(data),
          pending: data.pending ?? 0,
        })
      } catch (error) {
        if (cancelled) return
        const backendMessage = projectsService.isAxiosError(error) ? error.response?.data?.message : null
        setRows([])
        setPagination(initialPagination)
        setErrorMessage(
          typeof backendMessage === 'string' && backendMessage.length > 0
            ? backendMessage
            : messages.projects.status.errors.loadCostCenterEmployeesError,
        )
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadEmployees()

    return () => {
      cancelled = true
    }
  }, [active, costCenter, queryParams])

  const activeSortColumn = sortableColumnIndexes.find((index) => sortableColumns[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }
  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const statusSelectOptions = employeeStatusOptions.map((option) => ({ label: option.name, value: String(option.id) }))

  const handleSearch = () => {
    setQueryParams((prev) => ({ ...prev, page: 0, search: searchValue.trim() }))
  }

  const handleApplyFilters = () => {
    setQueryParams((prev) => ({
      ...prev,
      page: 0,
      active: filters.active,
      statusId: filters.statusId.trim(),
    }))
    setFiltersOpen(false)
  }

  const handleClearFilters = () => {
    setFilters({ active: '', statusId: '' })
    setQueryParams((prev) => ({ ...prev, page: 0, active: '', statusId: '' }))
    setFiltersOpen(false)
  }

  const handleSortChange = (columnIndex: number) => {
    const sortBy = sortableColumns[columnIndex]
    if (!sortBy) return
    setQueryParams((prev) => ({
      ...prev,
      page: 0,
      sortBy,
      sortDir: prev.sortBy === sortBy && prev.sortDir === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page: page - 1 }))
  }

  const renderCustomCell: TableCellCustomRenderer = ({ value, columnIndex }) => {
    if (columnIndex === ACTIVE_COLUMN_INDEX) {
      const enabled = String(value) === messages.projects.ui.statusActive
      return <StatusBadgeComponent enabled={enabled} />
    }

    if (columnIndex === CONTRACT_COLUMN_INDEX) {
      const enabled = String(value) === 'Sí'
      return (
        <StatusBadgeComponent
          enabled={enabled}
          activeLabel="Sí"
          inactiveLabel="No"
        />
      )
    }

    if (columnIndex === STATE_COLUMN_INDEX) {
      const text = String(value ?? '')
      if (!text || text === '-') return null
      return (
        <span className="inline-flex items-center r-md border border-slate-300 px-2 py-0.5 text-[11px] text-slate-700 dark:border-white/15 dark:text-slate-200">
          {text}
        </span>
      )
    }

    return null
  }

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">CENTRO COSTO · {costCenter ?? '—'}</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Trabajadores
          <span className="display-it text-slate-500 dark:text-slate-400"> asociados</span>
        </h1>
        <p className="mt-2 max-w-3xl text-[13px] leading-6 text-slate-500 dark:text-slate-400">
          {projectName || 'Proyecto seleccionado'}
        </p>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total trabajadores"
        activeLabel="Trabajadores activos"
        total={pagination.total}
        active={pagination.active}
      />

      {errorMessage && (
        <AlertMessageComponent message={errorMessage} tone="error" onClose={() => setErrorMessage(null)} />
      )}

      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        onSubmit={(event) => {
          event.preventDefault()
          handleSearch()
        }}
      >
        <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loading}
            label="Filtro"
            onClick={() => setFiltersOpen(true)}
          />
          <div className="min-w-0 flex-1">
            <InputComponent
              value={searchValue}
              type="text"
              placeholder="Buscar por trabajador, identificación o email"
              onValueChange={setSearchValue}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
          <ButtonComponent
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            label={loading ? 'Buscando...' : 'Buscar'}
          />
        </div>
      </form>

      <TableComponent
        columns={columns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay trabajadores asociados a este centro de costo."
        preserveHeaderCase
        customRenderer={renderCustomCell}
        sortableColumnIndexes={sortableColumnIndexes}
        sortState={sortState}
        onSortChange={handleSortChange}
      />

      <div className="flex justify-end">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          loading={loading}
          onPageChange={handlePageChange}
        />
      </div>

      <RightSidebarComponent
        open={filtersOpen}
        title="Filtros"
        onClose={() => setFiltersOpen(false)}
      >
        <div className="space-y-4">
          <SelectComponent
            value={filters.active}
            label="Activo"
            options={activeOptions}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, active: value }))}
          />
          <SelectComponent
            value={filters.statusId}
            label="Estado"
            options={statusSelectOptions}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, statusId: value }))}
          />
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <ButtonComponent
              type="button"
              variant="outline"
              disabled={loading}
              label="Limpiar"
              onClick={handleClearFilters}
            />
            <ButtonComponent
              type="button"
              variant="primary"
              disabled={loading}
              className="text-white dark:text-white"
              label={loading ? 'Aplicando...' : 'Aplicar'}
              onClick={handleApplyFilters}
            />
          </div>
        </div>
      </RightSidebarComponent>
    </section>
  )
}
