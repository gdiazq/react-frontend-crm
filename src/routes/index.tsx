import { Navigate, createBrowserRouter } from 'react-router-dom'
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
const RequestsDashboardPage = lazy(() => import('@/pages/requests/RequestsDashboardPage'))
const EmployeesDashboardPage = lazy(() => import('@/pages/employees/EmployeesDashboardPage'))
const ContractsDashboardPage = lazy(() => import('@/pages/contracts/ContractsDashboardPage'))
const ProjectTypesDashboardPage = lazy(() => import('@/pages/projects/ProjectTypesDashboardPage'))
const ProjectTypesFormDashboardPage = lazy(() => import('@/pages/projects/ProjectTypesFormDashboardPage'))
const ContractsFormDashboardPage = lazy(() => import('@/pages/contracts/ContractsFormDashboardPage'))
const EmployeesFormDashboardPage = lazy(() => import('@/pages/employees/EmployeesFormDashboardPage'))
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
        element: (
          <ProtectedRoute requiresPermissions module="USER" permissionType="canRead">
            <UsersDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/requests',
        element: (
          <ProtectedRoute requiresPermissions module="HR_REQUEST" permissionType="canRead">
            <RequestsDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/employees',
        element: (
          <ProtectedRoute requiresPermissions module="EMPLOYEE" permissionType="canRead">
            <EmployeesDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/contracts',
        element: (
          <ProtectedRoute requiresPermissions module="CONTRACT" permissionType="canRead">
            <ContractsDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/projects',
        element: <Navigate to="/projects/types" replace />,
      },
      {
        path: '/projects/types',
        element: (
          <ProtectedRoute requiresPermissions module="PROJECT_TYPE" permissionType="canRead">
            <ProjectTypesDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/projects/types/new',
        element: (
          <ProtectedRoute requiresPermissions module="PROJECT_TYPE" permissionType="canCreate">
            <ProjectTypesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/projects/types/:editId',
        element: (
          <ProtectedRoute requiresPermissions module="PROJECT_TYPE" permissionType="canUpdate">
            <ProjectTypesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/contracts/new',
        element: (
          <ProtectedRoute requiresPermissions module="CONTRACT" permissionType="canCreate">
            <ContractsFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/contracts/:editId',
        element: (
          <ProtectedRoute requiresPermissions module="CONTRACT" permissionType="canUpdate">
            <ContractsFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/employees/new',
        element: (
          <ProtectedRoute requiresPermissions module="EMPLOYEE" permissionType="canCreate">
            <EmployeesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/employees/:editId',
        element: (
          <ProtectedRoute requiresPermissions module="EMPLOYEE" permissionType="canUpdate">
            <EmployeesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/roles',
        element: (
          <ProtectedRoute requiresPermissions module="ROLE" permissionType="canRead">
            <RolesDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/roles/new',
        element: (
          <ProtectedRoute requiresPermissions module="ROLE" permissionType="canCreate">
            <RolesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/roles/:editId',
        element: (
          <ProtectedRoute requiresPermissions module="ROLE" permissionType="canUpdate">
            <RolesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/users/new',
        element: (
          <ProtectedRoute requiresPermissions module="USER" permissionType="canCreate">
            <UsersFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/users/:editId',
        element: (
          <ProtectedRoute requiresPermissions module="USER" permissionType="canUpdate">
            <UsersFormDashboardPage />
          </ProtectedRoute>
        ),
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
