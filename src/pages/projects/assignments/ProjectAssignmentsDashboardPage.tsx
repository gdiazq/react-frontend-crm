import { useEffect, useState } from 'react'
import {
  AlertMessageComponent,
  ProjectAssignmentsListDetailSidebarComponent,
  ProjectAssignmentsListFiltersSidebarComponent,
  ProjectAssignmentsListTableComponent,
  ProjectAssignmentsListToolbarComponent,
  StatsOverviewCardsComponent,
} from '@/components'
import { useStoreProjectAssignments, useStoreSelects } from '@/store'
import type { ProjectAssignmentTableRow } from '@/types'

export default function ProjectAssignmentsDashboardPage() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailMode, setDetailMode] = useState<'employee' | 'costCenter'>('employee')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null)
  const [selectedCostCenter, setSelectedCostCenter] = useState<number | null>(null)
  const [selectedDetailName, setSelectedDetailName] = useState('')

  const pagination = useStoreProjectAssignments((s) => s.pagination)
  const listError = useStoreProjectAssignments((s) => s.operationStatus.list.error)
  const clearOperationStatus = useStoreProjectAssignments((s) => s.clearOperationStatus)
  const getProjectAssignments = useStoreProjectAssignments((s) => s.getProjectAssignments)
  const getProjectAssignmentsByEmployee = useStoreProjectAssignments((s) => s.getProjectAssignmentsByEmployee)
  const getProjectAssignmentsByCostCenter = useStoreProjectAssignments((s) => s.getProjectAssignmentsByCostCenter)
  const clearEmployeeProjectAssignments = useStoreProjectAssignments((s) => s.clearEmployeeProjectAssignments)
  const clearCostCenterProjectAssignments = useStoreProjectAssignments((s) => s.clearCostCenterProjectAssignments)
  const projectActiveInactiveOptionsErrorMessage = useStoreSelects((s) => s.projectActiveInactiveOptionsErrorMessage)
  const getProjectActiveInactiveOptions = useStoreSelects((s) => s.getProjectActiveInactiveOptions)
  const clearProjectActiveInactiveOptionsStatus = useStoreSelects((s) => s.clearProjectActiveInactiveOptionsStatus)

  useEffect(() => {
    void getProjectAssignments()
    void getProjectActiveInactiveOptions()
  }, [getProjectAssignments, getProjectActiveInactiveOptions])

  const handleViewEmployeeDetail = (row: ProjectAssignmentTableRow) => {
    setDetailMode('employee')
    setSelectedEmployeeId(row.employeeId)
    setSelectedCostCenter(null)
    setSelectedDetailName(row.employeeName || 'Trabajador')
    setDetailOpen(true)
    clearCostCenterProjectAssignments()
    void getProjectAssignmentsByEmployee(row.employeeId)
  }

  const handleViewCostCenterDetail = (row: ProjectAssignmentTableRow) => {
    setDetailMode('costCenter')
    setSelectedCostCenter(row.costCenter)
    setSelectedEmployeeId(null)
    setSelectedDetailName(row.projectName || `CC ${row.costCenter}`)
    setDetailOpen(true)
    clearEmployeeProjectAssignments()
    void getProjectAssignmentsByCostCenter(row.costCenter)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setSelectedEmployeeId(null)
    setSelectedCostCenter(null)
    setSelectedDetailName('')
  }

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">ÍNDICE · HISTÓRICO</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> histórico</span>
        </h1>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total asignaciones"
        activeLabel="Asignaciones activas"
        pendingLabel="Pendientes"
        total={pagination.total}
        active={pagination.active}
        pending={pagination.pending}
      />

      {listError && 
        <AlertMessageComponent 
          message={listError} 
          tone="error" 
          onClose={() => clearOperationStatus('list')} 
        />
      }
      {projectActiveInactiveOptionsErrorMessage && 
        <AlertMessageComponent 
          message={projectActiveInactiveOptionsErrorMessage} 
          tone="error" 
          onClose={clearProjectActiveInactiveOptionsStatus} 
        />
      }

      <ProjectAssignmentsListToolbarComponent 
        onOpenFilters={() => setFiltersOpen(true)} 
      />

      <ProjectAssignmentsListTableComponent 
        onViewEmployeeDetail={handleViewEmployeeDetail} 
        onViewCostCenterDetail={handleViewCostCenterDetail} 
      />

      <ProjectAssignmentsListFiltersSidebarComponent 
        open={filtersOpen} 
        onClose={() => setFiltersOpen(false)} 
      />
      
      <ProjectAssignmentsListDetailSidebarComponent
        open={detailOpen}
        mode={detailMode}
        employeeId={selectedEmployeeId}
        costCenter={selectedCostCenter}
        fallbackName={selectedDetailName}
        onClose={handleCloseDetail}
      />
    </section>
  )
}
