import { DetailBadgeComponent } from '@/components/ui/detail/DetailBadgeComponent'
import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailHeroComponent, type DetailHeroStat } from '@/components/ui/detail/DetailHeroComponent'
import { DetailSectionHeaderComponent } from '@/components/ui/detail/DetailSectionHeaderComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import { IconEdit } from '@/components/ui/icons/IconEdit'
import type { OvertimeDetailView } from '@/types'
import { resolveApprovalTone } from '@/utils'

interface OvertimeDetailComponentProps {
  detail: OvertimeDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
  onEdit?: () => void
}

export function OvertimeDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
  onEdit,
}: OvertimeDetailComponentProps) {
  return (
    <DetailStateWrapperComponent
      loading={loading}
      errorMessage={errorMessage}
      hasData={detail !== null}
      loadingText="Cargando detalle de hora extra..."
      emptyText="Selecciona una hora extra para ver su detalle."
      onRetry={onRetry}
    >
      {detail && <OvertimeDetailContent detail={detail} onEdit={onEdit} />}
    </DetailStateWrapperComponent>
  )
}

interface OvertimeDetailContentProps {
  detail: OvertimeDetailView
  onEdit?: () => void
}

function OvertimeDetailContent({ detail, onEdit }: OvertimeDetailContentProps) {
  const statusTone = resolveApprovalTone(detail.statusName)
  const hoursValue = Number(detail.hoursDisplay.replace(',', '.')) || 0
  const hoursStat: DetailHeroStat = {
    label: 'Horas extra',
    value: detail.hoursDisplay,
    unit: 'hrs',
    progress: Math.min(100, hoursValue * 12),
  }
  const description = (
    <>
      Bloque <span className="num">{detail.overtimeTypeName || '—'}</span> de{' '}
      <span className="num">{detail.startTimeDisplay}</span> a <span className="num">{detail.endTimeDisplay}</span>.
    </>
  )

  return (
    <section className="space-y-12">
      <DetailHeroComponent
        displayName={detail.employeeName || 'Sin trabajador'}
        description={description}
        badges={
          <>
            <DetailBadgeComponent tone={statusTone} dot>
              {detail.statusName || 'Sin estado'}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone="accent" dot>
              {detail.overtimeTypeName || 'Sin tipo'}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone={detail.attendanceDisplay === 'Vinculada' ? 'ok' : 'neutral'} dot>
              {detail.attendanceDisplay}
            </DetailBadgeComponent>
          </>
        }
        stat={hoursStat}
        actions={onEdit ? <HeroActionButton onEdit={onEdit} /> : undefined}
      />

      <section>
        <DetailSectionHeaderComponent number="01" title="Bloque horario" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Fecha" value={detail.dateDisplay} mono />
          <DetailFieldCardComponent title="Estado" value={detail.statusName} />
          <DetailFieldCardComponent title="Inicio" value={detail.startTimeDisplay} mono />
          <DetailFieldCardComponent title="Término" value={detail.endTimeDisplay} mono />
          <DetailFieldCardComponent title="Horas" value={detail.hoursDisplay} mono />
          <DetailFieldCardComponent title="Asistencia" value={detail.attendanceDisplay} />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="02" title="Tipo" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Tipo hora extra" value={detail.overtimeTypeName} />
          <DetailFieldCardComponent title="Recargo" value={detail.surchargePercentDisplay} mono />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="03" title="Trabajador y proyecto" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Trabajador" value={detail.employeeName} />
          <DetailFieldCardComponent title="Proyecto" value={detail.projectName} />
          <DetailFieldCardComponent title="Centro de costo" value={detail.costCenterDisplay} mono />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="04" title="Motivo" />
        <p className="whitespace-pre-line text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
          {detail.reasonText || 'Sin motivo registrado.'}
        </p>
      </section>

      <section>
        <DetailSectionHeaderComponent number="05" title="Fechas" />
        <ol className="relative space-y-3 border-l border-slate-200 pl-5 dark:border-white/10">
          <TimelineItem label="Registro creado" value={detail.createdAtDisplay} />
          <TimelineItem label="Última actualización" value={detail.updatedAtDisplay} />
        </ol>
      </section>
    </section>
  )
}

function HeroActionButton({ onEdit }: { onEdit: () => void }) {
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

function TimelineItem({ label, value }: { label: string, value: string }) {
  return (
    <li className="relative">
      <span className="accent-bg absolute -left-[22px] top-1.5 h-1.5 w-1.5 r-full ring-4 ring-white dark:ring-slate-900" />
      <div className="flex items-baseline gap-3">
        <span className="num w-[92px] shrink-0 text-[11px] text-slate-400">{value || '—'}</span>
        <p className="text-[13px] text-slate-700 dark:text-slate-200">{label}</p>
      </div>
    </li>
  )
}
