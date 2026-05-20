import { useEffect, useState } from 'react'
import {
  AlertMessageComponent,
  RolesListDetailSidebarComponent,
  RolesListFiltersSidebarComponent,
  RolesListTableComponent,
  RolesListToolbarComponent,
  SaveConfirmComponent,
  StatsOverviewCardsComponent,
} from '@/components'
import { rolesTableColumnIndex } from '@/factories'
import messages from '@/messages/messages'
import { useStoreRoles, useStoreSelects } from '@/store'
import type { RoleTableRow } from '@/types'

const ROLE_NAME_COLUMN_INDEX = rolesTableColumnIndex.name

export default function RolesDashboardPage() {
  const pagination = useStoreRoles((s) => s.pagination)
  const loadingToggleStatus = useStoreRoles((s) => s.operationLoading.toggle)
  const listError = useStoreRoles((s) => s.operationStatus.list.error)
  const toggleError = useStoreRoles((s) => s.operationStatus.toggle.error)
  const clearOperationStatus = useStoreRoles((s) => s.clearOperationStatus)
  const getRoles = useStoreRoles((s) => s.getRoles)
  const toggleRoleStatus = useStoreRoles((s) => s.toggleRoleStatus)

  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<RoleTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')

  useEffect(() => {
    void getRoles()
    void getStatusOptions()
  }, [getRoles, getStatusOptions])

  const handleToggleStatus = (row: RoleTableRow) => {
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
    const roleName = pendingToggleRow.values[ROLE_NAME_COLUMN_INDEX]
    const success = await toggleRoleStatus(pendingToggleRow.id, nextStatus)
    if (!success) return

    setConfirmOpen(false)
    setPendingToggleRow(null)
    await getRoles()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setActionsMessage(
      `${roleName} ${
        nextStatus
          ? messages.roles.status.success.toggleEnabledSuccess
          : messages.roles.status.success.toggleDisabledSuccess
      }`,
    )
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.status === true ? 'deshabilitar' : 'habilitar'} al rol ${pendingToggleRow.values[ROLE_NAME_COLUMN_INDEX]}?`
    : ''

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · ROLES</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de roles</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total roles"
        activeLabel="Roles activos"
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

      {statusOptionsErrorMessage && (
        <AlertMessageComponent
          message={statusOptionsErrorMessage}
          tone="error"
          onClose={clearStatusOptionsStatus}
        />
      )}

      <RolesListToolbarComponent
        onOpenFilters={() => setFiltersOpen(true)}
        disabled={loadingToggleStatus}
      />

      {actionsMessage && (
        <AlertMessageComponent
          message={actionsMessage}
          tone="info"
          onClose={() => setActionsMessage('')}
        />
      )}

      <RolesListTableComponent
        onViewDetail={(row) => setSelectedDetailRowId(row.id)}
        onToggleStatus={handleToggleStatus}
        loadingExtra={loadingToggleStatus}
      />

      <RolesListFiltersSidebarComponent
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      <RolesListDetailSidebarComponent
        rowId={selectedDetailRowId}
        onClose={() => setSelectedDetailRowId(null)}
      />

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
