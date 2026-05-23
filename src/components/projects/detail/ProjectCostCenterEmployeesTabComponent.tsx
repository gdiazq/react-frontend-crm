import { useEffect, useState } from 'react'
import {
  AlertMessageComponent,
  ProjectCostCenterEmployeesFiltersSidebarComponent,
  ProjectCostCenterEmployeesTableComponent,
  ProjectCostCenterEmployeesToolbarComponent,
  StatsOverviewCardsComponent,
} from '@/components'
import { useStoreProjects, useStoreSelects } from '@/store'

interface ProjectCostCenterEmployeesTabComponentProps {
  active: boolean
  costCenter: number | null
  projectName: string
}

export function ProjectCostCenterEmployeesTabComponent({
  active,
  costCenter,
  projectName,
}: ProjectCostCenterEmployeesTabComponentProps) {
  const [filtersOpen, setFiltersOpen] = useState(false)

  const pagination = useStoreProjects((s) => s.costCenterEmployeesPagination)
  const errorMessage = useStoreProjects((s) => s.costCenterEmployeesErrorMessage)
  const getCostCenterEmployees = useStoreProjects((s) => s.getCostCenterEmployees)
  const resetCostCenterEmployees = useStoreProjects((s) => s.resetCostCenterEmployees)
  const clearCostCenterEmployeesError = useStoreProjects((s) => s.clearCostCenterEmployeesError)

  const employeeStatusOptionsErrorMessage = useStoreSelects((s) => s.employeeStatusOptionsErrorMessage)
  const projectActiveInactiveOptionsErrorMessage = useStoreSelects((s) => s.projectActiveInactiveOptionsErrorMessage)
  const getEmployeeStatusOptions = useStoreSelects((s) => s.getEmployeeStatusOptions)
  const getProjectActiveInactiveOptions = useStoreSelects((s) => s.getProjectActiveInactiveOptions)
  const clearEmployeeStatusOptionsStatus = useStoreSelects((s) => s.clearEmployeeStatusOptionsStatus)
  const clearProjectActiveInactiveOptionsStatus = useStoreSelects((s) => s.clearProjectActiveInactiveOptionsStatus)

  useEffect(() => {
    void getEmployeeStatusOptions()
    void getProjectActiveInactiveOptions()
  }, [getEmployeeStatusOptions, getProjectActiveInactiveOptions])

  useEffect(() => {
    resetCostCenterEmployees()
    if (active && Number.isInteger(costCenter) && costCenter !== null && costCenter > 0) {
      void getCostCenterEmployees(costCenter)
    }
  }, [active, costCenter, getCostCenterEmployees, resetCostCenterEmployees])

  return (
    <section className="min-w-0 space-y-4">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">CENTRO COSTO · {costCenter ?? '—'}</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Trabajadores
          <span className="display-it text-slate-500 dark:text-slate-400"> asociados</span>
        </h1>
        <p className="mt-2 max-w-3xl text-[13px] leading-6 text-slate-500 dark:text-slate-400">
          {projectName || 'Proyecto seleccionado'}
        </p>
      </header>

      <StatsOverviewCardsComponent
        totalLabel="Total trabajadores"
        activeLabel="Trabajadores activos"
        total={pagination.total}
        active={pagination.active}
      />

      {errorMessage && (
        <AlertMessageComponent message={errorMessage} tone="error" onClose={clearCostCenterEmployeesError} />
      )}
      {employeeStatusOptionsErrorMessage && (
        <AlertMessageComponent message={employeeStatusOptionsErrorMessage} tone="error" onClose={clearEmployeeStatusOptionsStatus} />
      )}
      {projectActiveInactiveOptionsErrorMessage && (
        <AlertMessageComponent message={projectActiveInactiveOptionsErrorMessage} tone="error" onClose={clearProjectActiveInactiveOptionsStatus} />
      )}

      <ProjectCostCenterEmployeesToolbarComponent
        costCenter={costCenter}
        onOpenFilters={() => setFiltersOpen(true)}
      />

      <ProjectCostCenterEmployeesTableComponent costCenter={costCenter} />

      <ProjectCostCenterEmployeesFiltersSidebarComponent
        open={filtersOpen}
        costCenter={costCenter}
        onClose={() => setFiltersOpen(false)}
      />
    </section>
  )
}
