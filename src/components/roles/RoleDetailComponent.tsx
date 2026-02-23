import messages from '@/messages/messages'
import type { RoleDetailView } from '@/types'
import StatusBadgeComponent from '@/components/ui/status/StatusBadgeComponent'

interface RoleDetailComponentProps {
  detail: RoleDetailView | null
}

export default function RoleDetailComponent({ detail }: RoleDetailComponentProps) {
  if (!detail) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">Selecciona un rol para ver su detalle.</p>
  }

  return (
    <section className="space-y-5">
      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Informacion general
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <p className="text-sm">
            <span className="font-semibold">Rol:</span> {detail.roleNameDisplay}
          </p>
          <div className="text-sm">
            <span className="font-semibold">{messages.roles.ui.detailStatusLabel}:</span>{' '}
            <StatusBadgeComponent
              enabled={detail.enabled}
              activeLabel={messages.roles.ui.statusEnabled}
              inactiveLabel={messages.roles.ui.statusDisabled}
            />
          </div>
          <p className="text-sm md:col-span-2">
            <span className="font-semibold">{messages.roles.ui.detailDescriptionLabel}:</span> {detail.descriptionDisplay}
          </p>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Fechas
        </h3>
        <div className="grid gap-3">
          <p className="text-sm">
            <span className="font-semibold">{messages.roles.ui.detailCreatedAtLabel}:</span> {detail.createdAtDisplay}
          </p>
          <p className="text-sm">
            <span className="font-semibold">{messages.roles.ui.detailUpdatedAtLabel}:</span> {detail.updatedAtDisplay}
          </p>
        </div>
      </article>
    </section>
  )
}
