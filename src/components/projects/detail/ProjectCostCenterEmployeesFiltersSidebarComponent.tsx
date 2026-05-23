import { useState } from 'react'
import { ButtonComponent, RightSidebarComponent, SelectComponent } from '@/components'
import { mapperProjectActiveFilterOptions, mapperProjectEmployeeStatusFilterOptions } from '@/mappers'
import { useStoreProjects, useStoreSelects } from '@/store'

interface ProjectCostCenterEmployeesFiltersSidebarComponentProps {
  open: boolean
  costCenter: number | null
  onClose: () => void
}

export function ProjectCostCenterEmployeesFiltersSidebarComponent(props: ProjectCostCenterEmployeesFiltersSidebarComponentProps) {
  const { open, costCenter, onClose } = props
  const queryParams = useStoreProjects((s) => s.costCenterEmployeesQueryParams)
  const loading = useStoreProjects((s) => s.loadingCostCenterEmployees)
  const setActiveFilter = useStoreProjects((s) => s.setCostCenterEmployeesActiveFilter)
  const setStatusFilter = useStoreProjects((s) => s.setCostCenterEmployeesStatusFilter)
  const clearFilters = useStoreProjects((s) => s.clearCostCenterEmployeesFilters)
  const searchCostCenterEmployees = useStoreProjects((s) => s.searchCostCenterEmployees)

  const employeeStatusOptions = useStoreSelects((s) => s.employeeStatusOptions)
  const projectActiveInactiveOptions = useStoreSelects((s) => s.projectActiveInactiveOptions)
  const loadingEmployeeStatusOptions = useStoreSelects((s) => s.loadingEmployeeStatusOptions)
  const loadingProjectActiveInactiveOptions = useStoreSelects((s) => s.loadingProjectActiveInactiveOptions)

  const [filters, setFilters] = useState(() => ({
    active: queryParams.active,
    statusId: queryParams.statusId,
  }))

  const activeSelectOptions = mapperProjectActiveFilterOptions(projectActiveInactiveOptions)
  const statusSelectOptions = mapperProjectEmployeeStatusFilterOptions(employeeStatusOptions)
  const loadingAny = loading || loadingEmployeeStatusOptions || loadingProjectActiveInactiveOptions
  const validCostCenter = Number.isInteger(costCenter) && costCenter !== null && costCenter > 0

  const handleApply = async () => {
    setActiveFilter(filters.active)
    setStatusFilter(filters.statusId.trim())
    if (validCostCenter) await searchCostCenterEmployees(costCenter)
    onClose()
  }

  const handleClear = async () => {
    setFilters({ active: '', statusId: '' })
    clearFilters()
    if (validCostCenter) await searchCostCenterEmployees(costCenter)
    onClose()
  }

  return (
    <RightSidebarComponent open={open} title="Filtros" onClose={onClose}>
      <div className="space-y-4">
        <SelectComponent
          value={filters.active}
          label="Activo"
          options={activeSelectOptions}
          loading={loadingProjectActiveInactiveOptions}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, active: value }))}
        />
        <SelectComponent
          value={filters.statusId}
          label="Estado"
          options={statusSelectOptions}
          loading={loadingEmployeeStatusOptions}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, statusId: value }))}
        />
        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <ButtonComponent type="button" variant="outline" disabled={loadingAny} label="Limpiar" onClick={() => { void handleClear() }} />
          <ButtonComponent type="button" variant="primary" disabled={loadingAny} className="text-white dark:text-white" label={loadingAny ? 'Aplicando...' : 'Aplicar'} onClick={() => { void handleApply() }} />
        </div>
      </div>
    </RightSidebarComponent>
  )
}
