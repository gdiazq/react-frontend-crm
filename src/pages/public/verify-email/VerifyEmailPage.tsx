import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  AlertMessageComponent,
  ButtonComponent,
  PublicAuthBackButtonComponent,
  PublicAuthHeaderComponent,
  PublicAuthLayoutComponent,
  ResendVerificationModal,
  VerificationCodeInputComponent,
} from '@/components'
import { AUTH_ROUTE_CREATE_PASSWORD, AUTH_ROUTE_LOGIN } from '@/constant'
import { initialResendVerificationForm, initialVerifyEmailForm } from '@/factories'
import { useFormValidation } from '@/hooks'
import { mapperResendVerificationPayload, mapperVerifyEmailPayload } from '@/mappers'
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
  const setPendingVerifyEmail = useStoreAuthFlow((s) => s.setPendingVerifyEmail)

  const queryEmail = (searchParams.get('email') ?? '').trim()
  const queryCode = (searchParams.get('code') ?? '').trim()
  const verifyTargetEmail = (queryEmail || pendingVerifyEmail || '').trim()
  const verifiedRef = useRef(false)

  const [form, setForm] = useState(() => ({ ...initialVerifyEmailForm, code: queryCode }))
  const [resendForm, setResendForm] = useState({ ...initialResendVerificationForm })
  const [showResendModal, setShowResendModal] = useState(false)
  const [resendModalError, setResendModalError] = useState<string | null>(null)
  const { errors, validateAll } = useFormValidation(form, verifyEmailValidationRules)

  useEffect(() => {
    if (queryEmail) {
      setPendingVerifyEmail(queryEmail)
      useStoreAuthFlow.setState({ errorMessage: null })
    }
  }, [queryEmail, setPendingVerifyEmail])

  useEffect(() => {
    if (!verifyTargetEmail && !verifiedRef.current) {
      useStoreAuthFlow.setState({ errorMessage: 'No se encontro el correo a verificar. Vuelve a registrarte.' })
    }
  }, [verifyTargetEmail])

  const handleResendCode = async () => {
    setResendModalError(null)

    if (!verifyTargetEmail) {
      setResendModalError('No se encontro el correo para reenviar el codigo.')
      return
    }
    if (!pendingVerifyPhone) {
      setResendModalError('No se encontro el telefono de verificacion. Vuelve a registrarte.')
      return
    }
    if (!resendForm.phoneNumber.trim()) {
      setResendModalError('Debes ingresar tu numero de telefono para reenviar el codigo.')
      return
    }

    const inputPhone = resendForm.phoneNumber.replace(/\s+/g, '')
    const expectedPhone = pendingVerifyPhone.replace(/\s+/g, '')
    if (inputPhone !== expectedPhone) {
      setResendModalError('El numero de telefono no coincide con el registrado.')
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

    setResendModalError(useStoreAuthFlow.getState().errorMessage || 'No se pudo reenviar el codigo.')
    useStoreAuthFlow.setState({ errorMessage: null })
  }

  const submitForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!verifyTargetEmail) {
      useStoreAuthFlow.setState({ errorMessage: 'No se encontro el correo a verificar o falta el codigo.' })
      return
    }
    if (!validateAll()) return

    const payload = mapperVerifyEmailPayload(verifyTargetEmail, form)
    const success = await verifyEmail(payload)
    if (success) {
      verifiedRef.current = true
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
        description={(
          <>
            Ingresa el código de 6 dígitos que enviamos
            {verifyTargetEmail ? (
              <>
                {' '}a <span className="num text-slate-800 dark:text-slate-200">{verifyTargetEmail}</span>
              </>
            ) : ' a tu correo'}
            {' '}para continuar.
          </>
        )}
      />

      <form className="mt-10 space-y-6" onSubmit={submitForm}>
        <VerificationCodeInputComponent
          value={form.code}
          error={errors.code}
          onValueChange={(code) => setForm({ code })}
        />

        <div className="flex items-center justify-between">
          <span className="num text-[10.5px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
            ¿No lo recibiste?
          </span>
          <button
            type="button"
            className="num text-[11px] uppercase tracking-[0.16em] accent-text transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={resendSubmitting}
            onClick={() => { setResendForm({ phoneNumber: '' }); setResendModalError(null); setShowResendModal(true) }}
          >
            {resendSubmitting ? 'Reenviando...' : 'Reenviar código →'}
          </button>
        </div>

        <ButtonComponent type="submit" variant="solid" disabled={verifySubmitting} className="w-full">
          {verifySubmitting ? 'Verificando...' : 'Verificar correo'}
        </ButtonComponent>

        {errorMessage && (
          <AlertMessageComponent
            message={errorMessage}
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
        onClose={() => setShowResendModal(false)}
        onConfirm={handleResendCode}
        onPhoneNumberChange={(phoneNumber) => setResendForm({ phoneNumber })}
      />
    </PublicAuthLayoutComponent>
  )
}
