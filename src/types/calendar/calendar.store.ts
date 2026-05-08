import type { CalendarEventView, CalendarEventsQueryParams } from './calendar'

export interface CalendarStore {
  events: CalendarEventView[]
  loadingEvents: boolean
  eventsErrorMessage: string | null
  lastRange: { from: string, to: string } | null
  getCalendarEvents: (queryParams: CalendarEventsQueryParams) => Promise<void>
  clearCalendarEvents: () => void
  clearCalendarStatus: () => void
}
