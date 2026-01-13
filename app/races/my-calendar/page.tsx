'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

interface Race {
  id: number
  name: string
  location: string
  city?: string
  province?: string
  country?: string
  discipline: string
  startDate: string
  endDate?: string
  distance?: number
  elevation?: number
  stages?: number
}

export default function MyCalendarPage() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [races, setRaces] = useState<Race[]>([])

  useEffect(() => {
    // Verificar si hay sesión
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
          // Cargar carreras favoritas del usuario
          fetch('/api/favorites')
            .then(res => res.json())
            .then(favData => {
              if (favData.races && Array.isArray(favData.races)) {
                setRaces(favData.races)
              } else {
                setRaces([])
              }
            })
            .catch(console.error)
            .finally(() => setLoading(false))
        } else {
          setLoading(false)
        }
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Inicia sesión</h2>
          <p className="text-gray-600 mb-6">Necesitas iniciar sesión para ver tu calendario de carreras</p>
          <button
            onClick={() => router.push('/races')}
            className="px-6 py-3 text-white rounded-lg transition-colors"
            style={{ backgroundColor: '#00A3A3' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#008080'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00A3A3'}
          >
            Volver a carreras
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Header - Fijo arriba en desktop */}
      <header className="bg-gray-900 border-b border-gray-700 lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-800"
          >
            <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-center">
            <h1 className="text-base font-semibold text-white">Mi Calendario</h1>
          </div>
          
          <div className="w-10"></div>
        </div>
      </header>

      {/* Contenido Principal - Con margen para sidebar en desktop */}
      <div className="flex-1 lg:ml-56 lg:mt-16 flex flex-col">
      {/* Contenido */}
      <main className="px-4 py-4 pb-4 lg:pb-4 flex-1 overflow-y-auto">
        {races.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 mb-2">No tienes carreras guardadas</p>
            <p className="text-sm text-gray-400 mb-6">Marca las carreras que quieres correr para verlas aquí</p>
            <Link
              href="/races"
              className="inline-block px-6 py-3 text-white rounded-lg transition-colors"
              style={{ backgroundColor: '#00A3A3' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#008080'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00A3A3'}
            >
              Ver carreras
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {races.map((race) => (
              <Link
                key={race.id}
                href={`/races/${race.id}`}
                className="block bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-sm mb-2">{race.name}</h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(race.startDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{race.city || race.location}</span>
                    {(race.province || race.country) && (
                      <span className="text-gray-400">• {[race.province, race.country].filter(Boolean).join(', ')}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      </div>

      {/* Sidebar - Vertical en desktop, horizontal abajo en mobile */}
      <nav className="bg-gray-900 border-t border-gray-700 lg:border-t-0 lg:border-r lg:fixed lg:left-0 lg:top-16 lg:bottom-0 lg:w-56 lg:flex lg:flex-col lg:justify-start lg:pt-4">
        <div className="flex justify-around items-center lg:flex-col lg:gap-2 lg:justify-start px-4 py-2 lg:py-0 lg:px-3">
          <Link 
            href="/races" 
            className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-3 py-2 lg:py-3 lg:w-full lg:px-3 lg:rounded-lg lg:transition-colors ${
              pathname === '/races' || (pathname.startsWith('/races/') && !pathname.startsWith('/races/my-calendar'))
                ? 'lg:bg-gray-800'
                : 'lg:hover:bg-gray-800'
            }`}
          >
            <div 
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                pathname === '/races' || (pathname.startsWith('/races/') && !pathname.startsWith('/races/my-calendar'))
                  ? ''
                  : 'bg-gray-700'
              }`}
              style={pathname === '/races' || (pathname.startsWith('/races/') && !pathname.startsWith('/races/my-calendar')) ? { backgroundColor: '#00A3A3' } : {}}
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
              </svg>
            </div>
            <span 
              className={`text-xs lg:text-sm font-medium ${
                pathname === '/races' || (pathname.startsWith('/races/') && !pathname.startsWith('/races/my-calendar'))
                  ? ''
                  : 'text-gray-300'
              }`}
              style={pathname === '/races' || (pathname.startsWith('/races/') && !pathname.startsWith('/races/my-calendar')) ? { color: '#00A3A3' } : {}}
            >Carreras</span>
          </Link>

          <div 
            className="flex flex-col lg:flex-row items-center gap-1 lg:gap-3 py-2 lg:py-3 lg:w-full lg:px-3 lg:rounded-lg opacity-50 cursor-not-allowed"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-600">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <span className="text-xs lg:text-sm font-medium text-gray-500">Mi calendario</span>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-3 py-2 lg:py-3 lg:w-full lg:px-3 lg:rounded-lg opacity-50 cursor-not-allowed">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-600">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs lg:text-sm text-gray-500">Config</span>
          </div>
        </div>
      </nav>
    </div>
  )
}
