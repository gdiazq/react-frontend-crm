import type { ValidationRule } from '@/types'

export const usersCreateValidationRules: Record<string, ValidationRule> = {
  username: { required: true, minLength: 3 },
  email: { required: true, email: true },
  firstName: { required: true, minLength: 2 },
  lastName: { required: true, minLength: 2 },
  phoneNumber: { required: true, pattern: /^\+?[0-9]{8,15}$/ },
  roleId: {
    required: true,
    custom: (value: string) => (Number.isInteger(Number(value)) && Number(value) > 0 ? null : 'Selecciona un rol'),
  },
}
