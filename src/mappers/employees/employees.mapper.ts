import messages from '@/messages/messages'
import type {
  EmployeeCreateForm,
  EmployeeCreatePayload,
  EmployeeDetail,
  EmployeeDetailView,
  EmployeePagedResponse,
  EmployeeRaw,
  EmployeeTableRow,
  EmployeesPagination,
  EmployeesQueryParams,
} from '@/types'
import { formatDate } from '@/utils'

export function mapperEmployeesRows(response: EmployeeRaw[]): EmployeeTableRow[] {
  return response.map((item) => ({
    id: String(item.id),
    active: item.active,
    values: [
      item.identification,
      `${item.firstName} ${item.paternalLastName} ${item.maternalLastName}`.trim(),
      item.corporateEmail,
      item.phone ?? '',
      item.statusName,
      item.rehireEligible ? messages.employees.ui.rehireEligibleYes : messages.employees.ui.rehireEligibleNo,
      item.active ? messages.employees.ui.statusActive : messages.employees.ui.statusInactive,
      formatDate(item.createdAt),
      formatDate(item.updatedAt),
      '',
    ],
  }))
}

export function mapperEmployeesPagination(response: EmployeePagedResponse): EmployeesPagination {
  const page = response.page ?? response.number ?? 0
  const size = response.size ?? 8
  const totalElements = response.totalElements ?? response.total ?? 0
  const totalPages = response.totalPages ?? 0
  const total = response.total ?? totalElements
  const active = response.active ?? 0
  const first = response.first ?? page === 0
  const last = response.last ?? page >= totalPages - 1

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

export function mapperEmployeesQueryParams(queryParams: EmployeesQueryParams): Record<string, string | number> {
  const search = queryParams.search.trim()
  const active = queryParams.active.trim()
  const statusId = queryParams.statusId.trim()
  const createdFrom = queryParams.createdFrom.trim()
  const createdTo = queryParams.createdTo.trim()
  const result: Record<string, string | number> = {
    page: queryParams.page,
    size: queryParams.size,
    sortBy: queryParams.sortBy,
    sortDir: queryParams.sortDir,
  }

  if (search.length > 0) result.search = search
  if (active === 'true' || active === 'false') result.active = active
  if (statusId.length > 0) {
    const parsedStatusId = Number(statusId)
    if (Number.isInteger(parsedStatusId) && parsedStatusId > 0) result.statusId = parsedStatusId
  }
  if (createdFrom.length > 0) result.createdFrom = createdFrom
  if (createdTo.length > 0) result.createdTo = createdTo

  return result
}

export function mapperEmployeeDetailView(result: EmployeeDetail): EmployeeDetailView {
  return {
    id: String(result.id),
    fullName: `${result.firstName} ${result.paternalLastName} ${result.maternalLastName}`.trim(),
    active: result.active,
    statusName: result.status?.name ?? '',
    rehireEligible: result.rehireEligible,
    identification: result.identification,
    identificationType: result.identificationType?.name ?? '',
    birthDate: result.birthDate ?? '',
    gender: result.gender?.name ?? '',
    maritalStatus: result.maritalStatus?.name ?? '',
    educationLevel: result.educationLevel?.name ?? '',
    driverLicense: result.driverLicense?.name ?? '',
    profession: result.profession?.name ?? '',
    nationality: result.nationality?.name ?? '',
    expat: result.expat?.name ?? '',
    personalEmail: result.personalEmail ?? '',
    corporateEmail: result.corporateEmail,
    phone: result.phone ?? '',
    phone2: result.phone2 ?? '',
    emergencyContactName: result.emergencyContactName ?? '',
    emergencyContactRelationship: result.emergencyContactRelationship?.name ?? '',
    emergencyContactPhone: result.emergencyContactPhone ?? '',
    emergencyContactPhone2: result.emergencyContactPhone2 ?? '',
    streetName: result.streetName ?? '',
    streetNumber: result.streetNumber ?? '',
    postalCode: result.postalCode ?? '',
    department: result.department ?? '',
    village: result.village ?? '',
    block: result.block ?? '',
    region: result.region?.name ?? '',
    commune: result.commune?.name ?? '',
    city: result.city?.name ?? '',
    familyAllowanceTier: result.familyAllowanceTier?.name ?? '',
    retirementStatus: result.retirementStatus?.name ?? '',
    isapreFun: result.isapreFun ?? '',
    pensionStatus: result.pensionStatus?.name ?? '',
    afp: result.afp?.name ?? '',
    healthInsurance: result.healthInsurance?.name ?? '',
    healthInsuranceTariff: result.healthInsuranceTariff?.name ?? '',
    healthInsuranceUF: result.healthInsuranceUF ?? '',
    healthInsurancePesos: result.healthInsurancePesos ?? '',
    paymentMethod: result.paymentMethod?.name ?? '',
    bank: result.bank?.name ?? '',
    bankAccount: result.bankAccount ?? '',
    clothingSize: result.clothingSize ?? '',
    shoeSize: result.shoeSize ?? '',
    pantSize: result.pantSize ?? '',
    username: result.username ?? '',
    userEmail: result.userEmail ?? '',
    userEnabled: result.userEnabled != null ? (result.userEnabled ? 'Si' : 'No') : '',
    requestId: result.requestId != null ? String(result.requestId) : '',
    createdAtDisplay: formatDate(result.createdAt),
    updatedAtDisplay: formatDate(result.updatedAt),
  }
}

function parseRequiredNumber(value: string): number {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0
}

function parseNullableNumber(value: string): number | null {
  const normalized = value.trim()
  if (!normalized) return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function parseNullableString(value: string): string | null {
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

export function mapperCreateEmployeePayload(form: EmployeeCreateForm): EmployeeCreatePayload {
  return {
    identification: form.identification.trim(),
    identificationTypeId: parseRequiredNumber(form.identificationTypeId),
    firstName: form.firstName.trim(),
    paternalLastName: form.paternalLastName.trim(),
    maternalLastName: form.maternalLastName.trim(),
    birthDate: form.birthDate.trim(),
    genderId: parseRequiredNumber(form.genderId),
    maritalStatusId: parseRequiredNumber(form.maritalStatusId),
    educationLevelId: parseRequiredNumber(form.educationLevelId),
    driverLicenseId: parseRequiredNumber(form.driverLicenseId),
    professionId: parseRequiredNumber(form.professionId),
    personalEmail: form.personalEmail.trim(),
    corporateEmail: form.corporateEmail.trim(),
    phone: form.phone.trim(),
    phone2: parseNullableString(form.phone2),
    emergencyContactName: form.emergencyContactName.trim(),
    emergencyContactRelationshipId: parseRequiredNumber(form.emergencyContactRelationshipId),
    emergencyContactPhone: form.emergencyContactPhone.trim(),
    emergencyContactPhone2: parseNullableString(form.emergencyContactPhone2),
    streetName: form.streetName.trim(),
    streetNumber: form.streetNumber.trim(),
    postalCode: form.postalCode.trim(),
    department: parseNullableString(form.department),
    village: parseNullableString(form.village),
    block: parseNullableString(form.block),
    regionId: parseRequiredNumber(form.regionId),
    communeId: parseRequiredNumber(form.communeId),
    cityId: parseRequiredNumber(form.cityId),
    expatId: parseRequiredNumber(form.expatId),
    nationalityId: parseRequiredNumber(form.nationalityId),
    familyAllowanceTierId: parseRequiredNumber(form.familyAllowanceTierId),
    retirementStatusId: parseRequiredNumber(form.retirementStatusId),
    isapreFun: parseNullableString(form.isapreFun),
    pensionStatusId: parseRequiredNumber(form.pensionStatusId),
    afpId: parseRequiredNumber(form.afpId),
    healthInsuranceId: parseRequiredNumber(form.healthInsuranceId),
    healthInsuranceTariffId: parseNullableNumber(form.healthInsuranceTariffId),
    healthInsuranceUF: parseNullableNumber(form.healthInsuranceUF),
    healthInsurancePesos: parseNullableNumber(form.healthInsurancePesos),
    paymentMethodId: parseRequiredNumber(form.paymentMethodId),
    bankId: parseRequiredNumber(form.bankId),
    bankAccount: form.bankAccount.trim(),
    clothingSize: form.clothingSize.trim(),
    shoeSize: form.shoeSize.trim(),
    pantSize: form.pantSize.trim(),
  }
}
