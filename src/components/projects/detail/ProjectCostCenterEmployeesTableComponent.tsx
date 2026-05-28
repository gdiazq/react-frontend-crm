import { useMemo } from 'react'
import { PaginationComponent, TableComponent } from '@/components'
import {
  projectCostCenterEmployeesTableColumns,
  projectCostCenterEmployeesTableColumnIndex,
  projectCostCenterEmployeesTableSortByColumn,
} from '@/factories'
import messages from '@/messages/messages'
import { useStoreProjects } from '@/store'
import {
  createRowsById,
  createTableSortState,
  createTableCustomRenderer,
  findRowById,
  isTableRowActive,
  renderStatusBadge,
  resolveNextTableSortDir,
} from '@/utils'

const STATE_COLUMN_INDEX = projectCostCenterEmployeesTableColumnIndex.status
const ACTIVE_COLUMN_INDEX = projectCostCenterEmployeesTableColumnIndex.active
const CONTRACT_COLUMN_INDEX = projectCostCenterEmployeesTableColumnIndex.contract
const SORTABLE_COLUMNS = Object.keys(projectCostCenterEmployeesTableSortByColumn).map((index) => Number(index))

interface ProjectCostCenterEmployeesTableComponentProps {
  costCenter: number | null
}

export function ProjectCostCenterEmployeesTableComponent({ costCenter }: ProjectCostCenterEmployeesTableComponentProps) {
  // Store state used to render the cost-center employees table.
  const rows = useStoreProjects((s) => s.costCenterEmployeesRows)
  const pagination = useStoreProjects((s) => s.costCenterEmployeesPagination)
  const queryParams = useStoreProjects((s) => s.costCenterEmployeesQueryParams)
  const loading = useStoreProjects((s) => s.loadingCostCenterEmployees)

  // Store actions triggered by table interactions.
  const sortCostCenterEmployees = useStoreProjects((s) => s.sortCostCenterEmployees)
  const goToCostCenterEmployeesPage = useStoreProjects((s) => s.goToCostCenterEmployeesPage)

  // Derived lookup for callbacks that receive the generic TableRow shape.
  const rowsById = useMemo(() => createRowsById(rows), [rows])
  const resolveEmployeeRow = (rowId: string) => findRowById(rowsById, rowId)
  const resolveRowActive = (rowId: string) => isTableRowActive(resolveEmployeeRow(rowId))
  const resolveRowHasContract = (rowId: string) => resolveEmployeeRow(rowId)?.hasContract === true
  const validCostCenter = Number.isInteger(costCenter) && costCenter !== null && costCenter > 0

  const renderCustomCell = createTableCustomRenderer({
    [ACTIVE_COLUMN_INDEX]: ({ row }) => renderStatusBadge(resolveRowActive(row.id)),
    [CONTRACT_COLUMN_INDEX]: ({ row }) => renderStatusBadge(resolveRowHasContract(row.id), { activeLabel: 'Sí', inactiveLabel: 'No' }),
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
    const nextSortDir = resolveNextTableSortDir(queryParams.sortBy, queryParams.sortDir, sortBy)
    await sortCostCenterEmployees(costCenter, sortBy, nextSortDir)
  }

  const sortState = createTableSortState(SORTABLE_COLUMNS, projectCostCenterEmployeesTableSortByColumn, queryParams.sortBy, queryParams.sortDir)

  return (
    <>
      <TableComponent
        columns={projectCostCenterEmployeesTableColumns}
        rows={rows}
        loading={loading}
        emptyMessage={messages.projects.ui.emptyCostCenterEmployeesList}
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
