import { useState } from 'react'
import { ButtonComponent, DateRangePickerComponent, RightSidebarComponent, SelectComponent } from '@/components'
import { useStoreEmployeeSelects, useStoreSettlement, useStoreSettlementSelects } from '@/store'

const REHIRE_ELIGIBLE_OPTIONS = [
  { label: 'Si', value: 'true' },
  { label: 'No', value: 'false' },
]

interface SettlementsListFiltersSidebarComponentProps {
  open: boolean
  onClose: () => void
}

export function SettlementsListFiltersSidebarComponent({ open, onClose }: SettlementsListFiltersSidebarComponentProps) {
  const queryParams = useStoreSettlement((s) => s.queryParams)
  const loadingSettlements = useStoreSettlement((s) => s.operationLoading.list)
  const setStatusFilter = useStoreSettlement((s) => s.setStatusFilter)
  const setLegalTerminationCauseIdFilter = useStoreSettlement((s) => s.setLegalTerminationCauseIdFilter)
  const setQualityOfWorkIdFilter = useStoreSettlement((s) => s.setQualityOfWorkIdFilter)
  const setSafetyComplianceIdFilter = useStoreSettlement((s) => s.setSafetyComplianceIdFilter)
  const setNoReHiredCauseIdFilter = useStoreSettlement((s) => s.setNoReHiredCauseIdFilter)
  const setRehireEligibleFilter = useStoreSettlement((s) => s.setRehireEligibleFilter)
  const setEndDateRange = useStoreSettlement((s) => s.setEndDateRange)
  const setCreatedDateRange = useStoreSettlement((s) => s.setCreatedDateRange)
  const clearStatusFilter = useStoreSettlement((s) => s.clearStatusFilter)
  const clearLegalTerminationCauseIdFilter = useStoreSettlement((s) => s.clearLegalTerminationCauseIdFilter)
  const clearQualityOfWorkIdFilter = useStoreSettlement((s) => s.clearQualityOfWorkIdFilter)
  const clearSafetyComplianceIdFilter = useStoreSettlement((s) => s.clearSafetyComplianceIdFilter)
  const clearNoReHiredCauseIdFilter = useStoreSettlement((s) => s.clearNoReHiredCauseIdFilter)
  const clearRehireEligibleFilter = useStoreSettlement((s) => s.clearRehireEligibleFilter)
  const clearEndDateRange = useStoreSettlement((s) => s.clearEndDateRange)
  const clearCreatedDateRange = useStoreSettlement((s) => s.clearCreatedDateRange)
  const searchSettlements = useStoreSettlement((s) => s.searchSettlements)

  const approvalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptions)
  const loadingApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.loadingApprovalEmployeeStatusOptions)
  const legalTerminationCauseFilterOptions = useStoreSettlementSelects((s) => s.legalTerminationCauseFilterOptions)
  const qualityOfWorkFilterOptions = useStoreSettlementSelects((s) => s.qualityOfWorkFilterOptions)
  const safetyComplianceFilterOptions = useStoreSettlementSelects((s) => s.safetyComplianceFilterOptions)
  const noRehireCauseFilterOptions = useStoreSettlementSelects((s) => s.noRehireCauseFilterOptions)
  const loadingFilterOptions = useStoreSettlementSelects((s) => s.loadingFilterOptions)

  const [filters, setFilters] = useState(() => ({
    statusId: queryParams.statusId,
    legalTerminationCauseId: queryParams.legalTerminationCauseId,
    qualityOfWorkId: queryParams.qualityOfWorkId,
    safetyComplianceId: queryParams.safetyComplianceId,
    noReHiredCauseId: queryParams.noReHiredCauseId,
    rehireEligible: queryParams.rehireEligible,
    endDateFrom: queryParams.endDateFrom,
    endDateTo: queryParams.endDateTo,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
  }))

  const statusSelectOptions = approvalEmployeeStatusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const legalCauseSelectOptions = legalTerminationCauseFilterOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const qualityOfWorkSelectOptions = qualityOfWorkFilterOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const safetyComplianceSelectOptions = safetyComplianceFilterOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const noRehireCauseSelectOptions = noRehireCauseFilterOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const loadingAny = loadingSettlements || loadingApprovalEmployeeStatusOptions || loadingFilterOptions

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApply = async () => {
    const selectedStatus = approvalEmployeeStatusOptions.find((option) => String(option.id) === filters.statusId)
    const selectedLegalCause = legalTerminationCauseFilterOptions.find((option) => String(option.id) === filters.legalTerminationCauseId)
    const selectedQualityOfWork = qualityOfWorkFilterOptions.find((option) => String(option.id) === filters.qualityOfWorkId)
    const selectedSafetyCompliance = safetyComplianceFilterOptions.find((option) => String(option.id) === filters.safetyComplianceId)
    const selectedNoReHiredCause = noRehireCauseFilterOptions.find((option) => String(option.id) === filters.noReHiredCauseId)
    setStatusFilter(selectedStatus ? String(selectedStatus.id) : '')
    setLegalTerminationCauseIdFilter(selectedLegalCause ? String(selectedLegalCause.id) : '')
    setQualityOfWorkIdFilter(selectedQualityOfWork ? String(selectedQualityOfWork.id) : '')
    setSafetyComplianceIdFilter(selectedSafetyCompliance ? String(selectedSafetyCompliance.id) : '')
    setNoReHiredCauseIdFilter(selectedNoReHiredCause ? String(selectedNoReHiredCause.id) : '')
    setRehireEligibleFilter(filters.rehireEligible)
    setEndDateRange({ endDateFrom: filters.endDateFrom.trim(), endDateTo: filters.endDateTo.trim() })
    setCreatedDateRange({ createdFrom: filters.createdFrom.trim(), createdTo: filters.createdTo.trim() })
    await searchSettlements()
    onClose()
  }

  const handleClear = async () => {
    setFilters({ statusId: '', legalTerminationCauseId: '', qualityOfWorkId: '', safetyComplianceId: '', noReHiredCauseId: '', rehireEligible: '', endDateFrom: '', endDateTo: '', createdFrom: '', createdTo: '' })
    clearStatusFilter()
    clearLegalTerminationCauseIdFilter()
    clearQualityOfWorkIdFilter()
    clearSafetyComplianceIdFilter()
    clearNoReHiredCauseIdFilter()
    clearRehireEligibleFilter()
    clearEndDateRange()
    clearCreatedDateRange()
    await searchSettlements()
    onClose()
  }

  return (
    <RightSidebarComponent open={open} title="Filtros" onClose={onClose}>
      <div className="space-y-4">
        <SelectComponent value={filters.statusId} label="Estado" options={statusSelectOptions} loading={loadingApprovalEmployeeStatusOptions} onValueChange={(value) => handleChangeFilter('statusId', value)} />
        <SelectComponent value={filters.rehireEligible} label="Recontratable" options={REHIRE_ELIGIBLE_OPTIONS} onValueChange={(value) => handleChangeFilter('rehireEligible', value)} />
        <SelectComponent value={filters.legalTerminationCauseId} label="Causa terminación" options={legalCauseSelectOptions} loading={loadingFilterOptions} onValueChange={(value) => handleChangeFilter('legalTerminationCauseId', value)} />
        <SelectComponent value={filters.qualityOfWorkId} label="Calidad del trabajo" options={qualityOfWorkSelectOptions} loading={loadingFilterOptions} onValueChange={(value) => handleChangeFilter('qualityOfWorkId', value)} />
        <SelectComponent value={filters.safetyComplianceId} label="Cumplimiento seguridad" options={safetyComplianceSelectOptions} loading={loadingFilterOptions} onValueChange={(value) => handleChangeFilter('safetyComplianceId', value)} />
        <SelectComponent value={filters.noReHiredCauseId} label="Causa no recontrato" options={noRehireCauseSelectOptions} loading={loadingFilterOptions} onValueChange={(value) => handleChangeFilter('noReHiredCauseId', value)} />
        <div className="space-y-3 rounded-xl border border-fuchsia-500/35 bg-fuchsia-50/15 p-3 dark:border-fuchsia-400/25 dark:bg-fuchsia-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-700 dark:text-fuchsia-300">Fecha fin</p>
          <DateRangePickerComponent fromValue={filters.endDateFrom} toValue={filters.endDateTo} label="Rango de término" onRangeChange={({ from, to }) => setFilters((prev) => ({ ...prev, endDateFrom: from, endDateTo: to }))} />
        </div>
        <div className="space-y-3 rounded-xl border border-emerald-500/35 bg-emerald-50/20 p-3 dark:border-emerald-400/25 dark:bg-emerald-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Fecha creación</p>
          <DateRangePickerComponent fromValue={filters.createdFrom} toValue={filters.createdTo} label="Rango de creación" onRangeChange={({ from, to }) => setFilters((prev) => ({ ...prev, createdFrom: from, createdTo: to }))} />
        </div>
        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <ButtonComponent type="button" variant="outline" disabled={loadingAny} label="Limpiar" onClick={() => { void handleClear() }} />
          <ButtonComponent type="button" variant="primary" disabled={loadingAny} className="text-white dark:text-white" label={loadingApprovalEmployeeStatusOptions || loadingFilterOptions ? 'Aplicando...' : 'Aplicar'} onClick={() => { void handleApply() }} />
        </div>
      </div>
    </RightSidebarComponent>
  )
}
