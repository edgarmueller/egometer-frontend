export interface User {
  id: string
  email: string
  displayName: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
  displayName: string
}
