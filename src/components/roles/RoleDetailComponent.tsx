import messages from '@/messages/messages'
import type { RoleDetailView } from '@/types'
import { DetailBadgeComponent } from '@/components/ui/detail/DetailBadgeComponent'
import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailHeroComponent } from '@/components/ui/detail/DetailHeroComponent'
import { DetailSectionHeaderComponent } from '@/components/ui/detail/DetailSectionHeaderComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import { IconEdit } from '@/components/ui/icons/IconEdit'

interface RoleDetailComponentProps {
  detail: RoleDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
  onEdit?: () => void
}

interface ParsedPermission {
  resource: string
  action: string
}

function parsePermissionName(permissionName: string): ParsedPermission {
  const [resourceRaw, actionRaw] = permissionName.split(':')
  const resource = resourceRaw?.trim() || 'GENERAL'
  const action = actionRaw?.trim() || 'ACCESS'
  return { resource, action }
}

export function RoleDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
  onEdit,
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
      {detail && <RoleDetailContent detail={detail} onEdit={onEdit} />}
    </DetailStateWrapperComponent>
  )
}

interface RoleDetailContentProps {
  detail: RoleDetailView
  onEdit?: () => void
}

function RoleDetailContent({ detail, onEdit }: RoleDetailContentProps) {
  const statusLabel = detail.enabled ? messages.roles.ui.statusEnabled : messages.roles.ui.statusDisabled
  const statusTone = detail.enabled ? 'ok' : 'bad'
  const permissionCount = detail.permissionsDisplay.length
  const description = detail.descriptionDisplay || 'Sin descripción registrada.'

  return (
    <section className="space-y-12">
      <DetailHeroComponent
        displayName={detail.roleNameDisplay}
        description={description}
        badges={
          <>
            <DetailBadgeComponent tone={statusTone} dot>
              {statusLabel}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone={permissionCount > 0 ? 'accent' : 'neutral'} dot>
              {permissionCount} permisos
            </DetailBadgeComponent>
          </>
        }
        stat={{
          label: 'Permisos',
          value: permissionCount,
          progress: permissionCount > 0 ? 100 : 0,
        }}
        actions={onEdit ? <HeroActionButton onEdit={onEdit} /> : undefined}
      />

      <section>
        <DetailSectionHeaderComponent number="01" title="Resumen" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Rol" value={detail.roleNameDisplay} />
          <DetailFieldCardComponent title={messages.roles.ui.detailStatusLabel} value={statusLabel} />
          <DetailFieldCardComponent
            title={messages.roles.ui.detailDescriptionLabel}
            value={detail.descriptionDisplay}
            className="md:col-span-2"
            valueClassName="text-left md:text-right"
          />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="02" title={messages.roles.ui.detailPermissionsLabel} />
        {detail.permissionsDisplay.length === 0 ? (
          <div className="r-lg border border-dashed border-slate-300 p-4 text-[12.5px] text-slate-600 dark:border-slate-700 dark:text-slate-300">
            {messages.roles.ui.detailNoPermissions}
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {detail.permissionsDisplay.map((permission) => {
              const parsedPermission = parsePermissionName(permission.name)

              return (
                <article
                  key={permission.id}
                  className="r-lg soft-ring border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="num min-w-0 break-all text-[12px] font-semibold accent-text">
                      {permission.name}
                    </p>
                    <div className="flex shrink-0 flex-wrap justify-end gap-1">
                      <DetailBadgeComponent tone="neutral">{parsedPermission.resource}</DetailBadgeComponent>
                      <DetailBadgeComponent tone="ok">{parsedPermission.action}</DetailBadgeComponent>
                    </div>
                  </div>
                  <p className="mt-3 r-md bg-slate-50 px-3 py-2 text-[12px] leading-relaxed text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
                    {messages.roles.ui.detailPermissionDescriptionLabel}: {permission.description || '—'}
                  </p>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section>
        <DetailSectionHeaderComponent number="03" title="Fechas" />
        <ol className="relative space-y-3 border-l border-slate-200 pl-5 dark:border-white/10">
          <TimelineItem label={messages.roles.ui.detailCreatedAtLabel} value={detail.createdAtDisplay} />
          <TimelineItem label={messages.roles.ui.detailUpdatedAtLabel} value={detail.updatedAtDisplay} />
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
