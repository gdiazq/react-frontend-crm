import type { ValidationRule } from '@/types'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function mapperValidateField(value: string, rule: ValidationRule): string | null {
  const normalized = value || ''

  if (rule.required && !normalized.trim()) return 'Campo obligatorio'
  if (rule.minLength && normalized.length < rule.minLength) return `Minimo ${rule.minLength} caracteres`
  if (rule.maxLength && normalized.length > rule.maxLength) return `Maximo ${rule.maxLength} caracteres`
  if (rule.email && !EMAIL_REGEX.test(normalized)) return 'Correo invalido'
  if (rule.pattern && !rule.pattern.test(normalized)) return 'Formato invalido'
  if (rule.custom) return rule.custom(normalized)
  return null
}

export function mapperIsFormValid(
  form: Record<string, string>,
  rules: Record<string, ValidationRule>,
): boolean {
  return Object.keys(rules).every((key) => {
    const rule = rules[key]
    if (!rule) return true
    return mapperValidateField(form[key] || '', rule) === null
  })
}
