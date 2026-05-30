import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DetailSidebarComponent, RoleDetailComponent } from '@/components'
import { AUTH_ROUTE_ROLES_EDIT, PermissionAction, PermissionModule } from '@/constant'
import { useHasPermission } from '@/hooks'
import { mapperRoleDetailView } from '@/mappers'
import messages from '@/messages/messages'
import { useStoreRoles } from '@/store'

interface RolesListDetailSidebarComponentProps {
  rowId: string | null
  onClose: () => void
}

export function RolesListDetailSidebarComponent(props: RolesListDetailSidebarComponentProps) {
  const { rowId, onClose } = props
  const navigate = useNavigate()
  const canUpdateRole = useHasPermission(PermissionModule.Role, PermissionAction.Update)
  const detail = useStoreRoles((s) => s.roleDetail)
  const loading = useStoreRoles((s) => s.operationLoading.detail)
  const error = useStoreRoles((s) => s.operationStatus.detail.error)
  const getRoleDetail = useStoreRoles((s) => s.getRoleDetail)
  const clearRoleDetail = useStoreRoles((s) => s.clearRoleDetail)

  useEffect(() => {
    if (rowId) void getRoleDetail(rowId)
  }, [getRoleDetail, rowId])

  const handleClose = () => {
    clearRoleDetail()
    onClose()
  }

  const detailView = mapperRoleDetailView(detail)
  const title = detailView
    ? `Detalle de ${detailView.roleNameDisplay}`
    : messages.roles.ui.detailTitleFallback

  return (
    <DetailSidebarComponent open={rowId !== null} title={title} onClose={handleClose}>
      <RoleDetailComponent
        key={rowId ?? 'empty-role-detail'}
        detail={detailView}
        loading={loading}
        errorMessage={error}
        onRetry={() => { if (rowId) void getRoleDetail(rowId) }}
        onEdit={rowId && canUpdateRole ? () => navigate(`${AUTH_ROUTE_ROLES_EDIT}=${rowId}`) : undefined}
      />
    </DetailSidebarComponent>
  )
}
