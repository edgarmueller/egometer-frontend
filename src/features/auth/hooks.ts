import { useMutation, useQuery } from '@tanstack/react-query'

import { authApi } from './api'
import { useAuth } from './auth-context'

export function useLogin() {
  const { setSession } = useAuth()
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => setSession(data.accessToken, data.user),
  })
}

export function useRegister() {
  const { setSession } = useAuth()
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => setSession(data.accessToken, data.user),
  })
}

export function useMe() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    enabled: isAuthenticated,
  })
}
