import type { ReactNode } from 'react'
import ButtonComponent from '@/components/ui/button/ButtonComponent'

interface DetailStateWrapperComponentProps {
  loading: boolean
  errorMessage: string | null
  hasData: boolean
  loadingText: string
  emptyText: string
  onRetry?: () => void
  children: ReactNode
}

export default function DetailStateWrapperComponent({
  loading,
  errorMessage,
  hasData,
  loadingText,
  emptyText,
  onRetry,
  children,
}: DetailStateWrapperComponentProps) {
  if (loading) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">{loadingText}</p>
  }

  if (errorMessage) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-rose-600 dark:text-rose-300">{errorMessage}</p>
        {onRetry && (
          <ButtonComponent
            type="button"
            variant="outline"
            label="Reintentar"
            onClick={onRetry}
          />
        )}
      </div>
    )
  }

  if (!hasData) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">{emptyText}</p>
  }

  return <>{children}</>
}
