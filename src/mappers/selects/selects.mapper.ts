import type {
  SelectPermissionOption,
  SelectProjectSpecialtyOption,
  SelectRoleOption,
  SelectStatusOption,
  SelectUserEmailOption,
  SelectUserNameOption,
} from '@/types'
import { formatPermissionName, formatRoleLabel } from '@/utils'

export function mapperSelectRoleOptions(response: SelectRoleOption[]): SelectRoleOption[] {
  return response
    .map((role) => ({ id: role.id, name: formatRoleLabel(role.name.trim()) }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

export function mapperSelectUserNameOptions(response: SelectUserNameOption[]): SelectUserNameOption[] {
  return response
    .map((user) => ({ id: user.id, name: user.name.trim() }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

export function mapperSelectUserEmailOptions(response: SelectUserEmailOption[]): SelectUserEmailOption[] {
  return response
    .map((user) => ({ id: user.id, email: user.email.trim() }))
    .sort((a, b) => a.email.localeCompare(b.email, 'es'))
}

export function mapperSelectStatusOptions(response: SelectStatusOption[]): SelectStatusOption[] {
  return response.map((status) => ({ id: status.id, name: status.name.trim() }))
}

export function mapperSelectPermissionOptions(response: SelectPermissionOption[]): SelectPermissionOption[] {
  return response
    .map((permission) => ({ id: permission.id, name: formatPermissionName(permission.name) }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

export function mapperSelectProjectSpecialtyOptions(response: SelectProjectSpecialtyOption[]): SelectProjectSpecialtyOption[] {
  return response
    .map((specialty) => ({ id: specialty.id, name: specialty.name.trim() }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}
