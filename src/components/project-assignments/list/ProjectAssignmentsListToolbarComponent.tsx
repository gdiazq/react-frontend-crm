import { ButtonComponent, InputComponent } from '@/components'
import { useStoreProjectAssignments } from '@/store'

interface ProjectAssignmentsListToolbarComponentProps {
  onOpenFilters: () => void
}

export function ProjectAssignmentsListToolbarComponent({ onOpenFilters }: ProjectAssignmentsListToolbarComponentProps) {
  // Store state used to render toolbar controls.
  const search = useStoreProjectAssignments((s) => s.queryParams.search)
  const loading = useStoreProjectAssignments((s) => s.operationLoading.list)

  // Store actions triggered by toolbar interactions.
  const setSearch = useStoreProjectAssignments((s) => s.setSearch)
  const searchProjectAssignments = useStoreProjectAssignments((s) => s.searchProjectAssignments)

  return (
    <form
      className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
      onSubmit={(event) => { event.preventDefault(); void searchProjectAssignments() }}
    >
      <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
        <ButtonComponent type="button" variant="outline" disabled={loading} label="Filtro" onClick={onOpenFilters} />
        <div className="min-w-0 flex-1">
          <InputComponent value={search} type="text" placeholder="Buscar por trabajador, identificación, proyecto o rol" onValueChange={setSearch} />
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
      </div>
    </form>
  )
}
