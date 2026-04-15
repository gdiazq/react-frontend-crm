import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import { StatusBadgeComponent } from '@/components/ui/status/StatusBadgeComponent'
import type { TerminationQuizQuestionDetailView } from '@/types'

interface TerminationQuizQuestionDetailComponentProps {
  detail: TerminationQuizQuestionDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
}

export function TerminationQuizQuestionDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
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
      {detail && <TerminationQuizQuestionDetailContent detail={detail} />}
    </DetailStateWrapperComponent>
  )
}

function TerminationQuizQuestionDetailContent({
  detail,
}: {
  detail: TerminationQuizQuestionDetailView
}) {
  return (
    <section className="space-y-5">
      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Informacion general
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Pregunta" value={detail.questionDisplay} className="md:col-span-2" />
          <DetailFieldCardComponent title="Grupo" value={detail.questionGroupDisplay} />
          <DetailFieldCardComponent title="Estado" value={<StatusBadgeComponent enabled={detail.active} />} />
          <DetailFieldCardComponent title="Requerida" value={detail.required ? 'Sí' : 'No'} />
          {detail.employeeIdDisplay !== '-' && (
            <DetailFieldCardComponent title="ID Empleado" value={detail.employeeIdDisplay} />
          )}
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Fechas
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Creado" value={detail.createdAtDisplay} />
          <DetailFieldCardComponent title="Actualizado" value={detail.updatedAtDisplay} />
        </div>
      </article>
    </section>
  )
}
