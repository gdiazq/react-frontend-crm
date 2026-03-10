import type {
  ContractCreateForm,
  ContractCreatePayload,
  ContractPagedResponse,
  ContractRaw,
  ContractsPagination,
  ContractsQueryParams,
  ContractTableRow,
} from '@/types'
import messages from '@/messages/messages'
import { formatDate } from '@/utils'

export function mapperContractsRows(result: ContractRaw[]): ContractTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    active: item.active,
    values: [
      item.name,
      item.company,
      item.contractType,
      item.contractStatus,
      formatDate(item.startDate),
      formatDate(item.endDate || '', '-'),
      item.active ? messages.contracts.ui.statusActive : messages.contracts.ui.statusInactive,
      formatDate(item.createdAt),
      '',
    ],
  }))
}

export function mapperContractsPagination(result: ContractPagedResponse): ContractsPagination {
  const page = result.page ?? result.number ?? 0
  const size = result.size ?? 10
  const totalElements = result.totalElements ?? result.total ?? 0
  const totalPages = result.totalPages ?? 0
  const total = result.total ?? totalElements
  const active = result.active ?? 0
  const first = result.first ?? page === 0
  const last = result.last ?? page >= totalPages - 1

  return {
    page,
    size,
    totalElements,
    totalPages,
    total,
    active,
    first,
    last,
  }
}

export function mapperContractsQueryParams(result: ContractsQueryParams): Record<string, number | string> {
  const employeeId = result.employeeId.trim()
  const createdFrom = result.createdFrom.trim()
  const createdTo = result.createdTo.trim()
  const queryParams: Record<string, number | string> = {
    page: result.page,
    size: result.size,
  }

  if (employeeId.length > 0) {
    const parsedEmployeeId = Number(employeeId)
    if (Number.isInteger(parsedEmployeeId) && parsedEmployeeId > 0) queryParams.employeeId = parsedEmployeeId
  }

  if (createdFrom.length > 0) queryParams.createdFrom = createdFrom
  if (createdTo.length > 0) queryParams.createdTo = createdTo

  return queryParams
}

function parseRequiredNumber(value: string): number {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0
}

function parseNullableString(value: string): string | null {
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

export function mapperCreateContractPayload(form: ContractCreateForm): ContractCreatePayload {
  return {
    employeeId: parseRequiredNumber(form.employeeId),
    name: form.name.trim(),
    contractNumber: form.contractNumber.trim(),
    contractTypeId: parseRequiredNumber(form.contractTypeId),
    safetyGroupId: parseRequiredNumber(form.safetyGroupId),
    contractDetail: parseNullableString(form.contractDetail),
    baseSalary: form.baseSalary.trim(),
    agreedSalary: form.agreedSalary.trim(),
    companyId: parseRequiredNumber(form.companyId),
    zoneId: parseRequiredNumber(form.zoneId),
    jobTitleId: parseRequiredNumber(form.jobTitleId),
    siteId: parseRequiredNumber(form.siteId),
    laborUnionId: parseRequiredNumber(form.laborUnionId),
    weeklyWorkHours: form.weeklyWorkHours.trim(),
    workDays: form.workDays.trim(),
    startDate: form.startDate.trim(),
    endDate: parseNullableString(form.endDate),
    mealTypeId: parseRequiredNumber(form.mealTypeId),
    transportTypeId: parseRequiredNumber(form.transportTypeId),
  }
}

export function mapperCreateContractFormData(payload: ContractCreatePayload, files: File[] = []): FormData {
  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  files.forEach((file) => formData.append('files', file))
  return formData
}
