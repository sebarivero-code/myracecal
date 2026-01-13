'use client'

import { useState, useEffect, useRef } from 'react'

interface User {
  id: string
  name: string
  email: string
  image?: string
}

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

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

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    setUser(null)
    setShowMenu(false)
    window.location.reload()
  }

  const handleClick = async () => {
    if (user) {
      // Si está logueado, mostrar/ocultar menú
      setShowMenu(!showMenu)
    } else {
      // Si no está logueado, iniciar login con Google
      window.location.href = '/api/auth/google'
    }
  }

  // Obtener solo el primer nombre
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0]
  }

  if (loading) {
    return (
      <div className="p-2 rounded-full">
        <svg className="w-6 h-6 text-gray-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleClick}
        className="p-2 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2"
        title={user ? `Usuario: ${user.name || user.email}` : 'Iniciar sesión con Google'}
      >
        {user ? (
          // Si está logueado, mostrar nombre y icono
          <>
            <span className="text-sm font-medium" style={{ color: '#F5D76E' }}>
              {getFirstName(user.name || user.email)}
            </span>
            {user.image ? (
              <img 
                src={user.image} 
                alt={user.name || user.email} 
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <svg className="w-6 h-6" style={{ color: '#F5D76E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </>
        ) : (
          // Si no está logueado, mostrar icono de login
          <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </button>

      {/* Menú dropdown para cerrar sesión */}
      {user && showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-700">
          <div className="px-4 py-2 border-b border-gray-700">
            <p className="text-sm text-white font-medium">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}

