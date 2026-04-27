import type { AnnexSelectOption } from '@/types'

export function mapperAnnexSelectOptions(response: AnnexSelectOption[]): AnnexSelectOption[] {
  return response
    .map((option) => ({ id: option.id, name: option.name.trim() }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}
