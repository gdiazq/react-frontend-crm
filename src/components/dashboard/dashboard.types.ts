import type { ReactNode } from 'react'

export type DashboardModule = {
  label: string
  eyebrow: string
  description: string
  route: string
  permissionModules: string[]
  accent: string
  icon: ReactNode
}

export type DashboardSummaryTone = 'cyan' | 'emerald' | 'amber'
