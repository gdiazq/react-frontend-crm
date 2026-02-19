import { type ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useStoreAuth } from '@/store'

interface ProtectedRouteProps {
  children: ReactNode
  requiresPermissions?: boolean
  module?: string
  permissionType?: 'canRead' | 'canCreate' | 'canUpdate' | 'canDelete'
}

export function ProtectedRoute({
  children,
  requiresPermissions = false,
  module = '',
  permissionType = 'canRead',
}: ProtectedRouteProps) {
  const user = useStoreAuth((s) => s.user)
  const getCurrentUser = useStoreAuth((s) => s.getCurrentUser)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
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
    return <Navigate to="/login" replace />
  }

  if (requiresPermissions && module && !hasPermission(module, permissionType)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}

interface PublicRouteProps {
  children: ReactNode
}

export function PublicRoute({ children }: PublicRouteProps) {
  const user = useStoreAuth((s) => s.user)
  const location = useLocation()
  const isLogoutRoute = location.pathname === '/logout'

  if (user && !isLogoutRoute) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
