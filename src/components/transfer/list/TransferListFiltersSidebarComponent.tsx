import { useState } from 'react'
import {
  ButtonComponent,
  DateRangePickerComponent,
  RightSidebarComponent,
  SelectComponent,
} from '@/components'
import {
  mapperEmptyTransferFilters,
  mapperTransferFiltersFromQuery,
  mapperTransferFiltersPayload,
  mapperTransferSelectOptions,
  mapperTransferStatusSelectOptions,
} from '@/mappers'
import { useStoreEmployeeSelects, useStoreTransfer } from '@/store'
import type { TransferFilterForm } from '@/types'

interface TransferListFiltersSidebarComponentProps {
  open: boolean
  onClose: () => void
}

export function TransferListFiltersSidebarComponent({ open, onClose }: TransferListFiltersSidebarComponentProps) {
  const queryParams = useStoreTransfer((s) => s.queryParams)
  const loadingTransfers = useStoreTransfer((s) => s.operationLoading.list)
  const setStatusFilter = useStoreTransfer((s) => s.setStatusFilter)
  const setToCostCenterFilter = useStoreTransfer((s) => s.setToCostCenterFilter)
  const setEffectiveDateRange = useStoreTransfer((s) => s.setEffectiveDateRange)
  const setCreatedDateRange = useStoreTransfer((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreTransfer((s) => s.setUpdatedDateRange)
  const clearStatusFilter = useStoreTransfer((s) => s.clearStatusFilter)
  const clearToCostCenterFilter = useStoreTransfer((s) => s.clearToCostCenterFilter)
  const clearEffectiveDateRange = useStoreTransfer((s) => s.clearEffectiveDateRange)
  const clearCreatedDateRange = useStoreTransfer((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreTransfer((s) => s.clearUpdatedDateRange)
  const searchTransfers = useStoreTransfer((s) => s.searchTransfers)

  const approvalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptions)
  const transferToCostCenterOptions = useStoreEmployeeSelects((s) => s.transferToCostCenterOptions)
  const loadingApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.loadingApprovalEmployeeStatusOptions)
  const loadingTransferToCostCenterOptions = useStoreEmployeeSelects((s) => s.loadingTransferToCostCenterOptions)

  const [filters, setFilters] = useState<TransferFilterForm>(() => mapperTransferFiltersFromQuery(queryParams))

  const statusSelectOptions = mapperTransferStatusSelectOptions(approvalEmployeeStatusOptions)
  const toCostCenterSelectOptions = mapperTransferSelectOptions(transferToCostCenterOptions)
  const loadingAny = loadingTransfers || loadingApprovalEmployeeStatusOptions || loadingTransferToCostCenterOptions

  const handleChangeFilter = (field: keyof TransferFilterForm, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApply = async () => {
    const payload = mapperTransferFiltersPayload(filters)
    setStatusFilter(payload.status)
    setToCostCenterFilter(payload.toCostCenter)
    setEffectiveDateRange({
      effectiveDateFrom: payload.effectiveDateFrom,
      effectiveDateTo: payload.effectiveDateTo,
    })
    setCreatedDateRange({ createdFrom: payload.createdFrom, createdTo: payload.createdTo })
    setUpdatedDateRange({ updatedFrom: payload.updatedFrom, updatedTo: payload.updatedTo })
    await searchTransfers()
    onClose()
  }

  const handleClear = async () => {
    setFilters(mapperEmptyTransferFilters())
    clearStatusFilter()
    clearToCostCenterFilter()
    clearEffectiveDateRange()
    clearCreatedDateRange()
    clearUpdatedDateRange()
    await searchTransfers()
    onClose()
  }

  return (
    <RightSidebarComponent open={open} title="Filtros" onClose={onClose}>
      <div className="space-y-4">
        <SelectComponent
          value={filters.status}
          label="Estado"
          options={statusSelectOptions}
          loading={loadingApprovalEmployeeStatusOptions}
          onValueChange={(value) => handleChangeFilter('status', value)}
        />
        <SelectComponent
          value={filters.toCostCenter}
          label="Centro destino"
          options={toCostCenterSelectOptions}
          loading={loadingTransferToCostCenterOptions}
          onValueChange={(value) => handleChangeFilter('toCostCenter', value)}
        />
        <div className="space-y-3 rounded-xl border border-cyan-500/35 bg-cyan-50/20 p-3 dark:border-cyan-400/25 dark:bg-cyan-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Fecha efectiva</p>
          <DateRangePickerComponent
            fromValue={filters.effectiveDateFrom}
            toValue={filters.effectiveDateTo}
            label="Rango de fecha"
            onRangeChange={({ from, to }) => {
              setFilters((prev) => ({ ...prev, effectiveDateFrom: from, effectiveDateTo: to }))
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
          <ButtonComponent type="button" variant="primary" disabled={loadingAny} className="text-white dark:text-white" label={loadingAny ? 'Aplicando...' : 'Aplicar'} onClick={() => { void handleApply() }} />
        </div>
      </div>
    </RightSidebarComponent>
  )
}
