import type {
  SelectRoleOption,
  SelectStatusOption,
  SelectUserEmailOption,
  SelectUserNameOption,
} from '@/types'
import { formatRoleLabel } from '@/utils'

export function mapperSelectRoleOptions(response: SelectRoleOption[]): SelectRoleOption[] {
  return response
    .map((role) => ({ id: role.id, name: formatRoleLabel(role.name.trim()) }))
    .filter((role) => Number.isInteger(role.id) && role.id > 0 && role.name.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

export function mapperSelectUserNameOptions(response: SelectUserNameOption[]): SelectUserNameOption[] {
  return response
    .map((user) => ({ id: user.id, name: user.name.trim() }))
    .filter((user) => Number.isInteger(user.id) && user.id > 0 && user.name.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

export function mapperSelectUserEmailOptions(response: SelectUserEmailOption[]): SelectUserEmailOption[] {
  return response
    .map((user) => ({ id: user.id, email: user.email.trim() }))
    .filter((user) => Number.isInteger(user.id) && user.id > 0 && user.email.length > 0)
    .sort((a, b) => a.email.localeCompare(b.email, 'es'))
}

export function mapperSelectStatusOptions(response: SelectStatusOption[]): SelectStatusOption[] {
  return response
    .map((status) => ({ id: status.id, name: status.name.trim() }))
    .filter((status) => status.name.length > 0)
}
