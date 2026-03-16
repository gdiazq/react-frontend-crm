import type { ValidationRule } from '@/types'

export const projectsCreateValidationRules: Record<string, ValidationRule> = {
  costCenter: {
    required: true,
    custom: (value: string) => {
      const parsed = Number(value)
      return Number.isInteger(parsed) && parsed > 0 ? null : 'Ingresa un centro de costo valido (numero positivo)'
    },
  },
  name: { required: true, minLength: 3 },
}
