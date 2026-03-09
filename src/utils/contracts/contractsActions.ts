import messages from '@/messages/messages'
import type { DropdownAction } from '../users/usersActions'

export function createContractsActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.contracts.ui.actionViewDetail, handler }
  }

  function actionUpdateContract(handler: () => void): DropdownAction {
    return { id: 'update-contract', label: messages.contracts.ui.updateContract, handler }
  }

  function actionToggleStatus(enabled: boolean, handler: () => void): DropdownAction {
    return {
      id: 'toggle-status',
      label: enabled ? messages.contracts.ui.actionDisableContract : messages.contracts.ui.actionEnableContract,
      tone: enabled ? 'danger' : 'default',
      handler,
    }
  }

  return { actionViewDetail, actionUpdateContract, actionToggleStatus }
}
