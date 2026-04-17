import type { ValidationRule } from '@/types'

const nameRule: Record<string, ValidationRule> = {
  name: {
    required: true,
    minLength: 3,
    custom: (value: string) => (value.trim().length >= 3 ? null : 'Minimo 3 caracteres'),
  },
}

export const rolesCreateValidationRules: Record<string, ValidationRule> = nameRule

export const projectStatusesCreateValidationRules: Record<string, ValidationRule> = nameRule

export const projectSpecialtiesCreateValidationRules: Record<string, ValidationRule> = nameRule

export const projectTypesCreateValidationRules: Record<string, ValidationRule> = nameRule

export const legalTerminationCausesCreateValidationRules: Record<string, ValidationRule> = nameRule
export const qualityOfWorkCreateValidationRules: Record<string, ValidationRule> = nameRule
export const safetyComplianceCreateValidationRules: Record<string, ValidationRule> = nameRule
export const noRehireCauseCreateValidationRules: Record<string, ValidationRule> = nameRule

export const transferCreateValidationRules: Record<string, ValidationRule> = {
  employeeId: {
    required: true,
    custom: (value: string) => (value.trim().length > 0 ? null : 'Selecciona un empleado'),
  },
  toCostCenter: {
    required: true,
    custom: (value: string) => {
      const n = Number(value.trim())
      return Number.isInteger(n) && n > 0 ? null : 'Centro de costo destino es obligatorio'
    },
  },
  effectiveDate: {
    required: true,
    custom: (value: string) => (value.trim().length > 0 ? null : 'La fecha efectiva es obligatoria'),
  },
  reason: {
    required: true,
    minLength: 3,
    custom: (value: string) => (value.trim().length >= 3 ? null : 'Minimo 3 caracteres'),
  },
}

export const terminationQuizQuestionCreateValidationRules: Record<string, ValidationRule> = {
  question: {
    required: true,
    minLength: 3,
    custom: (value: string) => (value.trim().length >= 3 ? null : 'Minimo 3 caracteres'),
  },
  questionGroup: {
    required: true,
    custom: (value: string) => (value.trim().length > 0 ? null : 'Ingresa el grupo de pregunta'),
  },
}
