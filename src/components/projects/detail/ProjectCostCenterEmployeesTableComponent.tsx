import { PaginationComponent, TableComponent } from '@/components'
import type { TableSortState } from '@/components'
import { SortDirection } from '@/constant'
import {
  projectCostCenterEmployeesTableColumns,
  projectCostCenterEmployeesTableColumnIndex,
  projectCostCenterEmployeesTableSortByColumn,
} from '@/factories'
import { useStoreProjects } from '@/store'
import {
  createTableCustomRenderer,
  renderStatusBadge,
} from '@/utils'

const STATE_COLUMN_INDEX = projectCostCenterEmployeesTableColumnIndex.status
const ACTIVE_COLUMN_INDEX = projectCostCenterEmployeesTableColumnIndex.active
const CONTRACT_COLUMN_INDEX = projectCostCenterEmployeesTableColumnIndex.contract
const SORTABLE_COLUMNS = Object.keys(projectCostCenterEmployeesTableSortByColumn).map((index) => Number(index))

interface ProjectCostCenterEmployeesTableComponentProps {
  costCenter: number | null
}

export function ProjectCostCenterEmployeesTableComponent({ costCenter }: ProjectCostCenterEmployeesTableComponentProps) {
  const rows = useStoreProjects((s) => s.costCenterEmployeesRows)
  const pagination = useStoreProjects((s) => s.costCenterEmployeesPagination)
  const queryParams = useStoreProjects((s) => s.costCenterEmployeesQueryParams)
  const loading = useStoreProjects((s) => s.loadingCostCenterEmployees)
  const sortCostCenterEmployees = useStoreProjects((s) => s.sortCostCenterEmployees)
  const goToCostCenterEmployeesPage = useStoreProjects((s) => s.goToCostCenterEmployeesPage)
  const validCostCenter = Number.isInteger(costCenter) && costCenter !== null && costCenter > 0

  const renderCustomCell = createTableCustomRenderer({
    [ACTIVE_COLUMN_INDEX]: ({ row }) => renderStatusBadge(Boolean(rows.find((item) => item.id === row.id)?.active)),
    [CONTRACT_COLUMN_INDEX]: ({ row }) => renderStatusBadge(Boolean(rows.find((item) => item.id === row.id)?.hasContract), { activeLabel: 'Sí', inactiveLabel: 'No' }),
    [STATE_COLUMN_INDEX]: ({ value }) => {
      const text = String(value ?? '')
      if (!text || text === '-') return null
      return (
        <span className="inline-flex items-center r-md border border-slate-300 px-2 py-0.5 text-[11px] text-slate-700 dark:border-white/15 dark:text-slate-200">
          {text}
        </span>
      )
    },
  })

  const handleSortChange = async (columnIndex: number) => {
    if (!validCostCenter) return
    const sortBy = projectCostCenterEmployeesTableSortByColumn[columnIndex]
    if (!sortBy) return
    const nextSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.Asc
      ? SortDirection.Desc
      : SortDirection.Asc
    await sortCostCenterEmployees(costCenter, sortBy, nextSortDir)
  }

  const activeSortColumn = SORTABLE_COLUMNS.find((index) => projectCostCenterEmployeesTableSortByColumn[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = { columnIndex: activeSortColumn, direction: queryParams.sortDir }

  return (
    <>
      <TableComponent
        columns={projectCostCenterEmployeesTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage="No hay trabajadores asociados a este centro de costo."
        preserveHeaderCase
        customRenderer={renderCustomCell}
        sortableColumnIndexes={SORTABLE_COLUMNS}
        sortState={sortState}
        onSortChange={(columnIndex) => { void handleSortChange(columnIndex) }}
      />

      <div className="flex justify-end">
        <PaginationComponent
          currentPage={pagination.page + 1}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalElements}
          pageSize={pagination.size}
          loading={loading}
          onPageChange={(page) => {
            if (validCostCenter) void goToCostCenterEmployeesPage(costCenter, page - 1)
          }}
        />
      </div>
    </>
  )
}
