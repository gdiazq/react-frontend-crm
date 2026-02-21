import { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  AUTH_ROUTE_DASHBOARD,
  AUTH_ROUTE_LOGIN,
  AUTH_ROUTE_LOGOUT,
  AUTH_ROUTE_SETTINGS,
  AUTH_ROUTE_USERS,
} from '@/constant'
import { NavbarComponent, NotificationPanel, SidebarComponent } from '@/components'
import { useStoreAuth, useStoreNotification, useStoreTheme } from '@/store'
import { selectFilterNotifications, selectUnreadCount } from '@/store/notification.store'

export default function LayoutPrivateDefault() {
  const navigate = useNavigate()
  const user = useStoreAuth((s) => s.user)
  const getCurrentUser = useStoreAuth((s) => s.getCurrentUser)
  const isDark = useStoreTheme((s) => s.isDark)
  const toggleTheme = useStoreTheme((s) => s.toggleTheme)
  const notifications = useStoreNotification(selectFilterNotifications)
  const unreadCount = useStoreNotification(selectUnreadCount)
  const mutationMarkAllAsRead = useStoreNotification((s) => s.mutationMarkAllAsRead)
  const mutationMarkAsRead = useStoreNotification((s) => s.mutationMarkAsRead)
  const mutationArchiveNotification = useStoreNotification((s) => s.mutationArchiveNotification)
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

  useEffect(() => {
    const init = async () => {
      if (!user) {
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
  }, [])

  const handleGoDashboard = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    navigate(AUTH_ROUTE_DASHBOARD)
  }

  const handleGoUsers = () => {
    setMobileSidebarOpen(false)
    setSettingsDropdownOpen(false)
    navigate(AUTH_ROUTE_USERS)
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
    mutationMarkAllAsRead()
  }

  const handleMarkRead = (id: string) => {
    const notification = useStoreNotification.getState().notifications.find((item) => item.id === id)
    if (!notification) return
    mutationMarkAsRead(notification)
  }

  const handleArchive = (id: string) => {
    const notification = useStoreNotification.getState().notifications.find((item) => item.id === id)
    if (!notification) return
    mutationArchiveNotification(notification)
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
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onToggleDesktopCollapse={() => setSidebarCollapsed((v) => !v)}
        onGoDashboard={handleGoDashboard}
        onGoUsers={handleGoUsers}
        onGoLogout={handleGoLogout}
      />

      <section className="flex min-h-screen w-full flex-col lg:pl-0">
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

        <section className="flex-1 p-6">
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
