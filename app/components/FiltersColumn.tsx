'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'

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
  selectedCountry: string | null
  selectedProvinces: string[]
  selectedDiscipline: string | null
  selectedFormats: string[]
  selectedModalities: string[]
}

interface FiltersColumnProps {
  races: Race[]
  onFiltersChange?: (filters: FilterState) => void
  compact?: boolean // Para la versión columna en desktop
  viewMode?: 'week' | 'month'
  onViewModeChange?: (mode: 'week' | 'month') => void
  showPastRaces?: boolean
  onShowPastRacesChange?: (show: boolean) => void
}

export default function FiltersColumn({ races, onFiltersChange, compact = false, viewMode = 'month', onViewModeChange, showPastRaces = false, onShowPastRacesChange }: FiltersColumnProps) {
  const router = useRouter()
  const [expandedSection, setExpandedSection] = useState<string | null>(compact ? null : 'ubicacion')
  
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
      if (race.disciplines && race.disciplines.length > 0) {
        race.disciplines.forEach(d => {
          if (d.trim()) disciplines.add(d.trim())
        })
      } else if (race.discipline) {
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
      const raceDisciplines = race.disciplines || (race.discipline ? race.discipline.split('/').map(d => d.trim()).filter(Boolean) : [])
      if (raceDisciplines.includes(selectedDiscipline)) {
        if (race.formats && race.formats.length > 0) {
          race.formats.forEach(f => {
            if (f.trim()) formats.add(f.trim())
          })
        } else if (race.format) {
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
      if (race.modalities && race.modalities.length > 0) {
        race.modalities.forEach(mod => modalities.add(mod))
      } else if (race.modality) {
        modalities.add(race.modality)
      }
    })
    return Array.from(modalities).sort()
  }, [races])

  // Cargar filtros guardados solo una vez al montar
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      const savedFilters = sessionStorage.getItem('raceFilters')
      if (savedFilters) {
        const saved = JSON.parse(savedFilters)
        setFilters(saved)
      }
    } catch (error) {
      console.error('Error al cargar filtros guardados:', error)
    }
  }, [])

  // NO usar useEffect para guardar - solo guardar cuando el usuario interactúa

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  // Ubicación
  const handleSelectCountry = (country: string | null) => {
    const newFilters = {
      ...filters,
      selectedCountry: country,
      selectedProvinces: []
    }
    setFilters(newFilters)
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('raceFilters', JSON.stringify(newFilters))
      } catch (error) {
        console.error('Error al guardar filtros:', error)
      }
    }
    if (onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }

  const handleToggleAllProvinces = () => {
    const newFilters = {
      ...filters,
      selectedProvinces: []
    }
    setFilters(newFilters)
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('raceFilters', JSON.stringify(newFilters))
      } catch (error) {
        console.error('Error al guardar filtros:', error)
      }
    }
    if (onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }

  const handleToggleProvince = (province: string) => {
    const isSelected = filters.selectedProvinces.includes(province)
    const newFilters = {
      ...filters,
      selectedProvinces: isSelected
        ? filters.selectedProvinces.filter(p => p !== province)
        : [...filters.selectedProvinces, province]
    }
    setFilters(newFilters)
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('raceFilters', JSON.stringify(newFilters))
      } catch (error) {
        console.error('Error al guardar filtros:', error)
      }
    }
    if (onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }

  // Disciplina
  const handleSelectDiscipline = (discipline: string | null) => {
    const newFilters = {
      ...filters,
      selectedDiscipline: discipline,
      selectedFormats: []
    }
    setFilters(newFilters)
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('raceFilters', JSON.stringify(newFilters))
      } catch (error) {
        console.error('Error al guardar filtros:', error)
      }
    }
    if (onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }

  const handleToggleAllFormats = () => {
    const newFilters = {
      ...filters,
      selectedFormats: []
    }
    setFilters(newFilters)
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('raceFilters', JSON.stringify(newFilters))
      } catch (error) {
        console.error('Error al guardar filtros:', error)
      }
    }
    if (onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }

  const handleToggleFormat = (format: string) => {
    const isSelected = filters.selectedFormats.includes(format)
    const newFilters = {
      ...filters,
      selectedFormats: isSelected
        ? filters.selectedFormats.filter(f => f !== format)
        : [...filters.selectedFormats, format]
    }
    setFilters(newFilters)
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('raceFilters', JSON.stringify(newFilters))
      } catch (error) {
        console.error('Error al guardar filtros:', error)
      }
    }
    if (onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }

  // Modalidad
  const handleToggleAllModalities = () => {
    const newFilters = {
      ...filters,
      selectedModalities: []
    }
    setFilters(newFilters)
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('raceFilters', JSON.stringify(newFilters))
      } catch (error) {
        console.error('Error al guardar filtros:', error)
      }
    }
    if (onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }

  const handleToggleModality = (modality: string) => {
    const isSelected = filters.selectedModalities.includes(modality)
    const newFilters = {
      ...filters,
      selectedModalities: isSelected
        ? filters.selectedModalities.filter(m => m !== modality)
        : [...filters.selectedModalities, modality]
    }
    setFilters(newFilters)
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('raceFilters', JSON.stringify(newFilters))
      } catch (error) {
        console.error('Error al guardar filtros:', error)
      }
    }
    if (onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }

  const handleApplyFilters = () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('raceFilters', JSON.stringify(filters))
      } catch (error) {
        console.error('Error al guardar filtros:', error)
      }
    }
    if (onFiltersChange) {
      onFiltersChange(filters)
    }
    if (!compact) {
      router.push('/races')
    }
  }

  const isAllCountriesSelected = filters.selectedCountry === null
  const isAllProvincesSelected = filters.selectedProvinces.length === 0 && filters.selectedCountry !== null
  const isAllDisciplinesSelected = filters.selectedDiscipline === null
  const isAllFormatsSelected = filters.selectedFormats.length === 0 && filters.selectedDiscipline !== null
  const isAllModalitiesSelected = filters.selectedModalities.length === 0

  return (
    <div className={`${compact ? 'lg:block hidden' : ''} ${compact ? 'bg-gray-100' : 'bg-white'} ${compact ? 'w-80 border-r border-gray-300 flex-shrink-0' : 'min-h-screen'}`}>
      {compact ? (
        <div className="h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4">
            {/* Toggle para mostrar/ocultar carreras pasadas */}
            {onShowPastRacesChange && (
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {showPastRaces ? 'Carreras previas visibles' : 'Carreras previas ocultas'}
                </span>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    // Limpiar posición guardada para evitar que se restaure
                    if (typeof window !== 'undefined') {
                      sessionStorage.removeItem('racesListScrollPosition')
                    }
                    onShowPastRacesChange(!showPastRaces)
                    // Usar requestAnimationFrame para asegurar que el scroll se ejecute después del render
                    requestAnimationFrame(() => {
                      requestAnimationFrame(() => {
                        if (typeof window !== 'undefined') {
                          window.scrollTo({ top: 0, behavior: 'auto' })
                        }
                      })
                    })
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  {showPastRaces ? 'Ocultar' : 'Mostrar'}
                </a>
              </div>
            )}
            {/* Selector de Vista - Solo en desktop */}
            {onViewModeChange && (
              <div className="mb-4 flex items-center gap-2">
                <button
                  onClick={() => {
                    // Limpiar posición guardada para evitar que se restaure
                    if (typeof window !== 'undefined') {
                      sessionStorage.removeItem('racesListScrollPosition')
                    }
                    onViewModeChange('month')
                    // Usar requestAnimationFrame para asegurar que el scroll se ejecute después del render
                    requestAnimationFrame(() => {
                      requestAnimationFrame(() => {
                        if (typeof window !== 'undefined') {
                          window.scrollTo({ top: 0, behavior: 'auto' })
                        }
                      })
                    })
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'month'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Por Mes
                </button>
                <button
                  onClick={() => {
                    // Limpiar posición guardada para evitar que se restaure
                    if (typeof window !== 'undefined') {
                      sessionStorage.removeItem('racesListScrollPosition')
                    }
                    onViewModeChange('week')
                    // Usar requestAnimationFrame para asegurar que el scroll se ejecute después del render
                    requestAnimationFrame(() => {
                      requestAnimationFrame(() => {
                        if (typeof window !== 'undefined') {
                          window.scrollTo({ top: 0, behavior: 'auto' })
                        }
                      })
                    })
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'week'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Por Semana
                </button>
              </div>
            )}
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
          </div>
        </div>
      ) : (
        <>
          {/* Header removido - La página de filtros ya tiene su propio header */}

          <div className="px-4 py-4 pb-4">
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

            <button
              onClick={handleApplyFilters}
              className="fixed bottom-20 lg:bottom-8 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50 hover:scale-110 active:scale-95"
              aria-label="Aplicar filtros"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
