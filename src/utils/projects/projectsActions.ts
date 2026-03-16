import messages from '@/messages/messages'
import type { DropdownAction } from '../users/usersActions'

export function createProjectsActions() {
  function actionUpdateProject(handler: () => void): DropdownAction {
    return { id: 'update-project', label: messages.projects.ui.actionUpdateProject, handler }
  }

  function actionToggleStatus(enabled: boolean, handler: () => void): DropdownAction {
    return {
      id: 'toggle-status',
      label: enabled ? messages.projects.ui.actionDisableProject : messages.projects.ui.actionEnableProject,
      tone: enabled ? 'danger' : 'default',
      handler,
    }
  }

  return { actionUpdateProject, actionToggleStatus }
}
