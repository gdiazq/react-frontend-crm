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

export function createLeavesActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.leaves.ui.actionViewDetail, handler }
  }

  function actionUpdateLeave(handler: () => void): DropdownAction {
    return { id: 'update-leave', label: messages.leaves.ui.updateLeave, handler }
  }

  return { actionViewDetail, actionUpdateLeave }
}

export function createAttendanceActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.attendance.ui.actionViewDetail, handler }
  }

  function actionUpdateAttendance(handler: () => void): DropdownAction {
    return { id: 'update-attendance', label: messages.attendance.ui.updateAttendance, handler }
  }

  function actionDeleteAttendance(handler: () => void): DropdownAction {
    return { id: 'delete-attendance', label: messages.attendance.ui.deleteAttendance, tone: 'danger', handler }
  }

  return { actionViewDetail, actionUpdateAttendance, actionDeleteAttendance }
}

export function createOvertimeActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.overtime.ui.actionViewDetail, handler }
  }

  function actionUpdateOvertime(handler: () => void): DropdownAction {
    return { id: 'update-overtime', label: messages.overtime.ui.updateOvertime, handler }
  }

  return { actionViewDetail, actionUpdateOvertime }
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

export function createProjectAssignmentsActions() {
  function actionViewEmployeeDetail(handler: () => void): DropdownAction {
    return { id: 'view-employee-detail', label: messages.projectAssignments.ui.actionViewEmployeeDetail, handler }
  }

  function actionViewCostCenterDetail(handler: () => void): DropdownAction {
    return { id: 'view-cost-center-detail', label: messages.projectAssignments.ui.actionViewCostCenterDetail, handler }
  }

  return { actionViewEmployeeDetail, actionViewCostCenterDetail }
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

export function createQualityOfWorkActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.qualityOfWork.ui.actionViewDetail, handler }
  }

  function actionUpdateQualityOfWork(handler: () => void): DropdownAction {
    return { id: 'update-quality-of-work', label: messages.qualityOfWork.ui.updateQualityOfWork, handler }
  }

  function actionToggleStatus(enabled: boolean, handler: () => void): DropdownAction {
    return {
      id: 'toggle-status',
      label: enabled ? messages.qualityOfWork.ui.actionDisableQualityOfWork : messages.qualityOfWork.ui.actionEnableQualityOfWork,
      tone: enabled ? 'danger' : 'default',
      handler,
    }
  }

  return { actionViewDetail, actionUpdateQualityOfWork, actionToggleStatus }
}

export function createSafetyComplianceActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.safetyCompliance.ui.actionViewDetail, handler }
  }

  function actionUpdateSafetyCompliance(handler: () => void): DropdownAction {
    return { id: 'update-safety-compliance', label: messages.safetyCompliance.ui.updateSafetyCompliance, handler }
  }

  function actionToggleStatus(enabled: boolean, handler: () => void): DropdownAction {
    return {
      id: 'toggle-status',
      label: enabled ? messages.safetyCompliance.ui.actionDisableSafetyCompliance : messages.safetyCompliance.ui.actionEnableSafetyCompliance,
      tone: enabled ? 'danger' : 'default',
      handler,
    }
  }

  return { actionViewDetail, actionUpdateSafetyCompliance, actionToggleStatus }
}

export function createNoRehireCauseActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.noRehireCause.ui.actionViewDetail, handler }
  }

  function actionUpdateNoRehireCause(handler: () => void): DropdownAction {
    return { id: 'update-no-rehire-cause', label: messages.noRehireCause.ui.updateNoRehireCause, handler }
  }

  function actionToggleStatus(enabled: boolean, handler: () => void): DropdownAction {
    return {
      id: 'toggle-status',
      label: enabled ? messages.noRehireCause.ui.actionDisableNoRehireCause : messages.noRehireCause.ui.actionEnableNoRehireCause,
      tone: enabled ? 'danger' : 'default',
      handler,
    }
  }

  return { actionViewDetail, actionUpdateNoRehireCause, actionToggleStatus }
}

export function createTerminationQuizQuestionActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.terminationQuizQuestion.ui.actionViewDetail, handler }
  }

  function actionUpdateTerminationQuizQuestion(handler: () => void): DropdownAction {
    return { id: 'update-termination-quiz-question', label: messages.terminationQuizQuestion.ui.updateTerminationQuizQuestion, handler }
  }

  function actionToggleStatus(enabled: boolean, handler: () => void): DropdownAction {
    return {
      id: 'toggle-status',
      label: enabled ? messages.terminationQuizQuestion.ui.actionDisableTerminationQuizQuestion : messages.terminationQuizQuestion.ui.actionEnableTerminationQuizQuestion,
      tone: enabled ? 'danger' : 'default',
      handler,
    }
  }

  return { actionViewDetail, actionUpdateTerminationQuizQuestion, actionToggleStatus }
}

export function createSettlementActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.settlement.ui.actionViewDetail, handler }
  }

  function actionEdit(handler: () => void): DropdownAction {
    return { id: 'edit', label: messages.settlement.ui.actionEdit, handler }
  }

  return { actionViewDetail, actionEdit }
}

export function createTransferActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.transfer.ui.actionViewDetail, handler }
  }

  function actionUpdateTransfer(handler: () => void): DropdownAction {
    return { id: 'update-transfer', label: messages.transfer.ui.updateTransfer, handler }
  }

  return { actionViewDetail, actionUpdateTransfer }
}

export function createAnnexesActions() {
  function actionViewDetail(handler: () => void): DropdownAction {
    return { id: 'view-detail', label: messages.annexes.ui.actionViewDetail, handler }
  }

  function actionUpdateAnnex(handler: () => void): DropdownAction {
    return { id: 'update-annex', label: messages.annexes.ui.updateAnnex, handler }
  }

  return { actionViewDetail, actionUpdateAnnex }
}
