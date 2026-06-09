import { useCallback } from 'react'
import { useStoreAuth } from '@/store'
import type { PermissionActionValue, PermissionModuleValue } from '@/constant'

const actionByPermissionType: Record<PermissionActionValue, string> = {
  canRead: 'READ',
  canCreate: 'CREATE',
  canUpdate: 'UPDATE',
  canDelete: 'DELETE',
  canApprove: 'APPROVE',
  canReject: 'REJECT',
}

const checkPermission = (
  permissions: ReturnType<typeof useStoreAuth.getState>['permissions'],
  userPermissions: readonly string[],
  moduleName: PermissionModuleValue | string,
  permissionType: PermissionActionValue,
): boolean => {
  const module = permissions.find((item) => item.module === moduleName)
  if (module) return Boolean(module[permissionType])

  const permissionCode = `${moduleName}:${actionByPermissionType[permissionType]}`
  return userPermissions.includes(permissionCode)
}

export function useHasPermission(
  moduleName: PermissionModuleValue | string,
  permissionType: PermissionActionValue,
): boolean {
  return useStoreAuth((state) =>
    checkPermission(state.permissions, state.user?.permissions ?? [], moduleName, permissionType),
  )
}

export function useHasPermissionFn() {
  const permissions = useStoreAuth((state) => state.permissions)
  const userPermissions = useStoreAuth((state) => state.user?.permissions ?? [])

  return useCallback(
    (moduleName: PermissionModuleValue | string, 
    permissionType: PermissionActionValue) => checkPermission(permissions, userPermissions, moduleName, permissionType),
    [permissions, userPermissions],
  )
}
