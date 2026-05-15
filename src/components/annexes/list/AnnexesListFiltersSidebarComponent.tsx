import { useEffect, useState } from 'react'
import {
  ButtonComponent,
  DateRangePickerComponent,
  RightSidebarComponent,
  SelectComponent,
} from '@/components'
import { useStoreAnnexes, useStoreEmployeeSelects } from '@/store'

interface AnnexesListFiltersSidebarComponentProps {
  open: boolean
  onClose: () => void
}

export function AnnexesListFiltersSidebarComponent(props: AnnexesListFiltersSidebarComponentProps) {
  const { open, onClose } = props
  const queryParams = useStoreAnnexes((s) => s.queryParams)
  const loadingAnnexes = useStoreAnnexes((s) => s.operationLoading.list)
  const setStatusFilter = useStoreAnnexes((s) => s.setStatusFilter)
  const setDateRange = useStoreAnnexes((s) => s.setDateRange)
  const setCreatedDateRange = useStoreAnnexes((s) => s.setCreatedDateRange)
  const setUpdatedDateRange = useStoreAnnexes((s) => s.setUpdatedDateRange)
  const clearStatusFilter = useStoreAnnexes((s) => s.clearStatusFilter)
  const clearDateRange = useStoreAnnexes((s) => s.clearDateRange)
  const clearCreatedDateRange = useStoreAnnexes((s) => s.clearCreatedDateRange)
  const clearUpdatedDateRange = useStoreAnnexes((s) => s.clearUpdatedDateRange)
  const searchAnnexes = useStoreAnnexes((s) => s.searchAnnexes)

  const approvalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptions)
  const loadingApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.loadingApprovalEmployeeStatusOptions)

  const [filters, setFilters] = useState(() => ({
    statusId: queryParams.status,
    dateFrom: queryParams.dateFrom,
    dateTo: queryParams.dateTo,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
    updatedFrom: queryParams.updatedFrom,
    updatedTo: queryParams.updatedTo,
  }))

  useEffect(() => {
    setFilters({
      statusId: queryParams.status,
      dateFrom: queryParams.dateFrom,
      dateTo: queryParams.dateTo,
      createdFrom: queryParams.createdFrom,
      createdTo: queryParams.createdTo,
      updatedFrom: queryParams.updatedFrom,
      updatedTo: queryParams.updatedTo,
    })
  }, [
    queryParams.status,
    queryParams.dateFrom,
    queryParams.dateTo,
    queryParams.createdFrom,
    queryParams.createdTo,
    queryParams.updatedFrom,
    queryParams.updatedTo,
  ])

  const statusSelectOptions = approvalEmployeeStatusOptions.map((option) => ({ label: option.name, value: String(option.id) }))
  const loadingAny = loadingAnnexes || loadingApprovalEmployeeStatusOptions

  const handleChangeFilter = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApply = async () => {
    const selectedStatus = approvalEmployeeStatusOptions.find((option) => String(option.id) === filters.statusId)
    setStatusFilter(selectedStatus ? String(selectedStatus.id) : '')
    setDateRange({ dateFrom: filters.dateFrom.trim(), dateTo: filters.dateTo.trim() })
    setCreatedDateRange({ createdFrom: filters.createdFrom.trim(), createdTo: filters.createdTo.trim() })
    setUpdatedDateRange({ updatedFrom: filters.updatedFrom.trim(), updatedTo: filters.updatedTo.trim() })
    await searchAnnexes()
    onClose()
  }

  const handleClear = async () => {
    setFilters({ statusId: '', dateFrom: '', dateTo: '', createdFrom: '', createdTo: '', updatedFrom: '', updatedTo: '' })
    clearStatusFilter()
    clearDateRange()
    clearCreatedDateRange()
    clearUpdatedDateRange()
    await searchAnnexes()
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
        <div className="space-y-3 rounded-xl border border-cyan-500/35 bg-cyan-50/20 p-3 dark:border-cyan-400/25 dark:bg-cyan-950/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Fecha del anexo</p>
          <DateRangePickerComponent
            fromValue={filters.dateFrom}
            toValue={filters.dateTo}
            label="Rango de fecha"
            onRangeChange={({ from, to }) => {
              setFilters((prev) => ({ ...prev, dateFrom: from, dateTo: to }))
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
