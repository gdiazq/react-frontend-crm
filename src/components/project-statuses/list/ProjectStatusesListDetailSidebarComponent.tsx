import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DetailSidebarComponent, ProjectStatusDetailComponent } from '@/components'
import { AUTH_ROUTE_PROJECT_STATUSES_EDIT } from '@/constant'
import { mapperProjectStatusDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreProjectStatuses } from '@/store'

interface ProjectStatusesListDetailSidebarComponentProps {
  rowId: string | null
  onClose: () => void
}

export function ProjectStatusesListDetailSidebarComponent(props: ProjectStatusesListDetailSidebarComponentProps) {
  const { rowId, onClose } = props

  const navigate = useNavigate()

  // Store state used to render the detail sidebar.
  const detail = useStoreProjectStatuses((s) => s.projectStatusDetail)
  const loading = useStoreProjectStatuses((s) => s.operationLoading.detail)
  const error = useStoreProjectStatuses((s) => s.operationStatus.detail.error)

  // Store actions triggered by detail lifecycle.
  const getProjectStatusDetail = useStoreProjectStatuses((s) => s.getProjectStatusDetail)
  const clearProjectStatusDetail = useStoreProjectStatuses((s) => s.clearProjectStatusDetail)

  useEffect(() => {
    if (rowId) void getProjectStatusDetail(rowId)
  }, [getProjectStatusDetail, rowId])

  const handleClose = () => {
    clearProjectStatusDetail()
    onClose()
  }

  // View model derived from backend detail.
  const detailView = mapperProjectStatusDetailView(detail)
  const title = detailView
    ? `Detalle de ${detailView.nameDisplay}`
    : messages.projectStatuses.ui.detailTitleFallback

  return (
    <DetailSidebarComponent open={rowId !== null} title={title} onClose={handleClose}>
      <ProjectStatusDetailComponent
        key={rowId ?? 'empty-project-status-detail'}
        detail={detailView}
        loading={loading}
        errorMessage={error}
        onRetry={() => { if (rowId) void getProjectStatusDetail(rowId) }}
        onEdit={rowId ? () => navigate(`${AUTH_ROUTE_PROJECT_STATUSES_EDIT}=${rowId}`) : undefined}
      />
    </DetailSidebarComponent>
  )
}
