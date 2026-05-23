import { SortDirection } from '@/constant'
import type {
  ProjectCreateForm,
  ProjectCostCenterEmployeeTableRow,
  ProjectCostCenterEmployeesPagination,
  ProjectCostCenterEmployeesQueryParams,
  ProjectCostCenterEmployeesSortBy,
  ProjectsPagination,
  ProjectsQueryParams,
  ProjectsSortBy,
  ProjectTableRow,
} from '@/types'

export const projectsTableColumns: string[] = [
  'Centro costo',
  'Nombre',
  'Tipo',
  'Vigencia',
  'Especialidad',
  'Visitador',
  'Supervisor',
  'Inicio',
  'Fin',
  'Estado',
  'Creado',
  'Actualizado',
  'Acciones',
]

export const projectsTableColumnIndex = {
  costCenter: 0,
  name: 1,
  type: 2,
  status: 3,
  specialty: 4,
  active: 9,
}

export const projectsTableSortByColumn: Partial<Record<number, ProjectsSortBy>> = {
  0: 'costCenter',
  1: 'name',
  2: 'typeId',
  3: 'statusId',
  4: 'specialtyId',
  5: 'visitorName',
  6: 'supervisorName',
  7: 'startDate',
  8: 'endDate',
  9: 'active',
  10: 'createdAt',
  11: 'updatedAt',
}

export const initialProjectsRows: ProjectTableRow[] = []

export const initialProjectsPagination: ProjectsPagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  first: true,
  last: true,
}

export const initialProjectsQueryParams: ProjectsQueryParams = {
  page: 0,
  size: 8,
  search: '',
  active: '',
  typeId: '',
  statusId: '',
  specialtyId: '',
  createdFrom: '',
  createdTo: '',
  updatedFrom: '',
  updatedTo: '',
  sortBy: 'createdAt',
  sortDir: SortDirection.Desc,
}

export const projectCostCenterEmployeesTableColumns: string[] = [
  'Identificación',
  'Trabajador',
  'Email',
  'Teléfono',
  'Estado',
  'Activo',
  'Contrato',
  'Creado',
]

export const projectCostCenterEmployeesTableColumnIndex = {
  status: 4,
  active: 5,
  contract: 6,
}

export const projectCostCenterEmployeesTableSortByColumn: Partial<Record<number, ProjectCostCenterEmployeesSortBy>> = {
  0: 'identification',
  1: 'firstName',
  4: 'statusName',
  7: 'createdAt',
}

export const initialProjectCostCenterEmployeesRows: ProjectCostCenterEmployeeTableRow[] = []

export const initialProjectCostCenterEmployeesPagination: ProjectCostCenterEmployeesPagination = {
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  total: 0,
  active: 0,
  pending: 0,
  first: true,
  last: true,
}

export const initialProjectCostCenterEmployeesQueryParams: ProjectCostCenterEmployeesQueryParams = {
  page: 0,
  size: 10,
  search: '',
  active: '',
  statusId: '',
  sortBy: 'createdAt',
  sortDir: SortDirection.Desc,
}

export const initialCreateProjectForm: ProjectCreateForm = {
  costCenter: '',
  name: '',
  address: '',
  description: '',
  typeId: '',
  statusId: '',
  specialtyId: '',
  visitorId: '',
  supervisorId: '',
  companyRepresentativeIds: [],
  startDate: '',
  realStartDate: '',
  endDate: '',
  realEndDate: '',
}
