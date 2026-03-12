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
import type { OperationKey, OperationStatus } from '@/types'

const initialOperationStatus: () => Record<OperationKey, OperationStatus> = () => ({
  list: { error: null, success: null, errorBack: null },
  detail: { error: null, success: null, errorBack: null },
  create: { error: null, success: null, errorBack: null },
  update: { error: null, success: null, errorBack: null },
  toggle: { error: null, success: null, errorBack: null },
})

export const useStoreContracts = create<ContractsStore>()((set, get) => {
  let latestContractDetailRequestId = 0

  const setOpError = (key: OperationKey, error: string, errorBack?: unknown) => {
    set((state) => ({
      operationStatus: {
        ...state.operationStatus,
        [key]: { error, success: null, errorBack: errorBack ?? null },
      },
    }))
  }

  const setOpSuccess = (key: OperationKey, success: string) => {
    set((state) => ({
      operationStatus: {
        ...state.operationStatus,
        [key]: { error: null, success, errorBack: null },
      },
    }))
  }

  const clearOp = (key: OperationKey) => {
    set((state) => ({
      operationStatus: {
        ...state.operationStatus,
        [key]: { error: null, success: null, errorBack: null },
      },
    }))
  }

  const resolveErrorMessage = (error: unknown, fallback: string): string => {
    if (contractsService.isAxiosError(error)) {
      return error.response?.data?.message || fallback
    }
    return fallback
  }

  return {
  contractsRows: [...initialContractsRows],
  contractDetail: null,
  pagination: { ...initialContractsPagination },
  queryParams: { ...initialContractsQueryParams },
  loadingContracts: false,
  loadingContractDetail: false,
  loadingToggleStatus: false,
  createContractSubmitting: false,
  updateContractSubmitting: false,
  operationStatus: initialOperationStatus(),

  getContracts: async () => {
    try {
      set({ loadingContracts: true })
      clearOp('list')
      const data = await contractsService.getContracts(get().queryParams)
      const pagination = mapperContractsPagination(data)
      set({
        contractsRows: mapperContractsRows(data.content),
        pagination,
        queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
      })
    } catch (error) {
      setOpError('list', resolveErrorMessage(error, messages.contracts.status.errors.loadError), error)
    } finally {
      set({ loadingContracts: false })
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
      set({ loadingContractDetail: true, contractDetail: null })
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
        set({ loadingContractDetail: false })
      }
    }
  },

  clearContractDetail: () => {
    latestContractDetailRequestId += 1
    set({ contractDetail: null, loadingContractDetail: false })
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
      set({ loadingToggleStatus: true })
      clearOp('toggle')
      await contractsService.toggleContractStatus(parsedContractId, nextStatus)
      return true
    } catch (error) {
      setOpError('toggle', resolveErrorMessage(error, messages.contracts.status.errors.toggleStatusError), error)
      return false
    } finally {
      set({ loadingToggleStatus: false })
    }
  },

  createContract: async (payload, files = []) => {
    try {
      set({ createContractSubmitting: true })
      clearOp('create')
      const data = await contractsService.createContract(payload, files)
      setOpSuccess('create', `${messages.contracts.status.success.createContractSuccess} (${data.name})`)
      return true
    } catch (error) {
      setOpError('create', resolveErrorMessage(error, messages.contracts.status.errors.createContractError), error)
      return false
    } finally {
      set({ createContractSubmitting: false })
    }
  },

  updateContract: async (payload, files = []) => {
    if (!Number.isInteger(payload.id) || payload.id <= 0) {
      setOpError('update', messages.contracts.status.errors.detailInvalidContractId)
      return false
    }

    try {
      set({ updateContractSubmitting: true })
      clearOp('update')
      await contractsService.updateContract(payload, files)
      setOpSuccess('update', messages.contracts.status.success.updateContractSuccess)
      return true
    } catch (error) {
      setOpError('update', resolveErrorMessage(error, messages.contracts.status.errors.updateContractError), error)
      return false
    } finally {
      set({ updateContractSubmitting: false })
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
