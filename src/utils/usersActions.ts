import messages from '@/messages/messages'

export interface DropdownAction {
  id: string
  label: string
  tone?: 'default' | 'danger'
  handler: () => void
}

export function createUsersActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.users.ui.actionViewDetail, handler }
  }

  function actionUpdateUser(handler: () => void): DropdownAction {
    return { id: 'update-user', label: messages.users.ui.updateUser, handler }
  }

  function actionToggleStatus(enabled: boolean, handler: () => void): DropdownAction {
    return {
      id: 'toggle-status',
      label: enabled ? messages.users.ui.actionDisableUser : messages.users.ui.actionEnableUser,
      tone: enabled ? 'danger' : 'default',
      handler,
    }
  }

  return { actionViewDetail, actionUpdateUser, actionToggleStatus }
}
