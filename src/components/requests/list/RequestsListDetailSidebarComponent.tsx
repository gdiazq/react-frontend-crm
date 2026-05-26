import { useEffect } from 'react'
import {
  DetailSidebarComponent,
  RequestDetailComponent,
} from '@/components'
import { PermissionAction, PermissionModule } from '@/constant'
import { requestsTableColumnIndex } from '@/factories'
import { mapperRequestDetailView } from '@/mappers'
import { useStoreRequests } from '@/store'
import { useHasPermission } from '@/hooks'
import type { RequestTableRow } from '@/types'

const FINAL_REQUEST_STATUS_IDS = new Set([3, 4])
const REQUEST_NAME_COLUMN_INDEX = requestsTableColumnIndex.name

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

  const canUpdate = useHasPermission(PermissionModule.HrRequest, PermissionAction.Update)
  const requestDetailView = mapperRequestDetailView(requestDetail)
  const canAct = canUpdate && row ? !FINAL_REQUEST_STATUS_IDS.has(row.statusId) : false
  const fallbackName = row ? String(row.values[REQUEST_NAME_COLUMN_INDEX] ?? 'Solicitud') : ''
  const title = requestDetailView
    ? `Detalle de ${requestDetailView.fullName}`
    : fallbackName
      ? `Detalle de ${fallbackName}`
      : 'Detalle de solicitud'

  return (
    <DetailSidebarComponent open={row !== null} title={title} onClose={handleClose}>
      <RequestDetailComponent
        key={row?.id ?? 'empty-request-detail'}
        detail={requestDetailView}
        loading={loadingRequestDetail}
        errorMessage={detailError}
        onRetry={() => { if (row) void getRequestDetail(row.id) }}
        onApprove={canAct && row ? () => onApprove(row) : undefined}
        onReject={canAct && row ? () => onReject(row) : undefined}
      />
    </DetailSidebarComponent>
  )
}
