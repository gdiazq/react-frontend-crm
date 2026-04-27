import type { ValidationRule } from '@/types'
import { selectRequiredRule } from './shared.validators'

export const annexesCreateValidationRules: Record<string, ValidationRule> = {
  employeeId: {
    required: true,
    custom: (value: string) => (Number.isInteger(Number(value)) && Number(value) > 0 ? null : 'Selecciona un trabajador'),
  },
  contractId: {
    required: true,
    custom: (value: string) => (Number.isInteger(Number(value)) && Number(value) > 0 ? null : 'Selecciona un contrato'),
  },
  annexTypeId: selectRequiredRule('el tipo de anexo'),
  date: { required: true },
}
