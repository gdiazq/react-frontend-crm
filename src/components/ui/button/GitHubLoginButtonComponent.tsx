import { ButtonComponent } from './ButtonComponent'

interface GitHubLoginButtonComponentProps {
  loading?: boolean
  label: string
  loadingLabel: string
  onClick: () => void
  disabled?: boolean
  className?: string
}

export function GitHubLoginButtonComponent({
  loading = false,
  label,
  loadingLabel,
  onClick,
  disabled = false,
  className = '',
}: GitHubLoginButtonComponentProps) {
  return (
    <ButtonComponent
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full gap-2 border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-current"
      >
        <path d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.8-.3.8-.6v-2.4c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.8-1.3-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.4 3.6 1.1.1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-6A4.8 4.8 0 0 1 5.7 8c-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 6 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1a4.8 4.8 0 0 1 1.3 3.3c0 4.6-2.8 5.7-5.5 6 .4.3.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
      </svg>
      <span>{loading ? loadingLabel : label}</span>
    </ButtonComponent>
  )
}
