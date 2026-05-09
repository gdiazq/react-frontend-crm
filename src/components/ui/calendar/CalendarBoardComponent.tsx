import { useEffect, useMemo, useState } from 'react'
import { formatDateLabel, formatDateValue, parseDateValue } from '../date-picker/datePickerUtils'

export type CalendarEventTone = 'cyan' | 'emerald' | 'amber' | 'rose' | 'slate'

export interface CalendarBoardEvent {
  id: string
  date: string
  title: string
  description?: string
  tone?: CalendarEventTone
}

interface CalendarBoardComponentProps {
  events?: CalendarBoardEvent[]
  initialMonth?: string
  selectedDate?: string
  title?: string
  subtitle?: string
  loading?: boolean
  errorMessage?: string | null
  emptyMessage?: string
  onDateSelect?: (date: string) => void
  onVisibleRangeChange?: (range: { from: string, to: string }) => void
}

const weekdays = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
const monthOptions = Array.from({ length: 12 }, (_, month) => ({
  value: String(month),
  label: new Intl.DateTimeFormat('es-CL', { month: 'long' }).format(new Date(2026, month, 1)),
}))
const YEAR_OPTIONS_LENGTH = 21

const toneClasses: Record<CalendarEventTone, string> = {
  cyan: 'border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200',
  amber: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200',
  rose: 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-200',
  slate: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200',
}

function resolveInitialMonth(initialMonth?: string) {
  const parsedInitialMonth = parseDateValue(initialMonth ? `${initialMonth}-01` : '')
  const now = new Date()
  const baseDate = parsedInitialMonth ?? now
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  if (baseDate < currentMonthStart) return currentMonthStart
  return new Date(baseDate.getFullYear(), baseDate.getMonth(), 1)
}

function buildMonthDays(monthDate: Date) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const leadingDays = (firstDay.getDay() + 6) % 7
  const totalCells = Math.ceil((leadingDays + lastDay.getDate()) / 7) * 7

  return Array.from({ length: totalCells }, (_, index) => {
    const dayDate = new Date(year, month, index - leadingDays + 1)
    return {
      date: dayDate,
      value: formatDateValue(dayDate),
      dayNumber: dayDate.getDate(),
      currentMonth: dayDate.getMonth() === month,
    }
  })
}

function buildMonthRange(monthDate: Date) {
  const from = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
  const to = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
  return {
    from: formatDateValue(from),
    to: formatDateValue(to),
  }
}

function formatMonthTitle(date: Date) {
  return new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' }).format(date)
}

function buildYearOptions(startYear: number) {
  return Array.from({ length: YEAR_OPTIONS_LENGTH }, (_, index) => startYear + index)
}

function isSameDay(first: Date, second: Date) {
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate()
}

function isBeforeDay(first: Date, second: Date) {
  const firstDay = new Date(first.getFullYear(), first.getMonth(), first.getDate())
  const secondDay = new Date(second.getFullYear(), second.getMonth(), second.getDate())
  return firstDay < secondDay
}

export function CalendarBoardComponent({
  events = [],
  initialMonth,
  selectedDate,
  title = 'Calendario',
  subtitle = 'Vista mensual de actividades',
  loading = false,
  errorMessage,
  emptyMessage = 'Sin eventos para este dia.',
  onDateSelect,
  onVisibleRangeChange,
}: CalendarBoardComponentProps) {
  const [currentMonth, setCurrentMonth] = useState(() => resolveInitialMonth(initialMonth))
  const [internalSelectedDate, setInternalSelectedDate] = useState(() => selectedDate || formatDateValue(new Date()))

  const activeSelectedDate = selectedDate ?? internalSelectedDate
  const today = useMemo(() => new Date(), [])
  const monthDays = useMemo(() => buildMonthDays(currentMonth), [currentMonth])
  const visibleRange = useMemo(() => buildMonthRange(currentMonth), [currentMonth])
  const yearOptions = useMemo(() => buildYearOptions(today.getFullYear()), [today])
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarBoardEvent[]>()
    events.forEach((event) => {
      const current = map.get(event.date) ?? []
      current.push(event)
      map.set(event.date, current)
    })
    return map
  }, [events])
  const selectedEvents = eventsByDate.get(activeSelectedDate) ?? []
  const monthEventCount = monthDays.reduce((count, day) => count + (eventsByDate.get(day.value)?.length ?? 0), 0)

  useEffect(() => {
    onVisibleRangeChange?.(visibleRange)
  }, [onVisibleRangeChange, visibleRange])

  const handleSelectDate = (date: string) => {
    const parsedDate = parseDateValue(date)
    const hasEvents = (eventsByDate.get(date)?.length ?? 0) > 0
    if (parsedDate && isBeforeDay(parsedDate, today) && !hasEvents) return
    setInternalSelectedDate(date)
    onDateSelect?.(date)
  }

  const handleMonthChange = (monthValue: string) => {
    const nextMonth = Number(monthValue)
    if (!Number.isInteger(nextMonth)) return
    if (currentMonth.getFullYear() === today.getFullYear() && nextMonth < today.getMonth()) return
    setCurrentMonth((month) => new Date(month.getFullYear(), nextMonth, 1))
  }

  const handleYearChange = (yearValue: string) => {
    const nextYear = Number(yearValue)
    if (!Number.isInteger(nextYear)) return
    setCurrentMonth((month) => {
      const nextMonth = nextYear === today.getFullYear() && month.getMonth() < today.getMonth()
        ? today.getMonth()
        : month.getMonth()
      return new Date(nextYear, nextMonth, 1)
    })
  }

  return (
    <section className="r-2xl overflow-hidden border border-slate-200 bg-white soft-ring dark:border-white/10 dark:bg-slate-950">
      <header className="relative isolate border-b border-slate-200 p-4 dark:border-white/10 sm:p-5">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_0%_0%,rgba(8,145,178,0.12),transparent_28%),linear-gradient(135deg,rgba(236,254,255,0.72),transparent_48%)] dark:bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.12),transparent_28%),linear-gradient(135deg,rgba(8,47,73,0.22),transparent_48%)]" />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="num text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Vista mensual</p>
            <h2 className="display mt-2 text-[34px] leading-none text-slate-950 dark:text-slate-50">
              {title}
              <span className="display-it text-slate-500 dark:text-slate-400"> operativo</span>
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{subtitle}</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-[minmax(10rem,1fr)_7rem]">
            <label className="flex flex-col gap-1.5">
              <span className="num text-[10px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Mes</span>
              <select
                value={String(currentMonth.getMonth())}
                className="r-md h-10 border border-slate-200 bg-white px-3 text-[13px] font-medium capitalize text-slate-700 outline-none transition hover:border-slate-300 focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--accent-400)]/30 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-white/20"
                onChange={(event) => handleMonthChange(event.target.value)}
              >
                {monthOptions.map((month) => (
                  <option
                    key={month.value}
                    value={month.value}
                    disabled={currentMonth.getFullYear() === today.getFullYear() && Number(month.value) < today.getMonth()}
                  >
                    {month.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="num text-[10px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Año</span>
              <select
                value={String(currentMonth.getFullYear())}
                className="r-md h-10 border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--accent-400)]/30 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-white/20"
                onChange={(event) => handleYearChange(event.target.value)}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </header>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="min-w-0 p-3 sm:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
            <h3 className="display text-[24px] capitalize leading-none text-slate-950 dark:text-slate-50">{formatMonthTitle(currentMonth)}</h3>
            <span className="r-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              {monthEventCount} eventos
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 border-b border-slate-100 pb-2 dark:border-white/10">
            {weekdays.map((weekday) => (
              <div key={weekday} className="py-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                {weekday}
              </div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {monthDays.map((day) => {
              const dayEvents = eventsByDate.get(day.value) ?? []
              const selected = day.value === activeSelectedDate
              const isToday = isSameDay(day.date, today)
              const hasEvents = dayEvents.length > 0
              const disabled = isBeforeDay(day.date, today) && !hasEvents

              return (
                <button
                  key={day.value}
                  type="button"
                  disabled={disabled}
                  className={`group relative min-h-[104px] overflow-hidden rounded-[calc(1rem*var(--radius-scale))] border p-2.5 pt-10 text-left transition hover:-translate-y-0.5 hover:border-[color:var(--accent-300)] hover:bg-cyan-50/40 hover:shadow-lg hover:shadow-slate-950/5 disabled:pointer-events-none disabled:opacity-35 dark:hover:bg-cyan-300/10 dark:hover:shadow-black/20 ${
                    selected
                      ? 'border-[color:var(--accent-400)] bg-cyan-50 soft-ring dark:border-cyan-300/40 dark:bg-cyan-300/10'
                      : 'border-slate-100 bg-white dark:border-white/10 dark:bg-slate-950/70'
                  } ${day.currentMonth ? '' : 'opacity-45'} ${disabled ? 'bg-slate-50 text-slate-400 dark:bg-slate-950/40 dark:text-slate-600' : ''}`}
                  onClick={() => handleSelectDate(day.value)}
                >
                  <span className={`num absolute left-3 top-2.5 text-[13px] leading-none ${
                    isToday
                      ? 'accent-text font-bold'
                      : selected
                        ? 'font-bold text-slate-950 dark:text-slate-50'
                        : 'font-semibold text-slate-600 dark:text-slate-300'
                  }`}>
                    {day.dayNumber}
                  </span>

                  {dayEvents.length > 0 && (
                    <span className="r-full absolute right-2.5 top-2.5 border border-slate-200 bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-500 shadow-sm dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-300">
                      {dayEvents.length}
                    </span>
                  )}

                  <div className="mt-2 space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <span key={event.id} className={`flex items-center gap-1.5 truncate rounded-lg border px-2 py-1 text-[10.5px] font-semibold ${toneClasses[event.tone ?? 'cyan']}`}>
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
                        <span className="truncate">{event.title}</span>
                      </span>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="block text-[10.5px] font-semibold text-slate-400 dark:text-slate-500">+{dayEvents.length - 2} mas</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <aside className="border-t border-slate-200 p-4 dark:border-white/10 lg:border-l lg:border-t-0">
          <p className="num text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Dia seleccionado</p>
          <h3 className="display mt-2 text-[28px] leading-none text-slate-950 dark:text-slate-50">{formatDateLabel(activeSelectedDate) || 'Sin fecha'}</h3>
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {errorMessage || (loading ? 'Cargando eventos...' : `${selectedEvents.length} eventos para revisar.`)}
          </p>

          <div className="mt-5 space-y-2">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="r-xl h-16 animate-pulse bg-slate-100 dark:bg-white/5" />
              ))
            ) : errorMessage ? (
              <div className="r-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-200">
                {errorMessage}
              </div>
            ) : selectedEvents.length > 0 ? (
              selectedEvents.map((event) => (
                <article key={event.id} className={`r-xl border p-3 ${toneClasses[event.tone ?? 'cyan']}`}>
                  <p className="text-sm font-semibold">{event.title}</p>
                  {event.description && <p className="mt-1 text-[12px] leading-5 opacity-80">{event.description}</p>}
                </article>
              ))
            ) : (
              <div className="r-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                {emptyMessage}
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}
