'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Race {
  id: number
  name: string
  location: string
  city?: string
  province?: string
  country?: string
  discipline: string
  disciplines?: string[]
  format?: string
  formats?: string[]
  modality?: string
  modalities?: string[]
  startDate: string
  endDate?: string
  distance?: number
  elevation?: number
  stages?: number
  days?: number
  registrationUrl?: string
  contactPhone?: string
  website?: string
  instagram?: string
}

interface FilterState {
  selectedCountry: string | null // Solo un país
  selectedProvinces: string[]
  selectedDiscipline: string | null // Solo una disciplina
  selectedFormats: string[]
  selectedModalities: string[]
}

export default function FiltersPage() {
  const router = useRouter()
  const [races, setRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedSection, setExpandedSection] = useState<string | null>('ubicacion')
  
  const [filters, setFilters] = useState<FilterState>({
    selectedCountry: null,
    selectedProvinces: [],
    selectedDiscipline: null,
    selectedFormats: [],
    selectedModalities: []
  })

  // Obtener valores únicos de la planilla
  const uniqueCountries = useMemo(() => {
    const countries = new Set<string>()
    races.forEach(race => {
      if (race.country) countries.add(race.country)
    })
    return Array.from(countries).sort()
  }, [races])

  const uniqueProvinces = useMemo(() => {
    if (!filters.selectedCountry) return []
    const provinces = new Set<string>()
    races.forEach(race => {
      if (race.province && race.country === filters.selectedCountry) {
        provinces.add(race.province)
      }
    })
    return Array.from(provinces).sort()
  }, [races, filters.selectedCountry])

  const uniqueDisciplines = useMemo(() => {
    const disciplines = new Set<string>()
    races.forEach(race => {
      // Usar el array de disciplinas parseadas si existe, sino usar el campo discipline original
      if (race.disciplines && race.disciplines.length > 0) {
        race.disciplines.forEach(d => {
          if (d.trim()) disciplines.add(d.trim())
        })
      } else if (race.discipline) {
        // Si no hay array parseado, intentar parsear el campo discipline
        const parsed = race.discipline.split('/').map(d => d.trim()).filter(Boolean)
        parsed.forEach(d => disciplines.add(d))
      }
    })
    return Array.from(disciplines).sort()
  }, [races])

  const uniqueFormats = useMemo(() => {
    if (!filters.selectedDiscipline) return []
    const selectedDiscipline = filters.selectedDiscipline
    const formats = new Set<string>()
    races.forEach(race => {
      // Verificar si la disciplina seleccionada está en el array de disciplinas de la carrera
      const raceDisciplines = race.disciplines || (race.discipline ? race.discipline.split('/').map(d => d.trim()).filter(Boolean) : [])
      if (raceDisciplines.includes(selectedDiscipline)) {
        // Si hay formatos parseados, usar esos, sino usar el campo format original
        if (race.formats && race.formats.length > 0) {
          race.formats.forEach(f => {
            if (f.trim()) formats.add(f.trim())
          })
        } else if (race.format) {
          // Si no hay array parseado, intentar parsear el campo format
          const parsed = race.format.split('/').map(f => f.trim()).filter(Boolean)
          parsed.forEach(f => formats.add(f))
        }
      }
    })
    return Array.from(formats).sort()
  }, [races, filters.selectedDiscipline])

  const uniqueModalities = useMemo(() => {
    const modalities = new Set<string>()
    races.forEach(race => {
      // Si hay múltiples modalidades, agregar cada una
      if (race.modalities && race.modalities.length > 0) {
        race.modalities.forEach(mod => modalities.add(mod))
      } else if (race.modality) {
        // Fallback a modality si no hay modalities
        modalities.add(race.modality)
      }
    })
    return Array.from(modalities).sort()
  }, [races])

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await fetch('/api/races')
        if (!response.ok) throw new Error('Error al cargar carreras')
        const data = await response.json()
        setRaces(data)
      } catch (error) {
        console.error('Error al cargar carreras:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRaces()
    
    // Cargar filtros guardados si existen
    const savedFilters = sessionStorage.getItem('raceFilters')
    if (savedFilters) {
      try {
        const saved = JSON.parse(savedFilters)
        setFilters(saved)
      } catch (error) {
        console.error('Error al cargar filtros guardados:', error)
      }
    }
  }, [])

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  // Ubicación
  const handleSelectCountry = (country: string | null) => {
    setFilters(prev => ({
      ...prev,
      selectedCountry: country,
      selectedProvinces: [] // Limpiar provincias al cambiar país
    }))
  }

  const handleToggleAllProvinces = () => {
    // "Todas las provincias" significa que no hay provincias seleccionadas (todas están incluidas)
    setFilters(prev => ({
      ...prev,
      selectedProvinces: []
    }))
  }

  const handleToggleProvince = (province: string) => {
    setFilters(prev => {
      const isSelected = prev.selectedProvinces.includes(province)
      if (isSelected) {
        return {
          ...prev,
          selectedProvinces: prev.selectedProvinces.filter(p => p !== province)
        }
      } else {
        // Al seleccionar una provincia específica, deseleccionar "Todas las provincias"
        return {
          ...prev,
          selectedProvinces: [...prev.selectedProvinces, province]
        }
      }
    })
  }

  // Disciplina
  const handleSelectDiscipline = (discipline: string | null) => {
    setFilters(prev => ({
      ...prev,
      selectedDiscipline: discipline,
      selectedFormats: [] // Limpiar formatos al cambiar disciplina
    }))
  }

  const handleToggleAllFormats = () => {
    // "Todos los formatos" significa que no hay formatos seleccionados
    setFilters(prev => ({
      ...prev,
      selectedFormats: []
    }))
  }

  const handleToggleFormat = (format: string) => {
    setFilters(prev => {
      const isSelected = prev.selectedFormats.includes(format)
      if (isSelected) {
        return {
          ...prev,
          selectedFormats: prev.selectedFormats.filter(f => f !== format)
        }
      } else {
        // Al seleccionar un formato específico, deseleccionar "Todos los formatos"
        return {
          ...prev,
          selectedFormats: [...prev.selectedFormats, format]
        }
      }
    })
  }

  // Modalidad
  const handleToggleAllModalities = () => {
    // "Todas las modalidades" significa que no hay modalidades seleccionadas
    setFilters(prev => ({
      ...prev,
      selectedModalities: []
    }))
  }

  const handleToggleModality = (modality: string) => {
    setFilters(prev => {
      const isSelected = prev.selectedModalities.includes(modality)
      if (isSelected) {
        return {
          ...prev,
          selectedModalities: prev.selectedModalities.filter(m => m !== modality)
        }
      } else {
        // Al seleccionar una modalidad específica, deseleccionar "Todas las modalidades"
        return {
          ...prev,
          selectedModalities: [...prev.selectedModalities, modality]
        }
      }
    })
  }

  const handleApplyFilters = () => {
    // Guardar filtros en sessionStorage
    sessionStorage.setItem('raceFilters', JSON.stringify(filters))
    router.push('/races')
  }

  const isAllCountriesSelected = filters.selectedCountry === null
  const isAllProvincesSelected = filters.selectedProvinces.length === 0 && filters.selectedCountry !== null
  const isAllDisciplinesSelected = filters.selectedDiscipline === null
  const isAllFormatsSelected = filters.selectedFormats.length === 0 && filters.selectedDiscipline !== null
  const isAllModalitiesSelected = filters.selectedModalities.length === 0

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Cargando filtros...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700">
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
            <button className="p-2 rounded-full hover:bg-gray-800">
              <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
          
          <div className="text-center">
            <h1 className="text-base font-semibold text-white">MyRaceCal.net</h1>
          </div>
          
          <div className="w-20"></div>
        </div>
      </header>

      {/* Filtros */}
      <main className="px-4 py-4 pb-4">
        {/* Ubicación */}
        <div className="mb-4">
          <div className={`w-full ${expandedSection === 'ubicacion' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-600'} overflow-hidden ${expandedSection === 'ubicacion' ? 'rounded-t-xl' : 'rounded-xl'}`}>
            <button
              onClick={() => toggleSection('ubicacion')}
              className="w-full px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span className="font-semibold">Ubicación</span>
              </div>
              <svg 
                className={`w-5 h-5 transition-transform ${expandedSection === 'ubicacion' ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSection !== 'ubicacion' && (
              <div className="bg-blue-50 px-4 py-2 text-sm text-gray-700">
                {filters.selectedCountry ? (
                  <span>
                    {filters.selectedCountry}
                    {filters.selectedProvinces.length > 0 && ` | ${filters.selectedProvinces.join(', ')}`}
                  </span>
                ) : (
                  <span>Todas</span>
                )}
              </div>
            )}
          </div>
          
          {expandedSection === 'ubicacion' && (
            <div className="bg-white border-x border-b border-gray-200 rounded-b-xl overflow-hidden">
              <div className="bg-blue-50 px-4 py-2 grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="country"
                    checked={isAllCountriesSelected}
                    onChange={() => handleSelectCountry(null)}
                    className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Todos los países</span>
                </label>
                {filters.selectedCountry !== null && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAllProvincesSelected}
                      onChange={handleToggleAllProvinces}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Todas las provincias</span>
                  </label>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 p-4">
                {/* Países */}
                <div>
                  <div className="space-y-2">
                    {uniqueCountries.map(country => (
                      <label key={country} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="country"
                          checked={filters.selectedCountry === country}
                          onChange={() => handleSelectCountry(country)}
                          className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{country}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Provincias */}
                {filters.selectedCountry !== null && (
                  <div>
                    <div className="space-y-2">
                      {uniqueProvinces.map(province => (
                        <label key={province} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.selectedProvinces.includes(province)}
                            onChange={() => handleToggleProvince(province)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm">{province}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Disciplina */}
        <div className="mb-4">
          <div className={`w-full ${expandedSection === 'disciplina' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-600'} overflow-hidden ${expandedSection === 'disciplina' ? 'rounded-t-xl' : 'rounded-xl'}`}>
            <button
              onClick={() => toggleSection('disciplina')}
              className="w-full px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="5.5" cy="17.5" r="3.5"/>
                  <circle cx="18.5" cy="17.5" r="3.5"/>
                  <path d="M15 6a6 6 0 0 0-6 6v7.5M9 6a6 6 0 0 1 6 6v7.5"/>
                  <path d="M9 6h6M9 12h6"/>
                </svg>
                <span className="font-semibold">Disciplina</span>
              </div>
              <svg 
                className={`w-5 h-5 transition-transform ${expandedSection === 'disciplina' ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSection !== 'disciplina' && (
              <div className="bg-blue-50 px-4 py-2 text-sm text-gray-700">
                {filters.selectedDiscipline ? (
                  <span>
                    {filters.selectedDiscipline}
                    {filters.selectedFormats.length > 0 && ` | ${filters.selectedFormats.join(', ')}`}
                  </span>
                ) : (
                  <span>Todas</span>
                )}
              </div>
            )}
          </div>
          
          {expandedSection === 'disciplina' && (
            <div className="bg-white border-x border-b border-gray-200 rounded-b-xl overflow-hidden">
              <div className="bg-blue-50 px-4 py-2 grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="discipline"
                    checked={isAllDisciplinesSelected}
                    onChange={() => handleSelectDiscipline(null)}
                    className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Todas las disciplinas</span>
                </label>
                {filters.selectedDiscipline !== null && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAllFormatsSelected}
                      onChange={handleToggleAllFormats}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Todos los formatos</span>
                  </label>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 p-4">
                {/* Disciplinas */}
                <div>
                  <div className="space-y-2">
                    {uniqueDisciplines.map(discipline => (
                      <label key={discipline} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="discipline"
                          checked={filters.selectedDiscipline === discipline}
                          onChange={() => handleSelectDiscipline(discipline)}
                          className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{discipline}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Formatos */}
                {filters.selectedDiscipline !== null && (
                  <div>
                    <div className="space-y-2">
                      {uniqueFormats.map(format => (
                        <label key={format} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.selectedFormats.includes(format)}
                            onChange={() => handleToggleFormat(format)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm">{format}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modalidad */}
        <div className="mb-4">
          <div className={`w-full ${expandedSection === 'modalidad' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-600'} overflow-hidden ${expandedSection === 'modalidad' ? 'rounded-t-xl' : 'rounded-xl'}`}>
            <button
              onClick={() => toggleSection('modalidad')}
              className="w-full px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-semibold">Modalidad</span>
              </div>
              <svg 
                className={`w-5 h-5 transition-transform ${expandedSection === 'modalidad' ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSection !== 'modalidad' && (
              <div className="bg-blue-50 px-4 py-2 text-sm text-gray-700">
                {filters.selectedModalities.length > 0 ? (
                  <span>{filters.selectedModalities.join(', ')}</span>
                ) : (
                  <span>Todas</span>
                )}
              </div>
            )}
          </div>
          
          {expandedSection === 'modalidad' && (
            <div className="bg-white border-x border-b border-gray-200 rounded-b-xl overflow-hidden">
              <div className="bg-blue-50 px-4 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAllModalitiesSelected}
                    onChange={handleToggleAllModalities}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Todas las modalidades</span>
                </label>
              </div>
              
              <div className="p-4">
                <div className="space-y-2">
                  {uniqueModalities.map(modality => (
                    <label key={modality} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.selectedModalities.includes(modality)}
                        onChange={() => handleToggleModality(modality)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{modality}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Botón Aplicar - Flotante */}
      <button
        onClick={handleApplyFilters}
        className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50 hover:scale-110 active:scale-95"
        aria-label="Aplicar filtros"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </button>

      {/* Navegación Inferior */}
      <nav className="bg-gray-900 border-t border-gray-700 px-4 py-2">
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

