import { useState } from 'react'
import {
  ButtonComponent,
  DateRangePickerComponent,
  RightSidebarComponent,
  SelectComponent,
} from '@/components'
import { mapperRequestSelectOptions } from '@/mappers'
import { useStoreEmployeeSelects, useStoreRequests } from '@/store'

interface RequestsListFiltersSidebarComponentProps {
  open: boolean
  onClose: () => void
}

export function RequestsListFiltersSidebarComponent(props: RequestsListFiltersSidebarComponentProps) {
  const { open, onClose } = props
  const queryParams = useStoreRequests((s) => s.queryParams)
  const loadingRequests = useStoreRequests((s) => s.operationLoading.list)
  const setStatusFilter = useStoreRequests((s) => s.setStatusFilter)
  const setModuleFilter = useStoreRequests((s) => s.setModuleFilter)
  const setCreatedDateRange = useStoreRequests((s) => s.setCreatedDateRange)
  const setApprovalDateRange = useStoreRequests((s) => s.setApprovalDateRange)
  const clearStatusFilter = useStoreRequests((s) => s.clearStatusFilter)
  const clearModuleFilter = useStoreRequests((s) => s.clearModuleFilter)
  const clearCreatedDateRange = useStoreRequests((s) => s.clearCreatedDateRange)
  const clearApprovalDateRange = useStoreRequests((s) => s.clearApprovalDateRange)
  const searchRequests = useStoreRequests((s) => s.searchRequests)
  const approvalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptions)
  const loadingApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.loadingApprovalEmployeeStatusOptions)
  const hrRequestTypeOptions = useStoreEmployeeSelects((s) => s.hrRequestTypeOptions)
  const loadingHrRequestTypeOptions = useStoreEmployeeSelects((s) => s.loadingHrRequestTypeOptions)

  const [filters, setFilters] = useState(() => ({
    statusId: queryParams.statusId,
    moduleId: queryParams.idModule,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
    approvalFrom: queryParams.approvalFrom,
    approvalTo: queryParams.approvalTo,
  }))

  const statusSelectOptions = mapperRequestSelectOptions(approvalEmployeeStatusOptions)
  const moduleSelectOptions = mapperRequestSelectOptions(hrRequestTypeOptions)
  const loadingAny = loadingRequests || loadingApprovalEmployeeStatusOptions || loadingHrRequestTypeOptions

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApply = async () => {
    setStatusFilter(filters.statusId.trim())
    setModuleFilter(filters.moduleId.trim())
    setCreatedDateRange({
      createdFrom: filters.createdFrom.trim(),
      createdTo: filters.createdTo.trim(),
    })
    setApprovalDateRange({
      approvalFrom: filters.approvalFrom.trim(),
      approvalTo: filters.approvalTo.trim(),
    })
    await searchRequests()
    onClose()
  }

  const handleClear = async () => {
    setFilters({
      statusId: '',
      moduleId: '',
      createdFrom: '',
      createdTo: '',
      approvalFrom: '',
      approvalTo: '',
    })
    clearStatusFilter()
    clearModuleFilter()
    clearCreatedDateRange()
    clearApprovalDateRange()
    await searchRequests()
    onClose()
  }

  return (
    <RightSidebarComponent open={open} title="Filtros" onClose={onClose}>
      <div className="space-y-4">
        <SelectComponent
          value={filters.statusId}
          label="Estado de aprobacion"
          options={statusSelectOptions}
          loading={loadingApprovalEmployeeStatusOptions}
          onValueChange={(value) => handleChangeFilter('statusId', value)}
        />
        <SelectComponent
          value={filters.moduleId}
          label="Tipo solicitud"
          options={moduleSelectOptions}
          loading={loadingHrRequestTypeOptions}
          onValueChange={(value) => handleChangeFilter('moduleId', value)}
        />
        <div className="space-y-3 rounded-xl border border-cyan-500/35 bg-cyan-50/30 p-3 dark:border-cyan-400/25 dark:bg-cyan-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
            Fecha aprobacion
          </p>
          <DateRangePickerComponent
            fromValue={filters.approvalFrom}
            toValue={filters.approvalTo}
            label="Rango de fechas"
            onRangeChange={({ from, to }) => setFilters((prev) => ({ ...prev, approvalFrom: from, approvalTo: to }))}
          />
        </div>
        <div className="space-y-3 rounded-xl border border-emerald-500/35 bg-emerald-50/20 p-3 dark:border-emerald-400/25 dark:bg-emerald-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
            Fecha creacion
          </p>
          <DateRangePickerComponent
            fromValue={filters.createdFrom}
            toValue={filters.createdTo}
            label="Rango de creación"
            onRangeChange={({ from, to }) => setFilters((prev) => ({ ...prev, createdFrom: from, createdTo: to }))}
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
            label={loadingApprovalEmployeeStatusOptions || loadingHrRequestTypeOptions ? 'Aplicando...' : 'Aplicar'}
            onClick={() => { void handleApply() }}
          />
        </div>
      </div>
    </RightSidebarComponent>
  )
}
