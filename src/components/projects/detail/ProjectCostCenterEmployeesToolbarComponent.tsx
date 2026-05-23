import { ButtonComponent, InputComponent } from '@/components'
import { useStoreProjects } from '@/store'

interface ProjectCostCenterEmployeesToolbarComponentProps {
  costCenter: number | null
  onOpenFilters: () => void
}

export function ProjectCostCenterEmployeesToolbarComponent({ costCenter, onOpenFilters }: ProjectCostCenterEmployeesToolbarComponentProps) {
  const search = useStoreProjects((s) => s.costCenterEmployeesQueryParams.search)
  const loading = useStoreProjects((s) => s.loadingCostCenterEmployees)
  const setSearch = useStoreProjects((s) => s.setCostCenterEmployeesSearch)
  const searchCostCenterEmployees = useStoreProjects((s) => s.searchCostCenterEmployees)
  const validCostCenter = Number.isInteger(costCenter) && costCenter !== null && costCenter > 0

  return (
    <form
      className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
      onSubmit={(event) => {
        event.preventDefault()
        if (validCostCenter) void searchCostCenterEmployees(costCenter)
      }}
    >
      <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
        <ButtonComponent type="button" variant="outline" disabled={loading} label="Filtro" onClick={onOpenFilters} />
        <div className="min-w-0 flex-1">
          <InputComponent
            value={search}
            type="text"
            placeholder="Buscar por trabajador, identificación o email"
            onValueChange={setSearch}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
        <ButtonComponent
          type="submit"
          variant="primary"
          disabled={loading || !validCostCenter}
          className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
          label={loading ? 'Buscando...' : 'Buscar'}
        />
      </div>
    </form>
  )
}
