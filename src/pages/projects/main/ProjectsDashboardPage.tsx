import { useEffect, useState } from 'react'
import {
  AlertMessageComponent,
  ProjectsListDetailSidebarComponent,
  ProjectsListFiltersSidebarComponent,
  ProjectsListTableComponent,
  ProjectsListToolbarComponent,
  SaveConfirmComponent,
  StatsOverviewCardsComponent,
} from '@/components'
import { projectsTableColumnIndex } from '@/factories'
import messages from '@/messages/messages'
import { useStoreProjects, useStoreSelects } from '@/store'
import type { ProjectTableRow } from '@/types'
import { isTableRowActive } from '@/utils'

const PROJECT_NAME_COLUMN_INDEX = projectsTableColumnIndex.name

export default function ProjectsDashboardPage() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [detailRowId, setDetailRowId] = useState<string | null>(null)
  const [detailName, setDetailName] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggleRow, setPendingToggleRow] = useState<ProjectTableRow | null>(null)
  const [actionsMessage, setActionsMessage] = useState('')

  // Store state used to render the dashboard.
  const pagination = useStoreProjects((s) => s.pagination)
  const loadingToggleStatus = useStoreProjects((s) => s.operationLoading.toggle)
  const listError = useStoreProjects((s) => s.operationStatus.list.error)
  const toggleError = useStoreProjects((s) => s.operationStatus.toggle.error)

  // Store actions triggered by dashboard interactions.
  const clearOperationStatus = useStoreProjects((s) => s.clearOperationStatus)
  const getProjects = useStoreProjects((s) => s.getProjects)
  const getProjectDetail = useStoreProjects((s) => s.getProjectDetail)
  const toggleProjectStatus = useStoreProjects((s) => s.toggleProjectStatus)

  // Shared select state/actions used by filters and table labels.
  const statusOptionsErrorMessage = useStoreSelects((s) => s.statusOptionsErrorMessage)
  const getStatusOptions = useStoreSelects((s) => s.getStatusOptions)
  const clearStatusOptionsStatus = useStoreSelects((s) => s.clearStatusOptionsStatus)
  const projectTypeOptionsErrorMessage = useStoreSelects((s) => s.projectTypeOptionsErrorMessage)
  const getProjectTypeOptions = useStoreSelects((s) => s.getProjectTypeOptions)
  const clearProjectTypeOptionsStatus = useStoreSelects((s) => s.clearProjectTypeOptionsStatus)
  const projectStatusOptionsErrorMessage = useStoreSelects((s) => s.projectStatusOptionsErrorMessage)
  const getProjectStatusOptions = useStoreSelects((s) => s.getProjectStatusOptions)
  const clearProjectStatusOptionsStatus = useStoreSelects((s) => s.clearProjectStatusOptionsStatus)
  const projectSpecialtyOptionsErrorMessage = useStoreSelects((s) => s.projectSpecialtyOptionsErrorMessage)
  const getProjectSpecialtyOptions = useStoreSelects((s) => s.getProjectSpecialtyOptions)
  const clearProjectSpecialtyOptionsStatus = useStoreSelects((s) => s.clearProjectSpecialtyOptionsStatus)

  useEffect(() => {
    void getProjects()
    void getStatusOptions()
    void getProjectTypeOptions()
    void getProjectStatusOptions()
    void getProjectSpecialtyOptions()
  }, [getProjectSpecialtyOptions, getProjectStatusOptions, getProjectTypeOptions, getProjects, getStatusOptions])

  const handleViewDetail = (row: ProjectTableRow) => {
    setDetailRowId(row.id)
    setDetailName(String(row.values[PROJECT_NAME_COLUMN_INDEX] ?? 'Proyecto'))
  }

  const handleCloseDetail = () => {
    setDetailRowId(null)
    setDetailName('')
  }

  const handleToggleStatus = (row: ProjectTableRow) => {
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
    const projectName = pendingToggleRow.values[PROJECT_NAME_COLUMN_INDEX]
    const success = await toggleProjectStatus(pendingToggleRow.id, nextStatus)
    if (!success) return

    setConfirmOpen(false)
    setPendingToggleRow(null)
    await getProjects()
    if (detailRowId === pendingToggleRow.id) {
      void getProjectDetail(pendingToggleRow.id)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setActionsMessage(
      `${projectName} ${nextStatus ? messages.projects.status.success.toggleEnabledSuccess : messages.projects.status.success.toggleDisabledSuccess}`,
    )
  }

  const confirmMessage = pendingToggleRow
    ? `¿Seguro que deseas ${isTableRowActive(pendingToggleRow) ? 'deshabilitar' : 'habilitar'} al proyecto ${pendingToggleRow.values[PROJECT_NAME_COLUMN_INDEX]}?`
    : ''

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · PROYECTOS</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de proyectos</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent totalLabel="Total proyectos" activeLabel="Proyectos activos" total={pagination.total} active={pagination.active} />

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
      {statusOptionsErrorMessage && 
        <AlertMessageComponent 
          message={statusOptionsErrorMessage} 
          tone="error" 
          onClose={clearStatusOptionsStatus} 
        />
      }

      {projectTypeOptionsErrorMessage && 
        <AlertMessageComponent 
          message={projectTypeOptionsErrorMessage} 
          tone="error" 
          onClose={clearProjectTypeOptionsStatus} 
        />
      }
      {projectStatusOptionsErrorMessage && 
        <AlertMessageComponent 
          message={projectStatusOptionsErrorMessage} 
          tone="error" 
          onClose={clearProjectStatusOptionsStatus} 
        />
      }
      {projectSpecialtyOptionsErrorMessage && 
        <AlertMessageComponent 
          message={projectSpecialtyOptionsErrorMessage} 
          tone="error" 
          onClose={clearProjectSpecialtyOptionsStatus} 
        />
      }

      <ProjectsListToolbarComponent 
        onOpenFilters={() => setFiltersOpen(true)} 
        disabled={loadingToggleStatus} 
      />

      <ProjectsListTableComponent 
        onViewDetail={handleViewDetail} 
        onToggleStatus={handleToggleStatus} 
        loadingExtra={loadingToggleStatus} 
      />

      {actionsMessage && 
        <AlertMessageComponent 
          message={actionsMessage} 
          tone="info" 
          onClose={() => setActionsMessage('')} 
        />
      }

      <ProjectsListFiltersSidebarComponent 
        open={filtersOpen} 
        onClose={() => setFiltersOpen(false)} 
      />
      
      <ProjectsListDetailSidebarComponent
        key={detailRowId ?? 'empty-project-detail-sidebar'}
        rowId={detailRowId}
        fallbackName={detailName}
        onClose={handleCloseDetail}
      />

      <SaveConfirmComponent
        open={confirmOpen}
        title="Confirmar cambio de estado"
        message={confirmMessage}
        confirmLabel={isTableRowActive(pendingToggleRow) ? 'Deshabilitar' : 'Habilitar'}
        cancelLabel="Cancelar"
        loading={loadingToggleStatus}
        onClose={handleCloseConfirm}
        onConfirm={() => { void handleConfirmToggleStatus() }}
      />
    </section>
  )
}
