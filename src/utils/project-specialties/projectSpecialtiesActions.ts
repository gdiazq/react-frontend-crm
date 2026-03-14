import messages from '@/messages/messages'
import type { DropdownAction } from '../users/usersActions'

export function createProjectSpecialtiesActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.projectSpecialties.ui.actionViewDetail, handler }
  }

  function actionUpdateProjectSpecialty(handler: () => void): DropdownAction {
    return { id: 'update-project-specialty', label: messages.projectSpecialties.ui.updateProjectSpecialty, handler }
  }

  function actionToggleStatus(enabled: boolean, handler: () => void): DropdownAction {
    return {
      id: 'toggle-status',
      label: enabled ? messages.projectSpecialties.ui.actionDisableProjectSpecialty : messages.projectSpecialties.ui.actionEnableProjectSpecialty,
      tone: enabled ? 'danger' : 'default',
      handler,
    }
  }

  return { actionViewDetail, actionUpdateProjectSpecialty, actionToggleStatus }
}
