import { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  AUTH_ROUTE_CONTRACTS,
  AUTH_ROUTE_DASHBOARD,
  AUTH_ROUTE_EMPLOYEES,
  AUTH_ROUTE_LOGIN,
  AUTH_ROUTE_LOGOUT,
  AUTH_ROUTE_PROJECT_STATUSES,
  AUTH_ROUTE_PROJECT_SPECIALTIES,
  AUTH_ROUTE_PROJECT_TYPES,
  AUTH_ROUTE_REQUESTS,
  AUTH_ROUTE_ROLES,
  AUTH_ROUTE_SETTINGS,
  AUTH_ROUTE_USERS,
} from '@/constant'
import { NavbarComponent, NotificationPanel, SidebarComponent } from '@/components'
import { useStoreAuth, useStoreNotification, useStoreTheme } from '@/store'
import { selectFilterNotifications, selectUnreadCount } from '@/store/notification.store'

export default function LayoutPrivateDefault() {
  const navigate = useNavigate()
  const user = useStoreAuth((s) => s.user)
  const hasPermission = useStoreAuth((s) => s.hasPermission)
  const getCurrentUser = useStoreAuth((s) => s.getCurrentUser)
  const isDark = useStoreTheme((s) => s.isDark)
  const toggleTheme = useStoreTheme((s) => s.toggleTheme)
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
  const disconnectRef = useRef(disconnect)
  disconnectRef.current = disconnect
  const canReadUsers = hasPermission('USER', 'canRead')
  const canReadRequests = hasPermission('HR_REQUEST', 'canRead')
  const canReadEmployees = hasPermission('EMPLOYEE', 'canRead')
  const canReadContracts = hasPermission('CONTRACT', 'canRead')
  const canReadProjects = hasPermission('PROJECT_TYPE', 'canRead')
  const canReadProjectSpecialties = hasPermission('PROJECT_SPECIALTY', 'canRead')
  const canReadProjectStatuses = hasPermission('PROJECT_STATUS', 'canRead')
  const canReadRoles = hasPermission('ROLE', 'canRead')

  useEffect(() => {
    const init = async () => {
      if (!useStoreAuth.getState().user) {
        try {
          await getCurrentUser()
        } catch {
          navigate(AUTH_ROUTE_LOGIN)
          return
        }
      }

      const userId = useStoreAuth.getState().user?.id
      if (!userId) return

      captureTab(2)
      getNotifications('', 0, 20)
      getCounter()
      connect(userId)
    }

    init()

    return () => {
      disconnectRef.current()
    }
  }, [captureTab, connect, getCurrentUser, getCounter, getNotifications, navigate])

  const handleGoDashboard = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    navigate(AUTH_ROUTE_DASHBOARD)
  }

  const handleGoUsers = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    if (!canReadUsers) {
      navigate('/unauthorized')
      return
    }
    navigate(AUTH_ROUTE_USERS)
  }

  const handleGoRequests = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    if (!canReadRequests) {
      navigate('/unauthorized')
      return
    }
    navigate(AUTH_ROUTE_REQUESTS)
  }

  const handleGoRoles = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    if (!canReadRoles) {
      navigate('/unauthorized')
      return
    }
    navigate(AUTH_ROUTE_ROLES)
  }

  const handleGoEmployees = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    if (!canReadEmployees) {
      navigate('/unauthorized')
      return
    }
    navigate(AUTH_ROUTE_EMPLOYEES)
  }

  const handleGoContracts = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    if (!canReadContracts) {
      navigate('/unauthorized')
      return
    }
    navigate(AUTH_ROUTE_CONTRACTS)
  }

  const handleGoProjects = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    if (!canReadProjects) {
      navigate('/unauthorized')
      return
    }
    navigate(AUTH_ROUTE_PROJECT_TYPES)
  }

  const handleGoProjectSpecialties = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    if (!canReadProjectSpecialties) {
      navigate('/unauthorized')
      return
    }
    navigate(AUTH_ROUTE_PROJECT_SPECIALTIES)
  }

  const handleGoProjectStatuses = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    if (!canReadProjectStatuses) {
      navigate('/unauthorized')
      return
    }
    navigate(AUTH_ROUTE_PROJECT_STATUSES)
  }

  const handleGoSettings = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    navigate(AUTH_ROUTE_SETTINGS)
  }

  const handleGoLogout = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    navigate(AUTH_ROUTE_LOGOUT)
  }

  const handleToggleNotifications = () => {
    setNotificationsOpen((v) => !v)
    if (!notificationsOpen) setSettingsDropdownOpen(false)
  }

  const handleToggleSettings = () => {
    setSettingsDropdownOpen((v) => !v)
    if (!settingsDropdownOpen) setNotificationsOpen(false)
  }

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
        showProjects={canReadProjects}
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
        onGoProjects={handleGoProjects}
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
          onToggleSettingsDropdown={handleToggleSettings}
          onCloseSettingsDropdown={() => setSettingsDropdownOpen(false)}
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
