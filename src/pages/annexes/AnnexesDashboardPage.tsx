import { useEffect, useState } from 'react'
import {
  AlertMessageComponent,
  AnnexesListDetailSidebarComponent,
  AnnexesListFiltersSidebarComponent,
  AnnexesListTableComponent,
  AnnexesListToolbarComponent,
  StatsOverviewCardsComponent,
} from '@/components'
import { mapperAnnexTableDisplayName } from '@/mappers'
import { useStoreAnnexes, useStoreEmployeeSelects } from '@/store'
import type { AnnexTableRow } from '@/types'

export default function AnnexesDashboardPage() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [detailRowId, setDetailRowId] = useState<string | null>(null)
  const [detailName, setDetailName] = useState('')

  const pagination = useStoreAnnexes((s) => s.pagination)
  const listError = useStoreAnnexes((s) => s.operationStatus.list.error)
  const clearOperationStatus = useStoreAnnexes((s) => s.clearOperationStatus)
  const getAnnexes = useStoreAnnexes((s) => s.getAnnexes)

  const approvalEmployeeStatusOptionsError = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptionsErrorMessage)
  const clearApprovalEmployeeStatusOptionsStatus = useStoreEmployeeSelects((s) => s.clearApprovalEmployeeStatusOptionsStatus)
  const getApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.getApprovalEmployeeStatusOptions)

  useEffect(() => {
    void getAnnexes()
    void getApprovalEmployeeStatusOptions()
  }, [getAnnexes, getApprovalEmployeeStatusOptions])

  const handleViewDetail = (row: AnnexTableRow) => {
    setDetailRowId(row.id)
    setDetailName(mapperAnnexTableDisplayName(row))
  }

  const handleCloseDetail = () => {
    setDetailRowId(null)
    setDetailName('')
  }

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · ANEXOS</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de anexos</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total anexos"
        activeLabel="Anexos aprobados"
        total={pagination.total}
        active={pagination.active}
      />

      {listError && (
        <AlertMessageComponent message={listError} tone="error" onClose={() => clearOperationStatus('list')} />
      )}
      {approvalEmployeeStatusOptionsError && (
        <AlertMessageComponent message={approvalEmployeeStatusOptionsError} tone="error" onClose={clearApprovalEmployeeStatusOptionsStatus} />
      )}

      <AnnexesListToolbarComponent onOpenFilters={() => setFiltersOpen(true)} />
      <AnnexesListTableComponent onViewDetail={handleViewDetail} />

      <AnnexesListFiltersSidebarComponent open={filtersOpen} onClose={() => setFiltersOpen(false)} />
      <AnnexesListDetailSidebarComponent
        rowId={detailRowId}
        fallbackName={detailName}
        onClose={handleCloseDetail}
      />
    </section>
  )
}
