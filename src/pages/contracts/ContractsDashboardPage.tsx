import { useEffect, useState } from 'react'
import {
  AlertMessageComponent,
  ContractsListDetailSidebarComponent,
  ContractsListFiltersSidebarComponent,
  ContractsListTableComponent,
  ContractsListToolbarComponent,
  StatsOverviewCardsComponent,
} from '@/components'
import { contractsTableColumnIndex } from '@/factories'
import { useStoreContractSelects, useStoreContracts, useStoreEmployeeSelects } from '@/store'
import type { ContractTableRow } from '@/types'

const CONTRACT_NAME_COLUMN_INDEX = contractsTableColumnIndex.name

export default function ContractsDashboardPage() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [detailRowId, setDetailRowId] = useState<string | null>(null)
  const [detailName, setDetailName] = useState('')

  const pagination = useStoreContracts((s) => s.pagination)
  const listError = useStoreContracts((s) => s.operationStatus.list.error)
  const clearOperationStatus = useStoreContracts((s) => s.clearOperationStatus)
  const getContracts = useStoreContracts((s) => s.getContracts)

  const contractFilterOptionsError = useStoreContractSelects((s) => s.contractFilterOptionsErrorMessage)
  const getContractFilterOptions = useStoreContractSelects((s) => s.getContractFilterOptions)
  const clearContractFilterOptionsStatus = useStoreContractSelects((s) => s.clearContractFilterOptionsStatus)

  const approvalEmployeeStatusOptionsError = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptionsErrorMessage)
  const getApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.getApprovalEmployeeStatusOptions)
  const clearApprovalEmployeeStatusOptionsStatus = useStoreEmployeeSelects((s) => s.clearApprovalEmployeeStatusOptionsStatus)

  useEffect(() => {
    void getContracts()
    void getContractFilterOptions()
    void getApprovalEmployeeStatusOptions()
  }, [getApprovalEmployeeStatusOptions, getContractFilterOptions, getContracts])

  const handleViewDetail = (row: ContractTableRow) => {
    setDetailRowId(row.id)
    setDetailName(String(row.values[CONTRACT_NAME_COLUMN_INDEX] ?? 'Contrato'))
  }

  const handleCloseDetail = () => {
    setDetailRowId(null)
    setDetailName('')
  }

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · CONTRATOS</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de contratos</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total contratos"
        activeLabel="Contratos activos"
        total={pagination.total}
        active={pagination.active}
      />

      {listError && (
        <AlertMessageComponent message={listError} tone="error" onClose={() => clearOperationStatus('list')} />
      )}
      {contractFilterOptionsError && (
        <AlertMessageComponent message={contractFilterOptionsError} tone="error" onClose={clearContractFilterOptionsStatus} />
      )}
      {approvalEmployeeStatusOptionsError && (
        <AlertMessageComponent message={approvalEmployeeStatusOptionsError} tone="error" onClose={clearApprovalEmployeeStatusOptionsStatus} />
      )}

      <ContractsListToolbarComponent onOpenFilters={() => setFiltersOpen(true)} />
      <ContractsListTableComponent onViewDetail={handleViewDetail} />

      <ContractsListFiltersSidebarComponent open={filtersOpen} onClose={() => setFiltersOpen(false)} />
      <ContractsListDetailSidebarComponent
        rowId={detailRowId}
        fallbackName={detailName}
        onClose={handleCloseDetail}
      />
    </section>
  )
}
