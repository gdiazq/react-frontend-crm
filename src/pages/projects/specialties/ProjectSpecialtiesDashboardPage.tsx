import { useEffect, useState } from 'react'
import {
  AlertMessageComponent,
  ProjectSpecialtiesListDetailSidebarComponent,
  ProjectSpecialtiesListFiltersSidebarComponent,
  ProjectSpecialtiesListTableComponent,
  ProjectSpecialtiesListToolbarComponent,
  SaveConfirmComponent,
  StatsOverviewCardsComponent,
} from '@/components'
import { projectSpecialtiesTableColumnIndex } from '@/factories'
import messages from '@/messages/messages'
import { useStoreProjectSpecialties, useStoreSelects } from '@/store'
import type { ProjectSpecialtyTableRow } from '@/types'

const NAME_COLUMN_INDEX = projectSpecialtiesTableColumnIndex.name

export default function ProjectSpecialtiesDashboardPage() {
  const pagination = useStoreProjectSpecialties((s) => s.pagination)
  const loadingToggleStatus = useStoreProjectSpecialties((s) => s.operationLoading.toggle)
  const listError = useStoreProjectSpecialties((s) => s.operationStatus.list.error)
  const toggleError = useStoreProjectSpecialties((s) => s.operationStatus.toggle.error)
  const clearOperationStatus = useStoreProjectSpecialties((s) => s.clearOperationStatus)
  const getProjectSpecialties = useStoreProjectSpecialties((s) => s.getProjectSpecialties)
  const toggleProjectSpecialtyStatus = useStoreProjectSpecialties((s) => s.toggleProjectSpecialtyStatus)
  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedDetailRowId, setSelectedDetailRowId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<ProjectSpecialtyTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')

  useEffect(() => {
    void getProjectSpecialties()
    void getStatusOptions()
  }, [getProjectSpecialties, getStatusOptions])

  const handleToggleStatus = (row: ProjectSpecialtyTableRow) => {
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
    const projectSpecialtyName = pendingToggleRow.values[NAME_COLUMN_INDEX]
    const success = await toggleProjectSpecialtyStatus(pendingToggleRow.id, nextStatus)
    if (!success) return

    setConfirmOpen(false)
    setPendingToggleRow(null)
    await getProjectSpecialties()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setActionsMessage(
      `${projectSpecialtyName} ${
        nextStatus
          ? messages.projectSpecialties.status.success.toggleEnabledSuccess
          : messages.projectSpecialties.status.success.toggleDisabledSuccess
      }`,
    )
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${pendingToggleRow.active === true ? 'deshabilitar' : 'habilitar'} la especialidad ${pendingToggleRow.values[NAME_COLUMN_INDEX]}?`
    : ''

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · ESPECIALIDADES</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de especialidades</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total especialidades"
        activeLabel="Especialidades activas"
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

      <ProjectSpecialtiesListToolbarComponent
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

      <ProjectSpecialtiesListTableComponent
        onViewDetail={(row) => setSelectedDetailRowId(row.id)}
        onToggleStatus={handleToggleStatus}
        loadingExtra={loadingToggleStatus}
      />

      <ProjectSpecialtiesListFiltersSidebarComponent
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      <ProjectSpecialtiesListDetailSidebarComponent
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
