import { create } from 'zustand'
import { contractsService } from '@/services'
import {
  initialContractsPagination,
  initialContractsQueryParams,
  initialContractsRows,
} from '@/factories'
import {
  mapperContractsPagination,
  mapperContractsRows,
} from '@/mappers'
import messages from '@/messages/messages'
import type { ContractsSortBy, ContractsSortDir, ContractsStore } from '@/types'
import {
  createOperationStatusHelpers,
  initialOperationLoading,
  initialOperationStatus,
  resolveErrorMessage,
} from '@/utils'

export const useStoreContracts = create<ContractsStore>()((set, get) => {
  let latestContractsRequestId = 0
  let latestContractDetailRequestId = 0

  const { setOpError, setOpSuccess, clearOp, setOpLoading } = createOperationStatusHelpers(set)

  return {
  contractsRows: [...initialContractsRows],
  contractDetail: null,
  pagination: { ...initialContractsPagination },
  queryParams: { ...initialContractsQueryParams },
  operationLoading: initialOperationLoading(),
  operationStatus: initialOperationStatus(),

  getContracts: async () => {
    const requestId = ++latestContractsRequestId
    try {
      setOpLoading('list', true)
      clearOp('list')
      const data = await contractsService.getContracts(get().queryParams)
      if (requestId !== latestContractsRequestId) return
      const pagination = mapperContractsPagination(data)
      set({
        contractsRows: mapperContractsRows(data.content),
        pagination,
        queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
      })
    } catch (error) {
      if (requestId !== latestContractsRequestId) return
      setOpError('list', resolveErrorMessage(error, messages.contracts.status.errors.loadError), error)
    } finally {
      if (requestId === latestContractsRequestId) {
        setOpLoading('list', false)
      }
    }
  },

  getContractDetail: async (contractId: string) => {
    const parsedContractId = Number(contractId)
    if (!Number.isInteger(parsedContractId) || parsedContractId <= 0) {
      setOpError('detail', messages.contracts.status.errors.detailInvalidContractId)
      set({ contractDetail: null })
      return null
    }
    const requestId = ++latestContractDetailRequestId

    try {
      setOpLoading('detail', true)
        set({ contractDetail: null })
      clearOp('detail')
      const data = await contractsService.getContractDetail(parsedContractId)
      if (requestId !== latestContractDetailRequestId) return null
      set({ contractDetail: data })
      return data
    } catch (error) {
      if (requestId !== latestContractDetailRequestId) return null
      setOpError('detail', resolveErrorMessage(error, messages.contracts.status.errors.detailLoadError), error)
      return null
    } finally {
      if (requestId === latestContractDetailRequestId) {
        setOpLoading('detail', false)
      }
    }
  },

  clearContractDetail: () => {
    latestContractDetailRequestId += 1
    set({ contractDetail: null })
      setOpLoading('detail', false)
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
    await get().getContracts()
  },

  nextPage: async () => {
    if (get().pagination.last) return
    await get().goToPage(get().pagination.page + 1)
  },

  previousPage: async () => {
    if (get().pagination.first) return
    await get().goToPage(get().pagination.page - 1)
  },

  setSearch: (value: string) => {
    set((state) => ({ queryParams: { ...state.queryParams, search: value } }))
  },

  setEmployeeFilter: (employeeId: string) => {
    set((state) => ({ queryParams: { ...state.queryParams, employeeId } }))
  },

  setStatusFilter: (statusId: string) => {
    set((state) => ({ queryParams: { ...state.queryParams, statusId } }))
  },

  setContractStatusFilter: (contractStatusId: string) => {
    set((state) => ({ queryParams: { ...state.queryParams, contractStatusId } }))
  },

  setContractTypeFilter: (contractTypeId: string) => {
    set((state) => ({ queryParams: { ...state.queryParams, contractTypeId } }))
  },

  setCreatedDateRange: ({ createdFrom, createdTo }) => {
    set((state) => ({ queryParams: { ...state.queryParams, createdFrom, createdTo } }))
  },

  setStartDateRange: ({ startDateFrom, startDateTo }) => {
    set((state) => ({ queryParams: { ...state.queryParams, startDateFrom, startDateTo } }))
  },

  setEndDateRange: ({ endDateFrom, endDateTo }) => {
    set((state) => ({ queryParams: { ...state.queryParams, endDateFrom, endDateTo } }))
  },

  setUpdatedDateRange: ({ updatedFrom, updatedTo }) => {
    set((state) => ({ queryParams: { ...state.queryParams, updatedFrom, updatedTo } }))
  },

  clearEmployeeFilter: () => {
    set((state) => ({ queryParams: { ...state.queryParams, employeeId: '' } }))
  },

  clearStatusFilter: () => {
    set((state) => ({ queryParams: { ...state.queryParams, statusId: '' } }))
  },

  clearContractStatusFilter: () => {
    set((state) => ({ queryParams: { ...state.queryParams, contractStatusId: '' } }))
  },

  clearContractTypeFilter: () => {
    set((state) => ({ queryParams: { ...state.queryParams, contractTypeId: '' } }))
  },

  clearCreatedDateRange: () => {
    set((state) => ({ queryParams: { ...state.queryParams, createdFrom: '', createdTo: '' } }))
  },

  clearStartDateRange: () => {
    set((state) => ({ queryParams: { ...state.queryParams, startDateFrom: '', startDateTo: '' } }))
  },

  clearEndDateRange: () => {
    set((state) => ({ queryParams: { ...state.queryParams, endDateFrom: '', endDateTo: '' } }))
  },

  clearUpdatedDateRange: () => {
    set((state) => ({ queryParams: { ...state.queryParams, updatedFrom: '', updatedTo: '' } }))
  },

  searchContracts: async () => {
    set((state) => ({
      pagination: { ...state.pagination, page: 0 },
      queryParams: { ...state.queryParams, page: 0 },
    }))
    await get().getContracts()
  },

  sortContracts: async (sortBy: ContractsSortBy, sortDir: ContractsSortDir) => {
    set((state) => ({
      pagination: { ...state.pagination, page: 0 },
      queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
    }))
    await get().getContracts()
  },

  toggleContractStatus: async (contractId, nextStatus) => {
    const parsedContractId = Number(contractId)
    if (!Number.isInteger(parsedContractId) || parsedContractId <= 0) {
      setOpError('toggle', messages.contracts.status.errors.invalidStatusContractId)
      return false
    }

    try {
      setOpLoading('toggle', true)
      clearOp('toggle')
      await contractsService.toggleContractStatus(parsedContractId, nextStatus)
      return true
    } catch (error) {
      setOpError('toggle', resolveErrorMessage(error, messages.contracts.status.errors.toggleStatusError), error)
      return false
    } finally {
      setOpLoading('toggle', false)
    }
  },

  createContract: async (payload, files = []) => {
    try {
      setOpLoading('create', true)
      clearOp('create')
      const data = await contractsService.createContract(payload, files)
      setOpSuccess('create', `${messages.contracts.status.success.createContractSuccess} (${data.name})`)
      return true
    } catch (error) {
      setOpError('create', resolveErrorMessage(error, messages.contracts.status.errors.createContractError), error)
      return false
    } finally {
      setOpLoading('create', false)
    }
  },

  updateContract: async (payload, files = []) => {
    if (!Number.isInteger(payload.id) || payload.id <= 0) {
      setOpError('update', messages.contracts.status.errors.detailInvalidContractId)
      return false
    }

    try {
      setOpLoading('update', true)
      clearOp('update')
      await contractsService.updateContract(payload, files)
      setOpSuccess('update', messages.contracts.status.success.updateContractSuccess)
      return true
    } catch (error) {
      setOpError('update', resolveErrorMessage(error, messages.contracts.status.errors.updateContractError), error)
      return false
    } finally {
      setOpLoading('update', false)
    }
  },

  clearOperationStatus: (key) => {
    clearOp(key)
  },

  clearAllOperationStatus: () => {
    set({ operationStatus: initialOperationStatus() })
  },
  }
})
