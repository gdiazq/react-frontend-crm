import type { ValidationRule } from '@/types'
import { selectRequiredRule } from './shared.validators'

export const leavesCreateValidationRules: Record<string, ValidationRule> = {
  employeeId: {
    required: true,
    custom: (value: string) => (Number.isInteger(Number(value)) && Number(value) > 0 ? null : 'Selecciona un trabajador'),
  },
  leaveTypeId: selectRequiredRule('el tipo de permiso'),
  startDate: { required: true },
  endDate: { required: true },
  halfDay: { required: true },
  reason: { required: true, minLength: 3 },
}
