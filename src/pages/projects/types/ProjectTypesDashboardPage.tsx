import { useEffect, useState } from 'react'
import {
  AlertMessageComponent,
  ProjectTypesListDetailSidebarComponent,
  ProjectTypesListFiltersSidebarComponent,
  ProjectTypesListTableComponent,
  ProjectTypesListToolbarComponent,
  SaveConfirmComponent,
  StatsOverviewCardsComponent,
} from '@/components'
import { projectTypesTableColumnIndex } from '@/factories'
import messages from '@/messages/messages'
import { useStoreProjectTypes, useStoreSelects } from '@/store'
import type { ProjectTypeTableRow } from '@/types'

const NAME_COLUMN_INDEX = projectTypesTableColumnIndex.name

export default function ProjectTypesDashboardPage() {
  const pagination = useStoreProjectTypes((s) => s.pagination)
  const loadingToggleStatus = useStoreProjectTypes((s) => s.operationLoading.toggle)
  const listError = useStoreProjectTypes((s) => s.operationStatus.list.error)
  const toggleError = useStoreProjectTypes((s) => s.operationStatus.toggle.error)
  const clearOperationStatus = useStoreProjectTypes((s) => s.clearOperationStatus)
  const getProjectTypes = useStoreProjectTypes((s) => s.getProjectTypes)
  const toggleProjectTypeStatus = useStoreProjectTypes((s) => s.toggleProjectTypeStatus)
  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<ProjectTypeTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')

  useEffect(() => {
    void getProjectTypes()
    void getStatusOptions()
  }, [getProjectTypes, getStatusOptions])

  const handleToggleStatus = (row: ProjectTypeTableRow) => {
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
    const projectTypeName = pendingToggleRow.values[NAME_COLUMN_INDEX]
    const success = await toggleProjectTypeStatus(pendingToggleRow.id, nextStatus)
    if (!success) return

    setConfirmOpen(false)
    setPendingToggleRow(null)
    await getProjectTypes()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setActionsMessage(
      `${projectTypeName} ${
        nextStatus
          ? messages.projectTypes.status.success.toggleEnabledSuccess
          : messages.projectTypes.status.success.toggleDisabledSuccess
      }`,
    )
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.active === true ? 'deshabilitar' : 'habilitar'} el tipo ${pendingToggleRow.values[NAME_COLUMN_INDEX]}?`
    : ''

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · TIPOS</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de tipos</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total tipos"
        activeLabel="Tipos activos"
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

      <ProjectTypesListToolbarComponent
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

      <ProjectTypesListTableComponent
        onViewDetail={(row) => setSelectedDetailRowId(row.id)}
        onToggleStatus={handleToggleStatus}
        loadingExtra={loadingToggleStatus}
      />

      <ProjectTypesListFiltersSidebarComponent
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      <ProjectTypesListDetailSidebarComponent
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
