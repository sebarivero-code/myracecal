'use client'

import { useState, useEffect } from 'react'

interface FavoriteButtonProps {
  raceId: number
  initialFavorite?: boolean
}

export default function FavoriteButton({ raceId, initialFavorite = false }: FavoriteButtonProps) {
  const [user, setUser] = useState<any>(null)
  const [isFavorite, setIsFavorite] = useState(initialFavorite)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Verificar si hay sesión
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
          // Cargar estado de favorito
          fetch(`/api/favorites?raceId=${raceId}`)
            .then(res => res.json())
            .then(favData => {
              if (favData.isFavorite !== undefined) {
                setIsFavorite(favData.isFavorite)
              }
            })
            .catch(console.error)
        }
      })
      .catch(console.error)
  }, [raceId])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      // Redirigir a login o mostrar mensaje
      alert('Por favor, inicia sesión para guardar favoritos')
      window.location.href = '/auth/signin'
      return
    }

    setIsLoading(true)
    const newFavoriteState = !isFavorite

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raceId,
          isFavorite: newFavoriteState,
        }),
      })

      if (response.ok) {
        setIsFavorite(newFavoriteState)
      } else {
        console.error('Error al actualizar favorito')
      }
    } catch (error) {
      console.error('Error al actualizar favorito:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex-shrink-0 p-2 rounded-full hover:bg-gray-100 relative transition-colors ${
        !user ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title={user ? (isFavorite ? 'Quitar de mi calendario' : 'Agregar a mi calendario') : 'Inicia sesión para guardar carreras'}
    >
      <svg
        className={`w-6 h-6 transition-colors ${
          isFavorite ? '' : 'text-gray-400'
        }`}
        style={isFavorite ? { color: '#00A3A3' } : {}}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        {/* Calendario */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
        {/* Check dentro del calendario */}
        {isFavorite && (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4"
            style={{ color: '#00A3A3' }}
            strokeWidth={2.5}
          />
        )}
      </svg>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-300 rounded-full animate-spin" style={{ borderTopColor: '#00A3A3' }}></div>
        </div>
      )}
    </button>
  )
}

