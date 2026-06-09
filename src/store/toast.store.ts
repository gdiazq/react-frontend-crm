import { create } from 'zustand'
import type { ToastInput, ToastStore } from '@/types'

let toastCounter = 0

export const useStoreToast = create<ToastStore>()((set) => ({
  toasts: [],

  pushToast: (toast: ToastInput) => {
    const id = toast.id ?? `toast-${Date.now()}-${++toastCounter}`
    set((state) => ({
      toasts: [...state.toasts, { id, message: toast.message, tone: toast.tone ?? 'info' }],
    }))
    return id
  },

  dismissToast: (id: string) => {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
  },

  clearToasts: () => {
    set({ toasts: [] })
  },
}))
