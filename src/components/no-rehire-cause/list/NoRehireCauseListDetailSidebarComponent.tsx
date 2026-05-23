import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DetailSidebarComponent, NoRehireCauseDetailComponent } from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE_EDIT } from '@/constant'
import { mapperNoRehireCauseDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreNoRehireCause } from '@/store'

interface NoRehireCauseListDetailSidebarComponentProps {
  rowId: string | null
  onClose: () => void
}

export function NoRehireCauseListDetailSidebarComponent(props: NoRehireCauseListDetailSidebarComponentProps) {
  const { rowId, onClose } = props
  const navigate = useNavigate()
  const detail = useStoreNoRehireCause((s) => s.noRehireCauseDetail)
  const loading = useStoreNoRehireCause((s) => s.operationLoading.detail)
  const error = useStoreNoRehireCause((s) => s.operationStatus.detail.error)
  const getNoRehireCauseDetail = useStoreNoRehireCause((s) => s.getNoRehireCauseDetail)
  const clearNoRehireCauseDetail = useStoreNoRehireCause((s) => s.clearNoRehireCauseDetail)

  useEffect(() => {
    if (rowId) void getNoRehireCauseDetail(rowId)
  }, [getNoRehireCauseDetail, rowId])

  const handleClose = () => {
    clearNoRehireCauseDetail()
    onClose()
  }

  const detailView = mapperNoRehireCauseDetailView(detail)
  const title = detailView
    ? `Detalle de ${detailView.nameDisplay}`
    : messages.noRehireCause.ui.detailTitleFallback

  return (
    <DetailSidebarComponent open={rowId !== null} title={title} onClose={handleClose}>
      <NoRehireCauseDetailComponent
        key={rowId ?? 'empty-no-rehire-cause-detail'}
        detail={detailView}
        loading={loading}
        errorMessage={error}
        onRetry={() => { if (rowId) void getNoRehireCauseDetail(rowId) }}
        onEdit={rowId ? () => navigate(`${AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE_EDIT}=${rowId}`) : undefined}
      />
    </DetailSidebarComponent>
  )
}
