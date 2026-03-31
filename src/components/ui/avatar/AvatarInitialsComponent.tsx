import { getInitials } from '@/utils'

interface AvatarInitialsComponentProps {
  fullName: string
  avatarUrl?: string
  fallbackInitials?: string
  alt?: string
  className?: string
}

export function AvatarInitialsComponent({
  fullName,
  avatarUrl = '',
  fallbackInitials = '',
  alt = 'Avatar',
  className = '',
}: AvatarInitialsComponentProps) {
  const containerClassName = `flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-base font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-100 ${className}`.trim()
  const resolvedInitials = getInitials(fullName, fallbackInitials)

  return (
    <div className={containerClassName}>
      {avatarUrl.length > 0 ? (
        <img src={avatarUrl} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span>{resolvedInitials}</span>
      )}
    </div>
  )
}
