import { ButtonComponent } from '@/components/ui/button/ButtonComponent'
import { InputComponent } from '@/components/ui/input/InputComponent'
import messages from '@/messages/messages'

interface ResendVerificationModalProps {
  open: boolean
  phoneNumber: string
  submitting: boolean
  errorMessage: string | null
  onClose: () => void
  onConfirm: () => void
  onPhoneNumberChange: (value: string) => void
}

export function ResendVerificationModal({
  open,
  phoneNumber,
  submitting,
  errorMessage,
  onClose,
  onConfirm,
  onPhoneNumberChange,
}: ResendVerificationModalProps) {
  if (!open) return null

  return (
    <section
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900">
        <h3 className="text-lg font-semibold">{messages.auth.ui.resendVerificationTitle}</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {messages.auth.ui.resendVerificationDescription}
        </p>

        <div className="mt-4">
          <InputComponent
            value={phoneNumber}
            label={messages.auth.ui.resendVerificationPhoneLabel}
            type="tel"
            autoComplete="tel"
            placeholder="+56912345678"
            required
            onValueChange={onPhoneNumberChange}
          />
        </div>
        {errorMessage && <p className="mt-2 text-sm text-rose-500">{errorMessage}</p>}

        <div className="mt-4 flex justify-end gap-2">
          <ButtonComponent variant="outline" disabled={submitting} onClick={onClose}>
            {messages.auth.ui.resendVerificationCancel}
          </ButtonComponent>
          <ButtonComponent variant="solid" disabled={submitting} onClick={onConfirm}>
            {submitting ? messages.auth.ui.resendVerificationSubmitting : messages.auth.ui.resendVerificationConfirm}
          </ButtonComponent>
        </div>
      </section>
    </section>
  )
}
