import axios from 'axios'
import type { StoreApi } from 'zustand'
import type { OperationKey, OperationStatus } from '@/types'

const emptyStatus = (): OperationStatus => ({ error: null, success: null, errorBack: null })

export const buildInitialOperationStatus = <K extends string>(
  keys: readonly K[],
): Record<K, OperationStatus> => {
  const result = {} as Record<K, OperationStatus>
  for (const key of keys) {
    result[key] = emptyStatus()
  }
  return result
}

export const initialOperationStatus = (): Record<OperationKey, OperationStatus> =>
  buildInitialOperationStatus<OperationKey>(['list', 'detail', 'create', 'update', 'toggle'])

interface OperationStatusState<K extends string = OperationKey> {
  operationStatus: Record<K, OperationStatus>
}

export const createOperationStatusHelpers = <
  K extends string,
  T extends OperationStatusState<K>,
>(
  set: StoreApi<T>['setState'],
) => {
  const setOpError = (key: K, error: string, errorBack?: unknown) => {
    set((state) => ({
      operationStatus: {
        ...state.operationStatus,
        [key]: { error, success: null, errorBack: errorBack ?? null },
      },
    }) as Partial<T>)
  }

  const setOpSuccess = (key: K, success: string) => {
    set((state) => ({
      operationStatus: {
        ...state.operationStatus,
        [key]: { error: null, success, errorBack: null },
      },
    }) as Partial<T>)
  }

  const clearOp = (key: K) => {
    set((state) => ({
      operationStatus: {
        ...state.operationStatus,
        [key]: { error: null, success: null, errorBack: null },
      },
    }) as Partial<T>)
  }

  return { setOpError, setOpSuccess, clearOp }
}

export const resolveErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback
  }
  return fallback
}
