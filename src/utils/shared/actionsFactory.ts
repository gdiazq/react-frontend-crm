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

  function actionLinkUser(handler: () => void): DropdownAction {
    return { id: 'link-user', label: messages.employees.ui.actionLinkUser, handler }
  }

  function actionUnlinkUser(handler: () => void): DropdownAction {
    return { id: 'unlink-user', label: messages.employees.ui.actionUnlinkUser, tone: 'danger', handler }
  }

  return { actionViewDetail, actionUpdateEmployee, actionToggleStatus, actionLinkUser, actionUnlinkUser }
}

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

export function createRolesActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.roles.ui.actionViewDetail, handler }
  }

  function actionUpdateRole(handler: () => void): DropdownAction {
    return { id: 'update-role', label: messages.roles.ui.updateRole, handler }
  }

  function actionToggleStatus(enabled: boolean, handler: () => void): DropdownAction {
    return {
      id: 'toggle-status',
      label: enabled ? messages.roles.ui.actionDisableRole : messages.roles.ui.actionEnableRole,
      tone: enabled ? 'danger' : 'default',
      handler,
    }
  }

  return { actionViewDetail, actionUpdateRole, actionToggleStatus }
}

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

export function createProjectsActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.projects.ui.actionViewDetail, handler }
  }

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

  return { actionViewDetail, actionUpdateProject, actionToggleStatus }
}

export function createLegalTerminationCausesActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.legalTerminationCauses.ui.actionViewDetail, handler }
  }

  function actionUpdateLegalTerminationCause(handler: () => void): DropdownAction {
    return { id: 'update-legal-termination-cause', label: messages.legalTerminationCauses.ui.updateLegalTerminationCause, handler }
  }

  function actionToggleStatus(enabled: boolean, handler: () => void): DropdownAction {
    return {
      id: 'toggle-status',
      label: enabled ? messages.legalTerminationCauses.ui.actionDisableLegalTerminationCause : messages.legalTerminationCauses.ui.actionEnableLegalTerminationCause,
      tone: enabled ? 'danger' : 'default',
      handler,
    }
  }

  return { actionViewDetail, actionUpdateLegalTerminationCause, actionToggleStatus }
}
