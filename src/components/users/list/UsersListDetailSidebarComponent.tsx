import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DetailSidebarComponent, UserDetailComponent } from '@/components'
import { AUTH_ROUTE_USERS_EDIT } from '@/constant'
import { mapperUserDetailView } from '@/mappers'
import { useStoreUsers } from '@/store'

interface UsersListDetailSidebarComponentProps {
  rowId: string | null
  fallbackName: string
  onClose: () => void
}

export function UsersListDetailSidebarComponent({ rowId, fallbackName, onClose }: UsersListDetailSidebarComponentProps) {
  const navigate = useNavigate()
  const detail = useStoreUsers((s) => s.userDetail)
  const loading = useStoreUsers((s) => s.operationLoading.detail)
  const error = useStoreUsers((s) => s.operationStatus.detail.error)
  const getUserDetail = useStoreUsers((s) => s.getUserDetail)
  const clearUserDetail = useStoreUsers((s) => s.clearUserDetail)

  useEffect(() => {
    if (rowId) void getUserDetail(rowId)
  }, [rowId, getUserDetail])

  const handleClose = () => {
    clearUserDetail()
    onClose()
  }

  const detailView = mapperUserDetailView(detail)
  const title = detail
    ? `Detalle de ${detail.username}`
    : fallbackName
      ? `Detalle de ${fallbackName}`
      : 'Detalle de usuario'

  return (
    <DetailSidebarComponent open={rowId !== null} title={title} onClose={handleClose}>
      <UserDetailComponent
        key={rowId ?? 'empty-user-detail'}
        detail={detailView}
        loading={loading}
        errorMessage={error}
        onRetry={() => { if (rowId) void getUserDetail(rowId) }}
        onEdit={rowId ? () => navigate(`${AUTH_ROUTE_USERS_EDIT}=${rowId}`) : undefined}
      />
    </DetailSidebarComponent>
  )
}
