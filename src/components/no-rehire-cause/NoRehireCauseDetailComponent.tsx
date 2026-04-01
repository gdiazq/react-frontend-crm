import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import { StatusBadgeComponent } from '@/components/ui/status/StatusBadgeComponent'
import type { NoRehireCauseDetailView } from '@/types'

interface NoRehireCauseDetailComponentProps {
  detail: NoRehireCauseDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
}

export function NoRehireCauseDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
}: NoRehireCauseDetailComponentProps) {
  return (
    <DetailStateWrapperComponent
      loading={loading}
      errorMessage={errorMessage}
      hasData={detail !== null}
      loadingText="Cargando detalle de causa de no recontratacion..."
      emptyText="Selecciona un registro para ver su detalle."
      onRetry={onRetry}
    >
      {detail && <NoRehireCauseDetailContent detail={detail} />}
    </DetailStateWrapperComponent>
  )
}

function NoRehireCauseDetailContent({
  detail,
}: {
  detail: NoRehireCauseDetailView
}) {
  return (
    <section className="space-y-5">
      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Informacion general
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <DetailFieldCardComponent title="Nombre" value={detail.nameDisplay} />
          <DetailFieldCardComponent title="Estado" value={<StatusBadgeComponent enabled={detail.active} />} />
          <DetailFieldCardComponent title="Descripcion" value={detail.descriptionDisplay} className="md:col-span-2" />
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
