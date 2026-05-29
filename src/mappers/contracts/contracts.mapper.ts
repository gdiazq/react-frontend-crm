import type {
  ContractDetail,
  ContractDetailDocumentView,
  ContractDetailView,
  ContractCreateForm,
  ContractCreatePayload,
  ContractFormSelectOption,
  ContractPagedResponse,
  ContractRaw,
  ContractSelectOption,
  ContractUpdatePayload,
  ContractsPagination,
  ContractsQueryParams,
  ContractTableRow,
} from '@/types'
import { mapperPagination } from '../shared/pagination.mapper'
import { buildQueryParams, appendString, appendParsedId } from '../shared/queryParams.mapper'
import { parseRequiredNumber, parseNullableString, normalizeDateValue } from '../shared/form.mapper'
import { formatDate, formatDateTime, resolveFileSize } from '@/utils'

export function mapperContractFormSelectOptions(options: ContractSelectOption[]): ContractFormSelectOption[] {
  return options.map((option) => ({ label: option.name, value: String(option.id) }))
}

export function mapperContractFormSelectOptionsWithCurrent(
  options: ContractFormSelectOption[],
  current: { enabled: boolean, value: string, label: string, fallbackLabel: string },
): ContractFormSelectOption[] {
  const shouldIncludeCurrent = current.enabled
    && current.value.trim().length > 0
    && !options.some((option) => option.value === current.value)

  return shouldIncludeCurrent
    ? [{ label: current.label || current.fallbackLabel, value: current.value }, ...options]
    : options
}

export function resolveContractIsIndefiniteType(label: string): boolean {
  return label.trim().toLowerCase().includes('indefinido')
}

export function mapperContractFormFieldChange(
  form: ContractCreateForm,
  field: keyof ContractCreateForm,
  value: string,
  options: { contractTypeOptions: ContractFormSelectOption[] },
): ContractCreateForm {
  if (field === 'contractTypeId') {
    const nextContractTypeLabel = options.contractTypeOptions.find((option) => option.value === value)?.label ?? ''
    if (resolveContractIsIndefiniteType(nextContractTypeLabel)) {
      return { ...form, contractTypeId: value, endDate: '' }
    }
  }

  return { ...form, [field]: value }
}

export function mapperContractsRows(result: ContractRaw[]): ContractTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    active: item.active,
    values: [
      item.employeeIdentification,
      item.employeeName,
      item.name,
      item.company,
      item.contractType,
      formatDate(item.startDate),
      formatDate(item.endDate || '', '-'),
      item.contractStatus,
      formatDate(item.createdAt),
      formatDate(item.updatedAt || '', 'Sin registro'),
      '',
    ],
  }))
}

export function mapperContractsPagination(result: ContractPagedResponse): ContractsPagination {
  return mapperPagination(result)
}

export function mapperContractsQueryParams(result: ContractsQueryParams): Record<string, number | string> {
  const params = buildQueryParams(result)
  appendString(params, 'search', result.search)
  appendParsedId(params, 'employeeId', result.employeeId)
  appendParsedId(params, 'statusId', result.statusId)
  appendParsedId(params, 'contractStatusId', result.contractStatusId)
  appendParsedId(params, 'contractTypeId', result.contractTypeId)
  appendString(params, 'createdFrom', result.createdFrom)
  appendString(params, 'createdTo', result.createdTo)
  appendString(params, 'startDateFrom', result.startDateFrom)
  appendString(params, 'startDateTo', result.startDateTo)
  appendString(params, 'endDateFrom', result.endDateFrom)
  appendString(params, 'endDateTo', result.endDateTo)
  appendString(params, 'updatedFrom', result.updatedFrom)
  appendString(params, 'updatedTo', result.updatedTo)
  return params
}

function mapperContractDocuments(documents: ContractDetail['documents']): ContractDetailDocumentView[] {
  if (!documents || documents.length === 0) return []

  return documents.map((document) => ({
    id: document.id,
    fileName: document.fileName,
    sizeDisplay: resolveFileSize(document.size),
    url: document.url?.trim() ?? '',
  }))
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

export function mapperUpdateContractPayload(contractId: number, form: ContractCreateForm): ContractUpdatePayload {
  return {
    id: contractId,
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

export function mapperContractDetailToForm(detail: ContractDetail): ContractCreateForm {
  return {
    employeeId: String(detail.employeeId),
    name: detail.name ?? '',
    contractNumber: detail.contractNumber ?? '',
    contractTypeId: String(detail.contractType?.id ?? detail.contractTypeId ?? ''),
    safetyGroupId: String(detail.safetyGroup?.id ?? detail.safetyGroupId ?? ''),
    contractDetail: detail.contractDetail ?? '',
    baseSalary: detail.baseSalary ?? '',
    agreedSalary: detail.agreedSalary ?? '',
    companyId: String(detail.company?.id ?? detail.companyId ?? ''),
    zoneId: String(detail.zone?.id ?? detail.zoneId ?? ''),
    jobTitleId: String(detail.jobTitle?.id ?? detail.jobTitleId ?? ''),
    siteId: String(detail.site?.id ?? detail.siteId ?? ''),
    laborUnionId: String(detail.laborUnion?.id ?? detail.laborUnionId ?? ''),
    weeklyWorkHours: detail.weeklyWorkHours ?? '',
    workDays: detail.workDays ?? '',
    startDate: normalizeDateValue(detail.startDate),
    endDate: normalizeDateValue(detail.endDate),
    mealTypeId: String(detail.mealType?.id ?? detail.mealTypeId ?? ''),
    transportTypeId: String(detail.transportType?.id ?? detail.transportTypeId ?? ''),
  }
}

export function mapperContractDetailView(detail: ContractDetail | null): ContractDetailView | null {
  if (!detail) return null

  return {
    contractName: detail.name,
    contractNumber: detail.contractNumber,
    employeeName: detail.employeeName || '',
    employeeIdentification: detail.employeeIdentification || '',
    contractTypeName: detail.contractType?.name || '',
    contractStatusName: detail.contractStatus?.name || '',
    approvalStatusName: detail.status?.name || '',
    companyName: detail.company?.name || '',
    zoneName: detail.zone?.name || '',
    jobTitleName: detail.jobTitle?.name || '',
    siteName: detail.site?.name || '',
    laborUnionName: detail.laborUnion?.name || '',
    safetyGroupName: detail.safetyGroup?.name || '',
    baseSalary: detail.baseSalary,
    agreedSalary: detail.agreedSalary,
    weeklyWorkHours: detail.weeklyWorkHours,
    workDays: detail.workDays,
    startDateDisplay: formatDate(detail.startDate, 'Sin registro'),
    endDateDisplay: formatDate(detail.endDate || '', 'Sin registro'),
    mealTypeName: detail.mealType?.name || '',
    transportTypeName: detail.transportType?.name || '',
    contractDetailText: detail.contractDetail || '',
    createdAtDisplay: formatDateTime(detail.createdAt, 'Sin registro'),
    updatedAtDisplay: formatDateTime(detail.updatedAt, 'Sin registro'),
    documents: mapperContractDocuments(detail.documents),
  }
}

export function mapperCreateContractFormData(payload: ContractCreatePayload, files: File[] = []): FormData {
  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  files.forEach((file) => formData.append('files', file))
  return formData
}

export function mapperUpdateContractFormData(payload: ContractUpdatePayload, files: File[] = []): FormData {
  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  files.forEach((file) => formData.append('files', file))
  return formData
}
