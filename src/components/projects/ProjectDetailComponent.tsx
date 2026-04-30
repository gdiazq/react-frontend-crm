import { DetailBadgeComponent } from '@/components/ui/detail/DetailBadgeComponent'
import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailHeroComponent } from '@/components/ui/detail/DetailHeroComponent'
import { DetailSectionHeaderComponent } from '@/components/ui/detail/DetailSectionHeaderComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import { IconEdit } from '@/components/ui/icons/IconEdit'
import type { ProjectDetailView } from '@/types'

interface ProjectDetailComponentProps {
  detail: ProjectDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
  onEdit?: () => void
}

export function ProjectDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
  onEdit,
}: ProjectDetailComponentProps) {
  return (
    <DetailStateWrapperComponent
      loading={loading}
      errorMessage={errorMessage}
      hasData={detail !== null}
      loadingText="Cargando detalle del proyecto..."
      emptyText="Selecciona un proyecto para ver su detalle."
      onRetry={onRetry}
    >
      {detail && <ProjectDetailContent detail={detail} onEdit={onEdit} />}
    </DetailStateWrapperComponent>
  )
}

function ProjectDetailContent({
  detail,
  onEdit,
}: {
  detail: ProjectDetailView
  onEdit?: () => void
}) {
  const activeLabel = detail.active ? 'Activo' : 'Inactivo'
  const activeTone = detail.active ? 'ok' : 'bad'
  const description = (
    <>
      Centro de costo <span className="num">{detail.costCenterDisplay || '—'}</span>, vigencia{' '}
      <span className="num">{detail.statusName || '—'}</span>.
    </>
  )

  return (
    <section className="space-y-12">
      <DetailHeroComponent
        eyebrowLabel="Proyecto"
        eyebrowId={detail.costCenterDisplay}
        displayName={detail.projectName}
        description={description}
        badges={(
          <>
            <DetailBadgeComponent tone={activeTone} dot>
              {activeLabel}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone="accent" dot>
              {detail.typeName || 'Sin tipo'}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone="neutral" dot>
              {detail.specialtyName || 'Sin especialidad'}
            </DetailBadgeComponent>
          </>
        )}
        actions={<HeroActionButtons onEdit={onEdit} />}
      />

      <section>
        <DetailSectionHeaderComponent number="01" title="Datos generales" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Centro costo" value={detail.costCenterDisplay} mono />
          <DetailFieldCardComponent title="Estado" value={activeLabel} />
          <DetailFieldCardComponent title="Tipo" value={detail.typeName} />
          <DetailFieldCardComponent title="Vigencia" value={detail.statusName} />
          <DetailFieldCardComponent title="Especialidad" value={detail.specialtyName} />
          <DetailFieldCardComponent title="Dirección" value={detail.addressDisplay} />
          <DetailFieldCardComponent
            title="Descripción"
            value={detail.descriptionDisplay}
            className="md:col-span-2"
            valueClassName="max-w-full text-left leading-relaxed"
          />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="02" title="Responsables" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Visitador" value={detail.visitorName} />
          <DetailFieldCardComponent title="Supervisor" value={detail.supervisorName} />
          <DetailFieldCardComponent
            title="Representantes"
            value={detail.companyRepresentativesDisplay}
            className="md:col-span-2"
            valueClassName="max-w-full text-left leading-relaxed"
          />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="03" title="Fechas" />
        <ol className="relative space-y-3 border-l border-slate-200 pl-5 dark:border-white/10">
          <TimelineItem date={detail.startDateDisplay} label="Inicio planificado" />
          <TimelineItem date={detail.realStartDateDisplay} label="Inicio real" />
          <TimelineItem date={detail.endDateDisplay} label="Fin planificado" />
          <TimelineItem date={detail.realEndDateDisplay} label="Fin real" />
          <TimelineItem date={detail.createdAtDisplay} label="Proyecto creado" />
          <TimelineItem date={detail.updatedAtDisplay} label="Última actualización" />
        </ol>
      </section>
    </section>
  )
}

function TimelineItem({ date, label }: { date: string, label: string }) {
  const dateOnly = date.split(/[,\s]/)[0] || '—'

  return (
    <li className="relative">
      <span className="accent-bg absolute -left-[22px] top-1.5 h-1.5 w-1.5 r-full ring-4 ring-white dark:ring-slate-900" />
      <div className="flex items-baseline gap-3">
        <span className="num w-[92px] shrink-0 text-[11px] text-slate-400">{dateOnly}</span>
        <p className="text-[13px] text-slate-700 dark:text-slate-200">{label}</p>
      </div>
    </li>
  )
}

function HeroActionButtons({ onEdit }: { onEdit?: () => void }) {
  if (!onEdit) return null

  return (
    <button
      type="button"
      onClick={onEdit}
      className="inline-flex h-9 items-center gap-1.5 r-md accent-bg px-3 text-[12.5px] font-medium text-white transition hover:opacity-90"
    >
      <IconEdit />
      Editar
    </button>
  )
}
