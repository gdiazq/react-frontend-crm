import { useState } from 'react'
import {
  ButtonComponent,
  DateRangePickerComponent,
  RightSidebarComponent,
  SelectComponent,
} from '@/components'
import {
  mapperEmptyLegalTerminationCausesFilters,
  mapperLegalTerminationCausesFiltersFromQuery,
  mapperLegalTerminationCausesFiltersPayload,
  mapperLegalTerminationCausesSelectOptions,
} from '@/mappers'
import { useStoreLegalTerminationCauses, useStoreSelects } from '@/store'
import type { LegalTerminationCausesFilterForm } from '@/types'

interface LegalTerminationCausesListFiltersSidebarComponentProps {
  open: boolean
  onClose: () => void
}

export function LegalTerminationCausesListFiltersSidebarComponent(props: LegalTerminationCausesListFiltersSidebarComponentProps) {
  const { open, onClose } = props
  const queryParams = useStoreLegalTerminationCauses((s) => s.queryParams)
  const loadingLegalTerminationCauses = useStoreLegalTerminationCauses((s) => s.operationLoading.list)
  const loadingToggleStatus = useStoreLegalTerminationCauses((s) => s.operationLoading.toggle)
  const setActiveFilter = useStoreLegalTerminationCauses((s) => s.setActiveFilter)
  const setCreatedDateRange = useStoreLegalTerminationCauses((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreLegalTerminationCauses((s) => s.setUpdatedDateRange)
  const clearActiveFilter = useStoreLegalTerminationCauses((s) => s.clearActiveFilter)
  const clearCreatedDateRange = useStoreLegalTerminationCauses((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreLegalTerminationCauses((s) => s.clearUpdatedDateRange)
  const searchLegalTerminationCauses = useStoreLegalTerminationCauses((s) => s.searchLegalTerminationCauses)
  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingStatusOptions = useStoreSelects((s) => s.loadingStatusOptions)

  const [filters, setFilters] = useState<LegalTerminationCausesFilterForm>(() => mapperLegalTerminationCausesFiltersFromQuery(queryParams))

  const statusSelectOptions = mapperLegalTerminationCausesSelectOptions(statusOptions)
  const loadingAny = loadingLegalTerminationCauses || loadingToggleStatus || loadingStatusOptions

  const handleChangeFilter = (field: keyof LegalTerminationCausesFilterForm, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApply = async () => {
    const payload = mapperLegalTerminationCausesFiltersPayload(filters)
    setActiveFilter(payload.activeId)
    setCreatedDateRange({ createdFrom: payload.createdFrom, createdTo: payload.createdTo })
    setUpdatedDateRange({ updatedFrom: payload.updatedFrom, updatedTo: payload.updatedTo })
    await searchLegalTerminationCauses()
    onClose()
  }

  const handleClear = async () => {
    setFilters(mapperEmptyLegalTerminationCausesFilters())
    clearActiveFilter()
    clearCreatedDateRange()
    clearUpdatedDateRange()
    await searchLegalTerminationCauses()
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
