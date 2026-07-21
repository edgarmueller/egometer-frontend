import { Navigate, Route, Routes } from 'react-router-dom'
import { format } from 'date-fns'

import { AppLayout } from '@/components/AppLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import DailyDashboardPage from '@/pages/DailyDashboardPage'
import MetersSettingsPage from '@/pages/MetersSettingsPage'
import MonthlyDashboardPage from '@/pages/MonthlyDashboardPage'
import WeeklyDashboardPage from '@/pages/WeeklyDashboardPage'

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

export function AppRoutes() {
  const today = format(new Date(), 'yyyy-MM-dd')

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<Navigate to={`/daily/${today}`} replace />} />
      <Route
        path="/daily/:date"
        element={
          <ProtectedLayout>
            <DailyDashboardPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/monthly/:year/:month"
        element={
          <ProtectedLayout>
            <MonthlyDashboardPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/weekly/:year/:week"
        element={
          <ProtectedLayout>
            <WeeklyDashboardPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/meters"
        element={
          <ProtectedLayout>
            <MetersSettingsPage />
          </ProtectedLayout>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
