import React, { createContext, useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (email, password) => {
    // Mock login - in real app, this would call an API
    if (email && password) {
      const mockUser = {
        id: uuidv4(),
        name: email.split('@')[0],
        email: email
      }
      setUser(mockUser)
      localStorage.setItem('triphub_user', JSON.stringify(mockUser))
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const register = (name, email, password) => {
    // Mock registration - in real app, this would call an API
    if (name && email && password) {
      const newUser = {
        id: uuidv4(),
        name: name,
        email: email
      }
      setUser(newUser)
      localStorage.setItem('triphub_user', JSON.stringify(newUser))
      return { success: true }
    }
    return { success: false, error: 'Registration failed' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('triphub_user')
  }

  // Check for existing user on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('triphub_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const value = {
    user,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}