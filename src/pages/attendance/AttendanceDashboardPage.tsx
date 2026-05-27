import { useEffect, useState } from 'react'
import {
  AlertMessageComponent,
  AttendanceListDetailSidebarComponent,
  AttendanceListFiltersSidebarComponent,
  AttendanceListTableComponent,
  AttendanceListToolbarComponent,
  StatsOverviewCardsComponent,
} from '@/components'
import { attendanceTableColumnIndex } from '@/factories'
import {
  useStoreAttendance,
  useStoreAttendanceSelects,
} from '@/store'
import type { AttendanceTableRow } from '@/types'

const EMPLOYEE_NAME_COLUMN_INDEX = attendanceTableColumnIndex.employeeName

export default function AttendanceDashboardPage() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [detailRowId, setDetailRowId] = useState<string | null>(null)
  const [detailName, setDetailName] = useState('')

  const pagination = useStoreAttendance((s) => s.pagination)
  const listError = useStoreAttendance((s) => s.operationStatus.list.error)
  const clearOperationStatus = useStoreAttendance((s) => s.clearOperationStatus)
  const getAttendance = useStoreAttendance((s) => s.getAttendance)

  const attendanceFormOptionsError = useStoreAttendanceSelects((s) => s.attendanceFormOptionsErrorMessage)
  const clearAttendanceFormOptionsStatus = useStoreAttendanceSelects((s) => s.clearAttendanceFormOptionsStatus)
  const getAttendanceFormOptions = useStoreAttendanceSelects((s) => s.getAttendanceFormOptions)

  const costCenterOptionsError = useStoreAttendanceSelects((s) => s.projectCostCenterOptionsErrorMessage)
  const clearCostCenterOptionsStatus = useStoreAttendanceSelects((s) => s.clearProjectCostCenterOptionsStatus)
  const getProjectCostCenterOptions = useStoreAttendanceSelects((s) => s.getProjectCostCenterOptions)

  useEffect(() => {
    void getAttendance()
    void getAttendanceFormOptions()
    void getProjectCostCenterOptions()
  }, [getAttendance, getAttendanceFormOptions, getProjectCostCenterOptions])

  const handleViewDetail = (row: AttendanceTableRow) => {
    setDetailRowId(row.id)
    setDetailName(String(row.values[EMPLOYEE_NAME_COLUMN_INDEX] ?? 'Asistencia'))
  }

  const handleCloseDetail = () => {
    setDetailRowId(null)
    setDetailName('')
  }

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · ASISTENCIA</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> de asistencia</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total registros"
        activeLabel="Presentes"
        pendingLabel="Pendientes"
        total={pagination.total}
        active={pagination.active}
        pending={pagination.pending}
      />

      {listError && (
        <AlertMessageComponent message={listError} tone="error" onClose={() => clearOperationStatus('list')} />
      )}
      {attendanceFormOptionsError && (
        <AlertMessageComponent message={attendanceFormOptionsError} tone="error" onClose={clearAttendanceFormOptionsStatus} />
      )}
      {costCenterOptionsError && (
        <AlertMessageComponent message={costCenterOptionsError} tone="error" onClose={clearCostCenterOptionsStatus} />
      )}

      <AttendanceListToolbarComponent onOpenFilters={() => setFiltersOpen(true)} />
      <AttendanceListTableComponent onViewDetail={handleViewDetail} />

      <AttendanceListFiltersSidebarComponent open={filtersOpen} onClose={() => setFiltersOpen(false)} />
      <AttendanceListDetailSidebarComponent
        rowId={detailRowId}
        fallbackName={detailName}
        onClose={handleCloseDetail}
      />
    </section>
  )
}
