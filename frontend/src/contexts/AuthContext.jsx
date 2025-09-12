import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (check localStorage)
    const savedAuth = localStorage.getItem('railSarthiAuth')
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth)
        setIsAuthenticated(true)
        setUser(authData.user)
      } catch (error) {
        console.error('Error parsing saved auth data:', error)
        localStorage.removeItem('railSarthiAuth')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData) => {
    setIsAuthenticated(true)
    setUser(userData)
    localStorage.setItem('railSarthiAuth', JSON.stringify({ user: userData }))
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('railSarthiAuth')
  }

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
