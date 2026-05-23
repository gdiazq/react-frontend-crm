import { useState } from 'react'
import {
  ButtonComponent,
  DateRangePickerComponent,
  RightSidebarComponent,
  SelectComponent,
} from '@/components'
import { mapperLeaveSelectOptions, mapperLeaveStatusFilterOptions } from '@/mappers'
import { useStoreEmployeeSelects, useStoreLeaveSelects, useStoreLeaves } from '@/store'

interface LeavesListFiltersSidebarComponentProps {
  open: boolean
  onClose: () => void
}

export function LeavesListFiltersSidebarComponent({ open, onClose }: LeavesListFiltersSidebarComponentProps) {
  const queryParams = useStoreLeaves((s) => s.queryParams)
  const loadingLeaves = useStoreLeaves((s) => s.operationLoading.list)
  const setStatusFilter = useStoreLeaves((s) => s.setStatusFilter)
  const setLeaveTypeFilter = useStoreLeaves((s) => s.setLeaveTypeFilter)
  const setEmployeeFilter = useStoreLeaves((s) => s.setEmployeeFilter)
  const setStartDateRange = useStoreLeaves((s) => s.setStartDateRange)
  const setEndDateRange = useStoreLeaves((s) => s.setEndDateRange)
  const setCreatedDateRange = useStoreLeaves((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreLeaves((s) => s.setUpdatedDateRange)
  const clearStatusFilter = useStoreLeaves((s) => s.clearStatusFilter)
  const clearLeaveTypeFilter = useStoreLeaves((s) => s.clearLeaveTypeFilter)
  const clearEmployeeFilter = useStoreLeaves((s) => s.clearEmployeeFilter)
  const clearStartDateRange = useStoreLeaves((s) => s.clearStartDateRange)
  const clearEndDateRange = useStoreLeaves((s) => s.clearEndDateRange)
  const clearCreatedDateRange = useStoreLeaves((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreLeaves((s) => s.clearUpdatedDateRange)
  const searchLeaves = useStoreLeaves((s) => s.searchLeaves)

  const employeeWithContractOptions = useStoreLeaveSelects((s) => s.employeeWithContractOptions)
  const leaveTypeOptions = useStoreLeaveSelects((s) => s.leaveTypeOptions)
  const loadingLeaveFormOptions = useStoreLeaveSelects((s) => s.loadingLeaveFormOptions)
  const approvalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptions)
  const loadingApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.loadingApprovalEmployeeStatusOptions)

  const statusSelectOptions = mapperLeaveStatusFilterOptions(approvalEmployeeStatusOptions)
  const [filters, setFilters] = useState(() => ({
    status: queryParams.status,
    leaveTypeId: queryParams.leaveTypeId,
    employeeId: queryParams.employeeId,
    startFrom: queryParams.startFrom,
    startTo: queryParams.startTo,
    endFrom: queryParams.endFrom,
    endTo: queryParams.endTo,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
    updatedFrom: queryParams.updatedFrom,
    updatedTo: queryParams.updatedTo,
  }))

  const employeeSelectOptions = mapperLeaveSelectOptions(employeeWithContractOptions)
  const leaveTypeSelectOptions = mapperLeaveSelectOptions(leaveTypeOptions)
  const loadingAny = loadingLeaves || loadingLeaveFormOptions || loadingApprovalEmployeeStatusOptions

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApply = async () => {
    setStatusFilter(filters.status.trim())
    setLeaveTypeFilter(filters.leaveTypeId)
    setEmployeeFilter(filters.employeeId)
    setStartDateRange({ startFrom: filters.startFrom.trim(), startTo: filters.startTo.trim() })
    setEndDateRange({ endFrom: filters.endFrom.trim(), endTo: filters.endTo.trim() })
    setCreatedDateRange({ createdFrom: filters.createdFrom.trim(), createdTo: filters.createdTo.trim() })
    setUpdatedDateRange({ updatedFrom: filters.updatedFrom.trim(), updatedTo: filters.updatedTo.trim() })
    await searchLeaves()
    onClose()
  }

  const handleClear = async () => {
    setFilters({ status: '', leaveTypeId: '', employeeId: '', startFrom: '', startTo: '', endFrom: '', endTo: '', createdFrom: '', createdTo: '', updatedFrom: '', updatedTo: '' })
    clearStatusFilter()
    clearLeaveTypeFilter()
    clearEmployeeFilter()
    clearStartDateRange()
    clearEndDateRange()
    clearCreatedDateRange()
    clearUpdatedDateRange()
    await searchLeaves()
    onClose()
  }

  return (
    <RightSidebarComponent open={open} title="Filtros" onClose={onClose}>
      <div className="space-y-4">
        <SelectComponent value={filters.status} label="Estado" options={statusSelectOptions} loading={loadingApprovalEmployeeStatusOptions} onValueChange={(v) => handleChangeFilter('status', v)} />
        <SelectComponent value={filters.leaveTypeId} label="Tipo de permiso" options={leaveTypeSelectOptions} loading={loadingLeaveFormOptions} onValueChange={(v) => handleChangeFilter('leaveTypeId', v)} />
        <SelectComponent value={filters.employeeId} label="Trabajador" options={employeeSelectOptions} loading={loadingLeaveFormOptions} onValueChange={(v) => handleChangeFilter('employeeId', v)} />

        <div className="space-y-3 rounded-xl border border-cyan-500/35 bg-cyan-50/20 p-3 dark:border-cyan-400/25 dark:bg-cyan-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Inicio del permiso</p>
          <DateRangePickerComponent fromValue={filters.startFrom} toValue={filters.startTo} label="Rango de inicio" onRangeChange={({ from, to }) => setFilters((prev) => ({ ...prev, startFrom: from, startTo: to }))} />
        </div>
        <div className="space-y-3 rounded-xl border border-sky-500/35 bg-sky-50/20 p-3 dark:border-sky-400/25 dark:bg-sky-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">Fin del permiso</p>
          <DateRangePickerComponent fromValue={filters.endFrom} toValue={filters.endTo} label="Rango de fin" onRangeChange={({ from, to }) => setFilters((prev) => ({ ...prev, endFrom: from, endTo: to }))} />
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
