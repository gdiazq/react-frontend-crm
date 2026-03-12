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

export const useStoreContracts = create<ContractsStore>()((set, get) => {
  let latestContractDetailRequestId = 0

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
  errorMessage: null,
  detailErrorMessage: null,
  createContractErrorMessage: null,
  createContractSuccessMessage: null,
  updateContractErrorMessage: null,
  updateContractSuccessMessage: null,
  errorBack: null,

  getContracts: async () => {
    try {
      set({ loadingContracts: true, errorMessage: null, errorBack: null })
      const data = await contractsService.getContracts(get().queryParams)
      const pagination = mapperContractsPagination(data)
      set({
        contractsRows: mapperContractsRows(data.content),
        pagination,
        queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
      })
    } catch (error) {
      set({ errorBack: error })
      if (contractsService.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.contracts.status.errors.loadError })
      } else {
        set({ errorMessage: messages.contracts.status.errors.loadError })
      }
    } finally {
      set({ loadingContracts: false })
    }
  },

  getContractDetail: async (contractId: string) => {
    const parsedContractId = Number(contractId)
    if (!Number.isInteger(parsedContractId) || parsedContractId <= 0) {
      set({
        detailErrorMessage: messages.contracts.status.errors.detailInvalidContractId,
        contractDetail: null,
      })
      return null
    }
    const requestId = ++latestContractDetailRequestId

    try {
      set({
        loadingContractDetail: true,
        detailErrorMessage: null,
        contractDetail: null,
        errorBack: null,
      })
      const data = await contractsService.getContractDetail(parsedContractId)
      if (requestId !== latestContractDetailRequestId) return null
      set({ contractDetail: data })
      return data
    } catch (error) {
      if (requestId !== latestContractDetailRequestId) return null
      if (contractsService.isAxiosError(error)) {
        set({
          detailErrorMessage: error.response?.data?.message || messages.contracts.status.errors.detailLoadError,
          errorBack: error,
        })
      } else {
        set({
          detailErrorMessage: messages.contracts.status.errors.detailLoadError,
          errorBack: error,
        })
      }
      return null
    } finally {
      if (requestId === latestContractDetailRequestId) {
        set({ loadingContractDetail: false })
      }
    }
  },

  clearContractDetail: () => {
    latestContractDetailRequestId += 1
    set({ contractDetail: null, detailErrorMessage: null, loadingContractDetail: false })
  },

  clearDetailError: () => {
    set({ detailErrorMessage: null })
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
      set({ errorMessage: messages.contracts.status.errors.invalidStatusContractId })
      return false
    }

    try {
      set({ loadingToggleStatus: true, errorMessage: null, errorBack: null })
      await contractsService.toggleContractStatus(parsedContractId, nextStatus)
      return true
    } catch (error) {
      if (contractsService.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.contracts.status.errors.toggleStatusError })
      } else {
        set({ errorMessage: messages.contracts.status.errors.toggleStatusError })
      }
      return false
    } finally {
      set({ loadingToggleStatus: false })
    }
  },

  createContract: async (payload, files = []) => {
    try {
      set({
        createContractSubmitting: true,
        createContractErrorMessage: null,
        createContractSuccessMessage: null,
        errorBack: null,
      })
      const data = await contractsService.createContract(payload, files)
      set({
        createContractSuccessMessage: `${messages.contracts.status.success.createContractSuccess} (${data.name})`,
      })
      return true
    } catch (error) {
      if (contractsService.isAxiosError(error)) {
        set({
          createContractErrorMessage: error.response?.data?.message || messages.contracts.status.errors.createContractError,
          errorBack: error,
        })
      } else {
        set({
          createContractErrorMessage: messages.contracts.status.errors.createContractError,
          errorBack: error,
        })
      }
      return false
    } finally {
      set({ createContractSubmitting: false })
    }
  },

  updateContract: async (payload, files = []) => {
    if (!Number.isInteger(payload.id) || payload.id <= 0) {
      set({ updateContractErrorMessage: messages.contracts.status.errors.detailInvalidContractId })
      return false
    }

    try {
      set({
        updateContractSubmitting: true,
        updateContractErrorMessage: null,
        updateContractSuccessMessage: null,
        errorBack: null,
      })
      await contractsService.updateContract(payload, files)
      set({ updateContractSuccessMessage: messages.contracts.status.success.updateContractSuccess })
      return true
    } catch (error) {
      if (contractsService.isAxiosError(error)) {
        set({
          updateContractErrorMessage: error.response?.data?.message || messages.contracts.status.errors.updateContractError,
          errorBack: error,
        })
      } else {
        set({
          updateContractErrorMessage: messages.contracts.status.errors.updateContractError,
          errorBack: error,
        })
      }
      return false
    } finally {
      set({ updateContractSubmitting: false })
    }
  },

  clearCreateContractStatus: () => {
    set({ createContractErrorMessage: null, createContractSuccessMessage: null })
  },

  clearUpdateContractStatus: () => {
    set({ updateContractErrorMessage: null, updateContractSuccessMessage: null })
  },

  clearStatus: () => {
    set({ errorMessage: null })
  },
  }
})
