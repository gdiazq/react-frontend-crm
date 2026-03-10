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
import type { ContractsStore } from '@/types'

export const useStoreContracts = create<ContractsStore>()((set, get) => ({
  contractsRows: [...initialContractsRows],
  pagination: { ...initialContractsPagination },
  queryParams: { ...initialContractsQueryParams },
  loadingContracts: false,
  loadingToggleStatus: false,
  createContractSubmitting: false,
  errorMessage: null,
  createContractErrorMessage: null,
  createContractSuccessMessage: null,
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

  mutationToggleContractStatus: async (contractId, nextStatus) => {
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

  mutationCreateContract: async (payload, files = []) => {
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

  clearCreateContractStatus: () => {
    set({ createContractErrorMessage: null, createContractSuccessMessage: null })
  },

  clearStatus: () => {
    set({ errorMessage: null })
  },
}))
