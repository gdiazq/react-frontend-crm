import type { ContractSelectOption } from '@/types'

export function mapperContractSelectOptions(response: ContractSelectOption[]): ContractSelectOption[] {
  return response
    .map((option) => ({ id: option.id, name: option.name.trim() }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}
