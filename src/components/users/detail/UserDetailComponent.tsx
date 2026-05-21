import { AvatarInitialsComponent } from '@/components/ui/avatar/AvatarInitialsComponent'
import { DetailBadgeComponent } from '@/components/ui/detail/DetailBadgeComponent'
import type { DetailBadgeTone } from '@/components/ui/detail/DetailBadgeComponent'
import { DetailFieldCardComponent } from '@/components/ui/detail/DetailFieldCardComponent'
import { DetailHeroComponent } from '@/components/ui/detail/DetailHeroComponent'
import { DetailSectionHeaderComponent } from '@/components/ui/detail/DetailSectionHeaderComponent'
import { DetailStateWrapperComponent } from '@/components/ui/detail/DetailStateWrapperComponent'
import { IconEdit } from '@/components/ui/icons/IconEdit'
import type { UserDetailView } from '@/types'

interface UserDetailComponentProps {
  detail: UserDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
  onEdit?: () => void
}

export function UserDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
  onEdit,
}: UserDetailComponentProps) {
  return (
    <DetailStateWrapperComponent
      loading={loading}
      errorMessage={errorMessage}
      hasData={detail !== null}
      loadingText="Cargando detalle del usuario..."
      emptyText="Selecciona un usuario para ver su detalle."
      onRetry={onRetry}
    >
      {detail && <UserDetailContent detail={detail} onEdit={onEdit} />}
    </DetailStateWrapperComponent>
  )
}

interface UserDetailContentProps {
  detail: UserDetailView
  onEdit?: () => void
}

function UserDetailContent({ detail, onEdit }: UserDetailContentProps) {
  const statusTone = resolveBooleanTone(detail.statusLabel)
  const verifiedTone = resolveBooleanTone(detail.emailVerifiedLabel)
  const accountLocked = isNegativeLabel(detail.accountNonLockedLabel)
  const roleCount = detail.roleNamesDisplay.length
  const description = (
    <>
      Perfil de acceso para <span className="num">{detail.emailDisplay || '—'}</span>.
    </>
  )

  return (
    <section className="space-y-12">
      <DetailHeroComponent
        displayName={detail.fullName || detail.usernameDisplay}
        description={description}
        badges={
          <>
            <DetailBadgeComponent tone={statusTone} dot>
              {detail.statusLabel || 'Sin estado'}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone={verifiedTone} dot>
              {detail.emailVerifiedLabel || 'Correo sin estado'}
            </DetailBadgeComponent>
            <DetailBadgeComponent tone={accountLocked ? 'bad' : 'ok'} dot>
              {accountLocked ? 'Cuenta bloqueada' : 'Cuenta operativa'}
            </DetailBadgeComponent>
          </>
        }
        stat={{
          label: 'Roles',
          value: roleCount,
          progress: roleCount > 0 ? 100 : 0,
        }}
        actions={onEdit ? <HeroActionButton onEdit={onEdit} /> : undefined}
      />

      <section>
        <DetailSectionHeaderComponent number="01" title="Perfil" />
        <div className="r-lg mb-5 flex items-center gap-4 border border-slate-200 p-4 dark:border-white/10">
          <AvatarInitialsComponent
            fullName={detail.fullName}
            avatarUrl={detail.avatarUrl}
            fallbackInitials={detail.initials || 'US'}
            alt="Avatar del usuario"
            className="accent-bg-soft accent-text h-14 w-14 text-[14px] font-bold"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-slate-900 dark:text-slate-50">{detail.fullName || '—'}</p>
            <p className="truncate text-[12.5px] text-slate-500 dark:text-slate-400">{detail.usernameDisplay}</p>
          </div>

          <DetailBadgeComponent tone={statusTone} dot>
            {detail.statusLabel || 'Sin estado'}
          </DetailBadgeComponent>
        </div>

        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Usuario" value={detail.usernameDisplay} />
          <DetailFieldCardComponent title="Nombre completo" value={detail.fullName} />
          <DetailFieldCardComponent title="Correo" value={detail.emailDisplay} valueClassName="break-all" />
          <DetailFieldCardComponent title="Teléfono" value={detail.phoneNumberDisplay} mono />
          <DetailFieldCardComponent title="Correo verificado" value={detail.emailVerifiedLabel} />
          <DetailFieldCardComponent title="Estado" value={detail.statusLabel} />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="02" title="Estado de cuenta" />
        <div className="grid gap-x-10 md:grid-cols-2">
          <DetailFieldCardComponent title="Cuenta vigente" value={detail.accountNonExpiredLabel} />
          <DetailFieldCardComponent title="Cuenta desbloqueada" value={detail.accountNonLockedLabel} />
          <DetailFieldCardComponent title="Credenciales vigentes" value={detail.credentialsNonExpiredLabel} />
        </div>
      </section>

      <section>
        <DetailSectionHeaderComponent number="03" title="Roles" />
        {detail.roleNamesDisplay.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {detail.roleNamesDisplay.map((roleName, index) => (
              <DetailBadgeComponent key={`${roleName}-${index}`} tone="accent">
                {roleName}
              </DetailBadgeComponent>
            ))}
          </div>
        ) : (
          <p className="text-[12.5px] text-slate-500 dark:text-slate-400">Sin roles asignados.</p>
        )}
      </section>

      <section>
        <DetailSectionHeaderComponent number="04" title="Fechas" />
        <ol className="relative space-y-3 border-l border-slate-200 pl-5 dark:border-white/10">
          <TimelineItem label="Creado" value={detail.createdAtDisplay} />
          <TimelineItem label="Última actualización" value={detail.updatedAtDisplay} />
          <TimelineItem label="Último acceso" value={detail.lastLoginDisplay} />
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
        <span className="num w-[136px] shrink-0 text-[11px] text-slate-400">{value || '—'}</span>
        <p className="text-[13px] text-slate-700 dark:text-slate-200">{label}</p>
      </div>
    </li>
  )
}

function resolveBooleanTone(label: string): DetailBadgeTone {
  return isNegativeLabel(label) ? 'bad' : 'ok'
}

function isNegativeLabel(label: string) {
  const normalized = label.trim().toLowerCase()
  return (
    normalized === ''
    || normalized.includes('no')
    || normalized.includes('deshabilitado')
    || normalized.includes('bloquead')
    || normalized.includes('expirad')
  )
}
