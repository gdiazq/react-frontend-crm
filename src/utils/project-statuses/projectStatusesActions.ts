import messages from '@/messages/messages'
import type { DropdownAction } from '../users/usersActions'

export function createProjectStatusesActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.projectStatuses.ui.actionViewDetail, handler }
  }

  function actionUpdateProjectStatus(handler: () => void): DropdownAction {
    return { id: 'update-project-status', label: messages.projectStatuses.ui.updateProjectStatus, handler }
  }

  function actionToggleStatus(enabled: boolean, handler: () => void): DropdownAction {
    return {
      id: 'toggle-status',
      label: enabled ? messages.projectStatuses.ui.actionDisableProjectStatus : messages.projectStatuses.ui.actionEnableProjectStatus,
      tone: enabled ? 'danger' : 'default',
      handler,
    }
  }

  return { actionViewDetail, actionUpdateProjectStatus, actionToggleStatus }
}
