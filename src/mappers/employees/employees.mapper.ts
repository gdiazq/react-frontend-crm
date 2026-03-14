import messages from '@/messages/messages'
import type {
  EmployeeCreateForm,
  EmployeeCreatePayload,
  EmployeeDetail,
  EmployeeDetailView,
  EmployeeUpdatePayload,
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
    hasContract: item.hasContract,
    linkedUserId: item.userId ?? null,
    linkedUserName: item.username ?? null,
    linkedUserEmail: item.userEmail ?? null,
    values: [
      item.identification,
      `${item.firstName} ${item.paternalLastName} ${item.maternalLastName}`.trim(),
      item.corporateEmail,
      item.phone ?? '',
      item.statusName,
      item.hasContract ? messages.employees.ui.rehireEligibleYes : messages.employees.ui.rehireEligibleNo,
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
  const resolveText = (value?: string | null) => {
    const normalized = (value ?? '').trim()
    return normalized.length > 0 ? normalized : 'Sin registro'
  }

  return {
    id: String(result.id),
    fullName: resolveText(`${result.firstName} ${result.paternalLastName} ${result.maternalLastName}`.trim()),
    active: result.active,
    statusName: resolveText(result.status?.name),
    rehireEligible: result.rehireEligible,
    hasContract: result.hasContract,
    identification: resolveText(result.identification),
    identificationType: resolveText(result.identificationType?.name),
    birthDate: resolveText(result.birthDate),
    gender: resolveText(result.gender?.name),
    maritalStatus: resolveText(result.maritalStatus?.name),
    educationLevel: resolveText(result.educationLevel?.name),
    driverLicense: resolveText(result.driverLicense?.name),
    profession: resolveText(result.profession?.name),
    nationality: resolveText(result.nationality?.name),
    expat: resolveText(result.expat?.name),
    personalEmail: resolveText(result.personalEmail),
    corporateEmail: resolveText(result.corporateEmail),
    phone: resolveText(result.phone),
    phone2: resolveText(result.phone2),
    emergencyContactName: resolveText(result.emergencyContactName),
    emergencyContactRelationship: resolveText(result.emergencyContactRelationship?.name),
    emergencyContactPhone: resolveText(result.emergencyContactPhone),
    emergencyContactPhone2: resolveText(result.emergencyContactPhone2),
    streetName: resolveText(result.streetName),
    streetNumber: resolveText(result.streetNumber),
    postalCode: resolveText(result.postalCode),
    department: resolveText(result.department),
    village: resolveText(result.village),
    block: resolveText(result.block),
    region: resolveText(result.region?.name),
    commune: resolveText(result.commune?.name),
    city: resolveText(result.city?.name),
    familyAllowanceTier: resolveText(result.familyAllowanceTier?.name),
    retirementStatus: resolveText(result.retirementStatus?.name),
    isapreFun: resolveText(result.isapreFun),
    pensionStatus: resolveText(result.pensionStatus?.name),
    afp: resolveText(result.afp?.name),
    healthInsurance: resolveText(result.healthInsurance?.name),
    healthInsuranceTariff: resolveText(result.healthInsuranceTariff?.name),
    healthInsuranceUF: resolveText(result.healthInsuranceUF),
    healthInsurancePesos: resolveText(result.healthInsurancePesos),
    paymentMethod: resolveText(result.paymentMethod?.name),
    bank: resolveText(result.bank?.name),
    bankAccount: resolveText(result.bankAccount),
    clothingSize: resolveText(result.clothingSize),
    shoeSize: resolveText(result.shoeSize),
    pantSize: resolveText(result.pantSize),
    username: resolveText(result.username),
    userEmail: resolveText(result.userEmail),
    userEnabled: result.userEnabled ?? null,
    requestId: result.requestId != null ? String(result.requestId) : 'Sin registro',
    createdAtDisplay: formatDate(result.createdAt, 'Sin registro'),
    updatedAtDisplay: formatDate(result.updatedAt, 'Sin registro'),
  }
}

function parseRequiredNumber(value: string): number {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0
}

function parseNullableId(value: string): number | null {
  const normalized = value.trim()
  if (!normalized) return null
  const parsed = Number(normalized)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
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

export function mapperEmployeeDetailToForm(detail: EmployeeDetail): EmployeeCreateForm {
  return {
    identification: detail.identification,
    identificationTypeId: detail.identificationType?.id ? String(detail.identificationType.id) : '',
    firstName: detail.firstName,
    paternalLastName: detail.paternalLastName,
    maternalLastName: detail.maternalLastName,
    birthDate: detail.birthDate ?? '',
    genderId: detail.gender?.id ? String(detail.gender.id) : '',
    maritalStatusId: detail.maritalStatus?.id ? String(detail.maritalStatus.id) : '',
    educationLevelId: detail.educationLevel?.id ? String(detail.educationLevel.id) : '',
    driverLicenseId: detail.driverLicense?.id ? String(detail.driverLicense.id) : '',
    professionId: detail.profession?.id ? String(detail.profession.id) : '',
    personalEmail: detail.personalEmail ?? '',
    corporateEmail: detail.corporateEmail,
    phone: detail.phone ?? '',
    phone2: detail.phone2 ?? '',
    emergencyContactName: detail.emergencyContactName ?? '',
    emergencyContactRelationshipId: detail.emergencyContactRelationship?.id ? String(detail.emergencyContactRelationship.id) : '',
    emergencyContactPhone: detail.emergencyContactPhone ?? '',
    emergencyContactPhone2: detail.emergencyContactPhone2 ?? '',
    streetName: detail.streetName ?? '',
    streetNumber: detail.streetNumber ?? '',
    postalCode: detail.postalCode ?? '',
    department: detail.department ?? '',
    village: detail.village ?? '',
    block: detail.block ?? '',
    regionId: detail.region?.id ? String(detail.region.id) : '',
    communeId: detail.commune?.id ? String(detail.commune.id) : '',
    cityId: detail.city?.id ? String(detail.city.id) : '',
    expatId: detail.expat?.id ? String(detail.expat.id) : '',
    nationalityId: detail.nationality?.id ? String(detail.nationality.id) : '',
    familyAllowanceTierId: detail.familyAllowanceTier?.id ? String(detail.familyAllowanceTier.id) : '',
    retirementStatusId: detail.retirementStatus?.id ? String(detail.retirementStatus.id) : '',
    isapreFun: detail.isapreFun ?? '',
    pensionStatusId: detail.pensionStatus?.id ? String(detail.pensionStatus.id) : '',
    afpId: detail.afp?.id ? String(detail.afp.id) : '',
    healthInsuranceId: detail.healthInsurance?.id ? String(detail.healthInsurance.id) : '',
    healthInsuranceTariffId: detail.healthInsuranceTariff?.id ? String(detail.healthInsuranceTariff.id) : '',
    healthInsuranceUF: detail.healthInsuranceUF ?? '',
    healthInsurancePesos: detail.healthInsurancePesos ?? '',
    paymentMethodId: detail.paymentMethod?.id ? String(detail.paymentMethod.id) : '',
    bankId: detail.bank?.id ? String(detail.bank.id) : '',
    bankAccount: detail.bankAccount ?? '',
    clothingSize: detail.clothingSize ?? '',
    shoeSize: detail.shoeSize ?? '',
    pantSize: detail.pantSize ?? '',
  }
}

export function mapperUpdateEmployeePayload(
  employeeId: number,
  form: EmployeeCreateForm,
  meta: { statusId: number, active: boolean, rehireEligible: boolean },
): EmployeeUpdatePayload {
  return {
    id: employeeId,
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
    expatId: parseNullableId(form.expatId),
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
    statusId: meta.statusId,
    active: meta.active,
    rehireEligible: meta.rehireEligible,
  }
}
