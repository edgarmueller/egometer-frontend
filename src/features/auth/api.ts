import { apiClient } from '@/lib/api-client'
import type { AuthResponse, LoginInput, RegisterInput, User } from './types'

export const authApi = {
  register: (input: RegisterInput) =>
    apiClient.post<AuthResponse>('/auth/register', input),
  login: (input: LoginInput) => apiClient.post<AuthResponse>('/auth/login', input),
  me: () => apiClient.get<User>('/auth/me'),
}
