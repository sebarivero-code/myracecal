'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  image?: string
}

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay sesión
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    setUser(null)
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="p-2 rounded-full opacity-50">
        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    )
  }

  if (user) {
    return (
      <button
        onClick={handleSignOut}
        className="p-2 rounded-full hover:bg-gray-800"
        title={user.name || 'Cerrar sesión'}
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || 'Usuario'}
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={() => window.location.href = '/api/auth/google?action=signin'}
      className="p-2 rounded-full hover:bg-gray-800"
      title="Iniciar sesión con Google"
    >
      <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </button>
  )
}

