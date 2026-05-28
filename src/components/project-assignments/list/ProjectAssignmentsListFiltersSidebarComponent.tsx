import { useState } from 'react'
import {
  ButtonComponent,
  DateRangePickerComponent,
  InputComponent,
  RightSidebarComponent,
  SelectComponent,
} from '@/components'
import { mapperProjectAssignmentActiveFilterOptions, mapperProjectAssignmentEmployeeSelectOptions } from '@/mappers'
import { useStoreProjectAssignments, useStoreSelects } from '@/store'

interface ProjectAssignmentsListFiltersSidebarComponentProps {
  open: boolean
  onClose: () => void
}

export function ProjectAssignmentsListFiltersSidebarComponent(props: ProjectAssignmentsListFiltersSidebarComponentProps) {
  const { open, onClose } = props

  // Store state used to initialize and render filters.
  const queryParams = useStoreProjectAssignments((s) => s.queryParams)
  const loading = useStoreProjectAssignments((s) => s.operationLoading.list)

  // Store actions triggered by filter buttons.
  const setEmployeeFilter = useStoreProjectAssignments((s) => s.setEmployeeFilter)
  const setCostCenterFilter = useStoreProjectAssignments((s) => s.setCostCenterFilter)
  const setActiveFilter = useStoreProjectAssignments((s) => s.setActiveFilter)
  const setAssignmentDateRange = useStoreProjectAssignments((s) => s.setAssignmentDateRange)
  const setCreatedDateRange = useStoreProjectAssignments((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreProjectAssignments((s) => s.setUpdatedDateRange)
  const clearEmployeeFilter = useStoreProjectAssignments((s) => s.clearEmployeeFilter)
  const clearCostCenterFilter = useStoreProjectAssignments((s) => s.clearCostCenterFilter)
  const clearActiveFilter = useStoreProjectAssignments((s) => s.clearActiveFilter)
  const clearAssignmentDateRange = useStoreProjectAssignments((s) => s.clearAssignmentDateRange)
  const clearCreatedDateRange = useStoreProjectAssignments((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreProjectAssignments((s) => s.clearUpdatedDateRange)
  const searchProjectAssignments = useStoreProjectAssignments((s) => s.searchProjectAssignments)

  // Module and shared select state loaded by the dashboard.
  const employeeWithContractOptions = useStoreProjectAssignments((s) => s.employeeWithContractOptions)
  const loadingEmployeeWithContractOptions = useStoreProjectAssignments((s) => s.loadingEmployeeWithContractOptions)
  const projectActiveInactiveOptions = useStoreSelects((s) => s.projectActiveInactiveOptions)
  const loadingProjectActiveInactiveOptions = useStoreSelects((s) => s.loadingProjectActiveInactiveOptions)

  const [filters, setFilters] = useState(() => ({
    employeeId: queryParams.employeeId,
    costCenter: queryParams.costCenter,
    active: queryParams.active,
    dateFrom: queryParams.dateFrom,
    dateTo: queryParams.dateTo,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
    updatedFrom: queryParams.updatedFrom,
    updatedTo: queryParams.updatedTo,
  }))

  // Derived options and loading state.
  const employeeSelectOptions = mapperProjectAssignmentEmployeeSelectOptions(employeeWithContractOptions)
  const activeSelectOptions = mapperProjectAssignmentActiveFilterOptions(projectActiveInactiveOptions)
  const loadingAny = loading || loadingEmployeeWithContractOptions || loadingProjectActiveInactiveOptions

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApply = async () => {
    setEmployeeFilter(filters.employeeId.trim())
    setCostCenterFilter(filters.costCenter.trim())
    setActiveFilter(filters.active)
    setAssignmentDateRange({ dateFrom: filters.dateFrom.trim(), dateTo: filters.dateTo.trim() })
    setCreatedDateRange({ createdFrom: filters.createdFrom.trim(), createdTo: filters.createdTo.trim() })
    setUpdatedDateRange({ updatedFrom: filters.updatedFrom.trim(), updatedTo: filters.updatedTo.trim() })
    await searchProjectAssignments()
    onClose()
  }

  const handleClear = async () => {
    setFilters({ employeeId: '', costCenter: '', active: '', dateFrom: '', dateTo: '', createdFrom: '', createdTo: '', updatedFrom: '', updatedTo: '' })
    clearEmployeeFilter()
    clearCostCenterFilter()
    clearActiveFilter()
    clearAssignmentDateRange()
    clearCreatedDateRange()
    clearUpdatedDateRange()
    await searchProjectAssignments()
    onClose()
  }

  return (
    <RightSidebarComponent open={open} title="Filtros" onClose={onClose}>
      <div className="space-y-4">
        <SelectComponent value={filters.employeeId} label="Trabajador" options={employeeSelectOptions} loading={loadingEmployeeWithContractOptions} onValueChange={(v) => handleChangeFilter('employeeId', v)} />
        <InputComponent value={filters.costCenter} label="Centro de costo" type="number" placeholder="Ej: 1001" onValueChange={(v) => handleChangeFilter('costCenter', v)} />
        <SelectComponent value={filters.active} label="Estado" options={activeSelectOptions} loading={loadingProjectActiveInactiveOptions} onValueChange={(v) => handleChangeFilter('active', v)} />
        <div className="space-y-3 rounded-xl border border-cyan-500/35 bg-cyan-50/20 p-3 dark:border-cyan-400/25 dark:bg-cyan-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Vigencia</p>
          <DateRangePickerComponent fromValue={filters.dateFrom} toValue={filters.dateTo} label="Rango de vigencia" onRangeChange={({ from, to }) => setFilters((prev) => ({ ...prev, dateFrom: from, dateTo: to }))} />
        </div>
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
          <ButtonComponent type="button" variant="primary" disabled={loadingAny} className="text-white dark:text-white" label="Aplicar" onClick={() => { void handleApply() }} />
        </div>
      </div>
    </RightSidebarComponent>
  )
}
