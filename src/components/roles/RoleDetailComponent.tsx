import messages from '@/messages/messages'
import type { RoleDetailView } from '@/types'
import StatusBadgeComponent from '@/components/ui/status/StatusBadgeComponent'
import DetailStateWrapperComponent from '@/components/ui/detail/DetailStateWrapperComponent'

interface RoleDetailComponentProps {
  detail: RoleDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
}

function parsePermissionName(permissionName: string) {
  const [resourceRaw, actionRaw] = permissionName.split(':')
  const resource = resourceRaw?.trim() ?? 'GENERAL'
  const action = actionRaw?.trim() ?? 'ACCESS'
  return { resource, action }
}

export default function RoleDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
}: RoleDetailComponentProps) {
  return (
    <DetailStateWrapperComponent
      loading={loading}
      errorMessage={errorMessage}
      hasData={detail !== null}
      loadingText="Cargando detalle del rol..."
      emptyText="Selecciona un rol para ver su detalle."
      onRetry={onRetry}
    >
      {detail && <RoleDetailContent detail={detail} />}
    </DetailStateWrapperComponent>
  )
}

function RoleDetailContent({ detail }: { detail: RoleDetailView }) {
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
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            {messages.roles.ui.detailPermissionsLabel}
          </h3>
          <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-200">
            {detail.permissionsDisplay.length}
          </span>
        </div>
        {detail.permissionsDisplay.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
            {messages.roles.ui.detailNoPermissions}
          </div>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {detail.permissionsDisplay.map((permission) => (
              <article
                key={permission.id}
                className="rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-3 shadow-sm dark:border-white/10 dark:from-slate-900/40 dark:to-slate-900/70"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-300">{permission.name}</p>
                  <div className="flex items-center gap-1">
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                      {parsePermissionName(permission.name).resource}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {parsePermissionName(permission.name).action}
                    </span>
                  </div>
                </div>
                <p className="mt-2 rounded-md bg-slate-100/80 px-2 py-1.5 text-xs text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
                  {messages.roles.ui.detailPermissionDescriptionLabel}: {permission.description}
                </p>
              </article>
            ))}
          </div>
        )}
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
