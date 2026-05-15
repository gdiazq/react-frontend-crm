import { useState } from 'react'
import {
  ButtonComponent,
  DateRangePickerComponent,
  RightSidebarComponent,
  SelectComponent,
} from '@/components'
import {
  useStoreAttendanceSelects,
  useStoreEmployeeSelects,
  useStoreOvertime,
} from '@/store'

interface OvertimeListFiltersSidebarComponentProps {
  open: boolean
  onClose: () => void
}

export function OvertimeListFiltersSidebarComponent({
  open,
  onClose,
}: OvertimeListFiltersSidebarComponentProps) {
  const queryParams = useStoreOvertime((s) => s.queryParams)
  const overtimeTypes = useStoreOvertime((s) => s.overtimeTypes)
  const loadingOvertime = useStoreOvertime((s) => s.operationLoading.list)
  const loadingOvertimeTypes = useStoreOvertime((s) => s.loadingOvertimeTypes)
  const setEmployeeFilter = useStoreOvertime((s) => s.setEmployeeFilter)
  const setCostCenterFilter = useStoreOvertime((s) => s.setCostCenterFilter)
  const setStatusFilter = useStoreOvertime((s) => s.setStatusFilter)
  const setDateRange = useStoreOvertime((s) => s.setDateRange)
  const setOvertimeTypeFilter = useStoreOvertime((s) => s.setOvertimeTypeFilter)
  const clearEmployeeFilter = useStoreOvertime((s) => s.clearEmployeeFilter)
  const clearCostCenterFilter = useStoreOvertime((s) => s.clearCostCenterFilter)
  const clearStatusFilter = useStoreOvertime((s) => s.clearStatusFilter)
  const clearDateRange = useStoreOvertime((s) => s.clearDateRange)
  const clearOvertimeTypeFilter = useStoreOvertime((s) => s.clearOvertimeTypeFilter)
  const searchOvertime = useStoreOvertime((s) => s.searchOvertime)

  const attendanceEmployeeOptions = useStoreAttendanceSelects((s) => s.attendanceEmployeeOptions)
  const loadingEmployeeOptions = useStoreAttendanceSelects((s) => s.loadingAttendanceEmployeeOptions)
  const projectCostCenterOptions = useStoreEmployeeSelects((s) => s.projectCostCenterOptions)
  const loadingCostCenterOptions = useStoreEmployeeSelects((s) => s.loadingFormOptions)

  const [filters, setFilters] = useState(() => ({
    employeeId: queryParams.employeeId,
    costCenter: queryParams.costCenter,
    statusId: queryParams.statusId,
    dateFrom: queryParams.dateFrom,
    dateTo: queryParams.dateTo,
    overtimeTypeId: queryParams.overtimeTypeId,
  }))

  const employeeSelectOptions = attendanceEmployeeOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const costCenterSelectOptions = projectCostCenterOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const overtimeTypeSelectOptions = overtimeTypes.map((option) => ({
    label: option.surchargePercent != null ? `${option.name} · ${option.surchargePercent}%` : option.name,
    value: String(option.id),
  }))

  const loadingAny = loadingOvertime || loadingOvertimeTypes || loadingEmployeeOptions || loadingCostCenterOptions

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApply = async () => {
    setEmployeeFilter(filters.employeeId)
    setCostCenterFilter(filters.costCenter.trim())
    setStatusFilter(filters.statusId.trim())
    setDateRange({ dateFrom: filters.dateFrom.trim(), dateTo: filters.dateTo.trim() })
    setOvertimeTypeFilter(filters.overtimeTypeId)
    await searchOvertime()
    onClose()
  }

  const handleClear = async () => {
    setFilters({ employeeId: '', costCenter: '', statusId: '', dateFrom: '', dateTo: '', overtimeTypeId: '' })
    clearEmployeeFilter()
    clearCostCenterFilter()
    clearStatusFilter()
    clearDateRange()
    clearOvertimeTypeFilter()
    await searchOvertime()
    onClose()
  }

  return (
    <RightSidebarComponent open={open} title="Filtros" onClose={onClose}>
      <div className="space-y-4">
        <SelectComponent
          value={filters.employeeId}
          label="Trabajador"
          options={employeeSelectOptions}
          loading={loadingEmployeeOptions}
          onValueChange={(v) => handleChangeFilter('employeeId', v)}
        />
        <SelectComponent
          value={filters.costCenter}
          label="Centro de costo"
          options={costCenterSelectOptions}
          loading={loadingCostCenterOptions}
          onValueChange={(v) => handleChangeFilter('costCenter', v)}
        />
        <SelectComponent
          value={filters.overtimeTypeId}
          label="Tipo de hora extra"
          options={overtimeTypeSelectOptions}
          loading={loadingOvertimeTypes}
          onValueChange={(v) => handleChangeFilter('overtimeTypeId', v)}
        />

        <div className="space-y-3 rounded-xl border border-cyan-500/35 bg-cyan-50/20 p-3 dark:border-cyan-400/25 dark:bg-cyan-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
            Fecha horas extras
          </p>
          <DateRangePickerComponent
            fromValue={filters.dateFrom}
            toValue={filters.dateTo}
            label="Rango de fecha"
            onRangeChange={({ from, to }) => {
              setFilters((prev) => ({ ...prev, dateFrom: from, dateTo: to }))
            }}
          />
        </div>

        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loadingAny}
            label="Limpiar"
            onClick={() => { void handleClear() }}
          />
          <ButtonComponent
            type="button"
            variant="primary"
            disabled={loadingAny}
            className="text-white dark:text-white"
            label="Aplicar"
            onClick={() => { void handleApply() }}
          />
        </div>
      </div>
    </RightSidebarComponent>
  )
}
