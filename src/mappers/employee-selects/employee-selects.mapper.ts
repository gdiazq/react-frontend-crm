import type { EmployeeSelectOption } from '@/types'

export function mapperEmployeeSelectOptions(response: EmployeeSelectOption[]): EmployeeSelectOption[] {
  return response
    .map((option) => ({ id: option.id, name: option.name.trim() }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}
