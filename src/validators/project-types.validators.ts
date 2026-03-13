import type { ValidationRule } from '@/types'

export const projectTypesCreateValidationRules: Record<string, ValidationRule> = {
  name: {
    required: true,
    minLength: 3,
    custom: (value: string) => (value.trim().length >= 3 ? null : 'Minimo 3 caracteres'),
  },
}
