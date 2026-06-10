import { PaginationComponent, TableComponent } from '@/components'
import {
  projectCostCenterEmployeesTableColumns,
  projectCostCenterEmployeesTableColumnIndex,
  projectCostCenterEmployeesTableSortByColumn,
} from '@/factories'
import messages from '@/messages/messages'
import { useStoreProjects } from '@/store'
import {
  createTableSortState,
  createTableCustomRenderer,
  renderContractStatus,
  renderEmployeeApprovalStatus,
  resolveNextTableSortDir,
} from '@/utils'

const CONTRACT_STATUS_COLUMN_INDEX = projectCostCenterEmployeesTableColumnIndex.contractStatus
const APPROVAL_STATUS_COLUMN_INDEX = projectCostCenterEmployeesTableColumnIndex.approvalStatus
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

  const validCostCenter = Number.isInteger(costCenter) && costCenter !== null && costCenter > 0

  const renderCustomCell = createTableCustomRenderer({
    [CONTRACT_STATUS_COLUMN_INDEX]: ({ value }) => renderContractStatus(value),
    [APPROVAL_STATUS_COLUMN_INDEX]: ({ value }) => renderEmployeeApprovalStatus(value),
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
