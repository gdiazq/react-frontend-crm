import { useNavigate } from 'react-router-dom'
import { ButtonComponent } from '@/components'
import { AUTH_ROUTE_DASHBOARD, AUTH_ROUTE_HOME, AUTH_ROUTE_LOGOUT } from '@/constant'

export default function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">Error 403</p>
        <h1 className="mt-2 text-2xl font-bold">Acceso no autorizado</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          No tienes permisos para ver este modulo. Si crees que es un error, solicita acceso a un administrador.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-wrap gap-2">
          <ButtonComponent
            type="button"
            variant="primary"
            label="Ir al dashboard"
            onClick={() => navigate(AUTH_ROUTE_DASHBOARD)}
          />
          <ButtonComponent
            type="button"
            variant="outline"
            label="Ir al inicio"
            onClick={() => navigate(AUTH_ROUTE_HOME)}
          />
          <ButtonComponent
            type="button"
            variant="danger"
            label="Cerrar sesion"
            onClick={() => navigate(AUTH_ROUTE_LOGOUT)}
          />
        </div>
      </section>
    </section>
  )
}
