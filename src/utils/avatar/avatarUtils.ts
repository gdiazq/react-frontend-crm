export function getInitials(fullName: string, fallback = ''): string {
  const parts = fullName.trim().split(/\s+/).filter((part) => part.length > 0)
  if (parts.length === 0) return fallback

  const firstInitial = parts[0]?.charAt(0) ?? ''
  const secondInitial = parts[1]?.charAt(0) ?? parts[0]?.charAt(1) ?? ''
  const initials = `${firstInitial}${secondInitial}`.toUpperCase()
  return initials.length > 0 ? initials : fallback
}
