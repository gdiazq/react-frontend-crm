import type { ReactNode } from 'react'
import { ButtonComponent } from '@/components/ui/button/ButtonComponent'
import { DetailSkeletonComponent } from './DetailSkeletonComponent'

interface DetailStateWrapperComponentProps {
  loading: boolean
  errorMessage: string | null
  hasData: boolean
  loadingText: string
  emptyText: string
  onRetry?: () => void
  children: ReactNode
  skeletonSections?: number
  skeletonFieldsPerSection?: number
}

export function DetailStateWrapperComponent({
  loading,
  errorMessage,
  hasData,
  loadingText,
  emptyText,
  onRetry,
  children,
  skeletonSections,
  skeletonFieldsPerSection,
}: DetailStateWrapperComponentProps) {
  if (loading) {
    return (
      <DetailSkeletonComponent
        sections={skeletonSections}
        fieldsPerSection={skeletonFieldsPerSection}
      />
    )
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
