import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  AUTH_ROUTE_ANNEXES,
  AUTH_ROUTE_ATTENDANCE,
  AUTH_ROUTE_CONTRACTS,
  AUTH_ROUTE_LEAVES,
  AUTH_ROUTE_OVERTIME,
  AUTH_ROUTE_TRANSFERS,
  AUTH_ROUTE_DASHBOARD,
  AUTH_ROUTE_EMPLOYEES,
  AUTH_ROUTE_LOGIN,
  AUTH_ROUTE_LOGOUT,
  AUTH_ROUTE_PROJECT_ASSIGNMENTS,
  AUTH_ROUTE_PROJECTS,
  AUTH_ROUTE_PROJECT_STATUSES,
  AUTH_ROUTE_PROJECT_SPECIALTIES,
  AUTH_ROUTE_PROJECT_TYPES,
  AUTH_ROUTE_SETTLEMENTS,
  AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE,
  AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION,
  AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE,
  AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES,
  AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY,
  AUTH_ROUTE_REQUESTS,
  AUTH_ROUTE_ROLES,
  AUTH_ROUTE_SETTINGS,
  AUTH_ROUTE_UNAUTHORIZED,
  AUTH_ROUTE_USERS,
  PermissionAction,
  PermissionModule,
} from '@/constant'
import { NavbarComponent, NotificationPanel, SidebarComponent } from '@/components'
import {
  useStoreAuth,
  useStoreCalendar,
  useStoreNotification,
  useStoreTheme,
} from '@/store'
import { useHasPermission } from '@/hooks'
import { selectFilterNotifications, selectUnreadCount } from '@/store/notification.store'

export function LayoutPrivateDefault() {
  const navigate = useNavigate()
  const user = useStoreAuth((s) => s.user)
  const getCurrentUser = useStoreAuth((s) => s.getCurrentUser)
  const isDark = useStoreTheme((s) => s.isDark)
  const toggleTheme = useStoreTheme((s) => s.toggleTheme)
  const calendarEvents = useStoreCalendar((s) => s.events)
  const loadingCalendarEvents = useStoreCalendar((s) => s.loadingEvents)
  const calendarEventsErrorMessage = useStoreCalendar((s) => s.eventsErrorMessage)
  const getCalendarEvents = useStoreCalendar((s) => s.getCalendarEvents)
  const notifications = useStoreNotification(selectFilterNotifications)
  const unreadCount = useStoreNotification(selectUnreadCount)
  const markAllAsRead = useStoreNotification((s) => s.markAllAsRead)
  const markAsRead = useStoreNotification((s) => s.markAsRead)
  const archiveNotification = useStoreNotification((s) => s.archiveNotification)
  const getNotifications = useStoreNotification((s) => s.getNotifications)
  const getCounter = useStoreNotification((s) => s.getCounter)
  const connect = useStoreNotification((s) => s.connect)
  const disconnect = useStoreNotification((s) => s.disconnect)
  const captureTab = useStoreNotification((s) => s.captureTab)

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const disconnectRef = useRef(disconnect)
  disconnectRef.current = disconnect
  const canReadUsers = useHasPermission(PermissionModule.User, PermissionAction.Read)
  const canReadRequests = useHasPermission(PermissionModule.HrRequest, PermissionAction.Read)
  const canReadEmployees = useHasPermission(PermissionModule.Employee, PermissionAction.Read)
  const canReadContracts = useHasPermission(PermissionModule.Contract, PermissionAction.Read)
  const canReadLeaves = useHasPermission(PermissionModule.Leave, PermissionAction.Read)
  const canReadAttendance = useHasPermission(PermissionModule.Attendance, PermissionAction.Read)
  const canReadOvertime = useHasPermission(PermissionModule.Overtime, PermissionAction.Read)
  const canReadAnnexes = useHasPermission(PermissionModule.Annex, PermissionAction.Read)
  const canReadTransfers = useHasPermission(PermissionModule.Transfer, PermissionAction.Read)
  const canReadProjects = useHasPermission(PermissionModule.Project, PermissionAction.Read)
  const canReadProjectTypes = useHasPermission(PermissionModule.ProjectType, PermissionAction.Read)
  const canReadProjectSpecialties = useHasPermission(PermissionModule.ProjectSpecialty, PermissionAction.Read)
  const canReadProjectStatuses = useHasPermission(PermissionModule.ProjectStatus, PermissionAction.Read)
  const canReadRoles = useHasPermission(PermissionModule.Role, PermissionAction.Read)
  const canReadSettlements = useHasPermission(PermissionModule.Settlement, PermissionAction.Read)
  const canReadLegalTerminationCauses = useHasPermission(PermissionModule.LegalTerminationCause, PermissionAction.Read)
  const canReadQualityOfWork = useHasPermission(PermissionModule.QualityOfWork, PermissionAction.Read)
  const canReadSafetyCompliance = useHasPermission(PermissionModule.SafetyCompliance, PermissionAction.Read)
  const canReadNoRehireCause = useHasPermission(PermissionModule.NoRehireCause, PermissionAction.Read)
  const canReadTerminationQuizQuestion = useHasPermission(PermissionModule.TerminationQuizQuestion, PermissionAction.Read)

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      if (!useStoreAuth.getState().user) {
        try {
          await getCurrentUser()
        } catch {
          if (!cancelled) navigate(AUTH_ROUTE_LOGIN)
          return
        }
      }

      if (cancelled) return

      const userId = useStoreAuth.getState().user?.id
      if (!userId) return

      connect(userId)
      captureTab(2)
      getNotifications('', 0, 20)
      getCounter()
    }

    init()

    return () => {
      cancelled = true
      disconnectRef.current()
    }
  }, [captureTab, connect, getCounter, getCurrentUser, getNotifications, navigate])


  const handleGoDashboard = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    navigate(AUTH_ROUTE_DASHBOARD)
  }

  const handleGoUsers = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadUsers) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_USERS)
  }

  const handleGoRequests = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadRequests) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_REQUESTS)
  }

  const handleGoRoles = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadRoles) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_ROLES)
  }

  const handleGoEmployees = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadEmployees) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_EMPLOYEES)
  }

  const handleGoContracts = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadContracts) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_CONTRACTS)
  }

  const handleGoLeaves = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadLeaves) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_LEAVES)
  }

  const handleGoAttendance = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadAttendance) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_ATTENDANCE)
  }

  const handleGoOvertime = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadOvertime) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_OVERTIME)
  }

  const handleGoAnnexes = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadAnnexes) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_ANNEXES)
  }

  const handleGoTransfers = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadTransfers) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_TRANSFERS)
  }

  const handleGoSettlements = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadSettlements) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_SETTLEMENTS)
  }

  const handleGoSettlementsTerminationCauses = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadLegalTerminationCauses) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_SETTLEMENTS_TERMINATION_CAUSES)
  }

  const handleGoSettlementsWorkQuality = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadQualityOfWork) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_SETTLEMENTS_WORK_QUALITY)
  }

  const handleGoSettlementsSafetyCompliance = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadSafetyCompliance) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_SETTLEMENTS_SAFETY_COMPLIANCE)
  }

  const handleGoSettlementsNoRehireCause = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadNoRehireCause) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_SETTLEMENTS_NO_REHIRE_CAUSE)
  }

  const handleGoSettlementsTerminationQuizQuestion = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadTerminationQuizQuestion) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_SETTLEMENTS_TERMINATION_QUIZ_QUESTION)
  }

  const handleGoProjects = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadProjects) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_PROJECTS)
  }

  const handleGoProjectAssignments = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadProjects) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_PROJECT_ASSIGNMENTS)
  }

  const handleGoProjectTypes = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadProjectTypes) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_PROJECT_TYPES)
  }

  const handleGoProjectSpecialties = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadProjectSpecialties) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_PROJECT_SPECIALTIES)
  }

  const handleGoProjectStatuses = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    if (!canReadProjectStatuses) {
      navigate(AUTH_ROUTE_UNAUTHORIZED)
      return
    }
    navigate(AUTH_ROUTE_PROJECT_STATUSES)
  }

  const handleGoSettings = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    navigate(AUTH_ROUTE_SETTINGS)
  }

  const handleGoLogout = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    setCalendarOpen(false)
    navigate(AUTH_ROUTE_LOGOUT)
  }

  const handleToggleNotifications = () => {
    setNotificationsOpen((v) => !v)
    if (!notificationsOpen) {
      setSettingsDropdownOpen(false)
      setCalendarOpen(false)
    }
  }

  const handleToggleSettings = () => {
    setSettingsDropdownOpen((v) => !v)
    if (!settingsDropdownOpen) {
      setNotificationsOpen(false)
      setCalendarOpen(false)
    }
  }

  const handleToggleCalendar = () => {
    setCalendarOpen((v) => !v)
    if (!calendarOpen) {
      setNotificationsOpen(false)
      setSettingsDropdownOpen(false)
    }
  }

  const handleCalendarVisibleRangeChange = useCallback((range: { from: string, to: string }) => {
    void getCalendarEvents(range)
  }, [getCalendarEvents])

  const handleMarkAllRead = () => {
    markAllAsRead()
  }

  const handleMarkRead = (id: string) => {
    const notification = useStoreNotification.getState().notifications.find((item) => item.id === id)
    if (!notification) return
    markAsRead(notification)
  }

  const handleArchive = (id: string) => {
    const notification = useStoreNotification.getState().notifications.find((item) => item.id === id)
    if (!notification) return
    archiveNotification(notification)
  }

  const formatNotificationTimestamp = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '--:--'
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const currentUser = user ?? useStoreAuth.getState().user

  return (
    <main
      id="layout-private-default"
      className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
    >
      <SidebarComponent
        mobileOpen={mobileSidebarOpen}
        collapsed={sidebarCollapsed}
        showUsers={canReadUsers}
        showRequests={canReadRequests}
        showEmployees={canReadEmployees}
        showContracts={canReadContracts}
        showLeaves={canReadLeaves}
        showAttendance={canReadAttendance}
        showOvertime={canReadOvertime}
        showAnnexes={canReadAnnexes}
        showTransfers={canReadTransfers}
        showSettlements={
          canReadSettlements
          || canReadLegalTerminationCauses
          || canReadQualityOfWork
          || canReadSafetyCompliance
          || canReadNoRehireCause
          || canReadTerminationQuizQuestion
        }
        showSettlementsTerminationCauses={canReadLegalTerminationCauses}
        showSettlementsWorkQuality={canReadQualityOfWork}
        showSettlementsSafetyCompliance={canReadSafetyCompliance}
        showSettlementsNoRehireCause={canReadNoRehireCause}
        showSettlementsTerminationQuizQuestion={canReadTerminationQuizQuestion}
        showProjects={canReadProjects}
        showProjectAssignments={canReadProjects}
        showProjectTypes={canReadProjectTypes}
        showProjectSpecialties={canReadProjectSpecialties}
        showProjectStatuses={canReadProjectStatuses}
        showRoles={canReadRoles}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onToggleDesktopCollapse={() => setSidebarCollapsed((v) => !v)}
        onGoDashboard={handleGoDashboard}
        onGoUsers={handleGoUsers}
        onGoRequests={handleGoRequests}
        onGoEmployees={handleGoEmployees}
        onGoContracts={handleGoContracts}
        onGoLeaves={handleGoLeaves}
        onGoAttendance={handleGoAttendance}
        onGoOvertime={handleGoOvertime}
        onGoAnnexes={handleGoAnnexes}
        onGoTransfers={handleGoTransfers}
        onGoSettlements={handleGoSettlements}
        onGoSettlementsTerminationCauses={handleGoSettlementsTerminationCauses}
        onGoSettlementsWorkQuality={handleGoSettlementsWorkQuality}
        onGoSettlementsSafetyCompliance={handleGoSettlementsSafetyCompliance}
        onGoSettlementsNoRehireCause={handleGoSettlementsNoRehireCause}
        onGoSettlementsTerminationQuizQuestion={handleGoSettlementsTerminationQuizQuestion}
        onGoProjects={handleGoProjects}
        onGoProjectAssignments={handleGoProjectAssignments}
        onGoProjectTypes={handleGoProjectTypes}
        onGoProjectSpecialties={handleGoProjectSpecialties}
        onGoProjectStatuses={handleGoProjectStatuses}
        onGoRoles={handleGoRoles}
        onGoLogout={handleGoLogout}
      />

      <section className="flex min-h-screen w-full min-w-0 flex-col lg:pl-0">
        <NavbarComponent
          unreadCount={unreadCount}
          userLabel={currentUser?.username || currentUser?.email || 'Usuario'}
          userEmail={currentUser?.email || ''}
          avatarUrl={currentUser?.avatarUrl || ''}
          isDark={isDark}
          onGoDashboard={handleGoDashboard}
          settingsDropdownOpen={settingsDropdownOpen}
          calendarOpen={calendarOpen}
          onToggleSettingsDropdown={handleToggleSettings}
          onCloseSettingsDropdown={() => setSettingsDropdownOpen(false)}
          onToggleCalendar={handleToggleCalendar}
          onCloseCalendar={() => setCalendarOpen(false)}
          calendarEvents={calendarEvents}
          calendarLoading={loadingCalendarEvents}
          calendarErrorMessage={calendarEventsErrorMessage}
          onCalendarVisibleRangeChange={handleCalendarVisibleRangeChange}
          onToggleSidebar={() => setMobileSidebarOpen((v) => !v)}
          onGoSettings={handleGoSettings}
          onGoLogout={handleGoLogout}
          onToggleNotifications={handleToggleNotifications}
          onToggleTheme={toggleTheme}
        />

        <section className="flex-1 min-w-0 p-4 sm:p-6">
          <Outlet />
        </section>
      </section>

      <NotificationPanel
        isOpen={notificationsOpen}
        unreadCount={unreadCount}
        notifications={notifications}
        onClose={() => setNotificationsOpen(false)}
        onMarkAllRead={handleMarkAllRead}
        onMarkRead={handleMarkRead}
        onArchive={handleArchive}
        formatTimestamp={formatNotificationTimestamp}
      />
    </main>
  )
}
