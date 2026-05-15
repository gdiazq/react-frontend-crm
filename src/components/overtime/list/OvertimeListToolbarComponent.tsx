import { useNavigate } from 'react-router-dom'
import { ButtonComponent, InputComponent } from '@/components'
import { AUTH_ROUTE_OVERTIME_CREATE, PermissionAction, PermissionModule } from '@/constant'
import { useStoreAuth, useStoreOvertime } from '@/store'

interface OvertimeListToolbarComponentProps {
  onOpenFilters: () => void
}

export function OvertimeListToolbarComponent({ onOpenFilters }: OvertimeListToolbarComponentProps) {
  const navigate = useNavigate()
  const search = useStoreOvertime((s) => s.queryParams.search)
  const loading = useStoreOvertime((s) => s.operationLoading.list)
  const setSearch = useStoreOvertime((s) => s.setSearch)
  const searchOvertime = useStoreOvertime((s) => s.searchOvertime)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canCreate = hasPermission(PermissionModule.Overtime, PermissionAction.Create)

  return (
    <form
      className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
      onSubmit={(event) => { event.preventDefault(); void searchOvertime() }}
    >
      <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
        <ButtonComponent type="button" variant="outline" disabled={loading} label="Filtro" onClick={onOpenFilters} />
        <div className="min-w-0 flex-1">
          <InputComponent
            value={search}
            type="text"
            placeholder="Buscar por trabajador, proyecto, tipo o motivo"
            onValueChange={setSearch}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
        <ButtonComponent
          type="submit"
          variant="primary"
          disabled={loading}
          className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
          label={loading ? 'Buscando...' : 'Buscar'}
        />
        {canCreate && (
          <ButtonComponent
            type="button"
            variant="success"
            disabled={loading}
            className="flex-1 md:flex-none"
            label="Nueva hora extra"
            onClick={() => navigate(AUTH_ROUTE_OVERTIME_CREATE)}
          />
        )}
      </div>
    </form>
  )
}
