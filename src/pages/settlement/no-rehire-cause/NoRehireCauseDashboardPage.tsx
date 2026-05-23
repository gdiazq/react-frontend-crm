import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  NoRehireCauseListDetailSidebarComponent,
  NoRehireCauseListFiltersSidebarComponent,
  NoRehireCauseListTableComponent,
  NoRehireCauseListToolbarComponent,
  SaveConfirmComponent,
  StatsOverviewCardsComponent,
} from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE } from '@/constant'
import { noRehireCauseTableColumnIndex } from '@/factories'
import messages from '@/messages/messages'
import { useStoreNoRehireCause, useStoreSelects } from '@/store'
import type { NoRehireCauseTableRow } from '@/types'

const NAME_COLUMN_INDEX = noRehireCauseTableColumnIndex.name

export default function NoRehireCauseDashboardPage() {
  const navigate = useNavigate()
  const pagination = useStoreNoRehireCause((s) => s.pagination)
  const loadingNoRehireCause = useStoreNoRehireCause((s) => s.operationLoading.list)
  const loadingToggleStatus = useStoreNoRehireCause((s) => s.operationLoading.toggle)
  const listError = useStoreNoRehireCause((s) => s.operationStatus.list.error)
  const toggleError = useStoreNoRehireCause((s) => s.operationStatus.toggle.error)
  const clearOperationStatus = useStoreNoRehireCause((s) => s.clearOperationStatus)
  const getNoRehireCause = useStoreNoRehireCause((s) => s.getNoRehireCause)
  const toggleNoRehireCauseStatus = useStoreNoRehireCause((s) => s.toggleNoRehireCauseStatus)

  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<NoRehireCauseTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')

  useEffect(() => {
    void getNoRehireCause()
    void getStatusOptions()
  }, [getNoRehireCause, getStatusOptions])

  const handleCloseDetail = () => {
    setSelectedDetailRowId(null)
  }

  const handleCloseConfirm = () => {
    if (loadingToggleStatus) return
    setConfirmOpen(false)
    setPendingToggleRow(null)
  }

  const handleConfirmToggleStatus = async () => {
    if (!pendingToggleRow || loadingToggleStatus) return

    const nextStatus = pendingToggleRow.active !== true
    const noRehireCauseName = pendingToggleRow.values[NAME_COLUMN_INDEX]
    const success = await toggleNoRehireCauseStatus(pendingToggleRow.id, nextStatus)
    if (!success) return

    setConfirmOpen(false)
    setPendingToggleRow(null)
    await getNoRehireCause()
    navigate(AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setActionsMessage(
      `${noRehireCauseName} ${
        nextStatus
          ? messages.noRehireCause.status.success.toggleEnabledSuccess
          : messages.noRehireCause.status.success.toggleDisabledSuccess
      }`,
    )
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.active === true ? 'deshabilitar' : 'habilitar'} la causa ${pendingToggleRow.values[NAME_COLUMN_INDEX]}?`
    : ''

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · NO RECONTRATACIÓN</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de no recontratación</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total registros"
        activeLabel="Registros activos"
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

      {actionsMessage && (
        <AlertMessageComponent
          message={actionsMessage}
          tone="info"
          onClose={() => setActionsMessage('')}
        />
      )}

      <NoRehireCauseListToolbarComponent
        disabled={loadingToggleStatus}
        onOpenFilters={() => setFiltersOpen(true)}
      />

      <NoRehireCauseListTableComponent
        loadingExtra={loadingToggleStatus}
        onViewDetail={(row) => setSelectedDetailRowId(row.id)}
        onToggleStatus={(row) => {
          setPendingToggleRow(row)
          setConfirmOpen(true)
        }}
      />

      <NoRehireCauseListFiltersSidebarComponent
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      <NoRehireCauseListDetailSidebarComponent
        rowId={selectedDetailRowId}
        onClose={handleCloseDetail}
      />

      <SaveConfirmComponent
        open={confirmOpen}
        title="Confirmar actualización de estado"
        message={confirmMessage}
        confirmLabel={pendingToggleRow?.active === true ? 'Deshabilitar' : 'Habilitar'}
        cancelLabel="Cancelar"
        loading={loadingNoRehireCause || loadingToggleStatus}
        onClose={handleCloseConfirm}
        onConfirm={() => { void handleConfirmToggleStatus() }}
      />
    </section>
  )
}
