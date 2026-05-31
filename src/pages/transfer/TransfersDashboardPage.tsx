import { useEffect, useState } from 'react'
import {
  AlertMessageComponent,
  StatsOverviewCardsComponent,
  TransferListDetailSidebarComponent,
  TransferListFiltersSidebarComponent,
  TransferListTableComponent,
  TransferListToolbarComponent,
} from '@/components'
import { mapperTransferTableDisplayName } from '@/mappers'
import { useStoreEmployeeSelects, useStoreTransfer } from '@/store'
import type { TransferTableRow } from '@/types'

export default function TransfersDashboardPage() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [detailRowId, setDetailRowId] = useState<string | null>(null)
  const [detailName, setDetailName] = useState('')

  const pagination = useStoreTransfer((s) => s.pagination)
  const listError = useStoreTransfer((s) => s.operationStatus.list.error)
  const clearOperationStatus = useStoreTransfer((s) => s.clearOperationStatus)
  const getTransfers = useStoreTransfer((s) => s.getTransfers)

  const approvalEmployeeStatusOptionsErrorMessage = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptionsErrorMessage)
  const transferToCostCenterOptionsErrorMessage = useStoreEmployeeSelects((s) => s.transferToCostCenterOptionsErrorMessage)
  const getApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.getApprovalEmployeeStatusOptions)
  const getTransferToCostCenterOptions = useStoreEmployeeSelects((s) => s.getTransferToCostCenterOptions)
  const clearApprovalEmployeeStatusOptionsStatus = useStoreEmployeeSelects((s) => s.clearApprovalEmployeeStatusOptionsStatus)
  const clearTransferToCostCenterOptionsStatus = useStoreEmployeeSelects((s) => s.clearTransferToCostCenterOptionsStatus)

  useEffect(() => {
    void getTransfers()
    void getApprovalEmployeeStatusOptions()
    void getTransferToCostCenterOptions()
  }, [getTransfers, getApprovalEmployeeStatusOptions, getTransferToCostCenterOptions])

  const handleViewDetail = (row: TransferTableRow) => {
    setDetailRowId(row.id)
    setDetailName(mapperTransferTableDisplayName(row))
  }

  const handleCloseDetail = () => {
    setDetailRowId(null)
    setDetailName('')
  }

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · TRASPASOS</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de traspasos</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total traspasos"
        activeLabel="Traspasos activos"
        total={pagination.total}
        active={pagination.active}
      />

      {approvalEmployeeStatusOptionsErrorMessage && (
        <AlertMessageComponent
          message={approvalEmployeeStatusOptionsErrorMessage}
          tone="error"
          onClose={clearApprovalEmployeeStatusOptionsStatus}
        />
      )}

      {transferToCostCenterOptionsErrorMessage && (
        <AlertMessageComponent
          message={transferToCostCenterOptionsErrorMessage}
          tone="error"
          onClose={clearTransferToCostCenterOptionsStatus}
        />
      )}

      {listError && (
        <AlertMessageComponent
          message={listError}
          tone="error"
          onClose={() => clearOperationStatus('list')}
        />
      )}

      <TransferListToolbarComponent 
        onOpenFilters={() => setFiltersOpen(true)} 
      />

      <TransferListTableComponent 
        onViewDetail={handleViewDetail} 
      />

      <TransferListFiltersSidebarComponent 
        open={filtersOpen} 
        onClose={() => setFiltersOpen(false)} 
      />
      
      <TransferListDetailSidebarComponent 
        rowId={detailRowId} 
        fallbackName={detailName} 
        onClose={handleCloseDetail} 
      />
    </section>
  )
}
