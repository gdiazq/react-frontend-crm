import { useState } from 'react'
import {
  ButtonComponent,
  DateRangePickerComponent,
  RightSidebarComponent,
  SelectComponent,
} from '@/components'
import { useStoreSelects, useStoreSettlementSelects, useStoreTerminationQuizQuestion } from '@/store'

interface TerminationQuizQuestionListFiltersSidebarComponentProps {
  open: boolean
  onClose: () => void
}

export function TerminationQuizQuestionListFiltersSidebarComponent(props: TerminationQuizQuestionListFiltersSidebarComponentProps) {
  const { open, onClose } = props
  const queryParams = useStoreTerminationQuizQuestion((s) => s.queryParams)
  const loadingList = useStoreTerminationQuizQuestion((s) => s.operationLoading.list)
  const loadingToggleStatus = useStoreTerminationQuizQuestion((s) => s.operationLoading.toggle)
  const setActiveFilter = useStoreTerminationQuizQuestion((s) => s.setActiveFilter)
  const setCreatedDateRange = useStoreTerminationQuizQuestion((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreTerminationQuizQuestion((s) => s.setUpdatedDateRange)
  const setQuestionGroupFilter = useStoreTerminationQuizQuestion((s) => s.setQuestionGroupFilter)
  const setEmployeeIdFilter = useStoreTerminationQuizQuestion((s) => s.setEmployeeIdFilter)
  const clearActiveFilter = useStoreTerminationQuizQuestion((s) => s.clearActiveFilter)
  const clearCreatedDateRange = useStoreTerminationQuizQuestion((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreTerminationQuizQuestion((s) => s.clearUpdatedDateRange)
  const searchTerminationQuizQuestion = useStoreTerminationQuizQuestion((s) => s.searchTerminationQuizQuestion)
  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingStatusOptions = useStoreSelects((s) => s.loadingStatusOptions)
  const quizQuestionGroupOptions = useStoreSettlementSelects((s) => s.quizQuestionGroupOptions)
  const loadingQuizQuestionGroupOptions = useStoreSettlementSelects((s) => s.loadingQuizQuestionGroupOptions)
  const employeeWithContractOptions = useStoreSettlementSelects((s) => s.employeeWithContractOptions)
  const loadingEmployeeWithContractOptions = useStoreSettlementSelects((s) => s.loadingEmployeeWithContractOptions)

  const [filters, setFilters] = useState(() => ({
    activeId: queryParams.active,
    questionGroupId: '',
    employeeId: queryParams.employeeId,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
    updatedFrom: queryParams.updatedFrom,
    updatedTo: queryParams.updatedTo,
  }))

  const statusSelectOptions = statusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const questionGroupSelectOptions = quizQuestionGroupOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const resolvedQuestionGroupId = filters.questionGroupId || (
    queryParams.questionGroup.trim().length > 0
      ? String(quizQuestionGroupOptions.find((option) => option.name === queryParams.questionGroup)?.id ?? '')
      : ''
  )
  const employeeSelectOptions = employeeWithContractOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const loadingFilterOptions = loadingStatusOptions || loadingQuizQuestionGroupOptions || loadingEmployeeWithContractOptions
  const loadingAny = loadingList || loadingToggleStatus || loadingFilterOptions

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApply = async () => {
    const selectedStatus = statusOptions.find((option) => String(option.id) === filters.activeId)
    const selectedQuestionGroup = quizQuestionGroupOptions.find((option) => String(option.id) === resolvedQuestionGroupId)
    setActiveFilter(selectedStatus ? String(selectedStatus.id) : '')
    setQuestionGroupFilter(selectedQuestionGroup ? selectedQuestionGroup.name : '')
    setEmployeeIdFilter(filters.employeeId.trim())
    setCreatedDateRange({ createdFrom: filters.createdFrom.trim(), createdTo: filters.createdTo.trim() })
    setUpdatedDateRange({ updatedFrom: filters.updatedFrom.trim(), updatedTo: filters.updatedTo.trim() })
    await searchTerminationQuizQuestion()
    onClose()
  }

  const handleClear = async () => {
    setFilters({ activeId: '', questionGroupId: '', employeeId: '', createdFrom: '', createdTo: '', updatedFrom: '', updatedTo: '' })
    clearActiveFilter()
    setQuestionGroupFilter('')
    setEmployeeIdFilter('')
    clearCreatedDateRange()
    clearUpdatedDateRange()
    await searchTerminationQuizQuestion()
    onClose()
  }

  return (
    <RightSidebarComponent open={open} title="Filtros" onClose={onClose}>
      <div className="space-y-4">
        <SelectComponent value={filters.activeId} label="Estado" options={statusSelectOptions} onValueChange={(value) => handleChangeFilter('activeId', value)} />
        <SelectComponent value={resolvedQuestionGroupId} label="Grupo de pregunta" options={questionGroupSelectOptions} disabled={loadingQuizQuestionGroupOptions} onValueChange={(value) => handleChangeFilter('questionGroupId', value)} />
        <SelectComponent value={filters.employeeId} label="Empleado" options={employeeSelectOptions} disabled={loadingEmployeeWithContractOptions} onValueChange={(value) => handleChangeFilter('employeeId', value)} />

        <div className="space-y-3 rounded-xl border border-emerald-500/35 bg-emerald-50/20 p-3 dark:border-emerald-400/25 dark:bg-emerald-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Fecha creación</p>
          <DateRangePickerComponent fromValue={filters.createdFrom} toValue={filters.createdTo} label="Rango de creación" onRangeChange={({ from, to }) => setFilters((prev) => ({ ...prev, createdFrom: from, createdTo: to }))} />
        </div>

        <div className="space-y-3 rounded-xl border border-amber-500/35 bg-amber-50/15 p-3 dark:border-amber-400/25 dark:bg-amber-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Fecha actualización</p>
          <DateRangePickerComponent fromValue={filters.updatedFrom} toValue={filters.updatedTo} label="Rango de actualización" onRangeChange={({ from, to }) => setFilters((prev) => ({ ...prev, updatedFrom: from, updatedTo: to }))} />
        </div>

        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <ButtonComponent type="button" variant="outline" disabled={loadingAny} label="Limpiar" onClick={() => { void handleClear() }} />
          <ButtonComponent type="button" variant="primary" disabled={loadingAny} className="text-white dark:text-white" label={loadingFilterOptions ? 'Aplicando...' : 'Aplicar'} onClick={() => { void handleApply() }} />
        </div>
      </div>
    </RightSidebarComponent>
  )
}
