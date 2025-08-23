import React, { createContext, useContext, useState, useEffect } from 'react'
import { getStoredUser, getStoredToken, removeStoredAuth } from '../utils/storage'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize auth state from localStorage
    const storedUser = getStoredUser()
    const storedToken = getStoredToken()
    
    if (storedUser && storedToken) {
      setUser(storedUser)
      setToken(storedToken)
    }
    
    setLoading(false)
  }, [])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', authToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    removeStoredAuth()
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const isAuthenticated = () => {
    return !!user && !!token
  }

  const value = {
    user,
    token,
    login,
    logout,
    isAdmin,
    isAuthenticated,
    loading
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}