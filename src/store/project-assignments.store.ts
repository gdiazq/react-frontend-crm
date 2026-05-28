import { create } from 'zustand'
import {
  initialProjectAssignmentsPagination,
  initialProjectAssignmentsQueryParams,
  initialProjectAssignmentsRows,
} from '@/factories'
import { mapperProjectAssignmentsPagination, mapperProjectAssignmentsRows } from '@/mappers'
import messages from '@/messages/messages'
import { projectAssignmentsService } from '@/services'
import type {
  ProjectAssignmentsSortBy,
  ProjectAssignmentsSortDir,
  ProjectAssignmentsStore,
} from '@/types'
import {
  createOperationStatusHelpers,
  initialOperationLoading,
  initialOperationStatus,
  resolveErrorMessage,
} from '@/utils'

export const useStoreProjectAssignments = create<ProjectAssignmentsStore>()((set, get) => {
  let latestProjectAssignmentsRequestId = 0
  let latestEmployeeProjectAssignmentsRequestId = 0
  let latestCostCenterProjectAssignmentsRequestId = 0

  const { setOpError, clearOp, setOpLoading } = createOperationStatusHelpers(set)

  return {
    projectAssignmentsRows: [...initialProjectAssignmentsRows],
    employeeProjectAssignments: [],
    costCenterProjectAssignments: [],
    employeeWithContractOptions: [],
    pagination: { ...initialProjectAssignmentsPagination },
    queryParams: { ...initialProjectAssignmentsQueryParams },
    loadingEmployeeProjectAssignments: false,
    loadingCostCenterProjectAssignments: false,
    loadingEmployeeWithContractOptions: false,
    employeeWithContractOptionsErrorMessage: null,
    operationLoading: initialOperationLoading(),
    operationStatus: initialOperationStatus(),

    getProjectAssignments: async () => {
      const requestId = ++latestProjectAssignmentsRequestId
      try {
        setOpLoading('list', true)
        clearOp('list')
        const data = await projectAssignmentsService.getProjectAssignments(get().queryParams)
        if (requestId !== latestProjectAssignmentsRequestId) return
        const pagination = mapperProjectAssignmentsPagination(data)
        set({
          projectAssignmentsRows: mapperProjectAssignmentsRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        if (requestId !== latestProjectAssignmentsRequestId) return
        setOpError('list', resolveErrorMessage(error, messages.projectAssignments.status.errors.loadError), error)
      } finally {
        if (requestId === latestProjectAssignmentsRequestId) {
          setOpLoading('list', false)
        }
      }
    },

    getEmployeeWithContractOptions: async () => {
      try {
        set({ loadingEmployeeWithContractOptions: true, employeeWithContractOptionsErrorMessage: null })
        const data = await projectAssignmentsService.getEmployeeWithContractOptions()
        set({ employeeWithContractOptions: data })
      } catch (error) {
        set({
          employeeWithContractOptionsErrorMessage: resolveErrorMessage(error, messages.projectAssignments.status.errors.loadEmployeeOptionsError),
        })
      } finally {
        set({ loadingEmployeeWithContractOptions: false })
      }
    },

    getProjectAssignmentsByEmployee: async (employeeId: number) => {
      if (!Number.isInteger(employeeId) || employeeId <= 0) {
        setOpError('detail', messages.projectAssignments.status.errors.detailInvalidId)
        set({ employeeProjectAssignments: [] })
        return
      }
      const requestId = ++latestEmployeeProjectAssignmentsRequestId

      try {
        set({ loadingEmployeeProjectAssignments: true, employeeProjectAssignments: [] })
        clearOp('detail')
        const data = await projectAssignmentsService.getProjectAssignmentsByEmployee(employeeId)
        if (requestId !== latestEmployeeProjectAssignmentsRequestId) return
        set({ employeeProjectAssignments: data })
      } catch (error) {
        if (requestId !== latestEmployeeProjectAssignmentsRequestId) return
        setOpError('detail', resolveErrorMessage(error, messages.projectAssignments.status.errors.detailLoadError), error)
      } finally {
        if (requestId === latestEmployeeProjectAssignmentsRequestId) {
          set({ loadingEmployeeProjectAssignments: false })
        }
      }
    },

    getProjectAssignmentsByCostCenter: async (costCenter: number) => {
      if (!Number.isInteger(costCenter) || costCenter <= 0) {
        setOpError('detail', messages.projectAssignments.status.errors.detailInvalidId)
        set({ costCenterProjectAssignments: [] })
        return
      }
      const requestId = ++latestCostCenterProjectAssignmentsRequestId

      try {
        set({ loadingCostCenterProjectAssignments: true, costCenterProjectAssignments: [] })
        clearOp('detail')
        const data = await projectAssignmentsService.getProjectAssignmentsByCostCenter(costCenter)
        if (requestId !== latestCostCenterProjectAssignmentsRequestId) return
        set({ costCenterProjectAssignments: data })
      } catch (error) {
        if (requestId !== latestCostCenterProjectAssignmentsRequestId) return
        setOpError('detail', resolveErrorMessage(error, messages.projectAssignments.status.errors.detailLoadError), error)
      } finally {
        if (requestId === latestCostCenterProjectAssignmentsRequestId) {
          set({ loadingCostCenterProjectAssignments: false })
        }
      }
    },

    clearEmployeeProjectAssignments: () => {
      latestEmployeeProjectAssignmentsRequestId += 1
      set({ employeeProjectAssignments: [], loadingEmployeeProjectAssignments: false })
      clearOp('detail')
    },

    clearCostCenterProjectAssignments: () => {
      latestCostCenterProjectAssignmentsRequestId += 1
      set({ costCenterProjectAssignments: [], loadingCostCenterProjectAssignments: false })
      clearOp('detail')
    },

    goToPage: async (page: number) => {
      const { pagination } = get()
      const lastPageIndex = pagination.totalPages - 1
      if (page < 0 || page > lastPageIndex) return
      set((state) => ({
        pagination: { ...state.pagination, page },
        queryParams: { ...state.queryParams, page },
      }))
      await get().getProjectAssignments()
    },

    nextPage: async () => {
      if (get().pagination.last) return
      await get().goToPage(get().pagination.page + 1)
    },

    previousPage: async () => {
      if (get().pagination.first) return
      await get().goToPage(get().pagination.page - 1)
    },

    setSearch: (value: string) => set((state) => ({ queryParams: { ...state.queryParams, search: value } })),
    setEmployeeFilter: (employeeId: string) => set((state) => ({ queryParams: { ...state.queryParams, employeeId } })),
    setCostCenterFilter: (costCenter: string) => set((state) => ({ queryParams: { ...state.queryParams, costCenter } })),
    setActiveFilter: (active: string) => set((state) => ({ queryParams: { ...state.queryParams, active } })),
    setAssignmentDateRange: ({ dateFrom, dateTo }) => set((state) => ({ queryParams: { ...state.queryParams, dateFrom, dateTo } })),
    setCreatedDateRange: ({ createdFrom, createdTo }) => set((state) => ({ queryParams: { ...state.queryParams, createdFrom, createdTo } })),
    setUpdatedDateRange: ({ updatedFrom, updatedTo }) => set((state) => ({ queryParams: { ...state.queryParams, updatedFrom, updatedTo } })),
    clearEmployeeFilter: () => set((state) => ({ queryParams: { ...state.queryParams, employeeId: '' } })),
    clearCostCenterFilter: () => set((state) => ({ queryParams: { ...state.queryParams, costCenter: '' } })),
    clearActiveFilter: () => set((state) => ({ queryParams: { ...state.queryParams, active: '' } })),
    clearAssignmentDateRange: () => set((state) => ({ queryParams: { ...state.queryParams, dateFrom: '', dateTo: '' } })),
    clearCreatedDateRange: () => set((state) => ({ queryParams: { ...state.queryParams, createdFrom: '', createdTo: '' } })),
    clearUpdatedDateRange: () => set((state) => ({ queryParams: { ...state.queryParams, updatedFrom: '', updatedTo: '' } })),

    searchProjectAssignments: async () => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0 },
      }))
      await get().getProjectAssignments()
    },

    sortProjectAssignments: async (sortBy: ProjectAssignmentsSortBy, sortDir: ProjectAssignmentsSortDir) => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
      }))
      await get().getProjectAssignments()
    },

    clearEmployeeWithContractOptionsStatus: () => {
      set({ employeeWithContractOptionsErrorMessage: null })
    },

    clearOperationStatus: (key) => clearOp(key),
    clearAllOperationStatus: () => set({ operationStatus: initialOperationStatus() }),
  }
})
