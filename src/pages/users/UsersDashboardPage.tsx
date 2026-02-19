import { useEffect, useState } from 'react'
import {
  ActionsDropdownComponent,
  ButtonComponent,
  PaginationComponent,
  SearchBarComponent,
  StatusBadgeComponent,
  TableComponent,
} from '@/components'
import type { TableRow } from '@/components'
import { usersTableColumns } from '@/factories'
import messages from '@/messages/messages'
import { useStoreUsers } from '@/store'
import { useUsersAction } from '@/utils'
import type { UserTableRow } from '@/types'
import type { DropdownAction } from '@/utils'

const STATUS_COLUMN_INDEX = 6
const ACTIONS_COLUMN_INDEX = usersTableColumns.length - 1

export default function UsersDashboardPage() {
  const usersRows = useStoreUsers((s) => s.usersRows) as UserTableRow[]
  const pagination = useStoreUsers((s) => s.pagination)
  const queryParams = useStoreUsers((s) => s.queryParams)
  const loadingUsers = useStoreUsers((s) => s.loadingUsers)
  const errorMessage = useStoreUsers((s) => s.errorMessage)
  const getUsers = useStoreUsers((s) => s.getUsers)
  const setSearch = useStoreUsers((s) => s.setSearch)
  const searchUsers = useStoreUsers((s) => s.searchUsers)
  const mutationToggleUserStatus = useStoreUsers((s) => s.mutationToggleUserStatus)
  const goToPage = useStoreUsers((s) => s.goToPage)

  const { actionViewDetail, actionUpdateUser, actionToggleStatus } = useUsersAction()

  const [openActionsRowId, setOpenActionsRowId] = useState<string | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')

  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size

  useEffect(() => {
    const closeActions = () => setOpenActionsRowId(null)
    window.addEventListener('click', closeActions)
    getUsers()
    return () => window.removeEventListener('click', closeActions)
  }, [])

  const handleViewDetail = (row: UserTableRow) => {
    setActionsMessage(`${row.values[0]} ${messages.users.viewDetailComingSoon}`)
    setOpenActionsRowId(null)
  }

  const handleUpdateUser = (row: UserTableRow) => {
    setActionsMessage(`${row.values[0]} ${messages.users.updateUserComingSoon}`)
    setOpenActionsRowId(null)
  }

  const handleToggleStatus = (row: UserTableRow) => {
    const nextStatus = row.status !== true
    mutationToggleUserStatus(row.id)
    setActionsMessage(`${row.values[0]} ${nextStatus ? messages.users.toggleEnabledSuccess : messages.users.toggleDisabledSuccess}`)
    setOpenActionsRowId(null)
  }

  const resolveRowActions = (row: UserTableRow): DropdownAction[] => [
    actionViewDetail(() => handleViewDetail(row)),
    actionUpdateUser(() => handleUpdateUser(row)),
    actionToggleStatus(row.status === true, () => handleToggleStatus(row)),
  ]

  const renderCell = (row: TableRow, value: React.ReactNode, columnIndex: number) => {
    const userRow = row as UserTableRow
    if (columnIndex === STATUS_COLUMN_INDEX) {
      return <StatusBadgeComponent enabled={userRow.status === true} />
    }
    if (columnIndex === ACTIONS_COLUMN_INDEX) {
      return (
        <ActionsDropdownComponent
          open={openActionsRowId === row.id}
          actions={resolveRowActions(userRow)}
          onToggle={() => setOpenActionsRowId((id) => (id === row.id ? null : row.id))}
        />
      )
    }
    return <span>{value as string ?? '-'}</span>
  }

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">Dashboard de usuarios</h1>
      </header>

      {errorMessage && (
        <p className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-400/40 dark:bg-rose-900/20 dark:text-rose-200">
          {errorMessage}
        </p>
      )}
      {actionsMessage && (
        <p className="rounded-lg border border-cyan-300 bg-cyan-50 px-3 py-2 text-sm text-cyan-700 dark:border-cyan-400/40 dark:bg-cyan-900/20 dark:text-cyan-200">
          {actionsMessage}
        </p>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex items-center">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingUsers}
            label="Filtro"
            onClick={() => setActionsMessage(messages.users.filtersComingSoon)}
          />
        </div>
        <div className="flex-1">
          <SearchBarComponent
            value={queryParams.search}
            loading={loadingUsers}
            placeholder="Buscar por nombre, apellido o correo"
            onValueChange={setSearch}
            onSearch={searchUsers}
          />
        </div>
        <div className="flex items-center md:ml-auto">
          <ButtonComponent
            type="button"
            variant="primary"
            disabled={loadingUsers}
            label="Nuevo usuario"
            onClick={() => setActionsMessage(messages.users.createComingSoon)}
          />
        </div>
      </div>

      <TableComponent
        columns={usersTableColumns}
        rows={usersRows}
        loading={loadingUsers}
        emptyMessage="No hay usuarios registrados."
        renderCell={renderCell}
      />

      <div className="flex justify-end">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          loading={loadingUsers}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>
    </section>
  )
}
