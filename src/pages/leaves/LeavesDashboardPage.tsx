import { useEffect, useState } from 'react'
import {
  AlertMessageComponent,
  LeavesListDetailSidebarComponent,
  LeavesListFiltersSidebarComponent,
  LeavesListTableComponent,
  LeavesListToolbarComponent,
  StatsOverviewCardsComponent,
} from '@/components'
import { leavesTableColumnIndex } from '@/factories'
import { useStoreEmployeeSelects, useStoreLeaveSelects, useStoreLeaves } from '@/store'
import type { LeaveTableRow } from '@/types'

const EMPLOYEE_NAME_COLUMN_INDEX = leavesTableColumnIndex.employeeName

export default function LeavesDashboardPage() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [detailRowId, setDetailRowId] = useState<string | null>(null)
  const [detailName, setDetailName] = useState('')

  const pagination = useStoreLeaves((s) => s.pagination)
  const listError = useStoreLeaves((s) => s.operationStatus.list.error)
  const clearOperationStatus = useStoreLeaves((s) => s.clearOperationStatus)
  const getLeaves = useStoreLeaves((s) => s.getLeaves)

  const leaveFormOptionsError = useStoreLeaveSelects((s) => s.leaveFormOptionsErrorMessage)
  const getLeaveFormOptions = useStoreLeaveSelects((s) => s.getLeaveFormOptions)
  const clearLeaveFormOptionsStatus = useStoreLeaveSelects((s) => s.clearLeaveFormOptionsStatus)
  const approvalEmployeeStatusOptionsError = useStoreEmployeeSelects((s) => s.approvalEmployeeStatusOptionsErrorMessage)
  const getApprovalEmployeeStatusOptions = useStoreEmployeeSelects((s) => s.getApprovalEmployeeStatusOptions)
  const clearApprovalEmployeeStatusOptionsStatus = useStoreEmployeeSelects((s) => s.clearApprovalEmployeeStatusOptionsStatus)

  useEffect(() => {
    void getLeaves()
    void getLeaveFormOptions()
    void getApprovalEmployeeStatusOptions()
  }, [getApprovalEmployeeStatusOptions, getLeaveFormOptions, getLeaves])

  const handleViewDetail = (row: LeaveTableRow) => {
    setDetailRowId(row.id)
    setDetailName(String(row.values[EMPLOYEE_NAME_COLUMN_INDEX] ?? 'Permiso'))
  }

  const handleCloseDetail = () => {
    setDetailRowId(null)
    setDetailName('')
  }

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · PERMISOS</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de permisos</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total permisos"
        activeLabel="Permisos aprobados"
        pendingLabel="Pendientes"
        total={pagination.total}
        active={pagination.active}
        pending={pagination.pending}
      />

      {listError && 
        <AlertMessageComponent message={listError} tone="error" onClose={() => clearOperationStatus('list')} />}
      {leaveFormOptionsError && 
        <AlertMessageComponent 
          message={leaveFormOptionsError} 
          tone="error" 
          onClose={clearLeaveFormOptionsStatus} 
        />
      }
      {approvalEmployeeStatusOptionsError && 
        <AlertMessageComponent 
          message={approvalEmployeeStatusOptionsError} 
          tone="error" 
          onClose={clearApprovalEmployeeStatusOptionsStatus} 
        />
      }

      <LeavesListToolbarComponent 
        onOpenFilters={() => setFiltersOpen(true)} 
      />

      <LeavesListTableComponent 
        onViewDetail={handleViewDetail} 
      />

      <LeavesListFiltersSidebarComponent 
        open={filtersOpen} 
        onClose={() => setFiltersOpen(false)} 
      />
      
      <LeavesListDetailSidebarComponent 
        rowId={detailRowId} 
        fallbackName={detailName} 
        onClose={handleCloseDetail} 
      />
      
    </section>
  )
}
