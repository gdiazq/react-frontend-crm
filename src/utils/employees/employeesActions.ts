import messages from '@/messages/messages'

export interface EmployeeDropdownAction {
  id: string
  label: string
  tone?: 'default' | 'danger'
  handler: () => void
}

export function createEmployeesActions() {
  function actionViewDetail(handler: () => void): EmployeeDropdownAction {
    return { id: 'view-detail', label: messages.employees.ui.actionViewDetail, handler }
  }

  function actionUpdateEmployee(handler: () => void): EmployeeDropdownAction {
    return { id: 'update-employee', label: messages.employees.ui.updateEmployee, handler }
  }

  function actionToggleStatus(enabled: boolean, handler: () => void): EmployeeDropdownAction {
    return {
      id: 'toggle-status',
      label: enabled ? messages.employees.ui.actionDisableEmployee : messages.employees.ui.actionEnableEmployee,
      tone: enabled ? 'danger' : 'default',
      handler,
    }
  }

  return { actionViewDetail, actionUpdateEmployee, actionToggleStatus }
}
