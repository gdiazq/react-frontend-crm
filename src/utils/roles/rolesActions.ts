import messages from '@/messages/messages'
import type { DropdownAction } from '../users/usersActions'

export function createRolesActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.roles.ui.actionViewDetail, handler }
  }

  function actionUpdateRole(handler: () => void): DropdownAction {
    return { id: 'update-role', label: messages.roles.ui.updateRole, handler }
  }

  function actionToggleStatus(enabled: boolean, handler: () => void): DropdownAction {
    return {
      id: 'toggle-status',
      label: enabled ? messages.roles.ui.actionDisableRole : messages.roles.ui.actionEnableRole,
      tone: enabled ? 'danger' : 'default',
      handler,
    }
  }

  return { actionViewDetail, actionUpdateRole, actionToggleStatus }
}
