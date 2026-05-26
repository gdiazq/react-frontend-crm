import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AttendanceDetailComponent, DetailSidebarComponent } from '@/components'
import { AUTH_ROUTE_ATTENDANCE_EDIT, PermissionAction, PermissionModule } from '@/constant'
import { mapperAttendanceDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreAttendance } from '@/store'
import { useHasPermission } from '@/hooks'

interface AttendanceListDetailSidebarComponentProps {
  rowId: string | null
  fallbackName: string
  onClose: () => void
}

export function AttendanceListDetailSidebarComponent(props: AttendanceListDetailSidebarComponentProps) {
  const { rowId, fallbackName, onClose } = props
  const navigate = useNavigate()
  const detail = useStoreAttendance((s) => s.attendanceDetail)
  const loading = useStoreAttendance((s) => s.operationLoading.detail)
  const error = useStoreAttendance((s) => s.operationStatus.detail.error)
  const getAttendanceDetail = useStoreAttendance((s) => s.getAttendanceDetail)
  const clearAttendanceDetail = useStoreAttendance((s) => s.clearAttendanceDetail)
  const canUpdate = useHasPermission(PermissionModule.Attendance, PermissionAction.Update)

  useEffect(() => {
    if (rowId) void getAttendanceDetail(rowId)
  }, [rowId, getAttendanceDetail])

  const handleClose = () => {
    clearAttendanceDetail()
    onClose()
  }

  const detailView = mapperAttendanceDetailView(detail)
  const title = detailView
    ? `Detalle de ${detailView.employeeName}`
    : fallbackName
      ? `Detalle de ${fallbackName}`
      : messages.attendance.ui.detailTitleFallback

  return (
    <DetailSidebarComponent open={rowId !== null} title={title} onClose={handleClose}>
      <AttendanceDetailComponent
        key={rowId ?? 'empty-attendance-detail'}
        detail={detailView}
        loading={loading}
        errorMessage={error}
        onRetry={() => { if (rowId) void getAttendanceDetail(rowId) }}
        onEdit={canUpdate && rowId ? () => navigate(`${AUTH_ROUTE_ATTENDANCE_EDIT}=${rowId}`) : undefined}
      />
    </DetailSidebarComponent>
  )
}
