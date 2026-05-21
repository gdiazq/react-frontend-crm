import { useEffect, useState } from 'react'
import {
  AlertMessageComponent,
  SettlementsListDetailSidebarComponent,
  SettlementsListFiltersSidebarComponent,
  SettlementsListTableComponent,
  SettlementsListToolbarComponent,
  StatsOverviewCardsComponent,
} from '@/components'
import { settlementTableColumnIndex } from '@/factories'
import { useStoreEmployeeSelects, useStoreSettlement, useStoreSettlementSelects } from '@/store'
import type { SettlementTableRow } from '@/types'

const EMPLOYEE_NAME_COLUMN_INDEX = settlementTableColumnIndex.employeeName

export default function SettlementsDashboardPage() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [detailRowId, setDetailRowId] = useState<string | null>(null)
  const [detailName, setDetailName] = useState('')

  const pagination = useStoreSettlement((s) => s.pagination)
  const listError = useStoreSettlement((s) => s.operationStatus.list.error)
  const clearOperationStatus = useStoreSettlement((s) => s.clearOperationStatus)
  const getSettlements = useStoreSettlement((s) => s.getSettlements)

  const approvalEmployeeStatusOptionsErrorMessage = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptionsErrorMessage)
  const getApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.getApprovalEmployeeStatusOptions)
  const clearApprovalEmployeeStatusOptionsStatus = useStoreEmployeeSelects((s) => s.clearApprovalEmployeeStatusOptionsStatus)

  const filterOptionsErrorMessage = useStoreSettlementSelects((s) => s.filterOptionsErrorMessage)
  const getFilterOptions = useStoreSettlementSelects((s) => s.getFilterOptions)
  const clearFilterOptionsStatus = useStoreSettlementSelects((s) => s.clearFilterOptionsStatus)

  useEffect(() => {
    void getSettlements()
    void getApprovalEmployeeStatusOptions()
    void getFilterOptions()
  }, [getSettlements, getApprovalEmployeeStatusOptions, getFilterOptions])

  const handleViewDetail = (row: SettlementTableRow) => {
    setDetailRowId(row.id)
    setDetailName(String(row.values[EMPLOYEE_NAME_COLUMN_INDEX] ?? 'Finiquito'))
  }

  const handleCloseDetail = () => {
    setDetailRowId(null)
    setDetailName('')
  }

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · FINIQUITOS</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de finiquitos</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total acuerdos"
        activeLabel="Acuerdos activos"
        total={pagination.total}
        active={pagination.active}
      />

      {filterOptionsErrorMessage && (
        <AlertMessageComponent 
          message={filterOptionsErrorMessage} 
          tone="error" 
          onClose={clearFilterOptionsStatus} 
        />
      )}

      {approvalEmployeeStatusOptionsErrorMessage && (
        <AlertMessageComponent 
          message={approvalEmployeeStatusOptionsErrorMessage} 
          tone="error" 
          onClose={clearApprovalEmployeeStatusOptionsStatus} 
        />
      )}

      {listError && (
        <AlertMessageComponent 
          message={listError} 
          tone="error" 
          onClose={() => clearOperationStatus('list')} 
        />
      )}

      <SettlementsListToolbarComponent 
        onOpenFilters={() => setFiltersOpen(true)} 
      />
      <SettlementsListTableComponent 
        onViewDetail={handleViewDetail} 
      />
      <SettlementsListFiltersSidebarComponent 
        open={filtersOpen} 
        onClose={() => setFiltersOpen(false)} 
      />
      <SettlementsListDetailSidebarComponent 
        rowId={detailRowId} 
        fallbackName={detailName} 
        onClose={handleCloseDetail} 
      />
    </section>
  )
}
