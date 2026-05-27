import { useEffect, useState } from 'react'
import {
  AlertMessageComponent,
  ProjectStatusesListDetailSidebarComponent,
  ProjectStatusesListFiltersSidebarComponent,
  ProjectStatusesListTableComponent,
  ProjectStatusesListToolbarComponent,
  SaveConfirmComponent,
  StatsOverviewCardsComponent,
} from '@/components'
import { projectStatusesTableColumnIndex } from '@/factories'
import messages from '@/messages/messages'
import { useStoreProjectStatuses, useStoreSelects } from '@/store'
import type { ProjectStatusTableRow } from '@/types'

const NAME_COLUMN_INDEX = projectStatusesTableColumnIndex.name

export default function ProjectStatusesDashboardPage() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<ProjectStatusTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')

  // Store state used to render the dashboard.
  const pagination = useStoreProjectStatuses((s) => s.pagination)
  const loadingToggleStatus = useStoreProjectStatuses((s) => s.operationLoading.toggle)
  const listError = useStoreProjectStatuses((s) => s.operationStatus.list.error)
  const toggleError = useStoreProjectStatuses((s) => s.operationStatus.toggle.error)

  // Store actions triggered by dashboard interactions.
  const clearOperationStatus = useStoreProjectStatuses((s) => s.clearOperationStatus)
  const getProjectStatuses = useStoreProjectStatuses((s) => s.getProjectStatuses)
  const toggleProjectStatusStatus = useStoreProjectStatuses((s) => s.toggleProjectStatusStatus)

  // Shared select state/actions used by filters.
  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)

  useEffect(() => {
    void getProjectStatuses()
    void getStatusOptions()
  }, [getProjectStatuses, getStatusOptions])

  const handleToggleStatus = (row: ProjectStatusTableRow) => {
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
    const nextStatus = pendingToggleRow.active !== true
    const projectStatusName = pendingToggleRow.values[NAME_COLUMN_INDEX]
    const success = await toggleProjectStatusStatus(pendingToggleRow.id, nextStatus)
    if (!success) return

    setConfirmOpen(false)
    setPendingToggleRow(null)
    await getProjectStatuses()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setActionsMessage(
      `${projectStatusName} ${
        nextStatus
          ? messages.projectStatuses.status.success.toggleEnabledSuccess
          : messages.projectStatuses.status.success.toggleDisabledSuccess
      }`,
    )
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.active === true ? 'deshabilitar' : 'habilitar'} la vigencia ${pendingToggleRow.values[NAME_COLUMN_INDEX]}?`
    : ''

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · VIGENCIAS</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de vigencias</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total vigencias"
        activeLabel="Vigencias activas"
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

      <ProjectStatusesListToolbarComponent
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

      <ProjectStatusesListTableComponent
        onViewDetail={(row) => setSelectedDetailRowId(row.id)}
        onToggleStatus={handleToggleStatus}
        loadingExtra={loadingToggleStatus}
      />

      <ProjectStatusesListFiltersSidebarComponent
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      <ProjectStatusesListDetailSidebarComponent
        rowId={selectedDetailRowId}
        onClose={() => setSelectedDetailRowId(null)}
      />

      <SaveConfirmComponent
        open={confirmOpen}
        title="Confirmar actualización de estado"
        message={confirmMessage}
        confirmLabel={pendingToggleRow?.active === true ? 'Deshabilitar' : 'Habilitar'}
        cancelLabel="Cancelar"
        loading={loadingToggleStatus}
        onClose={handleCloseConfirm}
        onConfirm={() => { void handleConfirmToggleStatus() }}
      />
    </section>
  )
}
