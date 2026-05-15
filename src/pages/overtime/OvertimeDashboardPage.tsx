import { useEffect, useState } from 'react'
import {
  AlertMessageComponent,
  OvertimeListDetailSidebarComponent,
  OvertimeListFiltersSidebarComponent,
  OvertimeListTableComponent,
  OvertimeListToolbarComponent,
  StatsOverviewCardsComponent,
} from '@/components'
import { overtimeTableColumnIndex } from '@/factories'
import {
  useStoreAttendanceSelects,
  useStoreEmployeeSelects,
  useStoreOvertime,
} from '@/store'
import type { OvertimeTableRow } from '@/types'

const EMPLOYEE_NAME_COLUMN_INDEX = overtimeTableColumnIndex.employeeName

export default function OvertimeDashboardPage() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [detailRowId, setDetailRowId] = useState<string | null>(null)
  const [detailName, setDetailName] = useState('')

  const pagination = useStoreOvertime((s) => s.pagination)
  const listError = useStoreOvertime((s) => s.operationStatus.list.error)
  const clearOperationStatus = useStoreOvertime((s) => s.clearOperationStatus)
  const getOvertime = useStoreOvertime((s) => s.getOvertime)
  const getOvertimeTypes = useStoreOvertime((s) => s.getOvertimeTypes)

  const employeeOptionsError = useStoreAttendanceSelects((s) => s.attendanceEmployeeOptionsErrorMessage)
  const clearEmployeeOptionsError = useStoreAttendanceSelects((s) => s.clearAttendanceEmployeeOptionsStatus)
  const getAttendanceEmployeeOptions = useStoreAttendanceSelects((s) => s.getAttendanceEmployeeOptions)
  const costCenterOptionsError = useStoreEmployeeSelects((s) => s.formOptionsErrorMessage)
  const clearCostCenterOptionsError = useStoreEmployeeSelects((s) => s.clearFormOptionsStatus)
  const getCostCenterFormOptions = useStoreEmployeeSelects((s) => s.getFormOptions)

  useEffect(() => {
    void getOvertime()
    void getOvertimeTypes()
    void getAttendanceEmployeeOptions()
    void getCostCenterFormOptions()
  }, [getOvertime, getOvertimeTypes, getAttendanceEmployeeOptions, getCostCenterFormOptions])

  const handleViewDetail = (row: OvertimeTableRow) => {
    setDetailRowId(row.id)
    setDetailName(String(row.values[EMPLOYEE_NAME_COLUMN_INDEX] ?? 'Hora extra'))
  }

  const handleCloseDetail = () => {
    setDetailRowId(null)
    setDetailName('')
  }

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · HORAS EXTRAS</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de horas extras</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total registros"
        activeLabel="Aprobadas"
        pendingLabel="Pendientes"
        total={pagination.total}
        active={pagination.active}
        pending={pagination.pending}
      />

      {listError && (
        <AlertMessageComponent message={listError} tone="error" onClose={() => clearOperationStatus('list')} />
      )}
      {employeeOptionsError && (
        <AlertMessageComponent message={employeeOptionsError} tone="error" onClose={clearEmployeeOptionsError} />
      )}
      {costCenterOptionsError && (
        <AlertMessageComponent message={costCenterOptionsError} tone="error" onClose={clearCostCenterOptionsError} />
      )}

      <OvertimeListToolbarComponent onOpenFilters={() => setFiltersOpen(true)} />
      <OvertimeListTableComponent onViewDetail={handleViewDetail} />

      <OvertimeListFiltersSidebarComponent open={filtersOpen} onClose={() => setFiltersOpen(false)} />
      <OvertimeListDetailSidebarComponent
        rowId={detailRowId}
        fallbackName={detailName}
        onClose={handleCloseDetail}
      />
    </section>
  )
}
