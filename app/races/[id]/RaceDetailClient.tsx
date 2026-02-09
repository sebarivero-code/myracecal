'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthButton from '@/app/components/AuthButton'
import HeaderLogo, { BRAND_ORANGE } from '@/app/components/HeaderLogo'
import { parseLocalDate } from '@/lib/date'

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
  campeonato?: string
}

export default function RaceDetailClient({ raceId, embedded, onClose, hideCloseButton }: { raceId: string; embedded?: boolean; onClose?: () => void; hideCloseButton?: boolean }) {
  const router = useRouter()
  const [race, setRace] = useState<Race | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStage, setSelectedStage] = useState(1)

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  useEffect(() => {
    const fetchRace = async () => {
      try {
        const response = await fetch(`/api/races/${raceId}`)
        if (!response.ok) {
          throw new Error('Carrera no encontrada')
        }
        const data = await response.json()
        setRace(data)
      } catch (error) {
        console.error('Error al cargar la carrera:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRace()
  }, [raceId])

  const formatDate = (dateString: string): string => {
    const date = parseLocalDate(dateString)
    if (isNaN(date.getTime())) return ''
    return date.getDate().toString()
  }

  const formatDateRange = (startDate: string, endDate?: string): string => {
    const start = parseLocalDate(startDate)
    if (isNaN(start.getTime())) return ''
    
    if (endDate) {
      const end = parseLocalDate(endDate)
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
    if (embedded) {
      return (
        <div className="flex flex-col flex-1 min-h-0">
          {onClose && !hideCloseButton && (
            <div className="flex-shrink-0 flex justify-end p-2 border-b border-gray-200 bg-white">
              <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Cerrar">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
          <div className="flex-1 flex items-center justify-center text-gray-500">Cargando carrera...</div>
        </div>
      )
    }
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Cargando carrera...</div>
      </div>
    )
  }

  if (!race) {
    if (embedded && onClose) {
      return (
        <div className="flex flex-col flex-1 min-h-0">
          {!hideCloseButton && (
            <div className="flex-shrink-0 flex justify-end p-2 border-b border-gray-200 bg-white">
              <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Cerrar">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-gray-500 mb-4">Carrera no encontrada</p>
            <button type="button" onClick={onClose} className="text-sm font-medium hover:underline" style={{ color: '#E85D04' }}>Cerrar</button>
          </div>
        </div>
      )
    }
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Carrera no encontrada</p>
          <Link href="/races" className="hover:underline" style={{ color: '#E85D04' }}>Volver al listado</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={embedded ? 'flex flex-col flex-1 min-h-0 overflow-hidden bg-white' : 'h-screen bg-white flex flex-col overflow-hidden'}>
      {!embedded && (
      <header className="bg-gray-900 border-b border-gray-700 flex-shrink-0 z-10 min-h-[73px]">
        <div className="px-4 py-1.5 flex items-center justify-between min-h-[73px] gap-2">
          <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-800 flex-shrink-0"
              aria-label="Volver"
            >
              <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <HeaderLogo showYear={false} className="min-w-0" />
          </div>
          
          <div className="flex items-center justify-end gap-2 flex-shrink-0">
            <span className="text-base font-bold italic whitespace-nowrap" style={{ color: BRAND_ORANGE }}>
              {new Date().getFullYear()}
            </span>
            <AuthButton />
          </div>
        </div>
      </header>
      )}
      {embedded && onClose && !hideCloseButton && (
        <div className="flex-shrink-0 flex justify-end p-2 border-b border-gray-200 bg-white">
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Cerrar">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
      {/* Contenido con scroll */}
      <main className="flex-1 overflow-y-auto bg-gray-100 min-h-0">
        <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
          {/* Subheader: ubicación + fecha — destacado con acento naranja */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-md">
            {!embedded && (
              <div className="px-4 py-3 text-white" style={{ backgroundColor: '#E85D04' }}>
                <h2 className="text-base font-bold leading-tight">{race.name}</h2>
              </div>
            )}
            <div
              className={`px-4 py-4 space-y-2.5 ${embedded ? '' : 'border-t border-gray-100'}`}
              style={{ borderLeft: '4px solid #E85D04', backgroundColor: 'rgba(232, 93, 4, 0.04)' }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-800 truncate">{race.city || race.location}</span>
                </div>
                <span className="text-sm text-gray-600 flex-shrink-0">{formatProvinceCountry()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">{formatDateRange(race.startDate, race.endDate)}</span>
                <button className="relative p-2 rounded-full hover:bg-white/60 transition-colors" aria-label="Guardar en mi calendario">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                  </svg>
                  <svg className="w-3 h-3 text-gray-600 absolute bottom-1 right-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </button>
              </div>
              {race.campeonato && (() => {
                const parts = race.campeonato.split(/\s*\/\s*/).map(p => p.trim()).filter(Boolean)
                const names = parts.map(p => {
                  const m = p.match(/^(.+?)\s*#\s*\d+\s*$/)
                  return m ? m[1].trim() : p
                })
                return (
                  <div className="pt-2 mt-2 border-t border-gray-200/80">
                    <div className="flex items-center gap-1 text-xs italic">
                      <span className="text-gray-600">Parte de</span>
                      <span className="flex items-center gap-1" style={{ color: '#d9732a' }}>
                        <svg className="w-4 h-4 flex-shrink-0 self-center" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H8v2h8v-2h-3v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
                        </svg>
                        <span className="flex flex-col leading-tight">
                          {names.map((name) => (
                            <span key={name}>{name}</span>
                          ))}
                        </span>
                      </span>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>

          {/* Caja: Formato y estadísticas */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" style={{ color: '#E85D04' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              {race.format && (!race.disciplineDistances || race.disciplineDistances.length <= 1) && (
                <>
                  {' | '}
                  {race.stages && race.stages > 1 
                    ? `${race.stages} etapas`
                    : race.format.replace(/\//g, ' & ')
                  }
                </>
              )}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {(() => {
              const disciplineDistances = race.disciplineDistances
              const disciplines = race.disciplines || [race.discipline].filter(Boolean)
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
                      <div key={idx} className="text-xs font-medium" style={{ color: '#E85D04' }}>
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
                    <svg className="w-4 h-4" style={{ color: '#E85D04' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span className="text-xs font-medium" style={{ color: '#E85D04' }}>{race.distance} km</span>
                  </div>
                )
              }
              return null
            })()}
            {race.elevation && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" style={{ color: '#E85D04' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className="text-xs font-medium" style={{ color: '#E85D04' }}>{race.elevation} m+</span>
              </div>
            )}
          </div>
        </div>
            {race.modalities && race.modalities.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">Modalidad: </span>
                <span className="text-sm text-gray-700 font-medium">{race.modalities.join(' & ')}</span>
              </div>
            )}
          </div>

          {/* Caja: Descripción (solo si hay texto) */}
          {race.description?.trim() && (
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-xs text-gray-500 mb-2">Descripción</div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {race.description.trim()}
              </p>
            </div>
          )}

          {/* Caja: Etapas - Solo si el formato es "Por etapas" */}
          {race.format?.toLowerCase().includes('etapas') && race.stages && race.stages > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            {/* Solapas de Etapas */}
            <div className="flex gap-2 overflow-x-auto px-4 pt-4 pb-2">
              {Array.from({ length: race.stages }, (_, i) => i + 1).map((stageNum) => (
                <button
                  key={stageNum}
                  onClick={() => setSelectedStage(stageNum)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedStage === stageNum
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={selectedStage === stageNum ? { backgroundColor: '#E85D04' } : {}}
                >
                  {stageNum}
                </button>
              ))}
            </div>

            {/* Contenido de la Etapa Seleccionada */}
            <div className="mx-4 mb-4 bg-gray-50 rounded-xl p-4">
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

        {/* Caja: Inscripción (destacada) */}
        {race.registrationUrl && (
          <a
            href={race.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl border-2 p-5 shadow-md transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
            style={{ borderColor: '#E85D04', backgroundColor: 'rgba(232, 93, 4, 0.08)' }}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ backgroundColor: '#E85D04' }}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Inscripción</div>
                <div className="text-base font-bold" style={{ color: '#E85D04' }}>Inscribite acá</div>
              </div>
              <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#E85D04' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </a>
        )}

        {/* Caja: Contacto y redes */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contacto y redes</div>
          {/* Instagram */}
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
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
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
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
            <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {race.website ? (
              <a 
                href={race.website.startsWith('http') ? race.website : `https://${race.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-700 hover:underline break-all"
              >
                {race.website}
              </a>
            ) : (
              <span className="text-sm text-gray-400">Sitio web no disponible</span>
            )}
          </div>
        </div>

        {/* Más carreras: enlaces internos por provincia, formato y disciplina (SEO y descubrimiento) */}
        {(() => {
          const disciplines = race.disciplines?.length ? race.disciplines : (race.discipline ? [race.discipline] : [])
          const firstDiscipline = disciplines[0]?.trim()
          const province = race.province?.trim()
          const country = race.country?.trim()
          const format = race.format?.trim()
          const links: { href: string; label: string }[] = []
          if (province) {
            links.push({ href: `/races?province=${encodeURIComponent(province)}`, label: `Carreras en ${province}` })
          }
          if (format) {
            links.push({
              href: country ? `/races?format=${encodeURIComponent(format)}&country=${encodeURIComponent(country)}` : `/races?format=${encodeURIComponent(format)}`,
              label: country ? `Carreras ${format} en ${country}` : `Carreras ${format}`,
            })
          }
          if (firstDiscipline) {
            links.push({ href: `/races?disciplina=${encodeURIComponent(firstDiscipline)}`, label: `Carreras de ${firstDiscipline}` })
            if (province) {
              links.push({
                href: `/races?disciplina=${encodeURIComponent(firstDiscipline)}&province=${encodeURIComponent(province)}`,
                label: `Carreras de ${firstDiscipline} en ${province}`,
              })
            }
          }
          if (links.length === 0) return null
          return (
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Más carreras</div>
              <ul className="flex flex-wrap gap-x-2 gap-y-1 items-center">
                {links.map(({ href, label }, i) => (
                  <li key={href} className="flex items-center gap-x-2">
                    <Link
                      href={href}
                      className="text-sm font-medium hover:underline"
                      style={{ color: '#E85D04' }}
                    >
                      {label}
                    </Link>
                    {i < links.length - 1 && <span className="text-gray-300">·</span>}
                  </li>
                ))}
              </ul>
            </div>
          )
        })()}
      </div>
      </main>

      {!embedded && (
      <nav className="bg-gray-900 border-t border-gray-700 flex-shrink-0 px-4 py-2 z-10">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Link href="/races" className="flex flex-col items-center gap-1 py-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E85D04' }}>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
              </svg>
            </div>
            <span className="text-xs font-medium" style={{ color: '#E85D04' }}>Carreras</span>
          </Link>

          <div className="flex flex-col items-center gap-1 py-2 opacity-50 cursor-not-allowed">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-gray-500">Mi calendario</span>
          </div>

          <div className="flex flex-col items-center gap-1 py-2 opacity-50 cursor-not-allowed">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs text-gray-500">Config</span>
          </div>
        </div>
      </nav>
      )}
    </div>
  )
}

