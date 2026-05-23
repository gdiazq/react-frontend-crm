import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DetailSidebarComponent, QualityOfWorkDetailComponent } from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY_EDIT } from '@/constant'
import { mapperQualityOfWorkDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreQualityOfWork } from '@/store'

interface QualityOfWorkListDetailSidebarComponentProps {
  rowId: string | null
  onClose: () => void
}

export function QualityOfWorkListDetailSidebarComponent(props: QualityOfWorkListDetailSidebarComponentProps) {
  const { rowId, onClose } = props
  const navigate = useNavigate()
  const detail = useStoreQualityOfWork((s) => s.qualityOfWorkDetail)
  const loading = useStoreQualityOfWork((s) => s.operationLoading.detail)
  const error = useStoreQualityOfWork((s) => s.operationStatus.detail.error)
  const getQualityOfWorkDetail = useStoreQualityOfWork((s) => s.getQualityOfWorkDetail)
  const clearQualityOfWorkDetail = useStoreQualityOfWork((s) => s.clearQualityOfWorkDetail)

  useEffect(() => {
    if (rowId) void getQualityOfWorkDetail(rowId)
  }, [getQualityOfWorkDetail, rowId])

  const handleClose = () => {
    clearQualityOfWorkDetail()
    onClose()
  }

  const detailView = mapperQualityOfWorkDetailView(detail)
  const title = detailView
    ? `Detalle de ${detailView.nameDisplay}`
    : messages.qualityOfWork.ui.detailTitleFallback

  return (
    <DetailSidebarComponent open={rowId !== null} title={title} onClose={handleClose}>
      <QualityOfWorkDetailComponent
        key={rowId ?? 'empty-quality-of-work-detail'}
        detail={detailView}
        loading={loading}
        errorMessage={error}
        onRetry={() => { if (rowId) void getQualityOfWorkDetail(rowId) }}
        onEdit={rowId ? () => navigate(`${AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY_EDIT}=${rowId}`) : undefined}
      />
    </DetailSidebarComponent>
  )
}
