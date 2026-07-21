import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { format, getISOWeek, getISOWeekYear } from 'date-fns'
import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/auth-context'
import { cn } from '@/lib/utils'

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-primary text-primary-foreground'
      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
  )
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const now = new Date()
  const todayPath = `/daily/${format(now, 'yyyy-MM-dd')}`
  const monthPath = `/monthly/${now.getFullYear()}/${now.getMonth() + 1}`
  const weekPath = `/weekly/${getISOWeekYear(now)}/${getISOWeek(now)}`

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold tracking-tight">egometer</span>
            <nav className="flex items-center gap-1">
              <NavLink to={todayPath} className={navLinkClass}>
                Daily
              </NavLink>
              <NavLink to={monthPath} className={navLinkClass}>
                Monthly
              </NavLink>
              <NavLink to={weekPath} className={navLinkClass}>
                Weekly
              </NavLink>
              <NavLink to="/meters" className={navLinkClass}>
                Meters
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user.displayName}
              </span>
            )}
            <Button variant="ghost" size="icon" aria-label="Log out" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
