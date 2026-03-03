import type { ReactNode } from 'react'
import ButtonComponent from '@/components/ui/button/ButtonComponent'

interface SaveConfirmComponentProps {
  open: boolean
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  confirmDisabled?: boolean
  children?: ReactNode
  onClose: () => void
  onConfirm: () => void
}

export default function SaveConfirmComponent({
  open,
  title = 'Confirmar',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loading = false,
  confirmDisabled = false,
  children,
  onClose,
  onConfirm,
}: SaveConfirmComponentProps) {
  if (!open) return null

  return (
    <section
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget && !loading) onClose()
      }}
    >
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{message}</p>
        {children && <div className="mt-4">{children}</div>}

        <div className="mt-5 flex justify-end gap-2">
          <ButtonComponent
            type="button"
            variant="outline"
            disabled={loading}
            onClick={onClose}
          >
            {cancelLabel}
          </ButtonComponent>
          <ButtonComponent
            type="button"
            variant="danger"
            disabled={loading || confirmDisabled}
            onClick={onConfirm}
          >
            {loading ? 'Guardando...' : confirmLabel}
          </ButtonComponent>
        </div>
      </section>
    </section>
  )
}
