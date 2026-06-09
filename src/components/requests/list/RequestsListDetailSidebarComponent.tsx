import { useEffect } from 'react'
import {
  DetailSidebarComponent,
  RequestDetailComponent,
} from '@/components'
import { PermissionAction, PermissionModule } from '@/constant'
import { isFinalRequestStatus, mapperRequestDetailTitle, mapperRequestDetailView } from '@/mappers'
import { useStoreRequests } from '@/store'
import { useHasPermission } from '@/hooks'
import type { RequestTableRow } from '@/types'

interface RequestsListDetailSidebarComponentProps {
  row: RequestTableRow | null
  onClose: () => void
  onApprove: (row: RequestTableRow) => void
  onReject: (row: RequestTableRow) => void
}

export function RequestsListDetailSidebarComponent(props: RequestsListDetailSidebarComponentProps) {
  const { row, onClose, onApprove, onReject } = props
  const requestDetail = useStoreRequests((s) => s.requestDetail)
  const loadingRequestDetail = useStoreRequests((s) => s.operationLoading.detail)
  const detailError = useStoreRequests((s) => s.operationStatus.detail.error)
  const getRequestDetail = useStoreRequests((s) => s.getRequestDetail)
  const clearRequestDetail = useStoreRequests((s) => s.clearRequestDetail)

  useEffect(() => {
    if (row) void getRequestDetail(row.id)
  }, [getRequestDetail, row])

  const handleClose = () => {
    clearRequestDetail()
    onClose()
  }

  const canApprove = useHasPermission(PermissionModule.HrRequest, PermissionAction.Approve)
  const canReject = useHasPermission(PermissionModule.HrRequest, PermissionAction.Reject)
  const requestDetailView = mapperRequestDetailView(requestDetail)
  const isActionable = row ? !isFinalRequestStatus(row.statusId) : false
  const fallbackName = row?.displayName ?? ''
  const title = mapperRequestDetailTitle(requestDetailView, fallbackName)

  return (
    <DetailSidebarComponent open={row !== null} title={title} onClose={handleClose}>
      <RequestDetailComponent
        key={row?.id ?? 'empty-request-detail'}
        detail={requestDetailView}
        loading={loadingRequestDetail}
        errorMessage={detailError}
        onRetry={() => { if (row) void getRequestDetail(row.id) }}
        onApprove={isActionable && canApprove && row ? () => onApprove(row) : undefined}
        onReject={isActionable && canReject && row ? () => onReject(row) : undefined}
      />
    </DetailSidebarComponent>
  )
}
