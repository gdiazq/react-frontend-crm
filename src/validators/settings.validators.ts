import type { ValidationRule } from '@/types'

export const settingsUpdateProfileValidationRules: Record<string, ValidationRule> = {
  firstName: { required: true, minLength: 2 },
  lastName: { required: true, minLength: 2 },
  email: { required: true, email: true },
  phoneNumber: { required: true, pattern: /^\+?[0-9]{8,15}$/ },
}
