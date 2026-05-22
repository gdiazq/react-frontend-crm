import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  LegalTerminationCausesListDetailSidebarComponent,
  LegalTerminationCausesListFiltersSidebarComponent,
  LegalTerminationCausesListTableComponent,
  LegalTerminationCausesListToolbarComponent,
  SaveConfirmComponent,
  StatsOverviewCardsComponent,
} from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES } from '@/constant'
import { legalTerminationCausesTableColumnIndex } from '@/factories'
import messages from '@/messages/messages'
import { useStoreLegalTerminationCauses, useStoreSelects } from '@/store'
import type { LegalTerminationCauseTableRow } from '@/types'

const NAME_COLUMN_INDEX = legalTerminationCausesTableColumnIndex.name

export default function SettlementsTerminationDashboardPage() {
  const navigate = useNavigate()
  const pagination = useStoreLegalTerminationCauses((s) => s.pagination)
  const loadingLegalTerminationCauses = useStoreLegalTerminationCauses((s) => s.operationLoading.list)
  const loadingToggleStatus = useStoreLegalTerminationCauses((s) => s.operationLoading.toggle)
  const listError = useStoreLegalTerminationCauses((s) => s.operationStatus.list.error)
  const toggleError = useStoreLegalTerminationCauses((s) => s.operationStatus.toggle.error)
  const clearOperationStatus = useStoreLegalTerminationCauses((s) => s.clearOperationStatus)
  const getLegalTerminationCauses = useStoreLegalTerminationCauses((s) => s.getLegalTerminationCauses)
  const toggleLegalTerminationCauseStatus = useStoreLegalTerminationCauses((s) => s.toggleLegalTerminationCauseStatus)

  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<LegalTerminationCauseTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')

  useEffect(() => {
    void getLegalTerminationCauses()
    void getStatusOptions()
  }, [getLegalTerminationCauses, getStatusOptions])

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
    const legalTerminationCauseName = pendingToggleRow.values[NAME_COLUMN_INDEX]
    const success = await toggleLegalTerminationCauseStatus(pendingToggleRow.id, nextStatus)
    if (!success) return

    setConfirmOpen(false)
    setPendingToggleRow(null)
    await getLegalTerminationCauses()
    navigate(AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setActionsMessage(
      `${legalTerminationCauseName} ${
        nextStatus
          ? messages.legalTerminationCauses.status.success.toggleEnabledSuccess
          : messages.legalTerminationCauses.status.success.toggleDisabledSuccess
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
          <span className="num">ÍNDICE · TERMINACIÓN</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de terminación</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total causas"
        activeLabel="Causas activas"
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

      <LegalTerminationCausesListToolbarComponent
        disabled={loadingToggleStatus}
        onOpenFilters={() => setFiltersOpen(true)}
      />

      <LegalTerminationCausesListTableComponent
        loadingExtra={loadingToggleStatus}
        onViewDetail={(row) => setSelectedDetailRowId(row.id)}
        onToggleStatus={(row) => {
          setPendingToggleRow(row)
          setConfirmOpen(true)
        }}
      />

      <LegalTerminationCausesListFiltersSidebarComponent
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      <LegalTerminationCausesListDetailSidebarComponent
        rowId={selectedDetailRowId}
        onClose={handleCloseDetail}
      />

      <SaveConfirmComponent
        open={confirmOpen}
        title="Confirmar actualización de estado"
        message={confirmMessage}
        confirmLabel={pendingToggleRow?.active === true ? 'Deshabilitar' : 'Habilitar'}
        cancelLabel="Cancelar"
        loading={loadingLegalTerminationCauses || loadingToggleStatus}
        onClose={handleCloseConfirm}
        onConfirm={() => { void handleConfirmToggleStatus() }}
      />
    </section>
  )
}
