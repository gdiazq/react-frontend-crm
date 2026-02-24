import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute, PublicRoute } from '@/middlewares/auth.middleware'
import { LayoutPrivateDefault } from '@/layouts'

// Lazy-load pages
const LoginPage = lazy(() => import('@/pages/public/LoginPage'))
const LoginCredentialsPage = lazy(() => import('@/pages/public/LoginCredentialsPage'))
const RegisterPage = lazy(() => import('@/pages/public/RegisterPage'))
const RecoveryPage = lazy(() => import('@/pages/public/RecoveryPage'))
const VerifyEmailPage = lazy(() => import('@/pages/public/VerifyEmailPage'))
const CreatePasswordPage = lazy(() => import('@/pages/public/CreatePasswordPage'))
const LogoutPage = lazy(() => import('@/pages/public/LogoutPage'))
const DashboardExamplePage = lazy(() => import('@/pages/public/DashboardExamplePage'))
const HomePage = lazy(() => import('@/pages/frontpage/HomePage'))
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'))
const UsersDashboardPage = lazy(() => import('@/pages/users/UsersDashboardPage'))
const UsersFormDashboardPage = lazy(() => import('@/pages/users/UsersFormDashboardPage'))
const RolesDashboardPage = lazy(() => import('@/pages/roles/RolesDashboardPage'))
const RolesFormDashboardPage = lazy(() => import('@/pages/roles/RolesFormDashboardPage'))
const UnauthorizedPage = lazy(() => import('@/pages/errors/UnauthorizedPage'))
const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'))

const pageLoaderFallback = (
  <div className="flex min-h-screen items-center justify-center bg-slate-950">
    <p className="text-sm text-slate-400">Cargando...</p>
  </div>
)

function wrap(element: React.ReactElement) {
  return <Suspense fallback={pageLoaderFallback}>{element}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: wrap(
      <PublicRoute>
        <LoginPage />
      </PublicRoute>,
    ),
  },
  {
    path: '/login/credentials',
    element: wrap(
      <PublicRoute>
        <LoginCredentialsPage />
      </PublicRoute>,
    ),
  },
  {
    path: '/register',
    element: wrap(
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>,
    ),
  },
  {
    path: '/recovery',
    element: wrap(
      <PublicRoute>
        <RecoveryPage />
      </PublicRoute>,
    ),
  },
  {
    path: '/verify-email',
    element: wrap(
      <PublicRoute>
        <VerifyEmailPage />
      </PublicRoute>,
    ),
  },
  {
    path: '/create-password',
    element: wrap(
      <PublicRoute>
        <CreatePasswordPage />
      </PublicRoute>,
    ),
  },
  {
    path: '/logout',
    element: wrap(
      <PublicRoute>
        <LogoutPage />
      </PublicRoute>,
    ),
  },
  {
    path: '/dashboard-example',
    element: wrap(<DashboardExamplePage />),
  },
  {
    path: '/',
    element: wrap(<HomePage />),
  },
  {
    element: wrap(
      <ProtectedRoute>
        <LayoutPrivateDefault />
      </ProtectedRoute>,
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
      {
        path: '/users',
        element: <UsersDashboardPage />,
      },
      {
        path: '/roles',
        element: <RolesDashboardPage />,
      },
      {
        path: '/roles/new',
        element: <RolesFormDashboardPage />,
      },
      {
        path: '/roles/:editId',
        element: <RolesFormDashboardPage />,
      },
      {
        path: '/users/new',
        element: <UsersFormDashboardPage />,
      },
      {
        path: '/users/:editId',
        element: <UsersFormDashboardPage />,
      },
      {
        path: '/unauthorized',
        element: <UnauthorizedPage />,
      },
    ],
  },
  {
    path: '*',
    element: wrap(<NotFoundPage />),
  },
])
