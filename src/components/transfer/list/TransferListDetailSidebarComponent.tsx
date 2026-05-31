import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DetailSidebarComponent, TransferDetailComponent } from '@/components'
import { AUTH_ROUTE_TRANSFERS_EDIT, PermissionAction, PermissionModule } from '@/constant'
import { mapperTransferDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { storageService } from '@/services'
import { useStoreTransfer } from '@/store'
import { useHasPermission } from '@/hooks'

interface TransferListDetailSidebarComponentProps {
  rowId: string | null
  fallbackName: string
  onClose: () => void
}

export function TransferListDetailSidebarComponent({ rowId, fallbackName, onClose }: TransferListDetailSidebarComponentProps) {
  const navigate = useNavigate()
  const transferDetail = useStoreTransfer((s) => s.transferDetail)
  const loadingTransferDetail = useStoreTransfer((s) => s.operationLoading.detail)
  const detailError = useStoreTransfer((s) => s.operationStatus.detail.error)
  const getTransferDetail = useStoreTransfer((s) => s.getTransferDetail)
  const clearTransferDetail = useStoreTransfer((s) => s.clearTransferDetail)
  const clearOperationStatus = useStoreTransfer((s) => s.clearOperationStatus)
  const canUpdateTransfer = useHasPermission(PermissionModule.Transfer, PermissionAction.Update)

  useEffect(() => {
    if (rowId) void getTransferDetail(rowId)
  }, [rowId, getTransferDetail])

  const handleClose = () => {
    clearTransferDetail()
    clearOperationStatus('detail')
    onClose()
  }

  const handleDownloadDocument = (fileId: number) => {
    window.open(storageService.getDownloadUrl(fileId), '_blank', 'noopener,noreferrer')
  }

  const detailView = mapperTransferDetailView(transferDetail)
  const detailTitle = detailView
    ? `Detalle de ${detailView.employeeFullNameDisplay}`
    : fallbackName
      ? `Detalle de ${fallbackName}`
      : messages.transfer.ui.detailTitleFallback

  return (
    <DetailSidebarComponent open={rowId !== null} title={detailTitle} onClose={handleClose}>
      <TransferDetailComponent
        key={rowId ?? 'empty-transfer-detail'}
        detail={detailView}
        loading={loadingTransferDetail}
        errorMessage={detailError}
        onRetry={() => { if (rowId) void getTransferDetail(rowId) }}
        onDownloadDocument={handleDownloadDocument}
        onEdit={rowId && canUpdateTransfer ? () => navigate(`${AUTH_ROUTE_TRANSFERS_EDIT}=${rowId}`) : undefined}
      />
    </DetailSidebarComponent>
  )
}
