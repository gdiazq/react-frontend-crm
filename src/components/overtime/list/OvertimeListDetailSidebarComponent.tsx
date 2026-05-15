import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DetailSidebarComponent, OvertimeDetailComponent } from '@/components'
import { AUTH_ROUTE_OVERTIME_EDIT, PermissionAction, PermissionModule } from '@/constant'
import { mapperOvertimeDetailView } from '@/mappers'
import { useStoreAuth, useStoreOvertime } from '@/store'

interface OvertimeListDetailSidebarComponentProps {
  rowId: string | null
  fallbackName: string
  onClose: () => void
}

export function OvertimeListDetailSidebarComponent({
  rowId,
  fallbackName,
  onClose,
}: OvertimeListDetailSidebarComponentProps) {
  const navigate = useNavigate()
  const detail = useStoreOvertime((s) => s.overtimeDetail)
  const loading = useStoreOvertime((s) => s.operationLoading.detail)
  const error = useStoreOvertime((s) => s.operationStatus.detail.error)
  const getOvertimeDetail = useStoreOvertime((s) => s.getOvertimeDetail)
  const clearOvertimeDetail = useStoreOvertime((s) => s.clearOvertimeDetail)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const canUpdate = hasPermission(PermissionModule.Overtime, PermissionAction.Update)

  useEffect(() => {
    if (rowId) void getOvertimeDetail(rowId)
  }, [rowId, getOvertimeDetail])

  const handleClose = () => {
    clearOvertimeDetail()
    onClose()
  }

  const detailView = mapperOvertimeDetailView(detail)
  const title = detailView
    ? `Detalle de ${detailView.employeeName}`
    : fallbackName
      ? `Detalle de ${fallbackName}`
      : 'Detalle de hora extra'

  return (
    <DetailSidebarComponent open={rowId !== null} title={title} onClose={handleClose}>
      <OvertimeDetailComponent
        key={rowId ?? 'empty-overtime-detail'}
        detail={detailView}
        loading={loading}
        errorMessage={error}
        onRetry={() => { if (rowId) void getOvertimeDetail(rowId) }}
        onEdit={canUpdate && rowId ? () => navigate(`${AUTH_ROUTE_OVERTIME_EDIT}=${rowId}`) : undefined}
      />
    </DetailSidebarComponent>
  )
}
