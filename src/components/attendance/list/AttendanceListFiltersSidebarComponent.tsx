import { useEffect, useState } from 'react'
import {
  ButtonComponent,
  DateRangePickerComponent,
  RightSidebarComponent,
  SelectComponent,
} from '@/components'
import {
  useStoreAttendance,
  useStoreAttendanceSelects,
  useStoreEmployeeSelects,
} from '@/store'

interface AttendanceListFiltersSidebarComponentProps {
  open: boolean
  onClose: () => void
}

export function AttendanceListFiltersSidebarComponent(props: AttendanceListFiltersSidebarComponentProps) {
  const { open, onClose } = props
  const queryParams = useStoreAttendance((s) => s.queryParams)
  const loadingAttendance = useStoreAttendance((s) => s.operationLoading.list)
  const setEmployeeFilter = useStoreAttendance((s) => s.setEmployeeFilter)
  const setCostCenterFilter = useStoreAttendance((s) => s.setCostCenterFilter)
  const setStatusFilter = useStoreAttendance((s) => s.setStatusFilter)
  const setDateRange = useStoreAttendance((s) => s.setDateRange)
  const setCreatedDateRange = useStoreAttendance((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreAttendance((s) => s.setUpdatedDateRange)
  const clearEmployeeFilter = useStoreAttendance((s) => s.clearEmployeeFilter)
  const clearCostCenterFilter = useStoreAttendance((s) => s.clearCostCenterFilter)
  const clearStatusFilter = useStoreAttendance((s) => s.clearStatusFilter)
  const clearDateRange = useStoreAttendance((s) => s.clearDateRange)
  const clearCreatedDateRange = useStoreAttendance((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreAttendance((s) => s.clearUpdatedDateRange)
  const searchAttendance = useStoreAttendance((s) => s.searchAttendance)

  const employeeWithContractOptions = useStoreAttendanceSelects((s) => s.employeeWithContractOptions)
  const attendanceStatusOptions = useStoreAttendanceSelects((s) => s.attendanceStatusOptions)
  const loadingAttendanceFormOptions = useStoreAttendanceSelects((s) => s.loadingAttendanceFormOptions)
  const projectCostCenterOptions = useStoreEmployeeSelects((s) => s.projectCostCenterOptions)
  const loadingCostCenterOptions = useStoreEmployeeSelects((s) => s.loadingFormOptions)

  const [filters, setFilters] = useState(() => ({
    employeeId: queryParams.employeeId,
    costCenter: queryParams.costCenter,
    statusId: queryParams.statusId,
    dateFrom: queryParams.dateFrom,
    dateTo: queryParams.dateTo,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
    updatedFrom: queryParams.updatedFrom,
    updatedTo: queryParams.updatedTo,
  }))

  useEffect(() => {
    setFilters({
      employeeId: queryParams.employeeId,
      costCenter: queryParams.costCenter,
      statusId: queryParams.statusId,
      dateFrom: queryParams.dateFrom,
      dateTo: queryParams.dateTo,
      createdFrom: queryParams.createdFrom,
      createdTo: queryParams.createdTo,
      updatedFrom: queryParams.updatedFrom,
      updatedTo: queryParams.updatedTo,
    })
  }, [
    queryParams.employeeId,
    queryParams.costCenter,
    queryParams.statusId,
    queryParams.dateFrom,
    queryParams.dateTo,
    queryParams.createdFrom,
    queryParams.createdTo,
    queryParams.updatedFrom,
    queryParams.updatedTo,
  ])

  const employeeSelectOptions = employeeWithContractOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const attendanceStatusSelectOptions = attendanceStatusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const costCenterSelectOptions = projectCostCenterOptions.map((option) => ({ label: option.name, value: String(option.id) }))

  const loadingAny = loadingAttendance || loadingAttendanceFormOptions || loadingCostCenterOptions

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApply = async () => {
    setEmployeeFilter(filters.employeeId)
    setCostCenterFilter(filters.costCenter.trim())
    setStatusFilter(filters.statusId)
    setDateRange({ dateFrom: filters.dateFrom.trim(), dateTo: filters.dateTo.trim() })
    setCreatedDateRange({ createdFrom: filters.createdFrom.trim(), createdTo: filters.createdTo.trim() })
    setUpdatedDateRange({ updatedFrom: filters.updatedFrom.trim(), updatedTo: filters.updatedTo.trim() })
    await searchAttendance()
    onClose()
  }

  const handleClear = async () => {
    setFilters({
      employeeId: '',
      costCenter: '',
      statusId: '',
      dateFrom: '',
      dateTo: '',
      createdFrom: '',
      createdTo: '',
      updatedFrom: '',
      updatedTo: '',
    })
    clearEmployeeFilter()
    clearCostCenterFilter()
    clearStatusFilter()
    clearDateRange()
    clearCreatedDateRange()
    clearUpdatedDateRange()
    await searchAttendance()
    onClose()
  }

  return (
    <RightSidebarComponent open={open} title="Filtros" onClose={onClose}>
      <div className="space-y-4">
        <SelectComponent
          value={filters.statusId}
          label="Estado"
          options={attendanceStatusSelectOptions}
          loading={loadingAttendanceFormOptions}
          onValueChange={(v) => handleChangeFilter('statusId', v)}
        />
        <SelectComponent
          value={filters.employeeId}
          label="Trabajador"
          options={employeeSelectOptions}
          loading={loadingAttendanceFormOptions}
          onValueChange={(v) => handleChangeFilter('employeeId', v)}
        />
        <SelectComponent
          value={filters.costCenter}
          label="Centro de costo"
          options={costCenterSelectOptions}
          loading={loadingCostCenterOptions}
          onValueChange={(v) => handleChangeFilter('costCenter', v)}
        />

        <div className="space-y-3 rounded-xl border border-cyan-500/35 bg-cyan-50/20 p-3 dark:border-cyan-400/25 dark:bg-cyan-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Fecha asistencia</p>
          <DateRangePickerComponent
            fromValue={filters.dateFrom}
            toValue={filters.dateTo}
            label="Rango de asistencia"
            onRangeChange={({ from, to }) => {
              setFilters((prev) => ({ ...prev, dateFrom: from, dateTo: to }))
            }}
          />
        </div>

        <div className="space-y-3 rounded-xl border border-emerald-500/35 bg-emerald-50/20 p-3 dark:border-emerald-400/25 dark:bg-emerald-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Fecha creación</p>
          <DateRangePickerComponent
            fromValue={filters.createdFrom}
            toValue={filters.createdTo}
            label="Rango de creación"
            onRangeChange={({ from, to }) => {
              setFilters((prev) => ({ ...prev, createdFrom: from, createdTo: to }))
            }}
          />
        </div>

        <div className="space-y-3 rounded-xl border border-amber-500/35 bg-amber-50/15 p-3 dark:border-amber-400/25 dark:bg-amber-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Fecha actualización</p>
          <DateRangePickerComponent
            fromValue={filters.updatedFrom}
            toValue={filters.updatedTo}
            label="Rango de actualización"
            onRangeChange={({ from, to }) => {
              setFilters((prev) => ({ ...prev, updatedFrom: from, updatedTo: to }))
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
