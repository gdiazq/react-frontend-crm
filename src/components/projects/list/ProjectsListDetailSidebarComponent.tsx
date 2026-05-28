import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DetailSidebarComponent,
  ProjectCostCenterEmployeesTabComponent,
  ProjectDetailComponent,
  TabsComponent,
} from '@/components'
import { AUTH_ROUTE_PROJECTS_EDIT, PermissionAction, PermissionModule } from '@/constant'
import { mapperProjectDetailView } from '@/mappers'
import { useStoreProjects } from '@/store'
import { useHasPermission } from '@/hooks'

type ProjectDetailTabKey = 'detail' | 'employees'

const tabs: { key: ProjectDetailTabKey, label: string }[] = [
  { key: 'detail', label: 'Detalle' },
  { key: 'employees', label: 'Trabajadores' },
]

interface ProjectsListDetailSidebarComponentProps {
  rowId: string | null
  fallbackName: string
  onClose: () => void
}

export function ProjectsListDetailSidebarComponent(props: ProjectsListDetailSidebarComponentProps) {
  const { rowId, fallbackName, onClose } = props

  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<ProjectDetailTabKey>('detail')

  // Store state used to render the detail sidebar.
  const detail = useStoreProjects((s) => s.projectDetail)
  const loading = useStoreProjects((s) => s.operationLoading.detail)
  const error = useStoreProjects((s) => s.operationStatus.detail.error)

  // Store actions triggered by detail lifecycle.
  const getProjectDetail = useStoreProjects((s) => s.getProjectDetail)
  const clearProjectDetail = useStoreProjects((s) => s.clearProjectDetail)

  const canUpdateProject = useHasPermission(PermissionModule.Project, PermissionAction.Update)

  useEffect(() => {
    if (rowId) void getProjectDetail(rowId)
  }, [getProjectDetail, rowId])

  const handleClose = () => {
    clearProjectDetail()
    setActiveTab('detail')
    onClose()
  }

  // View model derived from backend detail.
  const detailView = mapperProjectDetailView(detail)

  return (
    <DetailSidebarComponent
      open={rowId !== null}
      title=""
      size={activeTab === 'employees' ? 'wide' : 'default'}
      headerContent={<TabsComponent tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />}
      onClose={handleClose}
    >
      {activeTab === 'detail' ? (
        <ProjectDetailComponent
          key={rowId ?? 'empty-project-detail'}
          detail={detailView}
          loading={loading}
          errorMessage={error}
          onRetry={() => { if (rowId) void getProjectDetail(rowId) }}
          onEdit={canUpdateProject && rowId ? () => navigate(`${AUTH_ROUTE_PROJECTS_EDIT}=${rowId}`) : undefined}
        />
      ) : (
        <ProjectCostCenterEmployeesTabComponent
          active={activeTab === 'employees'}
          costCenter={detailView?.costCenter ?? null}
          projectName={detailView?.projectName ?? fallbackName}
        />
      )}
    </DetailSidebarComponent>
  )
}
