import type { SelectRoleOption } from '@/types'
import { formatRoleLabel } from '@/utils'

export function mapperSelectRoleOptions(response: SelectRoleOption[]): SelectRoleOption[] {
  return response
    .map((role) => ({ id: role.id, name: formatRoleLabel(role.name.trim()) }))
    .filter((role) => Number.isInteger(role.id) && role.id > 0 && role.name.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}
