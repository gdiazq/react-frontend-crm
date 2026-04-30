import { DetailBadgeComponent } from '@/components/ui/detail/DetailBadgeComponent'
import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailHeroComponent } from '@/components/ui/detail/DetailHeroComponent'
import { DetailSectionHeaderComponent } from '@/components/ui/detail/DetailSectionHeaderComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import { IconEdit } from '@/components/ui/icons/IconEdit'
import type { TerminationQuizQuestionDetailView } from '@/types'

interface TerminationQuizQuestionDetailComponentProps {
  detail: TerminationQuizQuestionDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
  onEdit?: () => void
}

export function TerminationQuizQuestionDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
  onEdit,
}: TerminationQuizQuestionDetailComponentProps) {
  return (
    <DetailStateWrapperComponent
      loading={loading}
      errorMessage={errorMessage}
      hasData={detail !== null}
      loadingText="Cargando detalle de pregunta del quiz de salida..."
      emptyText="Selecciona un registro para ver su detalle."
      onRetry={onRetry}
    >
      {detail && <TerminationQuizQuestionDetailContent detail={detail} onEdit={onEdit} />}
    </DetailStateWrapperComponent>
  )
}

function TerminationQuizQuestionDetailContent({
  detail,
  onEdit,
}: {
  detail: TerminationQuizQuestionDetailView
  onEdit?: () => void
}) {
  const statusLabel = detail.active ? 'Activa' : 'Inactiva'
  const statusTone = detail.active ? 'ok' : 'bad'
  const requiredLabel = detail.required ? 'Requerida' : 'Opcional'
  const description = (
    <>
      Pregunta del quiz de salida para flujos de <span className="num">RRHH</span>.
    </>
  )

  return (
    <section className="space-y-10">
      <DetailHeroComponent
        displayName={detail.questionDisplay}
        description={description}
        badges={(
          <>
            <DetailBadgeComponent tone={statusTone} dot>
              {statusLabel}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone={detail.required ? 'warn' : 'neutral'} dot>
              {requiredLabel}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone="accent" dot>
              Quiz de salida
            </DetailBadgeComponent>
          </>
        )}
        actions={<HeroActionButtons onEdit={onEdit} />}
      />

      <section>
        <DetailSectionHeaderComponent number="01" title="Resumen" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent
            title="Pregunta"
            value={detail.questionDisplay}
            className="md:col-start-1"
            valueClassName="max-w-full text-left leading-relaxed"
          />
          <DetailFieldCardComponent title="Grupo" value={detail.questionGroupDisplay} className="md:col-start-1" />
          {detail.employeeDisplay !== '-' && (
            <DetailFieldCardComponent title="Empleado" value={detail.employeeDisplay} className="md:col-start-1" />
          )}
          <DetailFieldCardComponent title="Estado" value={statusLabel} className="md:col-start-2 md:row-start-1" />
          <DetailFieldCardComponent title="Requerida" value={detail.required ? 'Sí' : 'No'} className="md:col-start-2 md:row-start-2" />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="02" title="Fechas" />
        <ol className="relative space-y-3 border-l border-slate-200 pl-5 dark:border-white/10">
          <li className="relative">
            <span className="accent-bg absolute -left-[22px] top-1.5 h-1.5 w-1.5 r-full ring-4 ring-white dark:ring-slate-900" />
            <div className="flex items-baseline gap-3">
              <span className="num w-[92px] shrink-0 text-[11px] text-slate-400">{detail.createdAtDisplay || '—'}</span>
              <p className="text-[13px] text-slate-700 dark:text-slate-200">Registro creado</p>
            </div>
          </li>
          <li className="relative">
            <span className="accent-bg absolute -left-[22px] top-1.5 h-1.5 w-1.5 r-full ring-4 ring-white dark:ring-slate-900" />
            <div className="flex items-baseline gap-3">
              <span className="num w-[92px] shrink-0 text-[11px] text-slate-400">{detail.updatedAtDisplay || '—'}</span>
              <p className="text-[13px] text-slate-700 dark:text-slate-200">Última actualización</p>
            </div>
          </li>
        </ol>
      </section>
    </section>
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
