import messages from '@/messages/messages'
import type { DropdownAction } from '../users/usersActions'

export function createEmployeesActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.employees.ui.actionViewDetail, handler }
  }

  function actionUpdateEmployee(handler: () => void): DropdownAction {
    return { id: 'update-employee', label: messages.employees.ui.updateEmployee, handler }
  }

  function actionToggleStatus(enabled: boolean, handler: () => void): DropdownAction {
    return {
      id: 'toggle-status',
      label: enabled ? messages.employees.ui.actionDisableEmployee : messages.employees.ui.actionEnableEmployee,
      tone: enabled ? 'danger' : 'default',
      handler,
    }
  }

  return { actionViewDetail, actionUpdateEmployee, actionToggleStatus }
}
