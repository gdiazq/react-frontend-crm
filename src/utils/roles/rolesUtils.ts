import messages from '@/messages/messages'
import type { RoleCreateForm } from '@/types'

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

export function formatPermissionName(name: string): string {
  return name
    .trim()
    .split(':')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join(': ')
}

export function mapRoleToForm(role: { name?: string | null, description?: string | null }): RoleCreateForm {
  return {
    name: role.name ?? '',
    description: role.description ?? '',
  }
}
