import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AUTH_ROUTE_HOME } from '@/constant'
import { useStoreAuth } from '@/store'

export default function LogoutPage() {
  const navigate = useNavigate()
  const logout = useStoreAuth((s) => s.logout)

  useEffect(() => {
    logout().then(() => navigate(AUTH_ROUTE_HOME))
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <p className="text-sm text-slate-600">Cerrando sesion…</p>
    </main>
  )
}
