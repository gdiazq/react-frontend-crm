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
import type { SettlementStore } from '@/types'
import {
  createOperationStatusHelpers,
  initialOperationStatus,
  resolveErrorMessage,
} from '@/utils'

export const useStoreSettlement = create<SettlementStore>()((set, get) => {
  let latestSettlementsRequestId = 0
  let latestDetailRequestId = 0

  const { setOpError, setOpSuccess, clearOp } = createOperationStatusHelpers(set)

  return {
    settlementRaw: [],
    settlementDetail: null,
    settlementRows: [...initialSettlementRows],
    pagination: { ...initialSettlementPagination },
    queryParams: { ...initialSettlementQueryParams },
    loadingSettlements: false,
    loadingSettlementDetail: false,
    createSettlementSubmitting: false,
    updateSettlementSubmitting: false,
    operationStatus: initialOperationStatus(),

    getSettlements: async () => {
      const requestId = ++latestSettlementsRequestId
      try {
        set({ loadingSettlements: true })
        clearOp('list')
        const data = await settlementService.getSettlements(get().queryParams)
        if (requestId !== latestSettlementsRequestId) return
        const pagination = mapperSettlementPagination(data)

        set({
          settlementRaw: data.content,
          settlementRows: mapperSettlementRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        if (requestId !== latestSettlementsRequestId) return
        setOpError('list', resolveErrorMessage(error, messages.settlement.status.errors.loadError), error)
      } finally {
        if (requestId === latestSettlementsRequestId) {
          set({ loadingSettlements: false })
        }
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

    setStatusFilter: (statusId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, statusId } }))
    },

    setLegalTerminationCauseIdFilter: (legalTerminationCauseId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, legalTerminationCauseId } }))
    },

    setQualityOfWorkIdFilter: (qualityOfWorkId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, qualityOfWorkId } }))
    },

    setSafetyComplianceIdFilter: (safetyComplianceId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, safetyComplianceId } }))
    },

    setNoReHiredCauseIdFilter: (noReHiredCauseId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, noReHiredCauseId } }))
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
      set((state) => ({ queryParams: { ...state.queryParams, statusId: '' } }))
    },

    clearLegalTerminationCauseIdFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, legalTerminationCauseId: '' } }))
    },

    clearQualityOfWorkIdFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, qualityOfWorkId: '' } }))
    },

    clearSafetyComplianceIdFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, safetyComplianceId: '' } }))
    },

    clearNoReHiredCauseIdFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, noReHiredCauseId: '' } }))
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

    createSettlement: async (payload, files = []) => {
      try {
        set({ createSettlementSubmitting: true })
        clearOp('create')
        await settlementService.createSettlement(payload, files)
        setOpSuccess('create', messages.settlement.status.success.createSuccess)
        return true
      } catch (error) {
        setOpError('create', resolveErrorMessage(error, messages.settlement.status.errors.createError), error)
        return false
      } finally {
        set({ createSettlementSubmitting: false })
      }
    },

    updateSettlement: async (payload, files = []) => {
      if (!Number.isInteger(payload.id) || payload.id <= 0) {
        setOpError('update', messages.settlement.status.errors.detailInvalidId)
        return false
      }

      try {
        set({ updateSettlementSubmitting: true })
        clearOp('update')
        await settlementService.updateSettlement(payload, files)
        setOpSuccess('update', messages.settlement.status.success.updateSuccess)
        return true
      } catch (error) {
        setOpError('update', resolveErrorMessage(error, messages.settlement.status.errors.updateError), error)
        return false
      } finally {
        set({ updateSettlementSubmitting: false })
      }
    },
  }
})
