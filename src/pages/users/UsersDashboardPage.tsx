import { useEffect, useState } from 'react'
import {
  SaveConfirmComponent,
  StatsOverviewCardsComponent,
  UsersListDetailSidebarComponent,
  UsersListFiltersSidebarComponent,
  UsersListTableComponent,
  UsersListToolbarComponent,
} from '@/components'
import { mapperUserRowStatus, mapperUserTableDisplayName, mapperUserToggleSuccessMessage } from '@/mappers'
import { useStoreSelects, useStoreToast, useStoreUsers } from '@/store'
import type { UserTableRow } from '@/types'

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

  const pushToast = useStoreToast((s) => s.pushToast)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [detailRowId, setDetailRowId] = useState<string | null>(null)
  const [detailName, setDetailName] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<UserTableRow | null>(null)

  useEffect(() => {
    void getUsers()
    void getUsersFilterOptions()
  }, [getUsers, getUsersFilterOptions])

  useEffect(() => {
    if (!listError) return
    pushToast({ message: listError, tone: 'error' })
    clearOperationStatus('list')
  }, [listError, pushToast, clearOperationStatus])

  useEffect(() => {
    if (!toggleError) return
    pushToast({ message: toggleError, tone: 'error' })
    clearOperationStatus('toggle')
  }, [toggleError, pushToast, clearOperationStatus])

  useEffect(() => {
    if (!usersFilterOptionsErrorMessage) return
    pushToast({ message: usersFilterOptionsErrorMessage, tone: 'error' })
    clearUsersFilterOptionsStatus()
  }, [usersFilterOptionsErrorMessage, pushToast, clearUsersFilterOptionsStatus])

  const handleViewDetail = (row: UserTableRow) => {
    setDetailRowId(row.id)
    setDetailName(mapperUserTableDisplayName(row))
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

    const nextStatus = !mapperUserRowStatus(pendingToggleRow)
    const success = await toggleUserStatus(pendingToggleRow.id, nextStatus)
    if (!success) return

    setConfirmOpen(false)
    setPendingToggleRow(null)
    await getUsers()
    pushToast({ message: mapperUserToggleSuccessMessage(pendingToggleRow, nextStatus), tone: 'success' })
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${mapperUserRowStatus(pendingToggleRow) ? 'deshabilitar' : 'habilitar'} al usuario ${mapperUserTableDisplayName(pendingToggleRow)}?`
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

      <UsersListToolbarComponent onOpenFilters={() => setFiltersOpen(true)} disabled={loadingToggleStatus} />

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
