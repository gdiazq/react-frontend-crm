import { DetailBadgeComponent } from '@/components/ui/detail/DetailBadgeComponent'
import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailHeroComponent, type DetailHeroStat } from '@/components/ui/detail/DetailHeroComponent'
import { DetailSectionHeaderComponent } from '@/components/ui/detail/DetailSectionHeaderComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import type { ProjectAssignmentDetailView } from '@/types'

interface ProjectAssignmentCostCenterDetailComponentProps {
  items: ProjectAssignmentDetailView[]
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
}

export function ProjectAssignmentCostCenterDetailComponent({
  items,
  loading,
  errorMessage,
  onRetry,
}: ProjectAssignmentCostCenterDetailComponentProps) {
  return (
    <DetailStateWrapperComponent
      loading={loading}
      errorMessage={errorMessage}
      hasData={items.length > 0}
      loadingText="Cargando histórico del centro de costo..."
      emptyText="Selecciona un proyecto para ver su histórico."
      onRetry={onRetry}
    >
      {items.length > 0 && <ProjectAssignmentCostCenterDetailContent items={items} />}
    </DetailStateWrapperComponent>
  )
}

function ProjectAssignmentCostCenterDetailContent({ items }: { items: ProjectAssignmentDetailView[] }) {
  const currentAssignment = items.find((item) => item.active) ?? items[0]
  const activeAssignments = items.filter((item) => item.active).length
  const assignmentStat: DetailHeroStat = {
    label: 'Trabajadores',
    value: activeAssignments,
    unit: activeAssignments === 1 ? 'activo' : 'activos',
    progress: Math.min(100, Math.max(20, activeAssignments * 20)),
  }
  const description = (
    <>
      Historial activo del centro de costo <span className="num">{currentAssignment.costCenterDisplay || '—'}</span>.
    </>
  )

  return (
    <section className="space-y-12">
      <DetailHeroComponent
        eyebrowLabel="Centro de costo"
        eyebrowId={currentAssignment.costCenterDisplay}
        displayName={currentAssignment.projectName || 'Sin proyecto'}
        description={description}
        badges={
          <>
            <DetailBadgeComponent tone="accent" dot>
              CC {currentAssignment.costCenterDisplay}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone={activeAssignments > 0 ? 'ok' : 'neutral'} dot>
              {activeAssignments > 0 ? `${activeAssignments} activos` : 'Sin trabajadores activos'}
            </DetailBadgeComponent>
          </>
        }
        stat={assignmentStat}
      />

      <section>
        <DetailSectionHeaderComponent number="01" title="Proyecto" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Proyecto" value={currentAssignment.projectName} />
          <DetailFieldCardComponent title="Centro de costo" value={currentAssignment.costCenterDisplay} mono />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="02" title="Trabajadores activos" />
        <AssignmentList items={items} />
      </section>
    </section>
  )
}

function AssignmentList({ items }: { items: ProjectAssignmentDetailView[] }) {
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
                  {item.employeeName}
                </p>
                <DetailBadgeComponent tone={item.active ? 'ok' : 'neutral'} dot>
                  {item.statusDisplay}
                </DetailBadgeComponent>
              </div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                {item.employeeIdentification} · {item.roleOnProjectDisplay} · {item.allocationPercentDisplay}
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
