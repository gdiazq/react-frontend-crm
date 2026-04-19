import type { DetailHeroStat } from '@/components/ui/detail/DetailHeroComponent'

export function resolveApprovalTone(statusName: string): 'ok' | 'warn' | 'bad' | 'accent' | 'neutral' {
  const normalized = statusName
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (normalized === 'aprobado') return 'ok'
  if (normalized === 'rechazado') return 'bad'
  if (normalized === 'pendiente de aprobacion') return 'warn'
  if (normalized === 'pendiente de revision') return 'accent'
  if (normalized === 'error de sincronizacion') return 'warn'
  return 'neutral'
}

export function buildTenureStat(createdAt: string): DetailHeroStat | undefined {
  if (!createdAt) return undefined
  const createdDate = new Date(createdAt)
  if (Number.isNaN(createdDate.getTime())) return undefined

  const now = Date.now()
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000
  const years = (now - createdDate.getTime()) / msPerYear

  if (years < 1) {
    const months = Math.max(0, Math.floor(years * 12))
    return {
      label: 'Antigüedad',
      value: months,
      unit: months === 1 ? 'mes' : 'meses',
      progress: Math.min(100, (years / 5) * 100),
    }
  }

  const displayYears = Math.floor(years)
  return {
    label: 'Antigüedad',
    value: displayYears,
    unit: displayYears === 1 ? 'año' : 'años',
    progress: Math.min(100, (years / 10) * 100),
  }
}
