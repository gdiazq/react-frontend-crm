import { useEffect, useState } from 'react'
import {
  AlertMessageComponent,
  SaveConfirmComponent,
  StatsOverviewCardsComponent,
  UsersListDetailSidebarComponent,
  UsersListFiltersSidebarComponent,
  UsersListTableComponent,
  UsersListToolbarComponent,
} from '@/components'
import messages from '@/messages/messages'
import { useStoreSelects, useStoreUsers } from '@/store'
import type { UserTableRow } from '@/types'

const USERNAME_COLUMN_INDEX = 0

export default function UsersDashboardPage() {
  const pagination = useStoreUsers((s) => s.pagination)
  const loadingToggleStatus = useStoreUsers((s) => s.operationLoading.toggle)
  const listError = useStoreUsers((s) => s.operationStatus.list.error)
  const toggleError = useStoreUsers((s) => s.operationStatus.toggle.error)
  const clearOperationStatus = useStoreUsers((s) => s.clearOperationStatus)
  const getUsers = useStoreUsers((s) => s.getUsers)
  const toggleUserStatus = useStoreUsers((s) => s.toggleUserStatus)

  const usersFilterOptionsErrorMessage = useStoreSelects((s) => s.usersFilterOptionsErrorMessage)
  const getUsersFilterOptions = useStoreSelects((s) => s.getUsersFilterOptions)
  const clearUsersFilterOptionsStatus = useStoreSelects((s) => s.clearUsersFilterOptionsStatus)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [detailRowId, setDetailRowId] = useState<string | null>(null)
  const [detailName, setDetailName] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<UserTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')

  useEffect(() => {
    void getUsers()
    void getUsersFilterOptions()
  }, [getUsers, getUsersFilterOptions])

  const handleViewDetail = (row: UserTableRow) => {
    setDetailRowId(row.id)
    setDetailName(String(row.values[USERNAME_COLUMN_INDEX] ?? 'Usuario'))
  }

  const handleCloseDetail = () => {
    setDetailRowId(null)
    setDetailName('')
  }

  const handleToggleStatus = (row: UserTableRow) => {
    setPendingToggleRow(row)
    setConfirmOpen(true)
  }

  const handleCloseConfirm = () => {
    if (loadingToggleStatus) return
    setConfirmOpen(false)
    setPendingToggleRow(null)
  }

  const handleConfirmToggleStatus = async () => {
    if (!pendingToggleRow || loadingToggleStatus) return

    const nextStatus = pendingToggleRow.status !== true
    const username = pendingToggleRow.values[USERNAME_COLUMN_INDEX]
    const success = await toggleUserStatus(pendingToggleRow.id, nextStatus)
    if (!success) return

    setConfirmOpen(false)
    setPendingToggleRow(null)
    await getUsers()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setActionsMessage(
      `${username} ${nextStatus ? messages.users.status.success.toggleEnabledSuccess : messages.users.status.success.toggleDisabledSuccess}`,
    )
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.status === true ? 'deshabilitar' : 'habilitar'} al usuario ${pendingToggleRow.values[USERNAME_COLUMN_INDEX]}?`
    : ''

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · USUARIOS</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de usuarios</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total usuarios"
        activeLabel="Usuarios activos"
        total={pagination.total}
        active={pagination.active}
      />

      {(listError || toggleError) && (
        <AlertMessageComponent
          message={(listError || toggleError)!}
          tone="error"
          onClose={() => {
            if (listError) clearOperationStatus('list')
            if (toggleError) clearOperationStatus('toggle')
          }}
        />
      )}

      {usersFilterOptionsErrorMessage && (
        <AlertMessageComponent
          message={usersFilterOptionsErrorMessage}
          tone="error"
          onClose={clearUsersFilterOptionsStatus}
        />
      )}

      <UsersListToolbarComponent onOpenFilters={() => setFiltersOpen(true)} disabled={loadingToggleStatus} />

      {actionsMessage && (
        <AlertMessageComponent message={actionsMessage} tone="info" onClose={() => setActionsMessage('')} />
      )}

      <UsersListTableComponent
        onViewDetail={handleViewDetail}
        onToggleStatus={handleToggleStatus}
        loadingExtra={loadingToggleStatus}
      />

      <UsersListFiltersSidebarComponent open={filtersOpen} onClose={() => setFiltersOpen(false)} />
      <UsersListDetailSidebarComponent rowId={detailRowId} fallbackName={detailName} onClose={handleCloseDetail} />

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
