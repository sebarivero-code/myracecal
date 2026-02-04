'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Race {
  id: string
  name: string
  slug: string
  format: string
  location: string
  editions: string
  editionsCount: number
}

export default function ManageRacesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [races, setRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Función para normalizar texto (remover tildes)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }
  
  // Buscar carreras
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(true)
      fetch(`/api/races/manage?q=${encodeURIComponent(searchQuery)}`)
        .then(async res => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            throw new Error(errorData.error || `Error ${res.status}`)
          }
          return res.json()
        })
        .then(data => {
          setRaces(data)
          setError(null)
        })
        .catch(err => {
          console.error('Error buscando carreras:', err)
          setError(err.message || 'Error al buscar carreras')
          setRaces([])
        })
        .finally(() => {
          setLoading(false)
        })
    }, 500) // Aumentado el debounce a 500ms para evitar queries muy rápidas
    
    return () => clearTimeout(timeoutId)
  }, [searchQuery])
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Carreras</h1>
            <p className="text-gray-400">Administra carreras y sus ediciones</p>
          </div>
          <Link
            href="/races/new"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition text-white font-medium"
          >
            + Nueva Carrera
          </Link>
        </div>
        
        {error && (
          <div className="bg-red-600 text-white p-4 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {/* Buscador */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar carrera por nombre..."
            className="w-full px-4 py-2 bg-gray-700 text-white rounded"
          />
        </div>
        
        {/* Tabla de carreras - Desktop */}
        <div className="hidden md:block bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Formato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ediciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                      Cargando...
                    </td>
                  </tr>
                ) : races.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <p className="text-gray-400">
                          {searchQuery ? 'No se encontraron carreras' : 'No hay carreras'}
                        </p>
                        <Link
                          href="/races/new"
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition text-white font-medium"
                        >
                          + Crear Nueva Carrera
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  races.map(race => (
                    <tr
                      key={race.id}
                      onClick={() => router.push(`/races/manage/${race.id}`)}
                      className="hover:bg-gray-700 cursor-pointer transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {race.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {race.format}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {race.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {race.editions || 'Sin ediciones'}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Listado mobile - Tarjetas */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="bg-gray-800 p-4 rounded-lg text-center text-gray-400">
              Cargando...
            </div>
          ) : races.length === 0 ? (
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-gray-400 mb-4">
                {searchQuery ? 'No se encontraron carreras' : 'No hay carreras'}
              </p>
              <Link
                href="/races/new"
                className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition text-white font-medium"
              >
                + Crear Nueva Carrera
              </Link>
            </div>
          ) : (
            races.map(race => (
              <div
                key={race.id}
                onClick={() => router.push(`/races/manage/${race.id}`)}
                className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition"
              >
                {/* Fila 1: Nombre (izq) y Formato (der) */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 pr-2">
                    <div className="text-sm font-medium text-white">
                      {race.name}
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 whitespace-nowrap">
                    {race.format}
                  </div>
                </div>
                
                {/* Fila 2: Ubicación (izq) y Ediciones (der) */}
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-2">
                    <div className="text-xs text-gray-400">
                      {race.location}
                    </div>
                  </div>
                  <div className="text-xs text-gray-300 whitespace-nowrap">
                    {race.editions || 'Sin ediciones'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {!loading && races.length > 0 && (
          <div className="mt-4 text-sm text-gray-400 text-center">
            Total: {races.length} carrera{races.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}
