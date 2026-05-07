import type { DateRange, Matcher } from 'react-day-picker'

export function parseDateValue(value?: string | null): Date | undefined {
  const normalized = (value ?? '').trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return undefined

  const [year, month, day] = normalized.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export function formatDateValue(date?: Date): string {
  if (!date || Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateLabel(value?: string | null): string {
  const date = parseDateValue(value)
  if (!date) return ''
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function buildDateDisabledMatchers(min?: string, max?: string): Matcher[] | undefined {
  const disabled: Matcher[] = []
  const minDate = parseDateValue(min)
  const maxDate = parseDateValue(max)

  if (minDate) disabled.push({ before: minDate })
  if (maxDate) disabled.push({ after: maxDate })

  return disabled.length > 0 ? disabled : undefined
}

export function mapRangeToValues(range?: DateRange): { from: string, to: string } {
  return {
    from: formatDateValue(range?.from),
    to: formatDateValue(range?.to),
  }
}

export const calendarClassNames = {
  root: 'w-full',
  months: 'flex flex-col gap-4',
  month: 'space-y-3',
  month_caption: 'flex h-8 items-center justify-center',
  caption_label: 'display text-[18px] leading-none text-slate-900 dark:text-slate-50',
  nav: 'absolute inset-x-3 top-3 flex items-center justify-between',
  button_previous: 'r-md inline-flex h-8 w-8 items-center justify-center border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900 disabled:opacity-40 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-slate-100',
  button_next: 'r-md inline-flex h-8 w-8 items-center justify-center border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900 disabled:opacity-40 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-slate-100',
  chevron: 'h-4 w-4 fill-current',
  month_grid: 'w-full border-separate border-spacing-y-1',
  weekdays: 'grid grid-cols-7',
  weekday: 'py-1 text-center text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500',
  week: 'grid grid-cols-7 gap-1',
  day: 'relative flex h-9 items-center justify-center text-center',
  day_button: 'r-md inline-flex h-9 w-9 items-center justify-center text-[12.5px] font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-400)] dark:text-slate-200 dark:hover:bg-white/5',
  today: '[&>button]:border [&>button]:border-[color:var(--accent-400)] [&>button]:accent-text',
  selected: '[&>button]:accent-bg [&>button]:text-white [&>button]:hover:opacity-90',
  range_start: '[&>button]:accent-bg [&>button]:text-white',
  range_middle: '[&>button]:bg-[color:var(--accent-100)] [&>button]:accent-text dark:[&>button]:bg-[color:var(--accent-500)]/15',
  range_end: '[&>button]:accent-bg [&>button]:text-white',
  outside: '[&>button]:text-slate-300 dark:[&>button]:text-slate-700',
  disabled: '[&>button]:cursor-not-allowed [&>button]:text-slate-300 [&>button]:line-through dark:[&>button]:text-slate-700',
}
