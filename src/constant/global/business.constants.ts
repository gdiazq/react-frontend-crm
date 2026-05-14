export const AttendanceMarkType = {
  CheckIn: 'CHECK_IN',
  CheckOut: 'CHECK_OUT',
} as const

export type AttendanceMarkType = typeof AttendanceMarkType[keyof typeof AttendanceMarkType]

export const CalendarModule = {
  Attendance: 'ATTENDANCE',
  Leave: 'LEAVE',
  Contract: 'CONTRACT',
  Annex: 'ANNEX',
  Transfer: 'TRANSFER',
  Settlement: 'SETTLEMENT',
  Project: 'PROJECT',
} as const

export type CalendarModule = typeof CalendarModule[keyof typeof CalendarModule]

export const CalendarEventTone = {
  Cyan: 'cyan',
  Emerald: 'emerald',
  Amber: 'amber',
  Rose: 'rose',
  Slate: 'slate',
} as const

export type CalendarEventTone = typeof CalendarEventTone[keyof typeof CalendarEventTone]

export const SortDirection = {
  Asc: 'asc',
  Desc: 'desc',
} as const

export type SortDirection = typeof SortDirection[keyof typeof SortDirection]
