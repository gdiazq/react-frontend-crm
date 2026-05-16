import { DetailBadgeComponent } from '@/components/ui/detail/DetailBadgeComponent'
import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailHeroComponent, type DetailHeroStat } from '@/components/ui/detail/DetailHeroComponent'
import { DetailSectionHeaderComponent } from '@/components/ui/detail/DetailSectionHeaderComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import type { ProjectAssignmentDetailView } from '@/types'

interface ProjectAssignmentEmployeeDetailComponentProps {
  items: ProjectAssignmentDetailView[]
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
}

export function ProjectAssignmentEmployeeDetailComponent({
  items,
  loading,
  errorMessage,
  onRetry,
}: ProjectAssignmentEmployeeDetailComponentProps) {
  return (
    <DetailStateWrapperComponent
      loading={loading}
      errorMessage={errorMessage}
      hasData={items.length > 0}
      loadingText="Cargando histórico del trabajador..."
      emptyText="Selecciona un trabajador para ver su histórico."
      onRetry={onRetry}
    >
      {items.length > 0 && <ProjectAssignmentEmployeeDetailContent items={items} />}
    </DetailStateWrapperComponent>
  )
}

function ProjectAssignmentEmployeeDetailContent({ items }: { items: ProjectAssignmentDetailView[] }) {
  const currentAssignment = items.find((item) => item.active) ?? items[0]
  const activeAssignments = items.filter((item) => item.active).length
  const assignmentStat: DetailHeroStat = {
    label: 'Asignaciones',
    value: items.length,
    unit: items.length === 1 ? 'registro' : 'registros',
    progress: Math.min(100, Math.max(20, activeAssignments * 35)),
  }
  const description = (
    <>
      Historial de centros de costo para <span className="num">{currentAssignment.employeeName || '—'}</span>.
    </>
  )

  return (
    <section className="space-y-12">
      <DetailHeroComponent
        eyebrowLabel="Trabajador"
        eyebrowId={currentAssignment.employeeIdentification}
        displayName={currentAssignment.employeeName || 'Sin trabajador'}
        description={description}
        badges={
          <>
            <DetailBadgeComponent tone={activeAssignments > 0 ? 'ok' : 'neutral'} dot>
              {activeAssignments > 0 ? `${activeAssignments} activo` : 'Sin asignación activa'}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone="accent" dot>
              {currentAssignment.projectName || 'Sin proyecto'}
            </DetailBadgeComponent>
          </>
        }
        stat={assignmentStat}
      />

      <section>
        <DetailSectionHeaderComponent number="01" title="Trabajador" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Nombre" value={currentAssignment.employeeName} />
          <DetailFieldCardComponent title="Identificación" value={currentAssignment.employeeIdentification} mono />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="02" title="Histórico de centros" />
        <AssignmentTimeline items={items} />
      </section>
    </section>
  )
}

function AssignmentTimeline({ items }: { items: ProjectAssignmentDetailView[] }) {
  return (
    <ol className="relative space-y-4 border-l border-slate-200 pl-5 dark:border-white/10">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span className="accent-bg absolute -left-[22px] top-1.5 h-1.5 w-1.5 r-full ring-4 ring-white dark:ring-slate-900" />
          <div className="grid gap-2 md:grid-cols-[120px_minmax(0,1fr)]">
            <span className="num text-[11px] text-slate-400">{item.startDateDisplay}</span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                  {item.projectName}
                </p>
                <DetailBadgeComponent tone={item.active ? 'ok' : 'neutral'} dot>
                  {item.statusDisplay}
                </DetailBadgeComponent>
              </div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                CC <span className="num">{item.costCenterDisplay}</span> · {item.roleOnProjectDisplay} · {item.allocationPercentDisplay}
              </p>
              <p className="num mt-1 text-[11px] text-slate-400">
                {item.startDateDisplay} - {item.endDateDisplay}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
