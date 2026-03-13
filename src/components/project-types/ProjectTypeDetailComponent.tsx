import DetailStateWrapperComponent from '@/components/ui/detail/DetailStateWrapperComponent'
import StatusBadgeComponent from '@/components/ui/status/StatusBadgeComponent'
import type { ProjectTypeDetailView } from '@/types'

interface ProjectTypeDetailComponentProps {
  detail: ProjectTypeDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
}

export default function ProjectTypeDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
}: ProjectTypeDetailComponentProps) {
  return (
    <DetailStateWrapperComponent
      loading={loading}
      errorMessage={errorMessage}
      hasData={detail != null}
      loadingText="Cargando detalle del tipo de proyecto..."
      emptyText="Selecciona un tipo para ver su detalle."
      onRetry={onRetry}
    >
      {detail && <ProjectTypeDetailContent detail={detail} />}
    </DetailStateWrapperComponent>
  )
}

function ProjectTypeDetailContent({ detail }: { detail: ProjectTypeDetailView }) {
  return (
    <section className="space-y-5">
      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Informacion general
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <p className="text-sm">
            <span className="font-semibold">Nombre:</span> {detail.nameDisplay}
          </p>
          <div className="text-sm">
            <span className="font-semibold">Estado:</span>{' '}
            <StatusBadgeComponent enabled={detail.active} />
          </div>
          <p className="text-sm md:col-span-2">
            <span className="font-semibold">Descripcion:</span> {detail.descriptionDisplay}
          </p>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Fechas
        </h3>
        <div className="grid gap-3">
          <p className="text-sm">
            <span className="font-semibold">Creado:</span> {detail.createdAtDisplay}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Actualizado:</span> {detail.updatedAtDisplay}
          </p>
        </div>
      </article>
    </section>
  )
}
