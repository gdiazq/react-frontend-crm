import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DetailSidebarComponent, LeaveDetailComponent } from '@/components'
import { AUTH_ROUTE_LEAVES_EDIT, PermissionAction, PermissionModule } from '@/constant'
import { mapperLeaveDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { storageService } from '@/services'
import { useStoreLeaves } from '@/store'
import { useHasPermission } from '@/hooks'

interface LeavesListDetailSidebarComponentProps {
  rowId: string | null
  fallbackName: string
  onClose: () => void
}

export function LeavesListDetailSidebarComponent(props: LeavesListDetailSidebarComponentProps) {
  const { rowId, fallbackName, onClose } = props
  const navigate = useNavigate()
  const detail = useStoreLeaves((s) => s.leaveDetail)
  const loading = useStoreLeaves((s) => s.operationLoading.detail)
  const error = useStoreLeaves((s) => s.operationStatus.detail.error)
  const getLeaveDetail = useStoreLeaves((s) => s.getLeaveDetail)
  const clearLeaveDetail = useStoreLeaves((s) => s.clearLeaveDetail)
  const canUpdate = useHasPermission(PermissionModule.Leave, PermissionAction.Update)

  useEffect(() => {
    if (rowId) void getLeaveDetail(rowId)
  }, [getLeaveDetail, rowId])

  const handleClose = () => {
    clearLeaveDetail()
    onClose()
  }

  const handleDownloadDocument = (fileId: number) => {
    window.open(storageService.getDownloadUrl(fileId), '_blank', 'noopener,noreferrer')
  }

  const detailView = mapperLeaveDetailView(detail)
  const title = detailView
    ? `Detalle de ${detailView.leaveTypeName}`
    : fallbackName
      ? `Detalle de ${fallbackName}`
      : messages.leaves.ui.detailTitleFallback

  return (
    <DetailSidebarComponent open={rowId !== null} title={title} onClose={handleClose}>
      <LeaveDetailComponent
        key={rowId ?? 'empty-leave-detail'}
        detail={detailView}
        loading={loading}
        errorMessage={error}
        onRetry={() => { if (rowId) void getLeaveDetail(rowId) }}
        onEdit={canUpdate && rowId ? () => navigate(`${AUTH_ROUTE_LEAVES_EDIT}=${rowId}`) : undefined}
        onDownloadDocument={handleDownloadDocument}
      />
    </DetailSidebarComponent>
  )
}
