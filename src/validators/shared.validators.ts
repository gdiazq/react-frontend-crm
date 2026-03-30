import type { ValidationRule } from '@/types'

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const selectRequiredRule = (label: string): ValidationRule => ({
  required: true,
  custom: (value: string) => (Number.isInteger(Number(value)) && Number(value) > 0 ? null : `Selecciona ${label}`),
})
