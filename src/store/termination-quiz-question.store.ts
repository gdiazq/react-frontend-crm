import { create } from 'zustand'
import {
  initialTerminationQuizQuestionPagination,
  initialTerminationQuizQuestionQueryParams,
  initialTerminationQuizQuestionRows,
  terminationQuizQuestionTableColumnIndex,
} from '@/factories'
import {
  mapperTerminationQuizQuestionPagination,
  mapperTerminationQuizQuestionRows,
} from '@/mappers'
import messages from '@/messages/messages'
import { terminationQuizQuestionService } from '@/services'
import type { TerminationQuizQuestionStore } from '@/types'
import {
  createOperationStatusHelpers,
  initialOperationLoading,
  initialOperationStatus,
  resolveErrorMessage,
} from '@/utils'

export const useStoreTerminationQuizQuestion = create<TerminationQuizQuestionStore>()((set, get) => {
  let latestTerminationQuizQuestionRequestId = 0
  let latestDetailRequestId = 0

  const { setOpError, setOpSuccess, clearOp, setOpLoading } = createOperationStatusHelpers(set)

  return {
    terminationQuizQuestionRaw: [],
    terminationQuizQuestionDetail: null,
    terminationQuizQuestionRows: [...initialTerminationQuizQuestionRows],
    pagination: { ...initialTerminationQuizQuestionPagination },
    queryParams: { ...initialTerminationQuizQuestionQueryParams },
    operationLoading: initialOperationLoading(),
    operationStatus: initialOperationStatus(),

    getTerminationQuizQuestion: async () => {
      const requestId = ++latestTerminationQuizQuestionRequestId
      try {
        setOpLoading('list', true)
        clearOp('list')
        const data = await terminationQuizQuestionService.getTerminationQuizQuestion(get().queryParams)
        if (requestId !== latestTerminationQuizQuestionRequestId) return
        const pagination = mapperTerminationQuizQuestionPagination(data)

        set({
          terminationQuizQuestionRaw: data.content,
          terminationQuizQuestionRows: mapperTerminationQuizQuestionRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        if (requestId !== latestTerminationQuizQuestionRequestId) return
        setOpError('list', resolveErrorMessage(error, messages.terminationQuizQuestion.status.errors.loadError), error)
      } finally {
        if (requestId === latestTerminationQuizQuestionRequestId) {
          setOpLoading('list', false)
        }
      }
    },

    getTerminationQuizQuestionDetail: async (id: string) => {
      const parsedId = Number(id)
      if (!Number.isInteger(parsedId) || parsedId <= 0) {
        setOpError('detail', messages.terminationQuizQuestion.status.errors.detailInvalidId)
        set({ terminationQuizQuestionDetail: null })
        return null
      }
      const requestId = ++latestDetailRequestId

      try {
        setOpLoading('detail', true)
        set({ terminationQuizQuestionDetail: null })
        clearOp('detail')
        const data = await terminationQuizQuestionService.getTerminationQuizQuestionDetail(parsedId)
        if (requestId != latestDetailRequestId) return null
        set({ terminationQuizQuestionDetail: data })
        return data
      } catch (error) {
        if (requestId != latestDetailRequestId) return null
        setOpError('detail', resolveErrorMessage(error, messages.terminationQuizQuestion.status.errors.detailLoadError), error)
        return null
      } finally {
        if (requestId == latestDetailRequestId) {
          setOpLoading('detail', false)
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
      await get().getTerminationQuizQuestion()
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

    setActiveFilter: (active: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, active } }))
    },

    setQuestionGroupFilter: (questionGroup: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, questionGroup } }))
    },

    setEmployeeIdFilter: (employeeId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, employeeId } }))
    },

    setCreatedDateRange: ({ createdFrom, createdTo }) => {
      set((state) => ({
        queryParams: { ...state.queryParams, createdFrom, createdTo },
      }))
    },

    setUpdatedDateRange: ({ updatedFrom, updatedTo }) => {
      set((state) => ({
        queryParams: { ...state.queryParams, updatedFrom, updatedTo },
      }))
    },

    clearActiveFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, active: '' } }))
    },

    clearCreatedDateRange: () => {
      set((state) => ({
        queryParams: { ...state.queryParams, createdFrom: '', createdTo: '' },
      }))
    },

    clearUpdatedDateRange: () => {
      set((state) => ({
        queryParams: { ...state.queryParams, updatedFrom: '', updatedTo: '' },
      }))
    },

    searchTerminationQuizQuestion: async () => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0 },
      }))
      await get().getTerminationQuizQuestion()
    },

    sortTerminationQuizQuestion: async (sortBy, sortDir) => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
      }))
      await get().getTerminationQuizQuestion()
    },

    createTerminationQuizQuestion: async (payload) => {
      const question = payload.question.trim()
      if (question.length < 3) {
        setOpError('create', messages.terminationQuizQuestion.status.errors.createError)
        return false
      }

      try {
        setOpLoading('create', true)
        clearOp('create')
        await terminationQuizQuestionService.createTerminationQuizQuestion(payload)
        setOpSuccess('create', messages.terminationQuizQuestion.status.success.createSuccess)
        return true
      } catch (error) {
        setOpError('create', resolveErrorMessage(error, messages.terminationQuizQuestion.status.errors.createError), error)
        return false
      } finally {
        setOpLoading('create', false)
      }
    },

    updateTerminationQuizQuestion: async (payload) => {
      if (!Number.isInteger(payload.id) || payload.id <= 0) {
        setOpError('update', messages.terminationQuizQuestion.status.errors.updateInvalidId)
        return false
      }
      const question = payload.question.trim()
      if (question.length < 3) {
        setOpError('update', messages.terminationQuizQuestion.status.errors.updateError)
        return false
      }

      try {
        setOpLoading('update', true)
        clearOp('update')
        await terminationQuizQuestionService.updateTerminationQuizQuestion(payload)
        setOpSuccess('update', messages.terminationQuizQuestion.status.success.updateSuccess)
        return true
      } catch (error) {
        setOpError('update', resolveErrorMessage(error, messages.terminationQuizQuestion.status.errors.updateError), error)
        return false
      } finally {
        setOpLoading('update', false)
      }
    },

    toggleTerminationQuizQuestionStatus: async (id: string, nextStatus: boolean) => {
      const parsedId = Number(id)
      if (!Number.isInteger(parsedId) || parsedId <= 0) {
        setOpError('toggle', messages.terminationQuizQuestion.status.errors.invalidStatusId)
        return false
      }

      const previousRow = get().terminationQuizQuestionRows.find((row) => row.id == id)
      const previousRaw = get().terminationQuizQuestionRaw.find((item) => item.id == parsedId)
      if (!previousRow || !previousRaw) {
        setOpError('toggle', messages.terminationQuizQuestion.status.errors.invalidStatusId)
        return false
      }

      try {
        setOpLoading('toggle', true)
        clearOp('toggle')
        set((state) => ({
          terminationQuizQuestionRaw: state.terminationQuizQuestionRaw.map((item) =>
            item.id == parsedId ? { ...item, active: nextStatus } : item,
          ),
          terminationQuizQuestionRows: state.terminationQuizQuestionRows.map((row) => {
            if (row.id != id) return row
            return {
              ...row,
              active: nextStatus,
              values: row.values.map((val, index) => {
                if (index === terminationQuizQuestionTableColumnIndex.status) {
                  return nextStatus
                    ? messages.terminationQuizQuestion.ui.statusActive
                    : messages.terminationQuizQuestion.ui.statusInactive
                }
                return val
              }),
            }
          }),
        }))
        await terminationQuizQuestionService.toggleTerminationQuizQuestionStatus(parsedId, nextStatus)
        setOpSuccess(
          'toggle',
          nextStatus
            ? messages.terminationQuizQuestion.status.success.toggleEnabledSuccess
            : messages.terminationQuizQuestion.status.success.toggleDisabledSuccess,
        )
        return true
      } catch (error) {
        set((state) => ({
          terminationQuizQuestionRaw: state.terminationQuizQuestionRaw.map((item) =>
            item.id == parsedId ? { ...item, active: previousRaw.active } : item,
          ),
          terminationQuizQuestionRows: state.terminationQuizQuestionRows.map((row) => {
            if (row.id != id) return row
            return {
              ...row,
              active: previousRaw.active,
              values: row.values.map((val, index) => {
                if (index === terminationQuizQuestionTableColumnIndex.status) {
                  return previousRaw.active
                    ? messages.terminationQuizQuestion.ui.statusActive
                    : messages.terminationQuizQuestion.ui.statusInactive
                }
                return val
              }),
            }
          }),
        }))
        setOpError('toggle', resolveErrorMessage(error, messages.terminationQuizQuestion.status.errors.toggleStatusError), error)
        return false
      } finally {
        setOpLoading('toggle', false)
      }
    },

    clearTerminationQuizQuestionDetail: () => {
      set({ terminationQuizQuestionDetail: null })
    },

    clearOperationStatus: (key) => {
      clearOp(key)
    },

    clearAllOperationStatus: () => {
      set({ operationStatus: initialOperationStatus() })
    },
  }
})
