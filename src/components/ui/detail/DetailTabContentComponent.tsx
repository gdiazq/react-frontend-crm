import type { ReactNode } from 'react'

interface DetailTabContentComponentProps {
  renderTabContent: () => ReactNode
  className?: string
}

export default function DetailTabContentComponent({
  renderTabContent,
  className = '',
}: DetailTabContentComponentProps) {
  return (
    <article className={`rounded-xl border border-slate-200 p-4 dark:border-white/10 ${className}`.trim()}>
      {renderTabContent()}
    </article>
  )
}
