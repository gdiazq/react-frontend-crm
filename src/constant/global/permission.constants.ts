export const PermissionAction = {
  Read: 'canRead',
  Create: 'canCreate',
  Update: 'canUpdate',
  Delete: 'canDelete',
  Approve: 'canApprove',
  Reject: 'canReject',
} as const

export type PermissionAction = typeof PermissionAction[keyof typeof PermissionAction]

export const PermissionModule = {
  User: 'USER',
  Role: 'ROLE',
  HrRequest: 'HR_REQUEST',
  Employee: 'EMPLOYEE',
  Contract: 'CONTRACT',
  Leave: 'LEAVE',
  Attendance: 'ATTENDANCE',
  Overtime: 'OVERTIME',
  Annex: 'ANNEX',
  Transfer: 'TRANSFER',
  Settlement: 'TERMINATION',
  Project: 'PROJECT',
  ProjectType: 'PROJECT_TYPE',
  ProjectSpecialty: 'PROJECT_SPECIALTY',
  ProjectStatus: 'PROJECT_STATUS',
  LegalTerminationCause: 'LEGAL_TERMINATION_CAUSE',
  QualityOfWork: 'QUALITY_OF_WORK',
  SafetyCompliance: 'SAFETY_COMPLIANCE',
  NoRehireCause: 'NO_RE_HIRED_CAUSE',
  TerminationQuizQuestion: 'TERMINATION_QUIZ_QUESTION',
  Calendar: 'CALENDAR',
} as const

export type PermissionModule = typeof PermissionModule[keyof typeof PermissionModule]
