import type {
  SelectCompanyRepresentativeOption,
  SelectEmployeeStatusOption,
  SelectPermissionOption,
  SelectProjectTypeOption,
  SelectProjectSpecialtyOption,
  SelectProjectStatusOption,
  SelectRoleOption,
  SelectStatusOption,
  SelectSupervisorOption,
  SelectUserEmailOption,
  SelectUserNameOption,
  SelectVisitorOption,
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

export function mapperSelectEmployeeStatusOptions(response: SelectEmployeeStatusOption[]): SelectEmployeeStatusOption[] {
  return response
    .map((status) => ({ id: status.id, name: status.name.trim() }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
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

export function mapperSelectProjectTypeOptions(response: SelectProjectTypeOption[]): SelectProjectTypeOption[] {
  return response
    .map((type) => ({ id: type.id, name: type.name.trim() }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

export function mapperSelectProjectStatusOptions(response: SelectProjectStatusOption[]): SelectProjectStatusOption[] {
  return response
    .map((status) => ({ id: status.id, name: status.name.trim() }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

export function mapperSelectVisitorOptions(response: SelectVisitorOption[]): SelectVisitorOption[] {
  return response
    .map((item) => ({ id: item.id, name: item.name.trim() }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

export function mapperSelectSupervisorOptions(response: SelectSupervisorOption[]): SelectSupervisorOption[] {
  return response
    .map((item) => ({ id: item.id, name: item.name.trim() }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

export function mapperSelectCompanyRepresentativeOptions(response: SelectCompanyRepresentativeOption[]): SelectCompanyRepresentativeOption[] {
  return response
    .map((item) => ({ id: item.id, name: item.name.trim() }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}
