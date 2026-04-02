import { create } from 'zustand'
import {
  initialSettlementPagination,
  initialSettlementQueryParams,
  initialSettlementRows,
} from '@/factories'
import {
  mapperSettlementPagination,
  mapperSettlementRows,
} from '@/mappers'
import messages from '@/messages/messages'
import { settlementService } from '@/services'
import type { OperationKey, OperationStatus, SettlementStore } from '@/types'

const initialOperationStatus: () => Record<OperationKey, OperationStatus> = () => ({
  list: { error: null, success: null, errorBack: null },
  detail: { error: null, success: null, errorBack: null },
  create: { error: null, success: null, errorBack: null },
  update: { error: null, success: null, errorBack: null },
  toggle: { error: null, success: null, errorBack: null },
})

export const useStoreSettlement = create<SettlementStore>()((set, get) => {
  let latestDetailRequestId = 0

  const setOpError = (key: OperationKey, error: string, errorBack?: unknown) => {
    set((state) => ({
      operationStatus: {
        ...state.operationStatus,
        [key]: { error, success: null, errorBack: errorBack ?? null },
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
    if (settlementService.isAxiosError(error)) {
      return error.response?.data?.message || fallback
    }
    return fallback
  }

  return {
    settlementRaw: [],
    settlementDetail: null,
    settlementRows: [...initialSettlementRows],
    pagination: { ...initialSettlementPagination },
    queryParams: { ...initialSettlementQueryParams },
    loadingSettlements: false,
    loadingSettlementDetail: false,
    operationStatus: initialOperationStatus(),

    getSettlements: async () => {
      try {
        set({ loadingSettlements: true })
        clearOp('list')
        const data = await settlementService.getSettlements(get().queryParams)
        const pagination = mapperSettlementPagination(data)

        set({
          settlementRaw: data.content,
          settlementRows: mapperSettlementRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        setOpError('list', resolveErrorMessage(error, messages.settlement.status.errors.loadError), error)
      } finally {
        set({ loadingSettlements: false })
      }
    },

    getSettlementDetail: async (id: string) => {
      const parsedId = Number(id)
      if (!Number.isInteger(parsedId) || parsedId <= 0) {
        setOpError('detail', messages.settlement.status.errors.detailInvalidId)
        set({ settlementDetail: null })
        return null
      }
      const requestId = ++latestDetailRequestId

      try {
        set({ loadingSettlementDetail: true, settlementDetail: null })
        clearOp('detail')
        const data = await settlementService.getSettlementDetail(parsedId)
        if (requestId !== latestDetailRequestId) return null
        set({ settlementDetail: data })
        return data
      } catch (error) {
        if (requestId !== latestDetailRequestId) return null
        setOpError('detail', resolveErrorMessage(error, messages.settlement.status.errors.detailLoadError), error)
        return null
      } finally {
        if (requestId === latestDetailRequestId) {
          set({ loadingSettlementDetail: false })
        }
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
      await get().getSettlements()
    },

    setSearch: (value: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, search: value } }))
    },

    setStatusFilter: (status: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, status } }))
    },

    setEmployeeIdFilter: (employeeId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, employeeId } }))
    },

    setLegalTerminationCauseIdFilter: (legalTerminationCauseId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, legalTerminationCauseId } }))
    },

    setRehireEligibleFilter: (rehireEligible: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, rehireEligible } }))
    },

    setEndDateRange: ({ endDateFrom, endDateTo }) => {
      set((state) => ({
        queryParams: { ...state.queryParams, endDateFrom, endDateTo },
      }))
    },

    setCreatedDateRange: ({ createdFrom, createdTo }) => {
      set((state) => ({
        queryParams: { ...state.queryParams, createdFrom, createdTo },
      }))
    },

    clearStatusFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, status: '' } }))
    },

    clearEmployeeIdFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, employeeId: '' } }))
    },

    clearLegalTerminationCauseIdFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, legalTerminationCauseId: '' } }))
    },

    clearRehireEligibleFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, rehireEligible: '' } }))
    },

    clearEndDateRange: () => {
      set((state) => ({
        queryParams: { ...state.queryParams, endDateFrom: '', endDateTo: '' },
      }))
    },

    clearCreatedDateRange: () => {
      set((state) => ({
        queryParams: { ...state.queryParams, createdFrom: '', createdTo: '' },
      }))
    },

    searchSettlements: async () => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0 },
      }))
      await get().getSettlements()
    },

    sortSettlements: async (sortBy, sortDir) => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
      }))
      await get().getSettlements()
    },

    clearSettlementDetail: () => {
      set({ settlementDetail: null })
    },

    clearOperationStatus: (key: OperationKey) => {
      clearOp(key)
    },
  }
})
