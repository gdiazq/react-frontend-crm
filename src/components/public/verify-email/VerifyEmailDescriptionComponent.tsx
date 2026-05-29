import messages from '@/messages/messages'

interface VerifyEmailDescriptionComponentProps {
  targetEmail: string
}

export function VerifyEmailDescriptionComponent({ targetEmail }: VerifyEmailDescriptionComponentProps) {
  return (
    <>
      {messages.auth.ui.verifyEmailDescriptionStart}
      {targetEmail ? (
        <>
          {' '}a <span className="num text-slate-800 dark:text-slate-200">{targetEmail}</span>
        </>
      ) : ` ${messages.auth.ui.verifyEmailDescriptionFallback}`}
      {' '}{messages.auth.ui.verifyEmailDescriptionEnd}
    </>
  )
}
