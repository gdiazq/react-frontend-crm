import type { ValidationRule } from '@/types'
import { selectRequiredRule } from './shared.validators'

export const contractsCreateValidationRules: Record<string, ValidationRule> = {
  employeeId: {
    required: true,
    custom: (value: string) => (Number.isInteger(Number(value)) && Number(value) > 0 ? null : 'Selecciona un trabajador'),
  },
  name: { required: true, minLength: 3 },
  contractNumber: { required: true, minLength: 2 },
  contractTypeId: selectRequiredRule('el tipo de contrato'),
  safetyGroupId: selectRequiredRule('la agrupacion de seguridad'),
  baseSalary: { required: true, minLength: 1 },
  agreedSalary: { required: true, minLength: 1 },
  companyId: selectRequiredRule('la empresa'),
  zoneId: selectRequiredRule('la zona'),
  jobTitleId: selectRequiredRule('el cargo'),
  siteId: selectRequiredRule('la sede'),
  laborUnionId: selectRequiredRule('el sindicato'),
  weeklyWorkHours: { required: true, minLength: 1 },
  workDays: { required: true, minLength: 1 },
  startDate: { required: true },
  mealTypeId: selectRequiredRule('el tipo de colacion'),
  transportTypeId: selectRequiredRule('el tipo de movilizacion'),
}
