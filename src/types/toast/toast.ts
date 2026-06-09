export type ToastTone = 'error' | 'success' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  tone: ToastTone
}

export interface ToastInput {
  message: string
  tone?: ToastTone
  id?: string
}

export interface ToastStore {
  toasts: Toast[]
  pushToast: (toast: ToastInput) => string
  dismissToast: (id: string) => void
  clearToasts: () => void
}
