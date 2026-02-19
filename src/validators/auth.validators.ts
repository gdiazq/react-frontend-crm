import type { ValidationRule } from '@/types'

export const loginValidationRules: Record<string, ValidationRule> = {
  email: { required: true, email: true },
  password: { required: true, minLength: 6 },
}

export const registerValidationRules: Record<string, ValidationRule> = {
  username: { required: true, minLength: 3 },
  firstName: { required: true },
  lastName: { required: true },
  phoneNumber: { required: true },
  email: { required: true, email: true },
}

export const verifyEmailValidationRules: Record<string, ValidationRule> = {
  code: { required: true, minLength: 6 },
}

export const preLoginValidationRules: Record<string, ValidationRule> = {
  email: { required: true, email: true },
}

export const loginCredentialsValidationRules: Record<string, ValidationRule> = {
  password: { required: true, minLength: 6 },
}
