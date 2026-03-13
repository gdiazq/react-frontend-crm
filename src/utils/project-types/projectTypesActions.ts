import messages from '@/messages/messages'
import type { DropdownAction } from '../users/usersActions'

export function createProjectTypesActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.projectTypes.ui.actionViewDetail, handler }
  }

  function actionUpdateProjectType(handler: () => void): DropdownAction {
    return { id: 'update-project-type', label: messages.projectTypes.ui.updateProjectType, handler }
  }

  function actionToggleStatus(enabled: boolean, handler: () => void): DropdownAction {
    return {
      id: 'toggle-status',
      label: enabled ? messages.projectTypes.ui.actionDisableProjectType : messages.projectTypes.ui.actionEnableProjectType,
      tone: enabled ? 'danger' : 'default',
      handler,
    }
  }

  return { actionViewDetail, actionUpdateProjectType, actionToggleStatus }
}
