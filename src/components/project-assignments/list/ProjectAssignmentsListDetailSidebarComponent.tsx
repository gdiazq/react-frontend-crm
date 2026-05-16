import { DetailSidebarComponent, ProjectAssignmentCostCenterDetailComponent, ProjectAssignmentEmployeeDetailComponent } from '@/components'
import { mapperProjectAssignmentDetailViews } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreProjectAssignments } from '@/store'

type DetailMode = 'employee' | 'costCenter'

interface ProjectAssignmentsListDetailSidebarComponentProps {
  open: boolean
  mode: DetailMode
  employeeId: number | null
  costCenter: number | null
  fallbackName: string
  onClose: () => void
}

export function ProjectAssignmentsListDetailSidebarComponent(props: ProjectAssignmentsListDetailSidebarComponentProps) {
  const { open, mode, employeeId, costCenter, fallbackName, onClose } = props
  const employeeAssignments = useStoreProjectAssignments((s) => s.employeeProjectAssignments)
  const costCenterAssignments = useStoreProjectAssignments((s) => s.costCenterProjectAssignments)
  const loadingEmployeeAssignments = useStoreProjectAssignments((s) => s.loadingEmployeeProjectAssignments)
  const loadingCostCenterAssignments = useStoreProjectAssignments((s) => s.loadingCostCenterProjectAssignments)
  const detailError = useStoreProjectAssignments((s) => s.operationStatus.detail.error)
  const getProjectAssignmentsByEmployee = useStoreProjectAssignments((s) => s.getProjectAssignmentsByEmployee)
  const getProjectAssignmentsByCostCenter = useStoreProjectAssignments((s) => s.getProjectAssignmentsByCostCenter)
  const clearEmployeeProjectAssignments = useStoreProjectAssignments((s) => s.clearEmployeeProjectAssignments)
  const clearCostCenterProjectAssignments = useStoreProjectAssignments((s) => s.clearCostCenterProjectAssignments)

  const handleClose = () => {
    clearEmployeeProjectAssignments()
    clearCostCenterProjectAssignments()
    onClose()
  }

  const handleRetry = () => {
    if (mode === 'employee' && employeeId) {
      void getProjectAssignmentsByEmployee(employeeId)
      return
    }
    if (mode === 'costCenter' && costCenter) {
      void getProjectAssignmentsByCostCenter(costCenter)
    }
  }

  const employeeItems = mapperProjectAssignmentDetailViews(employeeAssignments)
  const costCenterItems = mapperProjectAssignmentDetailViews(costCenterAssignments)
  const title = fallbackName ? `Detalle de ${fallbackName}` : messages.projectAssignments.ui.detailTitleFallback

  return (
    <DetailSidebarComponent open={open} title={title} onClose={handleClose}>
      {mode === 'employee' ? (
        <ProjectAssignmentEmployeeDetailComponent
          key={employeeId ?? 'empty-project-assignment-employee-detail'}
          items={employeeItems}
          loading={loadingEmployeeAssignments}
          errorMessage={detailError}
          onRetry={handleRetry}
        />
      ) : (
        <ProjectAssignmentCostCenterDetailComponent
          key={costCenter ?? 'empty-project-assignment-cost-center-detail'}
          items={costCenterItems}
          loading={loadingCostCenterAssignments}
          errorMessage={detailError}
          onRetry={handleRetry}
        />
      )}
    </DetailSidebarComponent>
  )
}
