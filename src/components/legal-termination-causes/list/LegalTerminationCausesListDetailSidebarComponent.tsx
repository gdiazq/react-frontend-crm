import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DetailSidebarComponent, LegalTerminationCauseDetailComponent } from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES_EDIT } from '@/constant'
import { mapperLegalTerminationCauseDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreLegalTerminationCauses } from '@/store'

interface LegalTerminationCausesListDetailSidebarComponentProps {
  rowId: string | null
  onClose: () => void
}

export function LegalTerminationCausesListDetailSidebarComponent(props: LegalTerminationCausesListDetailSidebarComponentProps) {
  const { rowId, onClose } = props
  const navigate = useNavigate()
  const detail = useStoreLegalTerminationCauses((s) => s.legalTerminationCauseDetail)
  const loading = useStoreLegalTerminationCauses((s) => s.operationLoading.detail)
  const error = useStoreLegalTerminationCauses((s) => s.operationStatus.detail.error)
  const getLegalTerminationCauseDetail = useStoreLegalTerminationCauses((s) => s.getLegalTerminationCauseDetail)
  const clearLegalTerminationCauseDetail = useStoreLegalTerminationCauses((s) => s.clearLegalTerminationCauseDetail)

  useEffect(() => {
    if (rowId) void getLegalTerminationCauseDetail(rowId)
  }, [getLegalTerminationCauseDetail, rowId])

  const handleClose = () => {
    clearLegalTerminationCauseDetail()
    onClose()
  }

  const detailView = mapperLegalTerminationCauseDetailView(detail)
  const title = detailView
    ? `Detalle de ${detailView.nameDisplay}`
    : messages.legalTerminationCauses.ui.detailTitleFallback

  return (
    <DetailSidebarComponent open={rowId !== null} title={title} onClose={handleClose}>
      <LegalTerminationCauseDetailComponent
        key={rowId ?? 'empty-legal-termination-cause-detail'}
        detail={detailView}
        loading={loading}
        errorMessage={error}
        onRetry={() => { if (rowId) void getLegalTerminationCauseDetail(rowId) }}
        onEdit={rowId ? () => navigate(`${AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES_EDIT}=${rowId}`) : undefined}
      />
    </DetailSidebarComponent>
  )
}
