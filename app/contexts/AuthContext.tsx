'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authLogger } from '@/app/lib';
import { api } from '@/app/lib/request';
import { useRouter } from 'next/navigation'
import type { User } from '@/app/types/supabase'
import { HttpStatus } from '@/app/types/api'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user && !!token

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setToken(storedToken)
          setUser(parsedUser)
        } catch (error) {
          authLogger.error('解析用户信息失败:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const data = await api.post<{ token: string; user: User }>('/auth/login', { email, password })

    if (data.code !== HttpStatus.OK) {
      throw new Error(data.msg || '登录失败')
    }

    if (data.data) {
      setToken(data.data.token)
      setUser(data.data.user)

      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))

      // 使用 window.location.href 跳转到首页，确保 cookie 正确设置和 middleware 生效
      window.location.href = '/'
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const refreshUser = async () => {
    if (!token) return

    try {
      const data = await api.get<{ user: User }>('/auth/me')
      
      if (data.code === HttpStatus.OK && data.data) {
        setUser(data.data.user)
        localStorage.setItem('user', JSON.stringify(data.data.user))
      }
    } catch (error) {
      authLogger.error('刷新用户信息失败:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth 必须在AuthProvider内部使用')
  }
  return context
}


