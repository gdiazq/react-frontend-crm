import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertMessageComponent,
  QualityOfWorkListDetailSidebarComponent,
  QualityOfWorkListFiltersSidebarComponent,
  QualityOfWorkListTableComponent,
  QualityOfWorkListToolbarComponent,
  SaveConfirmComponent,
  StatsOverviewCardsComponent,
} from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY } from '@/constant'
import { qualityOfWorkTableColumnIndex } from '@/factories'
import messages from '@/messages/messages'
import { useStoreQualityOfWork, useStoreSelects } from '@/store'
import type { QualityOfWorkTableRow } from '@/types'

const NAME_COLUMN_INDEX = qualityOfWorkTableColumnIndex.name

export default function SettlementsWorkQualityDashboardPage() {
  const navigate = useNavigate()
  const pagination = useStoreQualityOfWork((s) => s.pagination)
  const loadingQualityOfWork = useStoreQualityOfWork((s) => s.operationLoading.list)
  const loadingToggleStatus = useStoreQualityOfWork((s) => s.operationLoading.toggle)
  const listError = useStoreQualityOfWork((s) => s.operationStatus.list.error)
  const toggleError = useStoreQualityOfWork((s) => s.operationStatus.toggle.error)
  const clearOperationStatus = useStoreQualityOfWork((s) => s.clearOperationStatus)
  const getQualityOfWork = useStoreQualityOfWork((s) => s.getQualityOfWork)
  const toggleQualityOfWorkStatus = useStoreQualityOfWork((s) => s.toggleQualityOfWorkStatus)

  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<QualityOfWorkTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')

  useEffect(() => {
    void getQualityOfWork()
    void getStatusOptions()
  }, [getQualityOfWork, getStatusOptions])

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
    const qualityOfWorkName = pendingToggleRow.values[NAME_COLUMN_INDEX]
    const success = await toggleQualityOfWorkStatus(pendingToggleRow.id, nextStatus)
    if (!success) return

    setConfirmOpen(false)
    setPendingToggleRow(null)
    await getQualityOfWork()
    navigate(AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setActionsMessage(
      `${qualityOfWorkName} ${
        nextStatus
          ? messages.qualityOfWork.status.success.toggleEnabledSuccess
          : messages.qualityOfWork.status.success.toggleDisabledSuccess
      }`,
    )
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.active === true ? 'deshabilitar' : 'habilitar'} la calidad ${pendingToggleRow.values[NAME_COLUMN_INDEX]}?`
    : ''

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · CALIDAD DEL TRABAJO</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de calidad del trabajo</span>
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

      <QualityOfWorkListToolbarComponent
        disabled={loadingToggleStatus}
        onOpenFilters={() => setFiltersOpen(true)}
      />

      <QualityOfWorkListTableComponent
        loadingExtra={loadingToggleStatus}
        onViewDetail={(row) => setSelectedDetailRowId(row.id)}
        onToggleStatus={(row) => {
          setPendingToggleRow(row)
          setConfirmOpen(true)
        }}
      />

      <QualityOfWorkListFiltersSidebarComponent
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      <QualityOfWorkListDetailSidebarComponent
        rowId={selectedDetailRowId}
        onClose={handleCloseDetail}
      />

      <SaveConfirmComponent
        open={confirmOpen}
        title="Confirmar actualización de estado"
        message={confirmMessage}
        confirmLabel={pendingToggleRow?.active === true ? 'Deshabilitar' : 'Habilitar'}
        cancelLabel="Cancelar"
        loading={loadingQualityOfWork || loadingToggleStatus}
        onClose={handleCloseConfirm}
        onConfirm={() => { void handleConfirmToggleStatus() }}
      />
    </section>
  )
}
