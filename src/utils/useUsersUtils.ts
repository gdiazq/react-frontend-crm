import messages from '@/messages/messages'

const roleLabels: Record<string, string> = {
  ROLE_ADMIN: messages.users.roleAdmin,
  ROLE_USER: messages.users.roleUser,
  ROLE_MANAGER: messages.users.roleManager,
  ROLE_COORDINATOR: messages.users.roleCoordinator,
}

export function formatRoleLabel(roleName: string): string {
  return roleLabels[roleName] || roleName
}
