import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DetailSidebarComponent, SettlementDetailComponent } from '@/components'
import { AUTH_ROUTE_SETTLEMENTS_EDIT, PermissionAction, PermissionModule } from '@/constant'
import { mapperSettlementDetailView } from '@/mappers'
import { storageService } from '@/services'
import { useStoreSettlement } from '@/store'
import { useHasPermission } from '@/hooks'

interface SettlementsListDetailSidebarComponentProps {
  rowId: string | null
  fallbackName: string
  onClose: () => void
}

export function SettlementsListDetailSidebarComponent({ rowId, fallbackName, onClose }: SettlementsListDetailSidebarComponentProps) {
  const navigate = useNavigate()
  const settlementDetail = useStoreSettlement((s) => s.settlementDetail)
  const loadingSettlementDetail = useStoreSettlement((s) => s.operationLoading.detail)
  const detailError = useStoreSettlement((s) => s.operationStatus.detail.error)
  const getSettlementDetail = useStoreSettlement((s) => s.getSettlementDetail)
  const clearSettlementDetail = useStoreSettlement((s) => s.clearSettlementDetail)
  const canUpdate = useHasPermission(PermissionModule.Settlement, PermissionAction.Update)

  useEffect(() => {
    if (rowId) void getSettlementDetail(rowId)
  }, [rowId, getSettlementDetail])

  const handleClose = () => {
    clearSettlementDetail()
    onClose()
  }

  const handleDownloadDocument = (fileId: number) => {
    window.open(storageService.getDownloadUrl(fileId), '_blank', 'noopener,noreferrer')
  }

  const settlementDetailView = mapperSettlementDetailView(settlementDetail)
  const title = settlementDetailView
    ? `Detalle de ${settlementDetailView.employeeFullNameDisplay}`
    : fallbackName
      ? `Detalle de ${fallbackName}`
      : 'Detalle de finiquito'

  return (
    <DetailSidebarComponent open={rowId !== null} title={title} onClose={handleClose}>
      <SettlementDetailComponent
        key={rowId ?? 'empty-settlement-detail'}
        detail={settlementDetailView}
        loading={loadingSettlementDetail}
        errorMessage={detailError}
        onRetry={() => { if (rowId) void getSettlementDetail(rowId) }}
        onEdit={canUpdate && rowId ? () => navigate(`${AUTH_ROUTE_SETTLEMENTS_EDIT}=${rowId}`) : undefined}
        onDownloadDocument={handleDownloadDocument}
      />
    </DetailSidebarComponent>
  )
}
