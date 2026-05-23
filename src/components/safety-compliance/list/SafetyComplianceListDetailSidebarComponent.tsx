import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DetailSidebarComponent, SafetyComplianceDetailComponent } from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE_EDIT } from '@/constant'
import { mapperSafetyComplianceDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreSafetyCompliance } from '@/store'

interface SafetyComplianceListDetailSidebarComponentProps {
  rowId: string | null
  onClose: () => void
}

export function SafetyComplianceListDetailSidebarComponent(props: SafetyComplianceListDetailSidebarComponentProps) {
  const { rowId, onClose } = props
  const navigate = useNavigate()
  const detail = useStoreSafetyCompliance((s) => s.safetyComplianceDetail)
  const loading = useStoreSafetyCompliance((s) => s.operationLoading.detail)
  const error = useStoreSafetyCompliance((s) => s.operationStatus.detail.error)
  const getSafetyComplianceDetail = useStoreSafetyCompliance((s) => s.getSafetyComplianceDetail)
  const clearSafetyComplianceDetail = useStoreSafetyCompliance((s) => s.clearSafetyComplianceDetail)

  useEffect(() => {
    if (rowId) void getSafetyComplianceDetail(rowId)
  }, [getSafetyComplianceDetail, rowId])

  const handleClose = () => {
    clearSafetyComplianceDetail()
    onClose()
  }

  const detailView = mapperSafetyComplianceDetailView(detail)
  const title = detailView
    ? `Detalle de ${detailView.nameDisplay}`
    : messages.safetyCompliance.ui.detailTitleFallback

  return (
    <DetailSidebarComponent open={rowId !== null} title={title} onClose={handleClose}>
      <SafetyComplianceDetailComponent
        key={rowId ?? 'empty-safety-compliance-detail'}
        detail={detailView}
        loading={loading}
        errorMessage={error}
        onRetry={() => { if (rowId) void getSafetyComplianceDetail(rowId) }}
        onEdit={rowId ? () => navigate(`${AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE_EDIT}=${rowId}`) : undefined}
      />
    </DetailSidebarComponent>
  )
}
