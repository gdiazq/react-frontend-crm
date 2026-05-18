import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DetailSidebarComponent, ProjectSpecialtyDetailComponent } from '@/components'
import { AUTH_ROUTE_PROJECT_SPECIALTIES_EDIT } from '@/constant'
import { mapperProjectSpecialtyDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreProjectSpecialties } from '@/store'

interface ProjectSpecialtiesListDetailSidebarComponentProps {
  rowId: string | null
  onClose: () => void
}

export function ProjectSpecialtiesListDetailSidebarComponent(props: ProjectSpecialtiesListDetailSidebarComponentProps) {
  const { rowId, onClose } = props
  const navigate = useNavigate()
  const detail = useStoreProjectSpecialties((s) => s.projectSpecialtyDetail)
  const loading = useStoreProjectSpecialties((s) => s.operationLoading.detail)
  const error = useStoreProjectSpecialties((s) => s.operationStatus.detail.error)
  const getProjectSpecialtyDetail = useStoreProjectSpecialties((s) => s.getProjectSpecialtyDetail)
  const clearProjectSpecialtyDetail = useStoreProjectSpecialties((s) => s.clearProjectSpecialtyDetail)

  useEffect(() => {
    if (rowId) void getProjectSpecialtyDetail(rowId)
  }, [getProjectSpecialtyDetail, rowId])

  const handleClose = () => {
    clearProjectSpecialtyDetail()
    onClose()
  }

  const detailView = mapperProjectSpecialtyDetailView(detail)
  const title = detailView
    ? `Detalle de ${detailView.nameDisplay}`
    : messages.projectSpecialties.ui.detailTitleFallback

  return (
    <DetailSidebarComponent open={rowId !== null} title={title} onClose={handleClose}>
      <ProjectSpecialtyDetailComponent
        key={rowId ?? 'empty-project-specialty-detail'}
        detail={detailView}
        loading={loading}
        errorMessage={error}
        onRetry={() => { if (rowId) void getProjectSpecialtyDetail(rowId) }}
        onEdit={rowId ? () => navigate(`${AUTH_ROUTE_PROJECT_SPECIALTIES_EDIT}=${rowId}`) : undefined}
      />
    </DetailSidebarComponent>
  )
}
