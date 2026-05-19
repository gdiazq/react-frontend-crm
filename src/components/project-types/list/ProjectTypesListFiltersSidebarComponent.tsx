import { useState } from 'react'
import {
  ButtonComponent,
  DateRangePickerComponent,
  RightSidebarComponent,
  SelectComponent,
} from '@/components'
import { useStoreProjectTypes, useStoreSelects } from '@/store'

interface ProjectTypesListFiltersSidebarComponentProps {
  open: boolean
  onClose: () => void
}

export function ProjectTypesListFiltersSidebarComponent(props: ProjectTypesListFiltersSidebarComponentProps) {
  const { open, onClose } = props
  const queryParams = useStoreProjectTypes((s) => s.queryParams)
  const loadingProjectTypes = useStoreProjectTypes((s) => s.operationLoading.list)
  const loadingToggleStatus = useStoreProjectTypes((s) => s.operationLoading.toggle)
  const setActiveFilter = useStoreProjectTypes((s) => s.setActiveFilter)
  const setCreatedDateRange = useStoreProjectTypes((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreProjectTypes((s) => s.setUpdatedDateRange)
  const clearActiveFilter = useStoreProjectTypes((s) => s.clearActiveFilter)
  const clearCreatedDateRange = useStoreProjectTypes((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreProjectTypes((s) => s.clearUpdatedDateRange)
  const searchProjectTypes = useStoreProjectTypes((s) => s.searchProjectTypes)
  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingStatusOptions = useStoreSelects((s) => s.loadingStatusOptions)
  const [filters, setFilters] = useState(() => ({
    activeId: queryParams.active,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
    updatedFrom: queryParams.updatedFrom,
    updatedTo: queryParams.updatedTo,
  }))

  const statusSelectOptions = statusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const loadingAny = loadingProjectTypes || loadingToggleStatus || loadingStatusOptions

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApply = async () => {
    const selectedStatus = statusOptions.find((option) => String(option.id) === filters.activeId)
    setActiveFilter(selectedStatus ? String(selectedStatus.id) : '')
    setCreatedDateRange({ createdFrom: filters.createdFrom.trim(), createdTo: filters.createdTo.trim() })
    setUpdatedDateRange({ updatedFrom: filters.updatedFrom.trim(), updatedTo: filters.updatedTo.trim() })
    await searchProjectTypes()
    onClose()
  }

  const handleClear = async () => {
    setFilters({ activeId: '', createdFrom: '', createdTo: '', updatedFrom: '', updatedTo: '' })
    clearActiveFilter()
    clearCreatedDateRange()
    clearUpdatedDateRange()
    await searchProjectTypes()
    onClose()
  }

  return (
    <RightSidebarComponent open={open} title="Filtros" onClose={onClose}>
      <div className="space-y-4">
        <SelectComponent value={filters.activeId} label="Estado" options={statusSelectOptions} onValueChange={(value) => handleChangeFilter('activeId', value)} />
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
          <ButtonComponent type="button" variant="primary" disabled={loadingAny} className="text-white dark:text-white" label={loadingAny ? 'Aplicando...' : 'Aplicar'} onClick={() => { void handleApply() }} />
        </div>
      </div>
    </RightSidebarComponent>
  )
}
