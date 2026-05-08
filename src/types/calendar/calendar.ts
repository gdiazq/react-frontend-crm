export type CalendarModule = 'ATTENDANCE' | 'LEAVE' | 'CONTRACT' | 'ANNEX' | 'TRANSFER' | 'SETTLEMENT' | 'PROJECT'
export type CalendarEventTone = 'cyan' | 'emerald' | 'amber' | 'rose' | 'slate'

export interface CalendarEventRaw {
  id: string
  date: string
  title: string
  description?: string | null
  module: CalendarModule | string
  entityId: number
  entityType: string
  status?: string | null
  employeeId?: number | null
  employeeFullName?: string | null
  costCenter?: number | null
  projectName?: string | null
  tone?: CalendarEventTone | string | null
}

export interface CalendarEventsResponse {
  from: string
  to: string
  content: CalendarEventRaw[]
}

export interface CalendarEventsQueryParams {
  from: string
  to: string
  module?: CalendarModule | string
  employeeId?: string
  costCenter?: string
  status?: string
}

export interface CalendarEventView {
  id: string
  date: string
  title: string
  description?: string
  tone?: CalendarEventTone
  module: string
  entityId: number
  entityType: string
  status?: string
}
