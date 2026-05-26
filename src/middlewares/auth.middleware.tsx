import { type ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import {
  AUTH_ROUTE_DASHBOARD,
  AUTH_ROUTE_LOGIN,
  AUTH_ROUTE_LOGOUT,
  AUTH_ROUTE_UNAUTHORIZED,
  PermissionAction,
} from '@/constant'
import { useStoreAuth } from '@/store'
import { useHasPermission } from '@/hooks'
import type { PermissionActionValue } from '@/constant'

interface ProtectedRouteProps {
  children: ReactNode
  requiresPermissions?: boolean
  module?: string
  permissionType?: PermissionActionValue
}

export function ProtectedRoute({
  children,
  requiresPermissions = false,
  module = '',
  permissionType = PermissionAction.Read,
}: ProtectedRouteProps) {
  const user = useStoreAuth((s) => s.user)
  const getCurrentUser = useStoreAuth((s) => s.getCurrentUser)
  const canAccess = useHasPermission(module, permissionType)
  const [loading, setLoading] = useState(!user)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (user) return
    getCurrentUser()
      .then(() => setLoading(false))
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [getCurrentUser, user])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-sm text-slate-400">Cargando...</p>
      </div>
    )
  }

  if (error || !user) {
    return <Navigate to={AUTH_ROUTE_LOGIN} replace />
  }

  if (requiresPermissions && module && !canAccess) {
    return <Navigate to={AUTH_ROUTE_UNAUTHORIZED} replace />
  }

  return <>{children}</>
}

interface PublicRouteProps {
  children: ReactNode
}

export function PublicRoute({ children }: PublicRouteProps) {
  const user = useStoreAuth((s) => s.user)
  const location = useLocation()
  const isLogoutRoute = location.pathname === AUTH_ROUTE_LOGOUT

  if (user && !isLogoutRoute) {
    return <Navigate to={AUTH_ROUTE_DASHBOARD} replace />
  }

  return <>{children}</>
}
