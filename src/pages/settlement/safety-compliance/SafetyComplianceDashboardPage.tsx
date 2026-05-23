import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  SafetyComplianceListDetailSidebarComponent,
  SafetyComplianceListFiltersSidebarComponent,
  SafetyComplianceListTableComponent,
  SafetyComplianceListToolbarComponent,
  SaveConfirmComponent,
  StatsOverviewCardsComponent,
} from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE } from '@/constant'
import { safetyComplianceTableColumnIndex } from '@/factories'
import messages from '@/messages/messages'
import { useStoreSafetyCompliance, useStoreSelects } from '@/store'
import type { SafetyComplianceTableRow } from '@/types'

const NAME_COLUMN_INDEX = safetyComplianceTableColumnIndex.name

export default function SafetyComplianceDashboardPage() {
  const navigate = useNavigate()
  const pagination = useStoreSafetyCompliance((s) => s.pagination)
  const loadingSafetyCompliance = useStoreSafetyCompliance((s) => s.operationLoading.list)
  const loadingToggleStatus = useStoreSafetyCompliance((s) => s.operationLoading.toggle)
  const listError = useStoreSafetyCompliance((s) => s.operationStatus.list.error)
  const toggleError = useStoreSafetyCompliance((s) => s.operationStatus.toggle.error)
  const clearOperationStatus = useStoreSafetyCompliance((s) => s.clearOperationStatus)
  const getSafetyCompliance = useStoreSafetyCompliance((s) => s.getSafetyCompliance)
  const toggleSafetyComplianceStatus = useStoreSafetyCompliance((s) => s.toggleSafetyComplianceStatus)

  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<SafetyComplianceTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')

  useEffect(() => {
    void getSafetyCompliance()
    void getStatusOptions()
  }, [getSafetyCompliance, getStatusOptions])

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
    const safetyComplianceName = pendingToggleRow.values[NAME_COLUMN_INDEX]
    const success = await toggleSafetyComplianceStatus(pendingToggleRow.id, nextStatus)
    if (!success) return

    setConfirmOpen(false)
    setPendingToggleRow(null)
    await getSafetyCompliance()
    navigate(AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setActionsMessage(
      `${safetyComplianceName} ${
        nextStatus
          ? messages.safetyCompliance.status.success.toggleEnabledSuccess
          : messages.safetyCompliance.status.success.toggleDisabledSuccess
      }`,
    )
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.active === true ? 'deshabilitar' : 'habilitar'} el cumplimiento ${pendingToggleRow.values[NAME_COLUMN_INDEX]}?`
    : ''

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · SEGURIDAD</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de seguridad</span>
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

      <SafetyComplianceListToolbarComponent
        disabled={loadingToggleStatus}
        onOpenFilters={() => setFiltersOpen(true)}
      />

      <SafetyComplianceListTableComponent
        loadingExtra={loadingToggleStatus}
        onViewDetail={(row) => setSelectedDetailRowId(row.id)}
        onToggleStatus={(row) => {
          setPendingToggleRow(row)
          setConfirmOpen(true)
        }}
      />

      <SafetyComplianceListFiltersSidebarComponent
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      <SafetyComplianceListDetailSidebarComponent
        rowId={selectedDetailRowId}
        onClose={handleCloseDetail}
      />

      <SaveConfirmComponent
        open={confirmOpen}
        title="Confirmar actualización de estado"
        message={confirmMessage}
        confirmLabel={pendingToggleRow?.active === true ? 'Deshabilitar' : 'Habilitar'}
        cancelLabel="Cancelar"
        loading={loadingSafetyCompliance || loadingToggleStatus}
        onClose={handleCloseConfirm}
        onConfirm={() => { void handleConfirmToggleStatus() }}
      />
    </section>
  )
}
