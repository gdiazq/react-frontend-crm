import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperCalendarEventsQueryParams } from '@/mappers'
import type { CalendarEventsQueryParams, CalendarEventsResponse } from '@/types'

export const calendarService = {
  getCalendarEvents: async (queryParams: CalendarEventsQueryParams) => {
    const { data } = await axiosInstance.get<CalendarEventsResponse>('/rrhh/calendar/events', {
      params: mapperCalendarEventsQueryParams(queryParams),
    })
    return data
  },

  isAxiosError: axios.isAxiosError,
}
