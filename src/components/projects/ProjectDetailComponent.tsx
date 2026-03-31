import { useState } from 'react'
import { AvatarInitialsComponent } from '@/components/ui/avatar/AvatarInitialsComponent'
import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import { DetailSectionDropdownComponent } from '@/components/ui/dropdown/DetailSectionDropdownComponent'
import { StatusBadgeComponent } from '@/components/ui/status/StatusBadgeComponent'
import type { ProjectDetailView } from '@/types'

interface ProjectDetailComponentProps {
  detail: ProjectDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
}

type ProjectDetailTabKey = 'general' | 'team' | 'dates'

interface ProjectDetailContentProps {
  detail: ProjectDetailView
  activeTab: ProjectDetailTabKey
  onTabChange: (tab: ProjectDetailTabKey) => void
}

export function ProjectDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
}: ProjectDetailComponentProps) {
  const [activeTab, setActiveTab] = useState<ProjectDetailTabKey>('general')

  return (
    <DetailStateWrapperComponent
      loading={loading}
      errorMessage={errorMessage}
      hasData={detail !== null}
      loadingText="Cargando detalle del proyecto..."
      emptyText="Selecciona un proyecto para ver su detalle."
      onRetry={onRetry}
    >
      {detail && (
        <ProjectDetailContent
          detail={detail}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </DetailStateWrapperComponent>
  )
}

function ProjectDetailContent({ detail, activeTab, onTabChange }: ProjectDetailContentProps) {
  const tabSelectOptions = [
    { value: 'general', label: 'Informacion general' },
    { value: 'team', label: 'Responsables' },
    { value: 'dates', label: 'Fechas' },
  ]

  const renderTabContent = () => {
    if (activeTab == 'general') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Centro costo" value={detail.costCenterDisplay} />
          <DetailFieldCardComponent title="Tipo" value={detail.typeName} />
          <DetailFieldCardComponent title="Vigencia" value={detail.statusName} />
          <DetailFieldCardComponent title="Especialidad" value={detail.specialtyName} />
          <DetailFieldCardComponent title="Direccion" value={detail.addressDisplay} />
          <DetailFieldCardComponent title="Descripcion" value={detail.descriptionDisplay} />
        </div>
      )
    }

    if (activeTab == 'team') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Visitador" value={detail.visitorName} />
          <DetailFieldCardComponent title="Supervisor" value={detail.supervisorName} />
          <DetailFieldCardComponent
            title="Representantes"
            value={detail.companyRepresentativesDisplay}
            className="md:col-span-2"
          />
        </div>
      )
    }

    return (
      <div className="grid gap-3 md:grid-cols-2">
        <DetailFieldCardComponent title="Inicio" value={detail.startDateDisplay} />
        <DetailFieldCardComponent title="Inicio real" value={detail.realStartDateDisplay} />
        <DetailFieldCardComponent title="Fin" value={detail.endDateDisplay} />
        <DetailFieldCardComponent title="Fin real" value={detail.realEndDateDisplay} />
        <DetailFieldCardComponent title="Creado" value={detail.createdAtDisplay} />
        <DetailFieldCardComponent title="Actualizado" value={detail.updatedAtDisplay} />
      </div>
    )
  }

  return (
    <section className="space-y-5">
      <article className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-white/10 dark:from-slate-900/60 dark:to-slate-900/30">
        <div className="flex items-start gap-4">
          <AvatarInitialsComponent
            fullName={detail.projectName}
            fallbackInitials="PY"
            className="bg-cyan-100 font-bold text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200"
          />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-base font-semibold">{detail.projectName}</p>
            <p className="truncate text-sm text-slate-600 dark:text-slate-300">Centro costo: {detail.costCenterDisplay}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-slate-300/80 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:border-white/15 dark:bg-slate-800 dark:text-slate-200">
                {detail.typeName}
              </span>
              <span className="rounded-md border border-cyan-300/80 bg-cyan-100 px-2 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-500/40 dark:bg-cyan-900/30 dark:text-cyan-200">
                {detail.statusName}
              </span>
              <span className="rounded-md border border-indigo-300/80 bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-900/30 dark:text-indigo-200">
                {detail.specialtyName}
              </span>
              <StatusBadgeComponent enabled={detail.active} />
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 p-2 dark:border-white/10">
        <DetailSectionDropdownComponent
          value={activeTab}
          label="Seccion"
          options={tabSelectOptions}
          onValueChange={(value) => onTabChange(value as ProjectDetailTabKey)}
        />
      </article>

      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        {renderTabContent()}
      </article>
    </section>
  )
}
