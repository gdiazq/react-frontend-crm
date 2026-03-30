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
