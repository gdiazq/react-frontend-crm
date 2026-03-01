import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { DropdownAction } from '@/utils'

interface ActionsDropdownComponentProps {
  open: boolean
  actions: DropdownAction[]
  onToggle: () => void
  openDirection?: 'up' | 'down'
}

export default function ActionsDropdownComponent({
  open,
  actions,
  onToggle,
  openDirection = 'down',
}: ActionsDropdownComponentProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (!open) return

    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      const top = openDirection === 'up' ? rect.top - 8 : rect.bottom + 8
      setPosition({ top, left: rect.right })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, openDirection])

  return (
    <div className="relative inline-flex" onClick={(e) => e.stopPropagation()}>
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900"
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
      >
        <span className="sr-only">Abrir acciones</span>
        <span className="text-base leading-none">...</span>
      </button>

      {open && createPortal(
        <div
          className="fixed z-[70] min-w-52 rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-slate-900"
          style={{
            top: position.top,
            left: position.left,
            transform: openDirection === 'up' ? 'translate(-100%, -100%)' : 'translate(-100%, 0)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800 ${
                action.tone === 'danger'
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-700 dark:text-slate-200'
              }`}
              onClick={(e) => {
                e.stopPropagation()
                action.handler()
              }}
            >
              {action.label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  )
}
