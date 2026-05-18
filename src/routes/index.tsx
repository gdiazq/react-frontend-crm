import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute, PublicRoute } from '@/middlewares/auth.middleware'
import { LayoutPrivateDefault } from '@/layouts'
import {
  AUTH_ROUTE_ANNEXES,
  AUTH_ROUTE_ANNEXES_CREATE,
  AUTH_ROUTE_ATTENDANCE,
  AUTH_ROUTE_ATTENDANCE_CREATE,
  AUTH_ROUTE_CONTRACTS,
  AUTH_ROUTE_CONTRACTS_CREATE,
  AUTH_ROUTE_CREATE_PASSWORD,
  AUTH_ROUTE_DASHBOARD,
  AUTH_ROUTE_DASHBOARD_EXAMPLE,
  AUTH_ROUTE_EMPLOYEES,
  AUTH_ROUTE_EMPLOYEES_CREATE,
  AUTH_ROUTE_HOME,
  AUTH_ROUTE_LEAVES,
  AUTH_ROUTE_LEAVES_CREATE,
  AUTH_ROUTE_LOGIN,
  AUTH_ROUTE_LOGIN_CREDENTIALS,
  AUTH_ROUTE_LOGOUT,
  AUTH_ROUTE_OVERTIME,
  AUTH_ROUTE_OVERTIME_CREATE,
  AUTH_ROUTE_PROJECT_ASSIGNMENTS,
  AUTH_ROUTE_PROJECT_SPECIALTIES,
  AUTH_ROUTE_PROJECT_SPECIALTIES_CREATE,
  AUTH_ROUTE_PROJECT_STATUSES,
  AUTH_ROUTE_PROJECT_STATUSES_CREATE,
  AUTH_ROUTE_PROJECT_TYPES,
  AUTH_ROUTE_PROJECT_TYPES_CREATE,
  AUTH_ROUTE_PROJECTS,
  AUTH_ROUTE_PROJECTS_CREATE,
  AUTH_ROUTE_RECOVERY,
  AUTH_ROUTE_REGISTER,
  AUTH_ROUTE_REQUESTS,
  AUTH_ROUTE_ROLES,
  AUTH_ROUTE_ROLES_CREATE,
  AUTH_ROUTE_SETTINGS,
  AUTH_ROUTE_SETTLEMENTS,
  AUTH_ROUTE_SETTLEMENTS_CREATE,
  AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE,
  AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE_CREATE,
  AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE,
  AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE_CREATE,
  AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES,
  AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES_CREATE,
  AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION,
  AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION_CREATE,
  AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY,
  AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY_CREATE,
  AUTH_ROUTE_TRANSFERS,
  AUTH_ROUTE_TRANSFERS_CREATE,
  AUTH_ROUTE_UNAUTHORIZED,
  AUTH_ROUTE_USERS,
  AUTH_ROUTE_USERS_CREATE,
  AUTH_ROUTE_VERIFY_EMAIL,
  PermissionAction,
  PermissionModule,
} from '@/constant'

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
const LeavesDashboardPage = lazy(() => import('@/pages/leaves/LeavesDashboardPage'))
const LeavesFormDashboardPage = lazy(() => import('@/pages/leaves/LeavesFormDashboardPage'))
const AttendanceDashboardPage = lazy(() => import('@/pages/attendance/AttendanceDashboardPage'))
const AttendanceFormDashboardPage = lazy(() => import('@/pages/attendance/AttendanceFormDashboardPage'))
const OvertimeDashboardPage = lazy(() => import('@/pages/overtime/OvertimeDashboardPage'))
const OvertimeFormDashboardPage = lazy(() => import('@/pages/overtime/OvertimeFormDashboardPage'))
const TransfersDashboardPage = lazy(() => import('@/pages/transfer/TransfersDashboardPage'))
const ProjectsDashboardPage = lazy(() => import('@/pages/projects/main/ProjectsDashboardPage'))
const ProjectAssignmentsDashboardPage = lazy(() => import('@/pages/projects/assignments/ProjectAssignmentsDashboardPage'))
const ProjectStatusesDashboardPage = lazy(() => import('@/pages/projects/ProjectStatusesDashboardPage'))
const ProjectStatusesFormDashboardPage = lazy(() => import('@/pages/projects/ProjectStatusesFormDashboardPage'))
const ProjectSpecialtiesDashboardPage = lazy(() => import('@/pages/projects/specialties/ProjectSpecialtiesDashboardPage'))
const ProjectSpecialtiesFormDashboardPage = lazy(() => import('@/pages/projects/specialties/ProjectSpecialtiesFormDashboardPage'))
const ProjectsFormDashboardPage = lazy(() => import('@/pages/projects/main/ProjectsFormDashboardPage'))
const ProjectTypesDashboardPage = lazy(() => import('@/pages/projects/ProjectTypesDashboardPage'))
const ProjectTypesFormDashboardPage = lazy(() => import('@/pages/projects/ProjectTypesFormDashboardPage'))
const ContractsFormDashboardPage = lazy(() => import('@/pages/contracts/ContractsFormDashboardPage'))
const TransferFormDashboardPage = lazy(() => import('@/pages/transfer/TransferFormDashboardPage'))
const EmployeesFormDashboardPage = lazy(() => import('@/pages/employees/EmployeesFormDashboardPage'))
const UsersFormDashboardPage = lazy(() => import('@/pages/users/UsersFormDashboardPage'))
const RolesDashboardPage = lazy(() => import('@/pages/roles/RolesDashboardPage'))
const RolesFormDashboardPage = lazy(() => import('@/pages/roles/RolesFormDashboardPage'))
const SettlementsDashboardPage = lazy(() => import('@/pages/settlement/SettlementsDashboardPage'))
const SettlementFormDashboardPage = lazy(() => import('@/pages/settlement/SettlementFormDashboardPage'))
const LegalTerminationCausesDashboardPage = lazy(() => import('@/pages/settlement/LegalTerminationCausesDashboardPage'))
const LegalTerminationCausesFormDashboardPage = lazy(() => import('@/pages/settlement/LegalTerminationCausesFormDashboardPage'))
const SettlementsWorkQualityDashboardPage = lazy(() => import('@/pages/settlement/WorkQualityDashboardPage'))
const SettlementsWorkQualityFormDashboardPage = lazy(() => import('@/pages/settlement/WorkQualityFormDashboardPage'))
const SafetyComplianceDashboardPage = lazy(() => import('@/pages/settlement/SafetyComplianceDashboardPage'))
const SafetyComplianceFormDashboardPage = lazy(() => import('@/pages/settlement/SafetyComplianceFormDashboardPage'))
const NoRehireCauseDashboardPage = lazy(() => import('@/pages/settlement/NoRehireCauseDashboardPage'))
const NoRehireCauseFormDashboardPage = lazy(() => import('@/pages/settlement/NoRehireCauseFormDashboardPage'))
const TerminationQuizQuestionDashboardPage = lazy(() => import('@/pages/settlement/TerminationQuizQuestionDashboardPage'))
const TerminationQuizQuestionFormDashboardPage = lazy(() => import('@/pages/settlement/TerminationQuizQuestionFormDashboardPage'))
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
    path: AUTH_ROUTE_LOGIN,
    element: wrap(
      <PublicRoute>
        <LoginPage />
      </PublicRoute>,
    ),
  },
  {
    path: AUTH_ROUTE_LOGIN_CREDENTIALS,
    element: wrap(
      <PublicRoute>
        <LoginCredentialsPage />
      </PublicRoute>,
    ),
  },
  {
    path: AUTH_ROUTE_REGISTER,
    element: wrap(
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>,
    ),
  },
  {
    path: AUTH_ROUTE_RECOVERY,
    element: wrap(
      <PublicRoute>
        <RecoveryPage />
      </PublicRoute>,
    ),
  },
  {
    path: AUTH_ROUTE_VERIFY_EMAIL,
    element: wrap(
      <PublicRoute>
        <VerifyEmailPage />
      </PublicRoute>,
    ),
  },
  {
    path: AUTH_ROUTE_CREATE_PASSWORD,
    element: wrap(
      <PublicRoute>
        <CreatePasswordPage />
      </PublicRoute>,
    ),
  },
  {
    path: AUTH_ROUTE_LOGOUT,
    element: wrap(
      <PublicRoute>
        <LogoutPage />
      </PublicRoute>,
    ),
  },
  {
    path: AUTH_ROUTE_DASHBOARD_EXAMPLE,
    element: wrap(<DashboardExamplePage />),
  },
  {
    path: AUTH_ROUTE_HOME,
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
        path: AUTH_ROUTE_DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: AUTH_ROUTE_SETTINGS,
        element: <SettingsPage />,
      },
      {
        path: AUTH_ROUTE_USERS,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.User} permissionType={PermissionAction.Read}>
            <UsersDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_REQUESTS,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.HrRequest} permissionType={PermissionAction.Read}>
            <RequestsDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_EMPLOYEES,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Employee} permissionType={PermissionAction.Read}>
            <EmployeesDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_ANNEXES,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Annex} permissionType={PermissionAction.Read}>
            <AnnexesDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_ANNEXES_CREATE,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Annex} permissionType={PermissionAction.Create}>
            <AnnexesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${AUTH_ROUTE_ANNEXES}/:editId`,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Annex} permissionType={PermissionAction.Update}>
            <AnnexesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_CONTRACTS,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Contract} permissionType={PermissionAction.Read}>
            <ContractsDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_LEAVES,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Leave} permissionType={PermissionAction.Read}>
            <LeavesDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_LEAVES_CREATE,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Leave} permissionType={PermissionAction.Create}>
            <LeavesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${AUTH_ROUTE_LEAVES}/:editId`,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Leave} permissionType={PermissionAction.Update}>
            <LeavesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_ATTENDANCE,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Attendance} permissionType={PermissionAction.Read}>
            <AttendanceDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_ATTENDANCE_CREATE,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Attendance} permissionType={PermissionAction.Create}>
            <AttendanceFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${AUTH_ROUTE_ATTENDANCE}/:editId`,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Attendance} permissionType={PermissionAction.Update}>
            <AttendanceFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_OVERTIME,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Overtime} permissionType={PermissionAction.Read}>
            <OvertimeDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_OVERTIME_CREATE,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Overtime} permissionType={PermissionAction.Create}>
            <OvertimeFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${AUTH_ROUTE_OVERTIME}/:editId`,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Overtime} permissionType={PermissionAction.Update}>
            <OvertimeFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_TRANSFERS,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Transfer} permissionType={PermissionAction.Read}>
            <TransfersDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_SETTLEMENTS,
        element: <SettlementsDashboardPage />,
      },
      {
        path: AUTH_ROUTE_SETTLEMENTS_CREATE,
        element: <SettlementFormDashboardPage />,
      },
      {
        path: `${AUTH_ROUTE_SETTLEMENTS}/:editId`,
        element: <SettlementFormDashboardPage />,
      },
      {
        path: AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES,
        element: <LegalTerminationCausesDashboardPage />,
      },
      {
        path: AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES_CREATE,
        element: <LegalTerminationCausesFormDashboardPage />,
      },
      {
        path: `${AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES}/:editId`,
        element: <LegalTerminationCausesFormDashboardPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
      {
        path: AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY,
        element: <SettlementsWorkQualityDashboardPage />,
      },
      {
        path: AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY_CREATE,
        element: <SettlementsWorkQualityFormDashboardPage />,
      },
      {
        path: `${AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY}/:editId`,
        element: <SettlementsWorkQualityFormDashboardPage />,
      },
      {
        path: AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE,
        element: <SafetyComplianceDashboardPage />,
      },
      {
        path: AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE_CREATE,
        element: <SafetyComplianceFormDashboardPage />,
      },
      {
        path: `${AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE}/:editId`,
        element: <SafetyComplianceFormDashboardPage />,
      },
      {
        path: AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE,
        element: <NoRehireCauseDashboardPage />,
      },
      {
        path: AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE_CREATE,
        element: <NoRehireCauseFormDashboardPage />,
      },
      {
        path: `${AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE}/:editId`,
        element: <NoRehireCauseFormDashboardPage />,
      },
      {
        path: AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION,
        element: <TerminationQuizQuestionDashboardPage />,
      },
      {
        path: AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION_CREATE,
        element: <TerminationQuizQuestionFormDashboardPage />,
      },
      {
        path: `${AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION}/:editId`,
        element: <TerminationQuizQuestionFormDashboardPage />,
      },
      {
        path: AUTH_ROUTE_PROJECTS,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Project} permissionType={PermissionAction.Read}>
            <ProjectsDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_PROJECT_ASSIGNMENTS,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Project} permissionType={PermissionAction.Read}>
            <ProjectAssignmentsDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_PROJECTS_CREATE,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Project} permissionType={PermissionAction.Create}>
            <ProjectsFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${AUTH_ROUTE_PROJECTS}/:editId`,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Project} permissionType={PermissionAction.Update}>
            <ProjectsFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_PROJECT_TYPES,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.ProjectType} permissionType={PermissionAction.Read}>
            <ProjectTypesDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_PROJECT_TYPES_CREATE,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.ProjectType} permissionType={PermissionAction.Create}>
            <ProjectTypesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${AUTH_ROUTE_PROJECT_TYPES}/:editId`,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.ProjectType} permissionType={PermissionAction.Update}>
            <ProjectTypesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_PROJECT_SPECIALTIES,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.ProjectSpecialty} permissionType={PermissionAction.Read}>
            <ProjectSpecialtiesDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_PROJECT_SPECIALTIES_CREATE,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.ProjectSpecialty} permissionType={PermissionAction.Create}>
            <ProjectSpecialtiesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${AUTH_ROUTE_PROJECT_SPECIALTIES}/:editId`,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.ProjectSpecialty} permissionType={PermissionAction.Update}>
            <ProjectSpecialtiesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_PROJECT_STATUSES,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.ProjectStatus} permissionType={PermissionAction.Read}>
            <ProjectStatusesDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_PROJECT_STATUSES_CREATE,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.ProjectStatus} permissionType={PermissionAction.Create}>
            <ProjectStatusesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${AUTH_ROUTE_PROJECT_STATUSES}/:editId`,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.ProjectStatus} permissionType={PermissionAction.Update}>
            <ProjectStatusesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_CONTRACTS_CREATE,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Contract} permissionType={PermissionAction.Create}>
            <ContractsFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${AUTH_ROUTE_CONTRACTS}/:editId`,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Contract} permissionType={PermissionAction.Update}>
            <ContractsFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_TRANSFERS_CREATE,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Transfer} permissionType={PermissionAction.Create}>
            <TransferFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${AUTH_ROUTE_TRANSFERS}/:editId`,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Transfer} permissionType={PermissionAction.Update}>
            <TransferFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_EMPLOYEES_CREATE,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Employee} permissionType={PermissionAction.Create}>
            <EmployeesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${AUTH_ROUTE_EMPLOYEES}/:editId`,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Employee} permissionType={PermissionAction.Update}>
            <EmployeesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_ROLES,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Role} permissionType={PermissionAction.Read}>
            <RolesDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_ROLES_CREATE,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Role} permissionType={PermissionAction.Create}>
            <RolesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${AUTH_ROUTE_ROLES}/:editId`,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.Role} permissionType={PermissionAction.Update}>
            <RolesFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_USERS_CREATE,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.User} permissionType={PermissionAction.Create}>
            <UsersFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${AUTH_ROUTE_USERS}/:editId`,
        element: (
          <ProtectedRoute requiresPermissions module={PermissionModule.User} permissionType={PermissionAction.Update}>
            <UsersFormDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: AUTH_ROUTE_UNAUTHORIZED,
        element: <UnauthorizedPage />,
      },
    ],
  },
  {
    path: '*',
    element: wrap(<NotFoundPage />),
  },
])
