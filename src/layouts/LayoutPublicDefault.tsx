import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

interface LayoutPublicDefaultProps {
  children?: ReactNode
}

export function LayoutPublicDefault({ children }: LayoutPublicDefaultProps) {
  return (
    <main id="layout-public-default">
      {children ?? <Outlet />}
    </main>
  )
}
