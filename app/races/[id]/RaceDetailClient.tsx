'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Stage {
  number: number
  name?: string
  distance?: number
  elevation?: number
  startDate?: string
  endDate?: string
}

interface DisciplineDistance {
  discipline: string
  distances: number[]
}

interface Race {
  id: number
  name: string
  location: string
  city?: string
  province?: string
  country?: string
  discipline: string
  disciplines?: string[]
  disciplineDistances?: DisciplineDistance[]
  format?: string
  modality?: string
  modalities?: string[]
  startDate: string
  endDate?: string
  distance?: number
  elevation?: number
  stages?: number
  stageDetails?: Stage[]
  days?: number
  registrationUrl?: string
  contactPhone?: string
  website?: string
  instagram?: string
  description?: string
}

export default function RaceDetailClient({ raceId }: { raceId: string }) {
  const router = useRouter()
  const [race, setRace] = useState<Race | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStage, setSelectedStage] = useState(1)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  useEffect(() => {
    const fetchRace = async () => {
      try {
        const response = await fetch(`/api/races/${raceId}`)
        if (!response.ok) {
          throw new Error('Carrera no encontrada')
        }
        const data = await response.json()
        
        // Debug: verificar qué datos recibimos
        console.log('Race data received:', {
          id: data.id,
          name: data.name,
          disciplines: data.disciplines,
          discipline: data.discipline,
          distance: data.distance,
          disciplineDistances: data.disciplineDistances,
          fullData: data
        })
        
        setRace(data)
      } catch (error) {
        console.error('Error al cargar la carrera:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRace()
  }, [raceId])

  // Auto-focus en el input cuando se activa la búsqueda
  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearching])

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return date.getDate().toString()
  }

  const formatDateRange = (startDate: string, endDate?: string): string => {
    const start = new Date(startDate)
    if (isNaN(start.getTime())) return ''
    
    if (endDate) {
      const end = new Date(endDate)
      if (!isNaN(end.getTime()) && end.getTime() !== start.getTime()) {
        const startDay = start.getDate()
        const startMonth = monthNames[start.getMonth()].toLowerCase()
        const startYear = start.getFullYear()
        const endDay = end.getDate()
        const endMonth = monthNames[end.getMonth()].toLowerCase()
        const endYear = end.getFullYear()
        
        if (startYear === endYear) {
          if (startMonth === endMonth) {
            return `${startDay} - ${endDay} de ${startMonth} ${startYear}`
          }
          return `${startDay} de ${startMonth} - ${endDay} de ${endMonth} ${startYear}`
        }
        return `${startDay} de ${startMonth} ${startYear} - ${endDay} de ${endMonth} ${endYear}`
      }
    }
    
    const day = start.getDate()
    const month = monthNames[start.getMonth()].toLowerCase()
    const year = start.getFullYear()
    return `${day} de ${month} ${year}`
  }

  const formatProvinceCountry = (): string => {
    if (!race) return ''
    const parts = [race.province, race.country].filter(Boolean)
    return parts.join(' | ')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Cargando carrera...</div>
      </div>
    )
  }

  if (!race) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Carrera no encontrada</p>
          <Link href="/races" className="text-blue-600 hover:underline">
            Volver al listado
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 flex-shrink-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-800"
            >
              <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {isSearching ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      // Guardar el query y redirigir al listado
                      sessionStorage.setItem('racesListSearchQuery', searchQuery.trim())
                      sessionStorage.setItem('racesListIsSearching', 'true')
                      router.push('/races')
                    }
                  }}
                  placeholder="Buscar carrera..."
                  className="flex-1 px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsSearching(false)
                    setSearchQuery('')
                  }}
                  className="p-2 rounded-full hover:bg-gray-800"
                >
                  <svg className="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsSearching(true)}
                className="p-2 rounded-full hover:bg-gray-800"
              >
                <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>
          
          {!isSearching && (
            <div className="text-center">
              <h1 className="text-base font-semibold text-white">MyRaceCal.app</h1>
            </div>
          )}
          
          {isSearching && (
            <div></div>
          )}
          
          <div className="w-20"></div>
        </div>
      </header>

      {/* Race Header (Fondo Gris) */}
      <div className="bg-gray-200 border-b border-gray-300 flex-shrink-0 z-10 px-4 py-2">
        <h2 className="text-base font-bold mb-1.5 leading-tight text-gray-900">{race.name}</h2>
        
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span className="text-sm text-gray-700">{race.city || race.location}</span>
          </div>
          <span className="text-sm text-right text-gray-700">{formatProvinceCountry()}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">{formatDateRange(race.startDate, race.endDate)}</span>
          <button className="relative p-2 rounded-full hover:bg-gray-300">
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
            </svg>
            <svg className="w-3 h-3 text-gray-700 absolute bottom-1 right-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Race Details Card */}
      <main className="flex-1 overflow-y-auto">
        <div className="bg-white px-4 py-6">
        {/* Formato y Estadísticas */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="5.5" cy="17.5" r="3.5"/>
              <circle cx="18.5" cy="17.5" r="3.5"/>
              <path d="M15 6a6 6 0 0 0-6 6v7.5M9 6a6 6 0 0 1 6 6v7.5"/>
              <path d="M9 6h6M9 12h6"/>
            </svg>
            <span className="text-sm font-semibold text-red-600">
              {(race.disciplines && race.disciplines.length > 1
                ? race.disciplines.join(' / ')
                : race.discipline
              )?.replace(/\//g, ' & ')}
              {/* Solo mostrar el formato si no hay múltiples formatos (que se muestran con las distancias) */}
              {race.format && (!race.disciplineDistances || race.disciplineDistances.length <= 1) && ` | ${race.format.replace(/\//g, ' & ')}`}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {(() => {
              const disciplineDistances = race.disciplineDistances
              const disciplines = race.disciplines || [race.discipline].filter(Boolean)
              
              // Debug en el frontend
              console.log('Display logic:', {
                disciplines,
                disciplineDistances,
                disciplinesLength: disciplines.length,
                hasDisciplineDistances: !!disciplineDistances,
                disciplineDistancesLength: disciplineDistances?.length
              })
              
              // Si hay disciplineDistances con múltiples elementos Y múltiples disciplinas/formatos diferentes,
              // mostrar cada uno en líneas separadas
              // Si hay múltiples disciplinas pero un solo elemento en disciplineDistances, significa que comparten las mismas distancias
              const hasMultipleDisciplines = disciplines.length > 1
              const hasMultipleDistances = disciplineDistances && disciplineDistances.length > 1
              
              // Solo mostrar en líneas separadas si hay múltiples elementos Y son realmente diferentes formatos/disciplinas
              // Si hay múltiples disciplinas pero un solo elemento, todas comparten las mismas distancias
              if (hasMultipleDistances && !(hasMultipleDisciplines && disciplineDistances.length === 1)) {
                // Múltiples formatos/disciplinas con distancias diferentes: mostrar cada una con sus distancias en líneas separadas
                return (
                  <>
                    {disciplineDistances.map((dd, idx) => (
                      <div key={idx} className="text-xs text-red-600 font-medium">
                        {dd.discipline}: {dd.distances.map(d => d.toString()).join(' & ')} km
                      </div>
                    ))}
                  </>
                )
              } else if (disciplineDistances && disciplineDistances.length === 1 && disciplineDistances[0].distances.length > 0) {
                // Un solo formato/disciplina con múltiples distancias
                const distances = disciplineDistances[0].distances
                return (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span className="text-xs text-red-600 font-medium">
                      {distances.join(' & ')} km
                    </span>
                  </div>
                )
              } else if (race.distance && disciplines.length === 1) {
                // Formato antiguo (una sola distancia y una sola disciplina)
                // NO mostrar race.distance si hay múltiples disciplinas
                return (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span className="text-xs text-red-600 font-medium">{race.distance} km</span>
                  </div>
                )
              }
              return null
            })()}
            {race.elevation && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className="text-xs text-red-600 font-medium">{race.elevation} m+</span>
              </div>
            )}
          </div>
        </div>

        {/* Modalidad */}
        {race.modalities && race.modalities.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Modalidad</div>
            <div className="text-sm text-gray-700 font-medium">
              {race.modalities.join(' & ')}
            </div>
          </div>
        )}

        {/* Descripción */}
        {race.description ? (
          <div className="mb-4">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {race.description}
            </p>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-sm text-gray-500 italic">
              No hay descripción disponible para esta carrera.
            </p>
          </div>
        )}

        {/* Etapas - Solo si el formato es "Por etapas" */}
        {race.format?.toLowerCase().includes('etapas') && race.stages && race.stages > 0 && (
          <div className="mb-6">
            {/* Solapas de Etapas */}
            <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
              {Array.from({ length: race.stages }, (_, i) => i + 1).map((stageNum) => (
                <button
                  key={stageNum}
                  onClick={() => setSelectedStage(stageNum)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedStage === stageNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {stageNum}
                </button>
              ))}
            </div>

            {/* Contenido de la Etapa Seleccionada */}
            <div className="bg-gray-50 rounded-xl p-4">
              {(() => {
                const stage = race.stageDetails?.[selectedStage - 1]

                return (
                  <>
                    <h3 className="text-base font-bold mb-3 text-gray-900">
                      {stage?.name || `Etapa ${selectedStage}`}
                    </h3>
                    
                    <div className="flex items-center justify-end mb-3">
                      <div className="flex items-center gap-4">
                        {stage?.distance ? (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <span className="text-xs text-red-600 font-medium">{stage.distance} km</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">Distancia: No especificada</span>
                        )}
                        {stage?.elevation ? (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            <span className="text-xs text-red-600 font-medium">{stage.elevation} m+</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">Altimetría: No especificada</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-700">
                      {stage?.startDate ? (
                        <div>
                          <span className="font-medium">Desde: </span>
                          <span>{stage.startDate}</span>
                        </div>
                      ) : (
                        <div>
                          <span className="font-medium">Desde: </span>
                          <span className="text-gray-500">No especificada</span>
                        </div>
                      )}
                      {stage?.endDate ? (
                        <div>
                          <span className="font-medium">Hasta: </span>
                          <span>{stage.endDate}</span>
                        </div>
                      ) : (
                        <div>
                          <span className="font-medium">Hasta: </span>
                          <span className="text-gray-500">No especificada</span>
                        </div>
                      )}
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        )}

        {/* Link de Registro */}
        {race.registrationUrl && (
          <div className="mb-6">
            <a 
              href={race.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium"
            >
              <span>Inscribite acá</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* Social Media y Contacto */}
      <div className="bg-gray-100 px-4 py-4">
        {/* Instagram */}
        <div className="flex items-center gap-3 mb-3">
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          {race.instagram ? (
            <a 
              href={`https://instagram.com/${race.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-700 hover:underline"
            >
              {race.instagram.startsWith('@') ? race.instagram : `@${race.instagram}`}
            </a>
          ) : (
            <span className="text-sm text-gray-400">Instagram no disponible</span>
          )}
        </div>

        {/* WhatsApp */}
        <div className="flex items-center gap-3 mb-3">
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          {race.contactPhone ? (
            <a 
              href={`https://wa.me/${race.contactPhone.replace(/[^\d]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-700 hover:underline"
            >
              {race.contactPhone}
            </a>
          ) : (
            <span className="text-sm text-gray-400">WhatsApp no disponible</span>
          )}
        </div>

        {/* Website */}
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          {race.website ? (
            <a 
              href={race.website.startsWith('http') ? race.website : `https://${race.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-700 hover:underline"
            >
              {race.website}
            </a>
          ) : (
            <span className="text-sm text-gray-400">Sitio web no disponible</span>
          )}
        </div>
      </div>
      </main>

      {/* Navegación Inferior */}
      <nav className="bg-gray-900 border-t border-gray-700 flex-shrink-0 px-4 py-2 z-10">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Link href="/races" className="flex flex-col items-center gap-1 py-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-blue-400">Carreras</span>
          </Link>

          <div className="flex flex-col items-center gap-1 py-2 opacity-50 cursor-not-allowed">
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-gray-300">Mi calendario</span>
          </div>

          <div className="flex flex-col items-center gap-1 py-2 opacity-50 cursor-not-allowed">
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs text-gray-300">Config</span>
          </div>
        </div>
      </nav>
    </div>
  )
}

