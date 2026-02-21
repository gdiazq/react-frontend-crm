import { useState, useRef, useEffect } from 'react'

interface UsePasswordTokenCountdownOptions {
  token: string | null
  tokenIssuedAt: number | null
  maxAgeMs: number
  onMissingToken: () => void
  onExpired: () => void
}

export function usePasswordTokenCountdown({
  token,
  tokenIssuedAt,
  maxAgeMs,
  onMissingToken,
  onExpired,
}: UsePasswordTokenCountdownOptions) {
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    if (!token || !tokenIssuedAt) return 0
    const remaining = tokenIssuedAt + maxAgeMs - Date.now()
    return remaining <= 0 ? 0 : Math.ceil(remaining / 1000)
  })

  const expirationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onMissingTokenRef = useRef(onMissingToken)
  const onExpiredRef = useRef(onExpired)
  onMissingTokenRef.current = onMissingToken
  onExpiredRef.current = onExpired

  const clearTimers = () => {
    if (expirationTimerRef.current) { clearTimeout(expirationTimerRef.current); expirationTimerRef.current = null }
    if (countdownTimerRef.current) { clearInterval(countdownTimerRef.current); countdownTimerRef.current = null }
  }

  useEffect(() => {
    if (!token || !tokenIssuedAt) {
      onMissingTokenRef.current()
      return
    }

    const expiresAt = tokenIssuedAt + maxAgeMs
    const remainingMs = expiresAt - Date.now()

    if (remainingMs <= 0) {
      onExpiredRef.current()
      return
    }

    countdownTimerRef.current = setInterval(() => {
      const seconds = Math.ceil((expiresAt - Date.now()) / 1000)
      setRemainingSeconds(Math.max(seconds, 0))
      if (seconds <= 0) clearTimers()
    }, 1000)

    expirationTimerRef.current = setTimeout(() => {
      onExpiredRef.current()
    }, remainingMs)

    return clearTimers
  }, [token, tokenIssuedAt, maxAgeMs])

  return { remainingSeconds, clearTimers }
}
