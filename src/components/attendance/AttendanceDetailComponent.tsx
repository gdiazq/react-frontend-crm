import { DetailBadgeComponent } from '@/components/ui/detail/DetailBadgeComponent'
import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailHeroComponent, type DetailHeroStat } from '@/components/ui/detail/DetailHeroComponent'
import { DetailSectionHeaderComponent } from '@/components/ui/detail/DetailSectionHeaderComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import { IconEdit } from '@/components/ui/icons/IconEdit'
import type { AttendanceDetailView } from '@/types'
import { resolveApprovalTone } from '@/utils'

interface AttendanceDetailComponentProps {
  detail: AttendanceDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
  onEdit?: () => void
}

export function AttendanceDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
  onEdit,
}: AttendanceDetailComponentProps) {
  return (
    <DetailStateWrapperComponent
      loading={loading}
      errorMessage={errorMessage}
      hasData={detail !== null}
      loadingText="Cargando detalle de asistencia..."
      emptyText="Selecciona un registro para ver su detalle."
      onRetry={onRetry}
    >
      {detail && <AttendanceDetailContent detail={detail} onEdit={onEdit} />}
    </DetailStateWrapperComponent>
  )
}

interface AttendanceDetailContentProps {
  detail: AttendanceDetailView
  onEdit?: () => void
}

function AttendanceDetailContent({ detail, onEdit }: AttendanceDetailContentProps) {
  const statusTone = resolveAttendanceTone(detail.statusName || detail.statusCode)
  const hoursStat: DetailHeroStat = {
    label: 'Jornada',
    value: detail.totalHoursDisplay,
    unit: 'hrs',
    progress: Math.min(100, Number(detail.totalHoursDisplay.replace(',', '.')) * 10 || 0),
  }
  const description = (
    <>
      Registro de asistencia de <span className="num">{detail.employeeName || '—'}</span> para{' '}
      <span className="num">{detail.dateDisplay}</span>.
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
            <DetailBadgeComponent tone={detail.hasActiveLeaveDisplay === 'Sí' ? 'warn' : 'ok'} dot>
              {detail.hasActiveLeaveDisplay === 'Sí' ? 'Con permiso activo' : 'Sin permiso activo'}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone={detail.manuallyOverriddenDisplay === 'Sí' ? 'accent' : 'neutral'} dot>
              {detail.manuallyOverriddenDisplay === 'Sí' ? 'Ajuste manual' : 'Registro estándar'}
            </DetailBadgeComponent>
          </>
        }
        stat={hoursStat}
        actions={onEdit ? <HeroActionButton onEdit={onEdit} /> : undefined}
      />

      <section>
        <DetailSectionHeaderComponent number="01" title="Jornada" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Fecha" value={detail.dateDisplay} mono />
          <DetailFieldCardComponent title="Estado" value={detail.statusName} />
          <DetailFieldCardComponent title="Entrada" value={detail.checkInTimeDisplay} mono />
          <DetailFieldCardComponent title="Salida" value={detail.checkOutTimeDisplay} mono />
          <DetailFieldCardComponent title="Horas totales" value={detail.totalHoursDisplay} mono />
          <DetailFieldCardComponent title="Código estado" value={detail.statusCode} mono />
        </div>
        {detail.notesText && (
          <p className="mt-4 whitespace-pre-line text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
            {detail.notesText}
          </p>
        )}
      </section>

      <section>
        <DetailSectionHeaderComponent number="02" title="Trabajador" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Nombre" value={detail.employeeName} />
          <DetailFieldCardComponent title="Identificación" value={detail.employeeIdentification} mono />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="03" title="Proyecto" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Proyecto" value={detail.projectName} />
          <DetailFieldCardComponent title="Centro de costo" value={detail.costCenterDisplay} mono />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="04" title="Contexto" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Generado por permiso" value={detail.generatedByLeaveDisplay} />
          <DetailFieldCardComponent title="Permiso activo" value={detail.hasActiveLeaveDisplay} />
          <DetailFieldCardComponent title="Sobrescritura manual" value={detail.manuallyOverriddenDisplay} />
        </div>
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

function resolveAttendanceTone(statusName: string): 'ok' | 'warn' | 'bad' | 'accent' | 'neutral' {
  const normalized = statusName
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (normalized.includes('present') || normalized.includes('presente')) return 'ok'
  if (normalized.includes('late') || normalized.includes('atraso')) return 'warn'
  if (normalized.includes('absent') || normalized.includes('ausente')) return 'bad'
  if (normalized.includes('leave') || normalized.includes('permiso')) return 'accent'
  return resolveApprovalTone(statusName)
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
