import type { ReactNode } from 'react'

interface PublicAuthHeaderComponentProps {
  title: string
  accentTitle: string
  description: ReactNode
  titleClassName?: string
}

export function PublicAuthHeaderComponent(props: PublicAuthHeaderComponentProps) {
  const { title, accentTitle, description, titleClassName = 'mt-4' } = props

  return (
    <header className="mt-5">
      <h1 className={`display ${titleClassName} text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50`}>
        {title}
        <span className="display-it text-slate-500 dark:text-slate-400"> {accentTitle}</span>
      </h1>
      <p className="mt-3 max-w-xl text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </header>
  )
}
