import { useNavigate } from 'react-router-dom'
import { ButtonComponent, InputComponent } from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION_CREATE } from '@/constant'
import { useStoreTerminationQuizQuestion } from '@/store'

interface TerminationQuizQuestionListToolbarComponentProps {
  onOpenFilters: () => void
  disabled?: boolean
}

export function TerminationQuizQuestionListToolbarComponent(props: TerminationQuizQuestionListToolbarComponentProps) {
  const { onOpenFilters, disabled = false } = props
  const navigate = useNavigate()
  const search = useStoreTerminationQuizQuestion((s) => s.queryParams.search)
  const loading = useStoreTerminationQuizQuestion((s) => s.operationLoading.list)
  const setSearch = useStoreTerminationQuizQuestion((s) => s.setSearch)
  const searchTerminationQuizQuestion = useStoreTerminationQuizQuestion((s) => s.searchTerminationQuizQuestion)
  const loadingAny = loading || disabled

  return (
    <form
      className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
      onSubmit={(event) => { event.preventDefault(); void searchTerminationQuizQuestion() }}
    >
      <div className="flex items-center gap-2 md:col-start-1 md:row-start-1">
        <ButtonComponent type="button" variant="outline" disabled={loadingAny} label="Filtro" onClick={onOpenFilters} />
        <div className="min-w-0 flex-1">
          <InputComponent value={search} type="text" placeholder="Buscar por pregunta o grupo" onValueChange={setSearch} />
        </div>
      </div>

      <div className="flex items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
        <ButtonComponent
          type="submit"
          variant="primary"
          disabled={loadingAny}
          className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 md:flex-none dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400"
          label={loading ? 'Buscando...' : 'Buscar'}
        />
        <ButtonComponent
          type="button"
          variant="success"
          disabled={loadingAny}
          className="flex-1 md:flex-none"
          label="Nueva pregunta"
          onClick={() => navigate(AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION_CREATE)}
        />
      </div>
    </form>
  )
}
