import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DetailSidebarComponent, ProjectTypeDetailComponent } from '@/components'
import { AUTH_ROUTE_PROJECT_TYPES_EDIT } from '@/constant'
import { mapperProjectTypeDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreProjectTypes } from '@/store'

interface ProjectTypesListDetailSidebarComponentProps {
  rowId: string | null
  onClose: () => void
}

export function ProjectTypesListDetailSidebarComponent(props: ProjectTypesListDetailSidebarComponentProps) {
  const { rowId, onClose } = props
  const navigate = useNavigate()
  const detail = useStoreProjectTypes((s) => s.projectTypeDetail)
  const loading = useStoreProjectTypes((s) => s.operationLoading.detail)
  const error = useStoreProjectTypes((s) => s.operationStatus.detail.error)
  const getProjectTypeDetail = useStoreProjectTypes((s) => s.getProjectTypeDetail)
  const clearProjectTypeDetail = useStoreProjectTypes((s) => s.clearProjectTypeDetail)

  useEffect(() => {
    if (rowId) void getProjectTypeDetail(rowId)
  }, [getProjectTypeDetail, rowId])

  const handleClose = () => {
    clearProjectTypeDetail()
    onClose()
  }

  const detailView = mapperProjectTypeDetailView(detail)
  const title = detailView
    ? `Detalle de ${detailView.nameDisplay}`
    : messages.projectTypes.ui.detailTitleFallback

  return (
    <DetailSidebarComponent open={rowId !== null} title={title} onClose={handleClose}>
      <ProjectTypeDetailComponent
        key={rowId ?? 'empty-project-type-detail'}
        detail={detailView}
        loading={loading}
        errorMessage={error}
        onRetry={() => { if (rowId) void getProjectTypeDetail(rowId) }}
        onEdit={rowId ? () => navigate(`${AUTH_ROUTE_PROJECT_TYPES_EDIT}=${rowId}`) : undefined}
      />
    </DetailSidebarComponent>
  )
}
