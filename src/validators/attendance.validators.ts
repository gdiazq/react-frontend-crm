import type { ValidationRule } from '@/types'
import { selectRequiredRule } from './shared.validators'

const TIME_REGEX = /^(\d{1,2})(:?\d{2})?$/

function validateMarkTime(value: string): string | null {
  const normalized = value.trim()
  if (!normalized) return 'La hora es obligatoria'

  const hourOnly = normalized.match(/^(\d{1,2})$/)
  if (hourOnly) {
    const hour = Number(hourOnly[1])
    return hour >= 0 && hour <= 23 ? null : 'Hora inválida'
  }

  const compact = normalized.match(/^(\d{1,2})(\d{2})$/)
  if (compact) {
    const hour = Number(compact[1])
    const minute = Number(compact[2])
    return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59 ? null : 'Hora inválida'
  }

  const colon = normalized.match(/^(\d{1,2}):(\d{1,2})$/)
  if (colon) {
    const hour = Number(colon[1])
    const minute = Number(colon[2])
    return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59 ? null : 'Hora inválida'
  }

  return TIME_REGEX.test(normalized) ? null : 'Hora inválida'
}

export const attendanceCreateValidationRules: Record<string, ValidationRule> = {
  employeeId: {
    required: true,
    custom: (value: string) => (Number.isInteger(Number(value)) && Number(value) > 0 ? null : 'Selecciona un trabajador'),
  },
  date: { required: true },
  statusId: selectRequiredRule('el estado de asistencia'),
}

export const attendanceMarkCreateValidationRules: Record<string, ValidationRule> = {
  markType: {
    required: true,
    custom: (value: string) => (value.trim() ? null : 'Selecciona el tipo de marca'),
  },
  employeeId: {
    required: true,
    custom: (value: string) => (Number.isInteger(Number(value)) && Number(value) > 0 ? null : 'Selecciona un trabajador'),
  },
  date: { required: true },
  markTime: {
    required: true,
    custom: validateMarkTime,
  },
}
