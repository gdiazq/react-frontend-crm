import { useState } from 'react'
import {
  ButtonComponent,
  DateRangePickerComponent,
  RightSidebarComponent,
  SelectComponent,
} from '@/components'
import { useStoreContractSelects, useStoreContracts, useStoreEmployeeSelects } from '@/store'

interface ContractsListFiltersSidebarComponentProps {
  open: boolean
  onClose: () => void
}

export function ContractsListFiltersSidebarComponent(props: ContractsListFiltersSidebarComponentProps) {
  const { open, onClose } = props
  const queryParams = useStoreContracts((s) => s.queryParams)
  const loadingContracts = useStoreContracts((s) => s.operationLoading.list)
  const setStatusFilter = useStoreContracts((s) => s.setStatusFilter)
  const setContractStatusFilter = useStoreContracts((s) => s.setContractStatusFilter)
  const setContractTypeFilter = useStoreContracts((s) => s.setContractTypeFilter)
  const setCreatedDateRange = useStoreContracts((s) => s.setCreatedDateRange)
  const setStartDateRange = useStoreContracts((s) => s.setStartDateRange)
  const setEndDateRange = useStoreContracts((s) => s.setEndDateRange)
  const setUpdatedDateRange = useStoreContracts((s) => s.setUpdatedDateRange)
  const clearStatusFilter = useStoreContracts((s) => s.clearStatusFilter)
  const clearContractStatusFilter = useStoreContracts((s) => s.clearContractStatusFilter)
  const clearContractTypeFilter = useStoreContracts((s) => s.clearContractTypeFilter)
  const clearCreatedDateRange = useStoreContracts((s) => s.clearCreatedDateRange)
  const clearStartDateRange = useStoreContracts((s) => s.clearStartDateRange)
  const clearEndDateRange = useStoreContracts((s) => s.clearEndDateRange)
  const clearUpdatedDateRange = useStoreContracts((s) => s.clearUpdatedDateRange)
  const searchContracts = useStoreContracts((s) => s.searchContracts)

  const contractTypeFilterOptions = useStoreContractSelects((s) => s.contractTypeFilterOptions)
  const contractStatusFilterOptions = useStoreContractSelects((s) => s.contractStatusFilterOptions)
  const loadingContractFilterOptions = useStoreContractSelects((s) => s.loadingContractFilterOptions)
  const approvalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptions)
  const loadingApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.loadingApprovalEmployeeStatusOptions)

  const [filters, setFilters] = useState(() => ({
    statusId: queryParams.statusId,
    contractStatusId: queryParams.contractStatusId,
    contractTypeId: queryParams.contractTypeId,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
    startDateFrom: queryParams.startDateFrom,
    startDateTo: queryParams.startDateTo,
    endDateFrom: queryParams.endDateFrom,
    endDateTo: queryParams.endDateTo,
    updatedFrom: queryParams.updatedFrom,
    updatedTo: queryParams.updatedTo,
  }))

  const statusSelectOptions = approvalEmployeeStatusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const contractStatusSelectOptions = contractStatusFilterOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const contractTypeSelectOptions = contractTypeFilterOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const loadingAny = loadingContracts || loadingContractFilterOptions || loadingApprovalEmployeeStatusOptions

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApply = async () => {
    const selectedStatus = approvalEmployeeStatusOptions.find((option) => String(option.id) === filters.statusId)
    const selectedContractStatus = contractStatusFilterOptions.find((option) => String(option.id) === filters.contractStatusId)
    const selectedContractType = contractTypeFilterOptions.find((option) => String(option.id) === filters.contractTypeId)

    setStatusFilter(selectedStatus ? String(selectedStatus.id) : '')
    setContractStatusFilter(selectedContractStatus ? String(selectedContractStatus.id) : '')
    setContractTypeFilter(selectedContractType ? String(selectedContractType.id) : '')
    setCreatedDateRange({ createdFrom: filters.createdFrom.trim(), createdTo: filters.createdTo.trim() })
    setStartDateRange({ startDateFrom: filters.startDateFrom.trim(), startDateTo: filters.startDateTo.trim() })
    setEndDateRange({ endDateFrom: filters.endDateFrom.trim(), endDateTo: filters.endDateTo.trim() })
    setUpdatedDateRange({ updatedFrom: filters.updatedFrom.trim(), updatedTo: filters.updatedTo.trim() })
    await searchContracts()
    onClose()
  }

  const handleClear = async () => {
    setFilters({
      statusId: '',
      contractStatusId: '',
      contractTypeId: '',
      createdFrom: '',
      createdTo: '',
      startDateFrom: '',
      startDateTo: '',
      endDateFrom: '',
      endDateTo: '',
      updatedFrom: '',
      updatedTo: '',
    })
    clearStatusFilter()
    clearContractStatusFilter()
    clearContractTypeFilter()
    clearCreatedDateRange()
    clearStartDateRange()
    clearEndDateRange()
    clearUpdatedDateRange()
    await searchContracts()
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
          onValueChange={(v) => handleChangeFilter('statusId', v)}
        />
        <SelectComponent
          value={filters.contractStatusId}
          label="Estado contrato"
          options={contractStatusSelectOptions}
          loading={loadingContractFilterOptions}
          onValueChange={(v) => handleChangeFilter('contractStatusId', v)}
        />
        <SelectComponent
          value={filters.contractTypeId}
          label="Tipo contrato"
          options={contractTypeSelectOptions}
          loading={loadingContractFilterOptions}
          onValueChange={(v) => handleChangeFilter('contractTypeId', v)}
        />
        <div className="space-y-3 rounded-xl border border-cyan-500/35 bg-cyan-50/20 p-3 dark:border-cyan-400/25 dark:bg-cyan-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Fecha inicio contrato</p>
          <DateRangePickerComponent
            fromValue={filters.startDateFrom}
            toValue={filters.startDateTo}
            label="Rango de inicio"
            onRangeChange={({ from, to }) => {
              setFilters((prev) => ({ ...prev, startDateFrom: from, startDateTo: to }))
            }}
          />
        </div>
        <div className="space-y-3 rounded-xl border border-fuchsia-500/35 bg-fuchsia-50/15 p-3 dark:border-fuchsia-400/25 dark:bg-fuchsia-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-700 dark:text-fuchsia-300">Fecha fin contrato</p>
          <DateRangePickerComponent
            fromValue={filters.endDateFrom}
            toValue={filters.endDateTo}
            label="Rango de término"
            onRangeChange={({ from, to }) => {
              setFilters((prev) => ({ ...prev, endDateFrom: from, endDateTo: to }))
            }}
          />
        </div>
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
        <div className="space-y-3 rounded-xl border border-amber-500/35 bg-amber-50/15 p-3 dark:border-amber-400/25 dark:bg-amber-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Fecha actualizacion</p>
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
          <ButtonComponent type="button" variant="outline" disabled={loadingAny} label="Limpiar" onClick={() => { void handleClear() }} />
          <ButtonComponent type="button" variant="primary" disabled={loadingAny} className="text-white dark:text-white" label="Aplicar" onClick={() => { void handleApply() }} />
        </div>
      </div>
    </RightSidebarComponent>
  )
}
