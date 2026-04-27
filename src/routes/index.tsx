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
const RequestsDashboardPage = lazy(() => import('@/pages/requests/RequestsDashboardPage'))
const EmployeesDashboardPage = lazy(() => import('@/pages/employees/EmployeesDashboardPage'))
const AnnexesDashboardPage = lazy(() => import('@/pages/annexes/AnnexesDashboardPage'))
const AnnexesFormDashboardPage = lazy(() => import('@/pages/annexes/AnnexesFormDashboardPage'))
const ContractsDashboardPage = lazy(() => import('@/pages/contracts/ContractsDashboardPage'))
const TransfersDashboardPage = lazy(() => import('@/pages/transfers/TransfersDashboardPage'))
const ProjectsDashboardPage = lazy(() => import('@/pages/projects/ProjectsDashboardPage'))
const ProjectStatusesDashboardPage = lazy(() => import('@/pages/projects/ProjectStatusesDashboardPage'))
const ProjectStatusesFormDashboardPage = lazy(() => import('@/pages/projects/ProjectStatusesFormDashboardPage'))
const ProjectSpecialtiesDashboardPage = lazy(() => import('@/pages/projects/ProjectSpecialtiesDashboardPage'))
const ProjectSpecialtiesFormDashboardPage = lazy(() => import('@/pages/projects/ProjectSpecialtiesFormDashboardPage'))
const ProjectsFormDashboardPage = lazy(() => import('@/pages/projects/ProjectsFormDashboardPage'))
const ProjectTypesDashboardPage = lazy(() => import('@/pages/projects/ProjectTypesDashboardPage'))
const ProjectTypesFormDashboardPage = lazy(() => import('@/pages/projects/ProjectTypesFormDashboardPage'))
const ContractsFormDashboardPage = lazy(() => import('@/pages/contracts/ContractsFormDashboardPage'))
const TransferFormDashboardPage = lazy(() => import('@/pages/transfers/TransferFormDashboardPage'))
const EmployeesFormDashboardPage = lazy(() => import('@/pages/employees/EmployeesFormDashboardPage'))
const UsersFormDashboardPage = lazy(() => import('@/pages/users/UsersFormDashboardPage'))
const RolesDashboardPage = lazy(() => import('@/pages/roles/RolesDashboardPage'))
const RolesFormDashboardPage = lazy(() => import('@/pages/roles/RolesFormDashboardPage'))
const SettlementsDashboardPage = lazy(() => import('@/pages/settlements/SettlementsDashboardPage'))
const SettlementFormDashboardPage = lazy(() => import('@/pages/settlements/SettlementFormDashboardPage'))
const LegalTerminationCausesDashboardPage = lazy(() => import('@/pages/settlements/LegalTerminationCausesDashboardPage'))
const LegalTerminationCausesFormDashboardPage = lazy(() => import('@/pages/settlements/LegalTerminationCausesFormDashboardPage'))
const SettlementsWorkQualityDashboardPage = lazy(() => import('@/pages/settlements/WorkQualityDashboardPage'))
const SettlementsWorkQualityFormDashboardPage = lazy(() => import('@/pages/settlements/WorkQualityFormDashboardPage'))
const SafetyComplianceDashboardPage = lazy(() => import('@/pages/settlements/SafetyComplianceDashboardPage'))
const SafetyComplianceFormDashboardPage = lazy(() => import('@/pages/settlements/SafetyComplianceFormDashboardPage'))
const NoRehireCauseDashboardPage = lazy(() => import('@/pages/settlements/NoRehireCauseDashboardPage'))
const NoRehireCauseFormDashboardPage = lazy(() => import('@/pages/settlements/NoRehireCauseFormDashboardPage'))
const TerminationQuizQuestionDashboardPage = lazy(() => import('@/pages/settlements/TerminationQuizQuestionDashboardPage'))
const TerminationQuizQuestionFormDashboardPage = lazy(() => import('@/pages/settlements/TerminationQuizQuestionFormDashboardPage'))
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
        path: '/annexes',
        element: (
          <ProtectedRoute requiresPermissions module="ANNEX" permissionType="canRead">
            <AnnexesDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/annexes/new',
        element: (
          <ProtectedRoute requiresPermissions module="ANNEX" permissionType="canCreate">
            <AnnexesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/annexes/:editId',
        element: (
          <ProtectedRoute requiresPermissions module="ANNEX" permissionType="canUpdate">
            <AnnexesFormDashboardPage />
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
        path: '/transfers',
        element: (
          <ProtectedRoute requiresPermissions module="TRANSFER" permissionType="canRead">
            <TransfersDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/settlements',
        element: <SettlementsDashboardPage />,
      },
      {
        path: '/settlements/new',
        element: <SettlementFormDashboardPage />,
      },
      {
        path: '/settlements/:editId',
        element: <SettlementFormDashboardPage />,
      },
      {
        path: '/settlements/termination-causes',
        element: <LegalTerminationCausesDashboardPage />,
      },
      {
        path: '/settlements/termination-causes/new',
        element: <LegalTerminationCausesFormDashboardPage />,
      },
      {
        path: '/settlements/termination-causes/:editId',
        element: <LegalTerminationCausesFormDashboardPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
      {
        path: '/settlements/work-quality',
        element: <SettlementsWorkQualityDashboardPage />,
      },
      {
        path: '/settlements/work-quality/new',
        element: <SettlementsWorkQualityFormDashboardPage />,
      },
      {
        path: '/settlements/work-quality/:editId',
        element: <SettlementsWorkQualityFormDashboardPage />,
      },
      {
        path: '/settlements/safety-compliance',
        element: <SafetyComplianceDashboardPage />,
      },
      {
        path: '/settlements/safety-compliance/new',
        element: <SafetyComplianceFormDashboardPage />,
      },
      {
        path: '/settlements/safety-compliance/:editId',
        element: <SafetyComplianceFormDashboardPage />,
      },
      {
        path: '/settlements/no-rehire-cause',
        element: <NoRehireCauseDashboardPage />,
      },
      {
        path: '/settlements/no-rehire-cause/new',
        element: <NoRehireCauseFormDashboardPage />,
      },
      {
        path: '/settlements/no-rehire-cause/:editId',
        element: <NoRehireCauseFormDashboardPage />,
      },
      {
        path: '/settlements/termination-quiz-question',
        element: <TerminationQuizQuestionDashboardPage />,
      },
      {
        path: '/settlements/termination-quiz-question/new',
        element: <TerminationQuizQuestionFormDashboardPage />,
      },
      {
        path: '/settlements/termination-quiz-question/:editId',
        element: <TerminationQuizQuestionFormDashboardPage />,
      },
      {
        path: '/projects',
        element: (
          <ProtectedRoute requiresPermissions module="PROJECT" permissionType="canRead">
            <ProjectsDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/projects/new',
        element: (
          <ProtectedRoute requiresPermissions module="PROJECT" permissionType="canCreate">
            <ProjectsFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/projects/:editId',
        element: (
          <ProtectedRoute requiresPermissions module="PROJECT" permissionType="canUpdate">
            <ProjectsFormDashboardPage />
          </ProtectedRoute>
        ),
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
        path: '/projects/specialties',
        element: (
          <ProtectedRoute requiresPermissions module="PROJECT_SPECIALTY" permissionType="canRead">
            <ProjectSpecialtiesDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/projects/specialties/new',
        element: (
          <ProtectedRoute requiresPermissions module="PROJECT_SPECIALTY" permissionType="canCreate">
            <ProjectSpecialtiesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/projects/specialties/:editId',
        element: (
          <ProtectedRoute requiresPermissions module="PROJECT_SPECIALTY" permissionType="canUpdate">
            <ProjectSpecialtiesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/projects/statuses',
        element: (
          <ProtectedRoute requiresPermissions module="PROJECT_STATUS" permissionType="canRead">
            <ProjectStatusesDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/projects/statuses/new',
        element: (
          <ProtectedRoute requiresPermissions module="PROJECT_STATUS" permissionType="canCreate">
            <ProjectStatusesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/projects/statuses/:editId',
        element: (
          <ProtectedRoute requiresPermissions module="PROJECT_STATUS" permissionType="canUpdate">
            <ProjectStatusesFormDashboardPage />
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
        path: '/transfers/new',
        element: (
          <ProtectedRoute requiresPermissions module="TRANSFER" permissionType="canCreate">
            <TransferFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/transfers/:editId',
        element: (
          <ProtectedRoute requiresPermissions module="TRANSFER" permissionType="canUpdate">
            <TransferFormDashboardPage />
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
