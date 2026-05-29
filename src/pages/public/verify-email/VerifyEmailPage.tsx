import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  PublicAuthBackButtonComponent,
  PublicAuthHeaderComponent,
  PublicAuthLayoutComponent,
  ResendVerificationModal,
  VerifyEmailDescriptionComponent,
  VerificationCodeInputComponent,
} from '@/components'
import { AUTH_ROUTE_CREATE_PASSWORD, AUTH_ROUTE_LOGIN } from '@/constant'
import { initialResendVerificationForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import {
  mapperResendVerificationPayload,
  mapperResendVerificationValidation,
  mapperVerifyEmailInitialCode,
  mapperVerifyEmailPayload,
  mapperVerifyEmailTarget,
} from '@/mappers'
import messages from '@/messages/messages'
import { useStoreAuthFlow } from '@/store'
import { verifyEmailValidationRules } from '@/validators'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const verifySubmitting = useStoreAuthFlow((s) => s.verifySubmitting)
  const resendSubmitting = useStoreAuthFlow((s) => s.resendSubmitting)
  const errorMessage = useStoreAuthFlow((s) => s.errorMessage)
  const successMessage = useStoreAuthFlow((s) => s.successMessage)
  const pendingVerifyEmail = useStoreAuthFlow((s) => s.pendingVerifyEmail)
  const pendingVerifyPhone = useStoreAuthFlow((s) => s.pendingVerifyPhone)
  const verifyEmail = useStoreAuthFlow((s) => s.verifyEmail)
  const resendVerification = useStoreAuthFlow((s) => s.resendVerification)

  const queryEmail = (searchParams.get('email') ?? '').trim()
  const queryCode = (searchParams.get('code') ?? '').trim()
  const verifyTargetEmail = mapperVerifyEmailTarget(queryEmail, pendingVerifyEmail)
  const missingTargetEmailMessage = !verifyTargetEmail ? messages.auth.status.errors.verifyEmailMissingEmail : null

  const [form, setForm] = useState(() => mapperVerifyEmailInitialCode(queryCode))
  const [resendForm, setResendForm] = useState({ ...initialResendVerificationForm })
  const [showResendModal, setShowResendModal] = useState(false)
  const [resendModalError, setResendModalError] = useState<string | null>(null)
  const { errors, validateAll } = useFormValidation(form, verifyEmailValidationRules)

  const handleOpenResendModal = () => {
    setResendForm({ ...initialResendVerificationForm })
    setResendModalError(null)
    setShowResendModal(true)
  }

  const handleCloseResendModal = () => {
    setShowResendModal(false)
  }

  const handleResendCode = async () => {
    setResendModalError(null)

    const validationError = mapperResendVerificationValidation({
      targetEmail: verifyTargetEmail,
      pendingPhone: pendingVerifyPhone,
      phoneNumber: resendForm.phoneNumber,
    })
    if (validationError) {
      setResendModalError(validationError)
      return
    }

    const payload = mapperResendVerificationPayload(verifyTargetEmail, resendForm)
    const success = await resendVerification(payload)
    if (success) {
      setForm({ code: '' })
      setResendForm({ phoneNumber: '' })
      setShowResendModal(false)
      return
    }

    setResendModalError(useStoreAuthFlow.getState().errorMessage || messages.auth.status.errors.resendVerificationFallback)
    useStoreAuthFlow.setState({ errorMessage: null })
  }

  const submitForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!verifyTargetEmail) {
      useStoreAuthFlow.setState({ errorMessage: messages.auth.status.errors.verifyEmailMissingEmailOrCode })
      return
    }
    if (!validateAll()) return

    const payload = mapperVerifyEmailPayload(verifyTargetEmail, form)
    const success = await verifyEmail(payload)
    if (success) {
      useStoreAuthFlow.setState({ errorMessage: null })
      navigate(AUTH_ROUTE_CREATE_PASSWORD)
    }
  }

  return (
    <PublicAuthLayoutComponent>
      <PublicAuthBackButtonComponent label="VOLVER AL LOGIN" onClick={() => navigate(AUTH_ROUTE_LOGIN)} />

      <PublicAuthHeaderComponent
        title="Verifica"
        accentTitle="tu correo"
        description={<VerifyEmailDescriptionComponent targetEmail={verifyTargetEmail} />}
      />

      <form className="mt-10 space-y-6" onSubmit={submitForm}>
        <VerificationCodeInputComponent
          value={form.code}
          error={errors.code}
          onValueChange={(code) => setForm({ code })}
        />

        <div className="flex items-center justify-between">
          <span className="num text-[10.5px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
            {messages.auth.ui.verifyEmailResendQuestion}
          </span>
          <button
            type="button"
            className="num text-[11px] uppercase tracking-[0.16em] accent-text transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={resendSubmitting}
            onClick={handleOpenResendModal}
          >
            {resendSubmitting ? messages.auth.ui.resendVerificationSubmitting : messages.auth.ui.verifyEmailResendAction}
          </button>
        </div>

        <ButtonComponent type="submit" variant="solid" disabled={verifySubmitting} className="w-full">
          {verifySubmitting ? messages.auth.ui.verifyEmailSubmitting : messages.auth.ui.verifyEmailSubmit}
        </ButtonComponent>

        {(errorMessage || missingTargetEmailMessage) && (
          <AlertMessageComponent
            message={(errorMessage || missingTargetEmailMessage)!}
            tone="error"
            onClose={() => useStoreAuthFlow.setState({ errorMessage: null })}
          />
        )}
        {!errorMessage && successMessage && (
          <AlertMessageComponent
            message={successMessage}
            tone="success"
            onClose={() => useStoreAuthFlow.setState({ successMessage: null })}
          />
        )}
      </form>

      <ResendVerificationModal
        open={showResendModal}
        phoneNumber={resendForm.phoneNumber}
        submitting={resendSubmitting}
        errorMessage={resendModalError}
        onClose={handleCloseResendModal}
        onConfirm={handleResendCode}
        onPhoneNumberChange={(phoneNumber) => setResendForm({ phoneNumber })}
      />
    </PublicAuthLayoutComponent>
  )
}
