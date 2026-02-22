import { useEffect } from 'react'
import {
  AlertMessageComponent,
  PaginationComponent,
  SearchBarComponent,
  TableComponent,
} from '@/components'
import type { TableSortState } from '@/components'
import { rolesTableColumns } from '@/factories'
import { useStoreRoles } from '@/store'
import type { RolesSortBy } from '@/types'

const ROLES_SORT_BY_COLUMN: Partial<Record<number, RolesSortBy>> = {
  0: 'name',
  1: 'enabled',
  2: 'createdAt',
  3: 'updatedAt',
}

const ROLES_SORTABLE_COLUMNS = Object.keys(ROLES_SORT_BY_COLUMN).map((index) => Number(index))

export default function RolesDashboardPage() {
  const rolesRows = useStoreRoles((s) => s.rolesRows)
  const pagination = useStoreRoles((s) => s.pagination)
  const queryParams = useStoreRoles((s) => s.queryParams)
  const loadingRoles = useStoreRoles((s) => s.loadingRoles)
  const errorMessage = useStoreRoles((s) => s.errorMessage)
  const getRoles = useStoreRoles((s) => s.getRoles)
  const goToPage = useStoreRoles((s) => s.goToPage)
  const setSearch = useStoreRoles((s) => s.setSearch)
  const searchRoles = useStoreRoles((s) => s.searchRoles)
  const sortRoles = useStoreRoles((s) => s.sortRoles)
  const clearStatus = useStoreRoles((s) => s.clearStatus)

  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const activeSortColumn = ROLES_SORTABLE_COLUMNS.find((index) => ROLES_SORT_BY_COLUMN[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  useEffect(() => {
    void getRoles()
  }, [getRoles])

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = ROLES_SORT_BY_COLUMN[columnIndex]
    if (!sortBy) return

    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === 'asc' ? 'desc' : 'asc'

    await sortRoles(sortBy, nextSortDir)
  }

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">Dashboard de roles</h1>
      </header>

      {errorMessage && (
        <AlertMessageComponent
          message={errorMessage}
          tone="error"
          onClose={clearStatus}
        />
      )}

      <SearchBarComponent
        value={queryParams.search}
        loading={loadingRoles}
        placeholder="Buscar por nombre o descripcion de rol"
        buttonClassName="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
        onValueChange={setSearch}
        onSearch={() => { void searchRoles() }}
      />

      <TableComponent
        columns={rolesTableColumns}
        rows={rolesRows}
        loading={loadingRoles}
        emptyMessage="No hay roles registrados."
        sortableColumnIndexes={ROLES_SORTABLE_COLUMNS}
        sortState={sortState}
        onSortChange={(columnIndex) => { void handleSortChange(columnIndex) }}
      />

      <div className="flex justify-end">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          loading={loadingRoles}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>
    </section>
  )
}
