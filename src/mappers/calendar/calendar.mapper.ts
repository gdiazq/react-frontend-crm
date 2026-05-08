import type { CalendarEventTone, CalendarEventView, CalendarEventsQueryParams, CalendarEventRaw } from '@/types'

const validTones = new Set<CalendarEventTone>(['cyan', 'emerald', 'amber', 'rose', 'slate'])

function mapTone(value?: string | null): CalendarEventTone {
  return validTones.has(value as CalendarEventTone) ? value as CalendarEventTone : 'slate'
}

export function mapperCalendarEventsQueryParams(queryParams: CalendarEventsQueryParams): Record<string, string> {
  const params: Record<string, string> = {
    from: queryParams.from,
    to: queryParams.to,
  }

  if (queryParams.module?.trim()) params.module = queryParams.module.trim()
  if (queryParams.employeeId?.trim()) params.employeeId = queryParams.employeeId.trim()
  if (queryParams.costCenter?.trim()) params.costCenter = queryParams.costCenter.trim()
  if (queryParams.status?.trim()) params.status = queryParams.status.trim()

  return params
}

export function mapperCalendarEvents(items: CalendarEventRaw[]): CalendarEventView[] {
  return items.map((item) => ({
    id: item.id,
    date: item.date,
    title: item.title,
    description: item.description ?? undefined,
    tone: mapTone(item.tone),
    module: item.module,
    entityId: item.entityId,
    entityType: item.entityType,
    status: item.status ?? undefined,
  }))
}
