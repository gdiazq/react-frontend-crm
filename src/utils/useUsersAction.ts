import messages from '@/messages/messages'

export interface DropdownAction {
  id: string
  label: string
  tone?: 'default' | 'danger'
  handler: () => void
}

export function useUsersAction() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.users.actionViewDetail, handler }
  }

  function actionUpdateUser(handler: () => void): DropdownAction {
    return { id: 'update-user', label: messages.users.updateUser, handler }
  }

  function actionToggleStatus(enabled: boolean, handler: () => void): DropdownAction {
    return {
      id: 'toggle-status',
      label: enabled ? messages.users.actionDisableUser : messages.users.actionEnableUser,
      tone: enabled ? 'danger' : 'default',
      handler,
    }
  }

  return { actionViewDetail, actionUpdateUser, actionToggleStatus }
}
