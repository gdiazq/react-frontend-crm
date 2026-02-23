import messages from '@/messages/messages'

const roleLabels: Record<string, string> = {
  ROLE_ADMIN: messages.users.ui.roleAdmin,
  ROLE_USER: messages.users.ui.roleUser,
  ROLE_MANAGER: messages.users.ui.roleManager,
  ROLE_COORDINATOR: messages.users.ui.roleCoordinator,
}

function normalizeRoleName(roleName: string): string {
  const value = roleName.trim()
  if (value.length === 0) return ''

  const withoutPrefix = value.replace(/^ROLE_/, '')
  return withoutPrefix
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function formatRoleLabel(roleName: string): string {
  const key = roleName.trim()
  return roleLabels[key] || normalizeRoleName(key)
}
