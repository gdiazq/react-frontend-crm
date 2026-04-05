import type { ValidationRule } from '@/types'
import { selectRequiredRule } from './shared.validators'

export const settlementsCreateValidationRules: Record<string, ValidationRule> = {
  employeeId: {
    required: true,
    custom: (value: string) => (Number.isInteger(Number(value)) && Number(value) > 0 ? null : 'Selecciona un trabajador'),
  },
  endDate: { required: true },
  legalTerminationCauseId: selectRequiredRule('la causa de terminacion'),
  qualityOfWorkId: selectRequiredRule('la calidad del trabajo'),
  safetyComplianceId: selectRequiredRule('el cumplimiento de seguridad'),
  rehireEligible: {
    required: true,
    custom: (value: string) => (value === 'true' || value === 'false' ? null : 'Selecciona si es recontratable'),
  },
}
