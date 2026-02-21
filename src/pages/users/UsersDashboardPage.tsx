import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ActionsDropdownComponent,
  AlertMessageComponent,
  ButtonComponent,
  DetailSidebarComponent,
  PaginationComponent,
  RightSidebarComponent,
  SaveConfirmComponent,
  SearchBarComponent,
  StatusBadgeComponent,
  TableComponent,
  UserDetailComponent,
} from '@/components'
import { AUTH_ROUTE_USERS_CREATE } from '@/constant'
import type { TableRow, TableSortState } from '@/components'
import { usersTableColumns } from '@/factories'
import { mapperUserDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreUsers } from '@/store'
import { createUsersActions } from '@/utils'
import type { UserTableRow, UsersSortBy } from '@/types'
import type { DropdownAction } from '@/utils'

const STATUS_COLUMN_INDEX = 6
const EMAIL_COLUMN_INDEX = 2
const ACTIONS_COLUMN_INDEX = usersTableColumns.length - 1

const USERS_SORT_BY_COLUMN: Partial<Record<number, UsersSortBy>> = {
  0: 'username',
  1: 'firstName',
  2: 'email',
  3: 'phoneNumber',
  4: 'roles',
  5: 'emailVerified',
  6: 'enabled',
  7: 'createdAt',
  8: 'lastLogin',
}

const USERS_SORTABLE_COLUMNS = Object.keys(USERS_SORT_BY_COLUMN).map((index) => Number(index))

export default function UsersDashboardPage() {
  const navigate = useNavigate()
  const usersRows = useStoreUsers((s) => s.usersRows) as UserTableRow[]
  const userDetail = useStoreUsers((s) => s.userDetail)
  const pagination = useStoreUsers((s) => s.pagination)
  const queryParams = useStoreUsers((s) => s.queryParams)
  const loadingUsers = useStoreUsers((s) => s.loadingUsers)
  const loadingUserDetail = useStoreUsers((s) => s.loadingUserDetail)
  const loadingToggleStatus = useStoreUsers((s) => s.loadingToggleStatus)
  const errorMessage = useStoreUsers((s) => s.errorMessage)
  const detailErrorMessage = useStoreUsers((s) => s.detailErrorMessage)
  const getUsers = useStoreUsers((s) => s.getUsers)
  const getUserDetail = useStoreUsers((s) => s.getUserDetail)
  const setSearch = useStoreUsers((s) => s.setSearch)
  const searchUsers = useStoreUsers((s) => s.searchUsers)
  const sortUsers = useStoreUsers((s) => s.sortUsers)
  const clearUserDetail = useStoreUsers((s) => s.clearUserDetail)
  const mutationToggleUserStatus = useStoreUsers((s) => s.mutationToggleUserStatus)
  const goToPage = useStoreUsers((s) => s.goToPage)

  const { actionViewDetail, actionUpdateUser, actionToggleStatus } = createUsersActions()

  const [openActionsRowId, setOpenActionsRowId] = useState<string | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<UserTableRow | null>(null)

  const currentPage = pagination.page + 1
  const totalPages = pagination.totalPages
  const totalItems = pagination.totalElements
  const pageSize = pagination.size
  const userDetailView = useMemo(() => mapperUserDetailView(userDetail), [userDetail])
  const activeSortColumn = USERS_SORTABLE_COLUMNS.find((index) => USERS_SORT_BY_COLUMN[index] === queryParams.sortBy) ?? null
  const sortState: TableSortState = {
    columnIndex: activeSortColumn,
    direction: queryParams.sortDir,
  }

  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    const closeActions = () => setOpenActionsRowId(null)
    window.addEventListener('click', closeActions)
    return () => window.removeEventListener('click', closeActions)
  }, [])

  const handleViewDetail = (row: UserTableRow) => {
    setSelectedDetailRowId(row.id)
    setDetailOpen(true)
    setOpenActionsRowId(null)
    void getUserDetail(row.id)
  }

  const handleUpdateUser = (row: UserTableRow) => {
    setActionsMessage(`${row.values[0]} ${messages.users.ui.updateUserComingSoon}`)
    setOpenActionsRowId(null)
  }

  const handleToggleStatus = async (row: UserTableRow) => {
    setPendingToggleRow(row)
    setConfirmOpen(true)
    setOpenActionsRowId(null)
  }

  const resolveRowActions = (row: UserTableRow): DropdownAction[] => [
    actionViewDetail(() => handleViewDetail(row)),
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
          onClick={() => handleViewDetail(userRow)}
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

  const handleSortChange = async (columnIndex: number) => {
    const sortBy = USERS_SORT_BY_COLUMN[columnIndex]
    if (!sortBy) return

    const currentSortBy = queryParams.sortBy
    const currentSortDir = queryParams.sortDir
    const nextSortDir = currentSortBy === sortBy && currentSortDir === 'asc' ? 'desc' : 'asc'

    await sortUsers(sortBy, nextSortDir)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedDetailRowId(null)
    clearUserDetail()
  }

  const handleRetryDetail = () => {
    if (!selectedDetailRowId) return
    void getUserDetail(selectedDetailRowId)
  }

  const handleConfirmToggleStatus = async () => {
    if (!pendingToggleRow || loadingToggleStatus) return

    const nextStatus = pendingToggleRow.status !== true
    const success = await mutationToggleUserStatus(pendingToggleRow.id, nextStatus)
    if (success) {
      setActionsMessage(`${pendingToggleRow.values[0]} ${nextStatus ? messages.users.status.success.toggleEnabledSuccess : messages.users.status.success.toggleDisabledSuccess}`)
      setConfirmOpen(false)
      setPendingToggleRow(null)
    }
  }

  const handleCloseConfirm = () => {
    if (loadingToggleStatus) return
    setConfirmOpen(false)
    setPendingToggleRow(null)
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.status === true ? 'deshabilitar' : 'habilitar'} al usuario ${pendingToggleRow.values[0]}?`
    : ''
  const detailTitle = userDetail ? `Detalle de ${userDetail.username}` : 'Detalle de usuario'

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
            onClick={() => navigate(AUTH_ROUTE_USERS_CREATE)}
          />
        </div>
      </div>

      <TableComponent
        columns={usersTableColumns}
        rows={usersRows}
        loading={loadingUsers}
        emptyMessage="No hay usuarios registrados."
        renderCell={renderCell}
        sortableColumnIndexes={USERS_SORTABLE_COLUMNS}
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
        title={detailTitle}
        onClose={handleCloseDetail}
      >
        <UserDetailComponent
          detail={userDetailView}
          loading={loadingUserDetail}
          errorMessage={detailErrorMessage}
          onRetry={handleRetryDetail}
        />
      </DetailSidebarComponent>
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
