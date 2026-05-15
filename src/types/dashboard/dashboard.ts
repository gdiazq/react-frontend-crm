import type { ReactNode } from 'react'
import type { PermissionModuleValue } from '@/constant'

export type DashboardModule = {
  label: string
  eyebrow: string
  description: string
  route: string
  permissionModules: PermissionModuleValue[]
  accent: string
  icon: ReactNode
}

export type DashboardSummaryTone = 'cyan' | 'emerald' | 'amber'
