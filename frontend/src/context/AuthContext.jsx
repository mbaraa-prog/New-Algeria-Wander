import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('access_token')
      const userData = localStorage.getItem('user')

      if (accessToken && userData) {
        try {
          setUser(JSON.parse(userData))
          // Optionally verify token/refresh profile here
          // const profileResponse = await authService.getProfile();
          // setUser(profileResponse.data.user);
        } catch (error) {
          console.error('Failed to initialize auth:', error)
          logout()
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email, password, rememberMe) => {
    try {
      const response = await authService.login(email, password, rememberMe)
      if (response.success) {
        const { tokens, user: userData } = response.data
        localStorage.setItem('access_token', tokens.access)
        localStorage.setItem('refresh_token', tokens.refresh)
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
        errors: error.response?.data?.errors
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      if (response.success) {
        const { tokens, user: newUser } = response.data
        localStorage.setItem('access_token', tokens.access)
        localStorage.setItem('refresh_token', tokens.refresh)
        localStorage.setItem('user', JSON.stringify(newUser))
        setUser(newUser)
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.',
        errors: error.response?.data?.errors
      }
    }
  }

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      try {
        await authService.logout(refreshToken)
      } catch (error) {
        console.error('Logout API error:', error)
      }
    }
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

