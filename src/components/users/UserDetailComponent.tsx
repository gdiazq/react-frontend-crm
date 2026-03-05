import ButtonComponent from '@/components/ui/button/ButtonComponent'
import AvatarInitialsComponent from '@/components/ui/avatar/AvatarInitialsComponent'
import type { UserDetailView } from '@/types'

interface UserDetailComponentProps {
  detail: UserDetailView | null
  loading: boolean
  errorMessage: string | null
  onRetry?: () => void
}

export default function UserDetailComponent({
  detail,
  loading,
  errorMessage,
  onRetry,
}: UserDetailComponentProps) {
  if (loading) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">Cargando detalle del usuario...</p>
  }

  if (errorMessage) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-rose-600 dark:text-rose-300">{errorMessage}</p>
        {onRetry && (
          <ButtonComponent
            type="button"
            variant="outline"
            label="Reintentar"
            onClick={onRetry}
          />
        )}
      </div>
    )
  }

  if (!detail) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">Selecciona un usuario para ver su detalle.</p>
  }

  return (
    <section className="space-y-5">
      <article className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <AvatarInitialsComponent
          fullName={detail.fullName}
          avatarUrl={detail.avatarUrl}
          fallbackInitials={detail.initials}
          alt="Avatar del usuario"
        />

        <div className="min-w-0">
          <p className="truncate text-base font-semibold">{detail.fullName}</p>
          <p className="truncate text-sm text-slate-600 dark:text-slate-300">{detail.usernameDisplay}</p>
          <p className="truncate text-sm text-slate-600 dark:text-slate-300">{detail.emailDisplay}</p>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Informacion general
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <p className="text-sm"><span className="font-semibold">Telefono:</span> {detail.phoneNumberDisplay}</p>
          <p className="text-sm"><span className="font-semibold">Correo verificado:</span> {detail.emailVerifiedLabel}</p>
          <p className="text-sm"><span className="font-semibold">Estado:</span> {detail.statusLabel}</p>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Estado de cuenta
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <p className="text-sm"><span className="font-semibold">Cuenta vigente:</span> {detail.accountNonExpiredLabel}</p>
          <p className="text-sm"><span className="font-semibold">Cuenta desbloqueada:</span> {detail.accountNonLockedLabel}</p>
          <p className="text-sm"><span className="font-semibold">Credenciales vigentes:</span> {detail.credentialsNonExpiredLabel}</p>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Roles</h3>
        <div className="flex flex-wrap gap-2">
          {detail.roleNamesDisplay.map((roleName, index) => (
            <span
              key={`${roleName}-${index}`}
              className="rounded-full border border-cyan-300 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-800 dark:border-cyan-400/40 dark:bg-cyan-900/20 dark:text-cyan-200"
            >
              {roleName}
            </span>
          ))}
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Fechas
        </h3>
        <div className="grid gap-3">
          <p className="text-sm"><span className="font-semibold">Creado:</span> {detail.createdAtDisplay}</p>
          <p className="text-sm"><span className="font-semibold">Actualizado:</span> {detail.updatedAtDisplay}</p>
          <p className="text-sm"><span className="font-semibold">Ultimo acceso:</span> {detail.lastLoginDisplay}</p>
        </div>
      </article>
    </section>
  )
}
