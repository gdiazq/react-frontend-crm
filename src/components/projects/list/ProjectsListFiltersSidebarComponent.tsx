import { useState } from 'react'
import {
  ButtonComponent,
  DateRangePickerComponent,
  RightSidebarComponent,
  SelectComponent,
} from '@/components'
import { mapperProjectSelectOptions } from '@/mappers'
import { useStoreProjects, useStoreSelects } from '@/store'

interface ProjectsListFiltersSidebarComponentProps {
  open: boolean
  onClose: () => void
}

export function ProjectsListFiltersSidebarComponent(props: ProjectsListFiltersSidebarComponentProps) {
  const { open, onClose } = props

  // Store state used to initialize and render filters.
  const queryParams = useStoreProjects((s) => s.queryParams)
  const loadingProjects = useStoreProjects((s) => s.operationLoading.list)
  const loadingToggleStatus = useStoreProjects((s) => s.operationLoading.toggle)

  // Store actions triggered by filter buttons.
  const setActiveFilter = useStoreProjects((s) => s.setActiveFilter)
  const setTypeFilter = useStoreProjects((s) => s.setTypeFilter)
  const setStatusFilter = useStoreProjects((s) => s.setStatusFilter)
  const setSpecialtyFilter = useStoreProjects((s) => s.setSpecialtyFilter)
  const setCreatedDateRange = useStoreProjects((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreProjects((s) => s.setUpdatedDateRange)
  const clearActiveFilter = useStoreProjects((s) => s.clearActiveFilter)
  const clearTypeFilter = useStoreProjects((s) => s.clearTypeFilter)
  const clearStatusFilter = useStoreProjects((s) => s.clearStatusFilter)
  const clearSpecialtyFilter = useStoreProjects((s) => s.clearSpecialtyFilter)
  const clearCreatedDateRange = useStoreProjects((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreProjects((s) => s.clearUpdatedDateRange)
  const searchProjects = useStoreProjects((s) => s.searchProjects)

  // Shared select state loaded by the dashboard.
  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingStatusOptions = useStoreSelects((s) => s.loadingStatusOptions)
  const projectTypeOptions = useStoreSelects((s) => s.projectTypeOptions)
  const loadingProjectTypeOptions = useStoreSelects((s) => s.loadingProjectTypeOptions)
  const projectStatusOptions = useStoreSelects((s) => s.projectStatusOptions)
  const loadingProjectStatusOptions = useStoreSelects((s) => s.loadingProjectStatusOptions)
  const projectSpecialtyOptions = useStoreSelects((s) => s.projectSpecialtyOptions)
  const loadingProjectSpecialtyOptions = useStoreSelects((s) => s.loadingProjectSpecialtyOptions)

  const [filters, setFilters] = useState(() => ({
    activeId: queryParams.active,
    typeId: queryParams.typeId,
    statusId: queryParams.statusId,
    specialtyId: queryParams.specialtyId,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
    updatedFrom: queryParams.updatedFrom,
    updatedTo: queryParams.updatedTo,
  }))

  // Derived options and loading state.
  const statusSelectOptions = mapperProjectSelectOptions(statusOptions)
  const projectTypeSelectOptions = mapperProjectSelectOptions(projectTypeOptions)
  const projectStatusSelectOptions = mapperProjectSelectOptions(projectStatusOptions)
  const projectSpecialtySelectOptions = mapperProjectSelectOptions(projectSpecialtyOptions)
  const loadingAny = loadingProjects || loadingToggleStatus || loadingStatusOptions || loadingProjectTypeOptions || loadingProjectStatusOptions || loadingProjectSpecialtyOptions

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApply = async () => {
    const selectedStatus = statusOptions.find((option) => String(option.id) === filters.activeId)
    const selectedType = projectTypeOptions.find((option) => String(option.id) === filters.typeId)
    const selectedProjectStatus = projectStatusOptions.find((option) => String(option.id) === filters.statusId)
    const selectedSpecialty = projectSpecialtyOptions.find((option) => String(option.id) === filters.specialtyId)
    setActiveFilter(selectedStatus ? String(selectedStatus.id) : '')
    setTypeFilter(selectedType ? String(selectedType.id) : '')
    setStatusFilter(selectedProjectStatus ? String(selectedProjectStatus.id) : '')
    setSpecialtyFilter(selectedSpecialty ? String(selectedSpecialty.id) : '')
    setCreatedDateRange({ createdFrom: filters.createdFrom.trim(), createdTo: filters.createdTo.trim() })
    setUpdatedDateRange({ updatedFrom: filters.updatedFrom.trim(), updatedTo: filters.updatedTo.trim() })
    await searchProjects()
    onClose()
  }

  const handleClear = async () => {
    setFilters({ activeId: '', typeId: '', statusId: '', specialtyId: '', createdFrom: '', createdTo: '', updatedFrom: '', updatedTo: '' })
    clearActiveFilter()
    clearTypeFilter()
    clearStatusFilter()
    clearSpecialtyFilter()
    clearCreatedDateRange()
    clearUpdatedDateRange()
    await searchProjects()
    onClose()
  }

  return (
    <RightSidebarComponent open={open} title="Filtros" onClose={onClose}>
      <div className="space-y-4">
        <SelectComponent value={filters.activeId} label="Estado" options={statusSelectOptions} onValueChange={(v) => handleChangeFilter('activeId', v)} />
        <SelectComponent value={filters.typeId} label="Tipo" options={projectTypeSelectOptions} onValueChange={(v) => handleChangeFilter('typeId', v)} />
        <SelectComponent value={filters.statusId} label="Vigencia" options={projectStatusSelectOptions} onValueChange={(v) => handleChangeFilter('statusId', v)} />
        <SelectComponent value={filters.specialtyId} label="Especialidad" options={projectSpecialtySelectOptions} onValueChange={(v) => handleChangeFilter('specialtyId', v)} />

        <div className="space-y-3 rounded-xl border border-emerald-500/35 bg-emerald-50/20 p-3 dark:border-emerald-400/25 dark:bg-emerald-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Fecha creación</p>
          <DateRangePickerComponent fromValue={filters.createdFrom} toValue={filters.createdTo} label="Rango de creación" onRangeChange={({ from, to }) => setFilters((prev) => ({ ...prev, createdFrom: from, createdTo: to }))} />
        </div>
        <div className="space-y-3 rounded-xl border border-cyan-500/35 bg-cyan-50/20 p-3 dark:border-cyan-400/25 dark:bg-cyan-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Fecha actualización</p>
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
