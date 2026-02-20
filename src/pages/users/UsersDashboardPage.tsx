import { useEffect, useState } from 'react'
import {
  ActionsDropdownComponent,
  AlertMessageComponent,
  ButtonComponent,
  DetailSidebarComponent,
  PaginationComponent,
  RightSidebarComponent,
  SearchBarComponent,
  StatusBadgeComponent,
  TableComponent,
  UserDetailComponent,
} from '@/components'
import type { TableRow } from '@/components'
import { usersTableColumns } from '@/factories'
import messages from '@/messages/messages'
import { useStoreUsers } from '@/store'
import { createUsersActions } from '@/utils'
import type { UserTableRow } from '@/types'
import type { DropdownAction } from '@/utils'

const STATUS_COLUMN_INDEX = 6
const EMAIL_COLUMN_INDEX = 2
const ACTIONS_COLUMN_INDEX = usersTableColumns.length - 1

export default function UsersDashboardPage() {
  const usersRows = useStoreUsers((s) => s.usersRows) as UserTableRow[]
  const pagination = useStoreUsers((s) => s.pagination)
  const queryParams = useStoreUsers((s) => s.queryParams)
  const loadingUsers = useStoreUsers((s) => s.loadingUsers)
  const loadingToggleStatus = useStoreUsers((s) => s.loadingToggleStatus)
  const errorMessage = useStoreUsers((s) => s.errorMessage)
  const getUsers = useStoreUsers((s) => s.getUsers)
  const setSearch = useStoreUsers((s) => s.setSearch)
  const searchUsers = useStoreUsers((s) => s.searchUsers)
  const mutationToggleUserStatus = useStoreUsers((s) => s.mutationToggleUserStatus)
  const goToPage = useStoreUsers((s) => s.goToPage)

  const { actionViewDetail, actionUpdateUser, actionToggleStatus } = createUsersActions()

  const [openActionsRowId, setOpenActionsRowId] = useState<string | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)

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

  const handleViewDetail = () => {
    setDetailOpen(true)
    setOpenActionsRowId(null)
  }

  const handleUpdateUser = (row: UserTableRow) => {
    setActionsMessage(`${row.values[0]} ${messages.users.ui.updateUserComingSoon}`)
    setOpenActionsRowId(null)
  }

  const handleToggleStatus = async (row: UserTableRow) => {
    if (loadingToggleStatus) return
    const nextStatus = row.status !== true
    const success = await mutationToggleUserStatus(row.id, nextStatus)
    if (success) {
      setActionsMessage(`${row.values[0]} ${nextStatus ? messages.users.status.success.toggleEnabledSuccess : messages.users.status.success.toggleDisabledSuccess}`)
    }
    setOpenActionsRowId(null)
  }

  const resolveRowActions = (row: UserTableRow): DropdownAction[] => [
    actionViewDetail(() => handleViewDetail()),
    actionUpdateUser(() => handleUpdateUser(row)),
    actionToggleStatus(row.status === true, () => { void handleToggleStatus(row) }),
  ]

  const renderCell = (row: TableRow, value: React.ReactNode, columnIndex: number, rowIndex: number) => {
    const userRow = row as UserTableRow
    if (columnIndex === EMAIL_COLUMN_INDEX) {
      return (
        <button
          type="button"
          className="text-cyan-700 transition hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
          onClick={() => handleViewDetail()}
        >
          {value}
        </button>
      )
    }
    if (columnIndex === STATUS_COLUMN_INDEX) {
      return <StatusBadgeComponent enabled={userRow.status === true} />
    }
    if (columnIndex === ACTIONS_COLUMN_INDEX) {
      const openDirection = rowIndex >= Math.max(usersRows.length - 2, 0) ? 'up' : 'down'
      return (
        <ActionsDropdownComponent
          open={openActionsRowId === row.id}
          actions={resolveRowActions(userRow)}
          openDirection={openDirection}
          onToggle={() => setOpenActionsRowId((id) => (id === row.id ? null : row.id))}
        />
      )
    }
    return <span>{value}</span>
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
  }

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h1 className="text-2xl font-bold">Dashboard de usuarios</h1>
      </header>

      {errorMessage && (
        <AlertMessageComponent
          message={errorMessage}
          tone="error"
          onClose={() => useStoreUsers.setState({ errorMessage: null })}
        />
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex items-center">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingUsers || loadingToggleStatus}
            label="Filtro"
            onClick={() => setFiltersOpen(true)}
          />
        </div>
        <div className="flex-1">
          <SearchBarComponent
            value={queryParams.search}
            loading={loadingUsers || loadingToggleStatus}
            placeholder="Buscar por nombre, apellido o correo"
            buttonClassName="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
            onValueChange={setSearch}
            onSearch={searchUsers}
          />
        </div>
        <div className="flex items-center md:ml-auto">
          <ButtonComponent
            type="button"
            variant="primary"
            disabled={loadingUsers || loadingToggleStatus}
            className="text-white dark:text-white"
            label="Nuevo usuario"
            onClick={() => setActionsMessage(messages.users.ui.createComingSoon)}
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
          loading={loadingUsers}
          onPageChange={(page) => goToPage(page - 1)}
        />
      </div>
      <RightSidebarComponent
        open={filtersOpen}
        title="Filtros"
        onClose={() => setFiltersOpen(false)}
      />
      <DetailSidebarComponent
        open={detailOpen}
        title="Detalle de usuario"
        onClose={handleCloseDetail}
      >
        <UserDetailComponent />
      </DetailSidebarComponent>
    </section>
  )
}
