import type { RoleRaw } from '@/types'
import messages from '@/messages/messages'
import { formatDate } from '@/utils'

interface RoleDetailComponentProps {
  detail: RoleRaw | null
}

export default function RoleDetailComponent({ detail }: RoleDetailComponentProps) {
  if (!detail) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">Selecciona un rol para ver su detalle.</p>
  }

  const noData = messages.roles.ui.noData
  const noDate = messages.roles.ui.noDate

  return (
    <section className="space-y-5">
      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          {messages.roles.ui.actionViewDetail}
        </h3>
        <div className="grid gap-3">
          <p className="text-sm"><span className="font-semibold">Rol:</span> {detail.name || noData}</p>
          <p className="text-sm"><span className="font-semibold">{messages.roles.ui.detailDescriptionLabel}:</span> {detail.description || noData}</p>
          <p className="text-sm"><span className="font-semibold">{messages.roles.ui.detailStatusLabel}:</span> {detail.enabled ? messages.roles.ui.statusEnabled : messages.roles.ui.statusDisabled}</p>
          <p className="text-sm"><span className="font-semibold">{messages.roles.ui.detailCreatedAtLabel}:</span> {formatDate(detail.createdAt, noDate)}</p>
          <p className="text-sm"><span className="font-semibold">{messages.roles.ui.detailUpdatedAtLabel}:</span> {formatDate(detail.updatedAt, noDate)}</p>
        </div>
      </article>
    </section>
  )
}
