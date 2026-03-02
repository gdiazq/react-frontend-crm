import { type ReactNode, useEffect } from 'react'
import {
  AlertMessageComponent,
  EmployeeApprovalStatusBadgeComponent,
  PaginationComponent,
  StatsOverviewCardsComponent,
  TableComponent,
} from '@/components'
import { requestsTableColumns } from '@/factories'
import { useStoreRequests } from '@/store'
import type { RequestTableRow, TableRow } from '@/types'

const REQUEST_STATUS_COLUMN_INDEX = 3

export default function RequestsDashboardPage() {
  const requestsRows = useStoreRequests((s) => s.requestsRows) as RequestTableRow[]
  const pagination = useStoreRequests((s) => s.pagination)
  const loadingRequests = useStoreRequests((s) => s.loadingRequests)
  const errorMessage = useStoreRequests((s) => s.errorMessage)
  const getRequests = useStoreRequests((s) => s.getRequests)
  const goToPage = useStoreRequests((s) => s.goToPage)
  const clearStatus = useStoreRequests((s) => s.clearStatus)

  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size

  useEffect(() => {
    void getRequests()
  }, [getRequests])

  const renderCell = (row: TableRow, value: ReactNode, columnIndex: number) => {
    const requestRow = row as RequestTableRow
    if (columnIndex === REQUEST_STATUS_COLUMN_INDEX) {
      return <EmployeeApprovalStatusBadgeComponent statusName={requestRow.statusName} />
    }

    return <span>{value}</span>
  }

  return (
    <section className="min-w-0 space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">Dashboard de solicitudes RRHH</h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total solicitudes"
        activeLabel="Solicitudes en pagina"
        total={pagination.totalElements}
        active={pagination.numberOfElements}
      />

      {errorMessage && (
        <AlertMessageComponent
          message={errorMessage}
          tone="error"
          onClose={clearStatus}
        />
      )}

      <TableComponent
        columns={requestsTableColumns}
        rows={requestsRows}
        loading={loadingRequests}
        emptyMessage="No hay solicitudes registradas."
        renderCell={renderCell}
      />

      <div className="flex justify-end">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          loading={loadingRequests}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>
    </section>
  )
}
