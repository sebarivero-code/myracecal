'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface FavoriteButtonProps {
  raceId: number
  initialFavorite?: boolean
}

export default function FavoriteButton({ raceId, initialFavorite = false }: FavoriteButtonProps) {
  const { data: session } = useSession()
  const [isFavorite, setIsFavorite] = useState(initialFavorite)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session) {
      // Cargar estado de favorito
      fetch(`/api/favorites?raceId=${raceId}`)
        .then(res => res.json())
        .then(data => {
          if (data.isFavorite !== undefined) {
            setIsFavorite(data.isFavorite)
          }
        })
        .catch(console.error)
    }
  }, [session, raceId])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session) {
      // Redirigir a login o mostrar mensaje
      alert('Por favor, inicia sesión para guardar favoritos')
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
        !session ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title={session ? (isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos') : 'Inicia sesión para guardar favoritos'}
    >
      <svg
        className={`w-6 h-6 transition-colors ${
          isFavorite ? 'text-red-600' : 'text-blue-600'
        }`}
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke={isFavorite ? 'none' : 'currentColor'}
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
    </button>
  )
}

