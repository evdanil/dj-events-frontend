import { createContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { NEXT_URL } from '../config'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  const router = useRouter()
  useEffect(() => {
    const runme = async () => checkUserLoggedIn()
    runme()
  }, [])
  // Register user
  const register = async (user) => {
    const res = await fetch(`/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })

    const data = await res.json()

    // console.log(data)
    if (res.ok) {
      setUser(data.user)
      router.push('/account/dashboard')
    } else {
      setTimeout(() => setError(data.message), 1000)
      setError(null)
    }
  }

  // Login user
  const login = async ({ email: identifier, password }) => {
    // console.log({ identifier, password })
    const res = await fetch(`/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier,
        password,
      }),
    })

    const data = await res.json()

    // console.log(data)
    if (res.ok) {
      setUser(data.user)
      setTimeout(() => router.push('/account/dashboard'), 1000)
    } else {
      setTimeout(() => setError(data.message), 1000)
      setError(null)
    }
  }

  // Logout user
  const logout = async (user) => {
    const res = await fetch(`/api/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    // console.log(data)
    if (res.ok) {
      setUser(null)
      router.push('/')
    } else {
      // setTimeout(() => setError(data.message), 1000)
      setError(null)
    }
  }

  // Check if user logged in
  const checkUserLoggedIn = async (user) => {
    const res = await fetch(`/api/user`)
    const data = await res.json()

    if (res.ok) {
      setUser(data.user)
    } else {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, error, register, login, logout, checkUserLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
