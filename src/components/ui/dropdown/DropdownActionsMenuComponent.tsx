import { type ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconDots } from '@/components/ui/icons/IconDots'
import type { DropdownAction } from '@/utils'

interface DropdownActionsMenuComponentProps {
  actions: DropdownAction[]
  ariaLabel?: string
  variant?: 'inline' | 'portal'
  openDirection?: 'up' | 'down'
  triggerClassName?: string
  triggerIcon?: ReactNode
  open?: boolean
  onToggle?: () => void
}

const INLINE_TRIGGER_DEFAULT = 'inline-flex items-center gap-1.5 r-md border border-slate-200 bg-white px-2 h-9 text-[12.5px] text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/60'

export function DropdownActionsMenuComponent({
  actions,
  ariaLabel = 'Más acciones',
  variant = 'inline',
  openDirection = 'down',
  triggerClassName,
  triggerIcon,
  open: controlledOpen,
  onToggle,
}: DropdownActionsMenuComponentProps) {
  const isControlled = controlledOpen !== undefined
  const [internalOpen, setInternalOpen] = useState(false)
  const open = isControlled ? controlledOpen : internalOpen
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [portalPosition, setPortalPosition] = useState({ top: 0, left: 0 })

  const handleToggle = () => {
    if (isControlled) onToggle?.()
    else setInternalOpen((prev) => !prev)
  }

  const close = () => {
    if (isControlled) {
      if (open) onToggle?.()
    } else {
      setInternalOpen(false)
    }
  }

  useEffect(() => {
    if (!open) return
    const handleDocClick = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (!target) return
      if (rootRef.current?.contains(target)) return
      close()
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('mousedown', handleDocClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleDocClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  useEffect(() => {
    if (!open || variant !== 'portal') return
    const update = () => {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      const top = openDirection === 'up' ? rect.top - 8 : rect.bottom + 8
      setPortalPosition({ top, left: rect.right })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, variant, openDirection])

  if (actions.length === 0) return null

  const icon = triggerIcon ?? <IconDots />
  const resolvedTriggerClassName = triggerClassName ?? INLINE_TRIGGER_DEFAULT

  const renderMenuItems = () =>
    actions.map((action) => {
      const toneClass =
        action.tone === 'danger'
          ? 'text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-900/20'
          : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60'
      return (
        <button
          key={action.id}
          type="button"
          role="menuitem"
          onClick={(event) => {
            event.stopPropagation()
            close()
            action.handler()
          }}
          className={`block w-full px-3 py-2 text-left text-[12.5px] ${toneClass}`}
        >
          {action.label}
        </button>
      )
    })

  if (variant === 'portal') {
    return (
      <div
        ref={rootRef}
        className="relative inline-flex"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={triggerRef}
          type="button"
          aria-label={ariaLabel}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={(event) => {
            event.stopPropagation()
            handleToggle()
          }}
          className={resolvedTriggerClassName}
        >
          {icon}
        </button>
        {open && createPortal(
          <div
            role="menu"
            className="fixed z-[70] w-56 overflow-hidden r-md border border-slate-200 bg-white py-1 shadow-xl dark:border-white/10 dark:bg-slate-900"
            style={{
              top: portalPosition.top,
              left: portalPosition.left,
              transform: openDirection === 'up' ? 'translate(-100%, -100%)' : 'translate(-100%, 0)',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            {renderMenuItems()}
          </div>,
          document.body,
        )}
      </div>
    )
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        className={resolvedTriggerClassName}
      >
        {icon}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 w-56 overflow-hidden r-md border border-slate-200 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-slate-900"
        >
          {renderMenuItems()}
        </div>
      )}
    </div>
  )
}
