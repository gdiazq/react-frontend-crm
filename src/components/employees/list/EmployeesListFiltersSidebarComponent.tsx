import { useState } from 'react'
import {
  ButtonComponent,
  DateRangePickerComponent,
  RightSidebarComponent,
  SelectComponent,
} from '@/components'
import { useStoreEmployeeSelects, useStoreEmployees, useStoreSelects } from '@/store'

interface EmployeesListFiltersSidebarComponentProps {
  open: boolean
  onClose: () => void
}

export function EmployeesListFiltersSidebarComponent(props: EmployeesListFiltersSidebarComponentProps) {
  const { open, onClose } = props
  const queryParams = useStoreEmployees((s) => s.queryParams)
  const loadingEmployees = useStoreEmployees((s) => s.operationLoading.list)
  const loadingToggleStatus = useStoreEmployees((s) => s.operationLoading.toggle)
  const loadingLinkUser = useStoreEmployees((s) => s.loadingLinkUser)
  const setActiveFilter = useStoreEmployees((s) => s.setActiveFilter)
  const setApprovalStatusFilter = useStoreEmployees((s) => s.setApprovalStatusFilter)
  const setCreatedDateRange = useStoreEmployees((s) => s.setCreatedDateRange)
  const clearActiveFilter = useStoreEmployees((s) => s.clearActiveFilter)
  const clearApprovalStatusFilter = useStoreEmployees((s) => s.clearApprovalStatusFilter)
  const clearCreatedDateRange = useStoreEmployees((s) => s.clearCreatedDateRange)
  const searchEmployees = useStoreEmployees((s) => s.searchEmployees)

  const statusOptions = useStoreSelects((s) => s.statusOptions)
  const loadingStatusOptions = useStoreSelects((s) => s.loadingStatusOptions)
  const approvalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptions)
  const loadingApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.loadingApprovalEmployeeStatusOptions)

  const [filters, setFilters] = useState(() => ({
    activeId: queryParams.active,
    approvalStatusId: queryParams.statusId,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
  }))

  const statusSelectOptions = statusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const approvalStatusSelectOptions = approvalEmployeeStatusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const loadingAny = loadingEmployees || loadingToggleStatus || loadingLinkUser || loadingStatusOptions || loadingApprovalEmployeeStatusOptions

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApply = async () => {
    const selectedStatus = statusOptions.find((option) => String(option.id) === filters.activeId)
    const selectedApprovalStatus = approvalEmployeeStatusOptions.find((option) => String(option.id) === filters.approvalStatusId)
    setActiveFilter(selectedStatus ? String(selectedStatus.id) : '')
    setApprovalStatusFilter(selectedApprovalStatus ? String(selectedApprovalStatus.id) : '')
    setCreatedDateRange({ createdFrom: filters.createdFrom.trim(), createdTo: filters.createdTo.trim() })
    await searchEmployees()
    onClose()
  }

  const handleClear = async () => {
    setFilters({ activeId: '', approvalStatusId: '', createdFrom: '', createdTo: '' })
    clearActiveFilter()
    clearApprovalStatusFilter()
    clearCreatedDateRange()
    await searchEmployees()
    onClose()
  }

  return (
    <RightSidebarComponent open={open} title="Filtros" onClose={onClose}>
      <div className="space-y-4">
        <SelectComponent value={filters.activeId} label="Estado" options={statusSelectOptions} onValueChange={(v) => handleChangeFilter('activeId', v)} />
        <SelectComponent value={filters.approvalStatusId} label="Estado de aprobacion" options={approvalStatusSelectOptions} onValueChange={(v) => handleChangeFilter('approvalStatusId', v)} />
        <div className="space-y-3 rounded-xl border border-emerald-500/35 bg-emerald-50/20 p-3 dark:border-emerald-400/25 dark:bg-emerald-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Fecha creacion</p>
          <DateRangePickerComponent
            fromValue={filters.createdFrom}
            toValue={filters.createdTo}
            label="Rango de creación"
            onRangeChange={({ from, to }) => {
              setFilters((prev) => ({ ...prev, createdFrom: from, createdTo: to }))
            }}
          />
        </div>
        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <ButtonComponent type="button" variant="outline" disabled={loadingAny} label="Limpiar" onClick={() => { void handleClear() }} />
          <ButtonComponent
            type="button"
            variant="primary"
            disabled={loadingAny}
            className="text-white dark:text-white"
            label={loadingEmployees || loadingStatusOptions || loadingApprovalEmployeeStatusOptions ? 'Aplicando...' : 'Aplicar'}
            onClick={() => { void handleApply() }}
          />
        </div>
      </div>
    </RightSidebarComponent>
  )
}
