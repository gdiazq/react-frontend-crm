import { useState, useCallback, useMemo } from 'react'
import type { ValidationOptions, ValidationRule } from '@/types'
import { mapperIsFormValid, mapperValidateField } from '@/mappers'

export function useFormValidation(
  form: Record<string, string>,
  rules: Record<string, ValidationRule>,
  options: ValidationOptions = {},
) {
  const trigger = options.trigger || 'validacion'

  const [errors, setErrors] = useState<Record<string, string | null>>(() => {
    const initial: Record<string, string | null> = {}
    Object.keys(form).forEach((key) => { initial[key] = null })
    return initial
  })

  const validateField = useCallback((name: string): boolean => {
    const rule = rules[name]
    if (!rule) {
      setErrors((prev) => ({ ...prev, [name]: null }))
      return true
    }
    const error = mapperValidateField(form[name] || '', rule)
    setErrors((prev) => ({ ...prev, [name]: error }))
    return error === null
  }, [form, rules])

  const validateFieldValue = useCallback((name: string, value: string): boolean => {
    const rule = rules[name]
    if (!rule) {
      setErrors((prev) => ({ ...prev, [name]: null }))
      return true
    }
    const error = mapperValidateField(value, rule)
    setErrors((prev) => ({ ...prev, [name]: error }))
    return error === null
  }, [rules])

  const validateAll = useCallback((): boolean => {
    let valid = true
    const newErrors: Record<string, string | null> = {}
    Object.keys(rules).forEach((key) => {
      const rule = rules[key]
      if (!rule) {
        newErrors[key] = null
        return
      }
      const error = mapperValidateField(form[key] || '', rule)
      newErrors[key] = error
      if (error !== null) valid = false
    })
    setErrors(newErrors)
    return valid
  }, [form, rules])

  const isValid = useMemo(() => mapperIsFormValid(form, rules), [form, rules])

  const onValidation = useCallback((name: string) => {
    return (valueOrEvent?: unknown) => {
      if (trigger !== 'validacion') return
      if (typeof valueOrEvent === 'string') {
        validateFieldValue(name, valueOrEvent)
        return
      }
      validateField(name)
    }
  }, [trigger, validateField, validateFieldValue])

  const setFieldError = useCallback((name: string, error: string | null) => {
    setErrors((prev) => ({ ...prev, [name]: error }))
  }, [])

  return {
    errors,
    isValid,
    validateField,
    validateFieldValue,
    validateAll,
    onValidation,
    setFieldError,
  }
}
