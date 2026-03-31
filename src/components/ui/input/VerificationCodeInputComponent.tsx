import { useRef } from 'react'

interface VerificationCodeInputComponentProps {
  value: string
  error?: string | null
  onValueChange: (value: string) => void
}

const CODE_LENGTH = 6

export function VerificationCodeInputComponent({
  value,
  error,
  onValueChange,
}: VerificationCodeInputComponentProps) {
  const refs = useRef<(HTMLInputElement | null)[]>(Array(CODE_LENGTH).fill(null))
  const digits = value.split('').concat(Array(CODE_LENGTH).fill('')).slice(0, CODE_LENGTH)

  const handleChange = (index: number, char: string) => {
    const cleaned = char.replace(/\D/g, '').slice(-1)
    const newDigits = [...digits]
    newDigits[index] = cleaned
    onValueChange(newDigits.join(''))
    if (cleaned && index < CODE_LENGTH - 1) {
      refs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits]
        newDigits[index - 1] = ''
        onValueChange(newDigits.join(''))
        refs.current[index - 1]?.focus()
      } else {
        const newDigits = [...digits]
        newDigits[index] = ''
        onValueChange(newDigits.join(''))
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      refs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
    onValueChange(pasted.padEnd(CODE_LENGTH, '').slice(0, CODE_LENGTH))
    const focusIndex = Math.min(pasted.length, CODE_LENGTH - 1)
    refs.current[focusIndex]?.focus()
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-center gap-2">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className={`h-12 w-10 rounded-lg border text-center text-lg font-bold outline-none transition focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1 ${
              error
                ? 'border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-500 dark:bg-rose-950/20 dark:text-rose-200'
                : 'border-slate-300 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
            }`}
          />
        ))}
      </div>
      {error && <p className="text-center text-xs text-rose-500 dark:text-rose-400">{error}</p>}
    </div>
  )
}
