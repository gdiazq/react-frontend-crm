import messages from '@/messages/messages'
import type { DropdownAction } from '../users/usersActions'

export function createRequestsActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.requests.ui.actionViewDetail, handler }
  }

  function actionApproveRequest(handler: () => void): DropdownAction {
    return { id: 'approve-request', label: messages.requests.ui.actionApproveRequest, handler }
  }

  function actionRejectRequest(handler: () => void): DropdownAction {
    return { id: 'reject-request', label: messages.requests.ui.actionRejectRequest, tone: 'danger', handler }
  }

  return { actionViewDetail, actionApproveRequest, actionRejectRequest }
}
