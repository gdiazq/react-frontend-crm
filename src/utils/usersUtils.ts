import messages from '@/messages/messages'

const roleLabels: Record<string, string> = {
  ROLE_ADMIN: messages.users.ui.roleAdmin,
  ROLE_USER: messages.users.ui.roleUser,
  ROLE_MANAGER: messages.users.ui.roleManager,
  ROLE_COORDINATOR: messages.users.ui.roleCoordinator,
}

export function formatRoleLabel(roleName: string): string {
  return roleLabels[roleName] || roleName
}
