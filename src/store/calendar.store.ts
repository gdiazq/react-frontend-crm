import { create } from 'zustand'
import { calendarService } from '@/services'
import { mapperCalendarEvents } from '@/mappers'
import type { CalendarStore } from '@/types'
import { resolveErrorMessage } from '@/utils'

const CALENDAR_ERROR_FALLBACK = 'No se pudo cargar el calendario.'

export const useStoreCalendar = create<CalendarStore>()((set) => {
  let latestCalendarRequestId = 0

  return {
    events: [],
    loadingEvents: false,
    eventsErrorMessage: null,
    lastRange: null,

    getCalendarEvents: async (queryParams) => {
      const requestId = ++latestCalendarRequestId
      try {
        set({ loadingEvents: true, eventsErrorMessage: null })
        const response = await calendarService.getCalendarEvents(queryParams)
        if (requestId !== latestCalendarRequestId) return
        set({
          events: mapperCalendarEvents(response.content),
          lastRange: { from: response.from, to: response.to },
        })
      } catch (error) {
        if (requestId !== latestCalendarRequestId) return
        set({ eventsErrorMessage: resolveErrorMessage(error, CALENDAR_ERROR_FALLBACK), events: [] })
      } finally {
        if (requestId === latestCalendarRequestId) set({ loadingEvents: false })
      }
    },

    clearCalendarEvents: () => {
      latestCalendarRequestId += 1
      set({ events: [], loadingEvents: false, lastRange: null })
    },

    clearCalendarStatus: () => {
      set({ eventsErrorMessage: null })
    },
  }
})
