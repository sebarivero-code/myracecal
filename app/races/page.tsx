'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'

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
  days?: number
  registrationUrl?: string
  contactPhone?: string
  website?: string
  instagram?: string
}

interface WeekGroup {
  week: number
  startDate: Date
  endDate: Date
  races: Race[]
}

export default function RaceListPage() {
  const [races, setRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [sliderValue, setSliderValue] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mainScrollRef = useRef<HTMLDivElement>(null)
  const [appliedFilters, setAppliedFilters] = useState<{
    selectedCountry: string | null
    selectedProvinces: string[]
    selectedDiscipline: string | null
    selectedFormats: string[]
    selectedModalities: string[]
  } | null>(null)
  const weekRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const userSelectedMonth = useRef<number | null>(null)
  const scrollTargetPosition = useRef<number | null>(null)
  const isSliderDragging = useRef(false)
  const scrollPositions = useRef<number[]>([])
  const sliderSteps = useRef(52) // Número de porciones (52 semanas del año)
  const currentSection = useRef(-1)

  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  // Función para normalizar texto removiendo tildes
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  const getWeekGroups = (): WeekGroup[] => {
    const filteredRaces = races.filter(race => {
      if (!race.startDate) return false
      const raceDate = new Date(race.startDate)
      if (isNaN(raceDate.getTime())) return false
      
      // Filtrar por año
      if (raceDate.getFullYear() !== selectedYear) return false
      
      // Filtrar por búsqueda si hay query
      if (searchQuery.trim()) {
        const raceName = race.name || ''
        const normalizedRaceName = normalizeText(raceName)
        const normalizedQuery = normalizeText(searchQuery.trim())
        if (!normalizedRaceName.includes(normalizedQuery)) return false
      }
      
      // Filtrar por filtros aplicados
      if (appliedFilters) {
        // Filtro por país
        if (appliedFilters.selectedCountry !== null) {
          if (!race.country || race.country !== appliedFilters.selectedCountry) {
            return false
          }
        }
        
        // Filtro por provincia
        if (appliedFilters.selectedProvinces.length > 0) {
          if (!race.province || !appliedFilters.selectedProvinces.includes(race.province)) {
            return false
          }
        }
        
        // Filtro por disciplina - debe matchear con cualquier disciplina de la carrera
        if (appliedFilters.selectedDiscipline !== null) {
          const raceDisciplines = race.disciplines || [race.discipline].filter(Boolean)
          if (!raceDisciplines.includes(appliedFilters.selectedDiscipline)) {
            return false
          }
        }
        
        // Filtro por formato
        if (appliedFilters.selectedFormats.length > 0) {
          if (!race.format || !appliedFilters.selectedFormats.includes(race.format)) {
            return false
          }
        }
        
        // Filtro por modalidad - debe matchear con cualquier modalidad de la carrera
        if (appliedFilters.selectedModalities.length > 0) {
          const raceModalities = race.modalities || (race.modality ? [race.modality] : [])
          const hasMatchingModality = raceModalities.some(mod => 
            appliedFilters.selectedModalities.includes(mod)
          )
          if (!hasMatchingModality) {
            return false
          }
        }
      }
      
      return true
    })

    // Calcular el primer lunes del año
    const jan1 = new Date(selectedYear, 0, 1)
    const jan1Day = jan1.getDay()
    const daysToMonday = jan1Day === 0 ? 6 : jan1Day - 1
    const firstMonday = new Date(jan1)
    firstMonday.setDate(1 - daysToMonday)

    // Crear mapa de carreras por semana
    const weekMap = new Map<number, Race[]>()
    filteredRaces.forEach(race => {
      const date = new Date(race.startDate)
      const week = getWeekOfYear(date)
      
      if (!weekMap.has(week)) {
        weekMap.set(week, [])
      }
      weekMap.get(week)!.push(race)
    })

    // Detectar si hay algún filtro activo (búsqueda o filtros aplicados)
    const hasSearchFilter = searchQuery.trim().length > 0
    const hasAppliedFilters = appliedFilters && (
      appliedFilters.selectedCountry !== null ||
      appliedFilters.selectedProvinces.length > 0 ||
      appliedFilters.selectedDiscipline !== null ||
      appliedFilters.selectedFormats.length > 0 ||
      appliedFilters.selectedModalities.length > 0
    )
    const hasAnyFilter = hasSearchFilter || hasAppliedFilters
    
    if (hasAnyFilter) {
      // Solo mostrar semanas que tienen carreras filtradas
      const groups: WeekGroup[] = []
      weekMap.forEach((weekRaces, weekNum) => {
        if (weekRaces.length > 0) {
          // Calcular las fechas de la semana basándonos en la primera carrera
          const firstRace = weekRaces[0]
          const raceDate = new Date(firstRace.startDate)
          const monday = getMondayOfWeek(raceDate)
          const sunday = new Date(monday)
          sunday.setDate(monday.getDate() + 6)
          
          const sortedRaces = weekRaces.sort((a, b) => 
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          )
          
          groups.push({ week: weekNum, startDate: monday, endDate: sunday, races: sortedRaces })
        }
      })
      
      // Ordenar por fecha de inicio
      groups.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      
      return groups
    }
    
    // Generar todas las semanas del año (sin filtro)
    const groups: WeekGroup[] = []
    let week = 1
    let currentMonday = new Date(firstMonday)
    const yearStart = new Date(selectedYear, 0, 1)
    const yearEnd = new Date(selectedYear, 11, 31)
    
    // Continuar hasta que el lunes sea del año siguiente
    while (currentMonday.getFullYear() <= selectedYear + 1) {
      const monday = new Date(currentMonday)
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)
      
      // Incluir semanas que tengan al menos un día del año seleccionado
      // (el lunes debe ser <= 31 dic del año, o el domingo debe ser >= 1 ene del año)
      if (monday <= yearEnd && sunday >= yearStart) {
        // Nota: El primer lunes puede ser del año anterior (ej: 29 dic 2025 para 2026)
        // En ese caso, getWeekOfYear devolverá la semana del año anterior, lo cual es correcto
        // Usamos el número de semana secuencial (week) para la generación de grupos
        
        const weekRaces = weekMap.get(week) || []
        const sortedRaces = weekRaces.sort((a, b) => 
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        )
        
        groups.push({ week, startDate: monday, endDate: sunday, races: sortedRaces })
      }
      
      // Avanzar a la siguiente semana
      currentMonday.setDate(currentMonday.getDate() + 7)
      week++
      
      // Limitar a 53 semanas máximo para evitar loops infinitos
      if (week > 53) break
    }

    return groups
  }

  const getMondayOfWeek = (date: Date): Date => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  const getWeekOfYear = (date: Date): number => {
    const d = new Date(date)
    const year = d.getFullYear()
    
    const jan1 = new Date(year, 0, 1)
    const jan1Day = jan1.getDay()
    const firstMonday = new Date(jan1)
    
    const daysToMonday = jan1Day === 0 ? 6 : jan1Day - 1
    firstMonday.setDate(1 - daysToMonday)
    
    const diffTime = d.getTime() - firstMonday.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return 0
    }
    
    return Math.floor(diffDays / 7) + 1
  }

  const weekGroups = useMemo(() => getWeekGroups(), [races, selectedYear, searchQuery, appliedFilters])

  // Calcular el porcentaje del año que ha pasado hasta hoy
  const getYearProgress = useMemo(() => {
    const today = new Date()
    const currentYear = today.getFullYear()
    
    // Si el año seleccionado es futuro, todo es azul (100% progreso = todo azul)
    if (selectedYear > currentYear) {
      return 0 // 0% gris, 100% azul
    }
    
    // Si el año seleccionado es pasado, todo es gris (100% progreso = todo gris)
    if (selectedYear < currentYear) {
      return 100 // 100% gris, 0% azul
    }
    
    // Si es el año actual, calcular el progreso real
    const startOfYear = new Date(selectedYear, 0, 1)
    const endOfYear = new Date(selectedYear, 11, 31)
    const totalDays = Math.ceil((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const daysPassed = Math.ceil((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const progress = Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100)
    return progress
  }, [selectedYear])

  useEffect(() => {
    fetchRaces()
    
    // Cargar filtros aplicados desde sessionStorage
    const savedFilters = sessionStorage.getItem('raceFilters')
    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters)
        setAppliedFilters(filters)
      } catch (error) {
        console.error('Error al cargar filtros:', error)
      }
    }
  }, [])

  // Restaurar estado de búsqueda al cargar la página
  useEffect(() => {
    if (!loading && races.length > 0) {
      const savedSearchQuery = sessionStorage.getItem('racesListSearchQuery')
      const savedIsSearching = sessionStorage.getItem('racesListIsSearching')
      
      if (savedSearchQuery !== null) {
        setSearchQuery(savedSearchQuery)
      }
      
      if (savedIsSearching === 'true') {
        setIsSearching(true)
      }
    }
  }, [loading, races.length])

  // Enfocar el input cuando se activa la búsqueda
  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearching])

  // Restaurar posición de scroll al cargar la página, o posicionar en la semana actual
  useEffect(() => {
    if (!loading && races.length > 0 && weekGroups.length > 0) {
      const savedScrollPosition = sessionStorage.getItem('racesListScrollPosition')
      if (savedScrollPosition) {
        const scrollY = parseInt(savedScrollPosition, 10)
        // Esperar a que el DOM se renderice completamente
        const restoreScroll = () => {
          const scrollContainer = mainScrollRef.current
          if (scrollContainer) {
            scrollContainer.scrollTo(0, scrollY)
            sessionStorage.removeItem('racesListScrollPosition')
          }
        }
        
        // Intentar restaurar inmediatamente
        restoreScroll()
        
        // También intentar después de un pequeño delay por si acaso
        setTimeout(restoreScroll, 100)
        setTimeout(restoreScroll, 300)
      } else {
        // No hay posición guardada: posicionar en la semana actual o primera semana
        const today = new Date()
        const currentYear = today.getFullYear()
        
        let targetWeek: number | null = null
        
        if (selectedYear === currentYear) {
          // Si el año seleccionado es el año actual, posicionar en la semana actual
          targetWeek = getWeekOfYear(today)
        } else {
          // Si el año seleccionado es diferente al año actual, posicionar en la primera semana
          targetWeek = 1
        }
        
        if (targetWeek && weekGroups.length > 0) {
          const targetWeekGroup = weekGroups.find(group => group.week === targetWeek)
          
          if (targetWeekGroup) {
            const scrollToTargetWeek = () => {
              const scrollContainer = mainScrollRef.current
              const weekElement = weekRefs.current.get(targetWeek!)
              
              if (scrollContainer && weekElement) {
                const headerElement = document.querySelector('header')
                const filterHeaderElement = scrollContainer.parentElement?.querySelector('div.bg-white.border-b') as HTMLElement
                
                const headerOffset = headerElement && filterHeaderElement
                  ? filterHeaderElement.getBoundingClientRect().bottom - headerElement.getBoundingClientRect().top
                  : 165
                
                const containerRect = scrollContainer.getBoundingClientRect()
                const elementRect = weekElement.getBoundingClientRect()
                const elementTop = elementRect.top - containerRect.top + scrollContainer.scrollTop
                const targetPosition = Math.max(0, elementTop - headerOffset)
                
                scrollContainer.scrollTop = targetPosition
              }
            }
            
            setTimeout(scrollToTargetWeek, 200)
            setTimeout(scrollToTargetWeek, 500)
          }
        }
      }
      
      // Limpiar el estado de búsqueda guardado después de restaurarlo
      sessionStorage.removeItem('racesListSearchQuery')
      sessionStorage.removeItem('racesListIsSearching')
    }
  }, [loading, races.length, weekGroups.length, selectedYear])

  useEffect(() => {
    // Calcular posiciones de scroll al cargar las semanas
    if (weekGroups.length === 0) return
    
    let scrollHandler: (() => void) | null = null
    
    const calculatePositions = () => {
      const positions: number[] = []
      const headerOffset = 165
      
      // Calcular la posición de scroll de cada semana
      const scrollContainer = mainScrollRef.current
      if (!scrollContainer) {
        setTimeout(calculatePositions, 100)
        return
      }
      
      weekGroups.forEach((group) => {
        const weekElement = weekRefs.current.get(group.week)
        if (weekElement && scrollContainer) {
          const containerRect = scrollContainer.getBoundingClientRect()
          const elementRect = weekElement.getBoundingClientRect()
          const elementTop = elementRect.top - containerRect.top + scrollContainer.scrollTop
          positions.push(elementTop - headerOffset)
        }
      })
      
      // Si no hay posiciones, reintentar después
      if (positions.length === 0) {
        setTimeout(calculatePositions, 100)
        return
      }
      
      // Usar el número de semanas como número de pasos
      const steps = Math.max(weekGroups.length, 1)
      sliderSteps.current = steps
      
      // Dividir en N porciones iguales basándome en la primera y última posición
      const firstPosition = Math.max(0, positions[0])
      const lastPosition = positions[positions.length - 1]
      const totalHeight = lastPosition - firstPosition
      
      scrollPositions.current = []
      for (let i = 0; i < steps; i++) {
        const position = firstPosition + (totalHeight * i) / Math.max(steps - 1, 1)
        scrollPositions.current.push(Math.max(0, position))
      }
      
      // Inicializar el slider en la posición actual
      const currentScrollTop = scrollContainer.scrollTop
      let initialSection = 0
      for (let i = scrollPositions.current.length - 1; i >= 0; i--) {
        if (currentScrollTop >= scrollPositions.current[i]) {
          initialSection = i
          break
        }
      }
      setSliderValue(initialSection)
      currentSection.current = initialSection
      
      // Registrar el handler de scroll después de calcular las posiciones
      scrollHandler = () => {
        if (isSliderDragging.current) return
        if (scrollPositions.current.length === 0) return
        
        if (!scrollContainer) return
        
        const currentScrollTop = scrollContainer.scrollTop
        
        // Si hay una posición objetivo, no actualizar el slider durante el scroll programático
        if (scrollTargetPosition.current !== null) {
          const distanceToTarget = Math.abs(currentScrollTop - scrollTargetPosition.current)
          // Si estamos cerca del objetivo, esperar a que termine el scroll
          if (distanceToTarget < 100) {
            return
          }
          // Si nos alejamos mucho, limpiar la posición objetivo (scroll manual)
          if (distanceToTarget > 300) {
            scrollTargetPosition.current = null
          } else {
            // Aún estamos en scroll programático, no actualizar
            return
          }
        }
        
        let newSection = 0
        for (let i = scrollPositions.current.length - 1; i >= 0; i--) {
          if (currentScrollTop >= scrollPositions.current[i]) {
            newSection = i
            break
          }
        }
        
        if (newSection !== currentSection.current) {
          currentSection.current = newSection
          setSliderValue(newSection)
          
          if (weekGroups[newSection]) {
            const month = weekGroups[newSection].startDate.getMonth()
            setSelectedMonth(month)
          }
        }
      }
      
      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', scrollHandler, { passive: true })
        scrollHandler()
      }
    }
    
    setTimeout(calculatePositions, 100)
    
    return () => {
      const scrollContainer = mainScrollRef.current
      if (scrollHandler && scrollContainer) {
        scrollContainer.removeEventListener('scroll', scrollHandler)
      }
    }
  }, [weekGroups])


  const fetchRaces = async () => {
    try {
      const response = await fetch('/api/races')
      if (response.ok) {
        const data = await response.json()
        setRaces(data)
        
        if (data.length > 0) {
          for (const race of data) {
            if (race.startDate) {
              const date = new Date(race.startDate)
              if (!isNaN(date.getTime()) && date.getFullYear() > 2000) {
                setSelectedYear(date.getFullYear())
                setSelectedMonth(date.getMonth())
                break
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar carreras:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDayOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 0)
    const diff = date.getTime() - start.getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  const getDateFromDayOfYear = (dayOfYear: number, year: number): Date => {
    const date = new Date(year, 0, 1)
    date.setDate(dayOfYear)
    return date
  }

  const weekHasDaysInMonth = (group: WeekGroup, monthIndex: number): boolean => {
    const monday = group.startDate
    const sunday = group.endDate
    
    // Una semana tiene días en el mes si:
    // - El lunes está en ese mes, o
    // - El domingo está en ese mes
    // (Si cruza meses, tiene días en ambos)
    return monday.getMonth() === monthIndex || sunday.getMonth() === monthIndex
  }

  const scrollToMonth = (monthIndex: number) => {
    setSelectedMonth(monthIndex)
    setSliderValue(monthIndex)
    userSelectedMonth.current = monthIndex
    
    // Buscar la primera semana que tenga al menos 1 día en ese mes
    const targetWeek = weekGroups.find(group => 
      weekHasDaysInMonth(group, monthIndex)
    )
    
    if (targetWeek) {
      const weekElement = weekRefs.current.get(targetWeek.week)
      const scrollContainer = mainScrollRef.current
      if (weekElement && scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect()
        const elementRect = weekElement.getBoundingClientRect()
        const elementTop = elementRect.top - containerRect.top + scrollContainer.scrollTop
        const headerOffset = 165
        const targetPosition = elementTop - headerOffset
        scrollTargetPosition.current = targetPosition
        
        scrollContainer.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
      }
    }
  }

  const handleSliderChange = (value: number) => {
    isSliderDragging.current = true
    setSliderValue(value)
    currentSection.current = value
    
    // Usar la posición predefinida para esta porción
    if (scrollPositions.current[value] !== undefined) {
      const targetPosition = scrollPositions.current[value]
      scrollTargetPosition.current = targetPosition
      
      // Actualizar el mes basándome en la semana correspondiente
      if (weekGroups[value]) {
        const month = weekGroups[value].startDate.getMonth()
        setSelectedMonth(month)
      }
      
      const scrollContainer = mainScrollRef.current
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
      }
      
      // Mantener el flag activo durante el scroll suave y un poco más
      // El scroll suave puede durar hasta 1.5-2 segundos
      setTimeout(() => {
        isSliderDragging.current = false
        // Limpiar la posición objetivo después de que termine el scroll
        setTimeout(() => {
          scrollTargetPosition.current = null
        }, 300)
      }, 2000)
    }
  }

  const formatWeekRange = (start: Date, end: Date) => {
    const startDay = start.getDate()
    const startMonth = months[start.getMonth()].toLowerCase()
    const endDay = end.getDate()
    const endMonth = months[end.getMonth()].toLowerCase()
    
    if (startMonth === endMonth) {
      return `${startDay} - ${endDay} ${startMonth}`
    }
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return date.getDate().toString()
  }

  const formatDateMonth = (dateString: string): string => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return months[date.getMonth()].toLowerCase()
  }

  const formatDateDayOfWeek = (dateString: string): string => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    const dayNames = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sab']
    return dayNames[date.getDay()]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Cargando carreras...</div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full opacity-50 cursor-not-allowed">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            {isSearching ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar carrera..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsSearching(false)
                    setSearchQuery('')
                  }}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsSearching(true)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>
          
          {!isSearching && (
            <div className="text-center">
              <h1 className="text-base font-semibold">MyRaceCal.app</h1>
            </div>
          )}
          
          {isSearching && (
            <div></div>
          )}
          
          <div className="flex items-center justify-end">
            <span className="px-4 py-1.5 text-base font-medium text-gray-700">
              {selectedYear}
            </span>
          </div>
        </div>
      </header>

      {/* Cabecera de Filtros */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0 z-10">
        <Link 
          href="/races/filters"
          className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
              <div className="flex-1">
                <div className="text-sm text-gray-600">
                  {appliedFilters ? (
                    <div className="flex flex-col gap-2">
                      {/* País y Provincia juntos */}
                      {appliedFilters.selectedCountry && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-xs">
                            {appliedFilters.selectedCountry}
                            {appliedFilters.selectedProvinces.length > 0 && ` | ${appliedFilters.selectedProvinces.join(', ')}`}
                          </span>
                        </div>
                      )}
                      {/* Disciplina y Formato juntos */}
                      {appliedFilters.selectedDiscipline && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="5.5" cy="17.5" r="3.5"/>
                            <circle cx="18.5" cy="17.5" r="3.5"/>
                            <path d="M15 6a6 6 0 0 0-6 6v7.5M9 6a6 6 0 0 1 6 6v7.5"/>
                            <path d="M9 6h6M9 12h6"/>
                          </svg>
                          <span className="text-xs">
                            {appliedFilters.selectedDiscipline}
                            {appliedFilters.selectedFormats.length > 0 && ` | ${appliedFilters.selectedFormats.join(', ')}`}
                          </span>
                        </div>
                      )}
                      {/* Modalidad */}
                      {appliedFilters.selectedModalities.length > 0 && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="text-xs">
                            {appliedFilters.selectedModalities.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span>Sin filtros aplicados</span>
                  )}
                </div>
              </div>
          </div>
          {appliedFilters && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setAppliedFilters(null)
                sessionStorage.removeItem('raceFilters')
              }}
              className="ml-2 p-1 rounded-full hover:bg-gray-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </Link>
      </div>

      {/* Lista de Carreras por Semana */}
      <main ref={mainScrollRef} className="flex-1 overflow-y-auto px-4 py-4 pb-4">
        {weekGroups.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Sin carreras este año</p>
              </div>
        ) : (
          weekGroups.map((group) => (
            <div 
              key={group.week} 
              ref={(el) => {
                if (el) weekRefs.current.set(group.week, el)
              }}
              className="mb-6"
            >
              {/* Header de Semana */}
              <div className={`px-4 py-2 rounded-t-2xl ${
                group.races.length > 0 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                <h2 className="text-sm font-semibold flex justify-between items-center">
                  <span>Semana {group.week}</span>
                  <span>{formatWeekRange(group.startDate, group.endDate)}</span>
                </h2>
              </div>

              {/* Carreras de la Semana */}
              <div className="bg-white border-x border-b border-gray-200 rounded-b-2xl overflow-hidden">
                {group.races.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    Sin carreras esta semana
              </div>
                ) : (
                  group.races.map((race, index) => (
                    <Link
                      key={race.id}
                      href={`/races/${race.id}`}
                      onClick={() => {
                        const scrollContainer = mainScrollRef.current
                        if (scrollContainer) {
                          sessionStorage.setItem('racesListScrollPosition', scrollContainer.scrollTop.toString())
                        }
                        sessionStorage.setItem('racesListSearchQuery', searchQuery)
                        sessionStorage.setItem('racesListIsSearching', isSearching.toString())
                      }}
                      className={`block px-4 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                        index === 0 ? 'rounded-t-none' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Número de Día */}
                        <div className="flex-shrink-0 w-12 h-16 bg-blue-50 rounded-xl flex flex-col items-center justify-center gap-0.5">
                          <span className="text-blue-700 text-xs leading-none">
                            {formatDateDayOfWeek(race.startDate)}
                          </span>
                          <span className="text-blue-700 font-bold text-lg leading-none">
                            {formatDate(race.startDate)}
                          </span>
                          <span className="text-blue-700 text-xs leading-none">
                            {formatDateMonth(race.startDate)}
                          </span>
                        </div>

                        {/* Información de la Carrera */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm mb-1.5 leading-tight">
                            {race.name}
                          </h3>
                          
                          <div className="text-xs text-gray-600 mb-2 flex justify-between items-center">
                            <span>
                              <span className="font-medium">
                                {(race.disciplines && race.disciplines.length > 1
                                  ? race.disciplines.join(' / ')
                                  : race.discipline
                                )?.replace(/\//g, ' & ')}
                              </span>
                              {race.format && (
                                <>
                                  {' | '}
                                  {race.stages && race.stages > 1 
                                    ? `Por etapas (${race.stages})`
                                    : race.format.replace(/\//g, ' & ')
                                  }
                                </>
                              )}
                            </span>
                            {(() => {
                              const disciplines = race.disciplines || [race.discipline].filter(Boolean)
                              const hasMultipleDisciplines = disciplines.length > 1
                              const disciplineDistances = race.disciplineDistances
                              const hasMultipleFormats = disciplineDistances && disciplineDistances.length > 1
                              
                              // No mostrar distancia si hay múltiples disciplinas o múltiples formatos
                              // (porque el usuario no sabrá a cuál formato/disciplina corresponde cada distancia)
                              if (hasMultipleDisciplines || hasMultipleFormats) {
                                return race.elevation ? (
                                  <span>{race.elevation} m+</span>
                                ) : null
                              } else {
                                // Mostrar distancia/es si hay una sola disciplina y un solo formato
                                if (disciplineDistances && disciplineDistances.length > 0 && disciplineDistances[0].distances.length > 0) {
                                  const distances = disciplineDistances[0].distances
                                  return (
                                    <span>
                                      {distances.length > 1 
                                        ? `${distances.join(' & ')} km`
                                        : `${distances[0]} km`
                                      }
                                      {race.elevation && ' | '}
                                      {race.elevation && <span>{race.elevation} m+</span>}
                                    </span>
                                  )
                                } else if (race.distance || race.elevation) {
                                  return (
                                    <span>
                                      {race.distance && <span>{race.distance} km</span>}
                                      {race.distance && race.elevation && ' | '}
                                      {race.elevation && <span>{race.elevation} m+</span>}
                                    </span>
                                  )
                                }
                                return null
                              }
                            })()}
              </div>

                          <div className="text-xs text-gray-500 flex justify-between items-center">
                            <span>{race.city || race.location}</span>
                            {(race.province || race.country) && (
                              <span>{[race.province, race.country].filter(Boolean).join(' | ')}</span>
                            )}
                </div>
              </div>

                        {/* Icono de Calendario (Favorito) */}
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            // TODO: Implementar toggle de favorito
                          }}
                          className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100 relative"
                        >
                          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                          </svg>
                          <svg className="w-4 h-4 text-white absolute bottom-1 right-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        </button>
                </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </main>

      {/* Slider - Fijo debajo del listado (solo cuando no hay filtro activo) */}
      {(() => {
        const hasSearchFilter = searchQuery.trim().length > 0
        const hasAppliedFilters = appliedFilters && (
          appliedFilters.selectedCountry !== null ||
          appliedFilters.selectedProvinces.length > 0 ||
          appliedFilters.selectedDiscipline !== null ||
          appliedFilters.selectedFormats.length > 0 ||
          appliedFilters.selectedModalities.length > 0
        )
        return !hasSearchFilter && !hasAppliedFilters
      })() && (
      <div className="flex-shrink-0 bg-white border-t border-gray-200 z-20">
        <div className="px-4 py-4">
          <div className="relative" style={{ height: '50px' }}>
            {/* Números de fondo (1-12) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full flex items-center justify-between px-8 relative" style={{ maxWidth: 'calc(100% - 120px)', margin: '0 auto' }}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
                  const position = (num - 1) * (100 / 11)
                  const isTwoDigit = num >= 10
                  return (
                    <span
                      key={num}
                      className="text-3xl font-light select-none absolute"
                      style={{
                        left: `${position}%`,
                        transform: 'translateX(-50%)',
                        lineHeight: '1',
                        color: 'rgba(156, 163, 175, 0.7)',
                        letterSpacing: isTwoDigit ? '-0.20em' : '0'
                      }}
                    >
                      {num}
                    </span>
                  )
                })}
              </div>
            </div>
            
            {/* Slider */}
            <div className="flex items-center gap-3 relative z-10 h-full">
              <span className="text-xs text-gray-500 font-medium min-w-[30px]">
                ENE
              </span>
              <div className="flex-1 relative flex items-center" style={{ height: '40px' }}>
                <input
                  type="range"
                  min="0"
                  max={Math.max(sliderSteps.current - 1, 0)}
                  step="1"
                  value={sliderValue}
                  onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${getYearProgress}%, #2563eb ${getYearProgress}%, #2563eb 100%)`
                  }}
                />
              </div>
              <span className="text-xs text-gray-500 font-medium min-w-[30px] text-right">
                DIC
              </span>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Navegación Inferior */}
      <nav className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-2 z-10">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Link href="/races" className="flex flex-col items-center gap-1 py-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-blue-600">Carreras</span>
          </Link>

          <div className="flex flex-col items-center gap-1 py-2 opacity-50 cursor-not-allowed">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-gray-400">Mi calendario</span>
          </div>

          <div className="flex flex-col items-center gap-1 py-2 opacity-50 cursor-not-allowed">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs text-gray-400">Config</span>
          </div>
        </div>
      </nav>
    </div>
  )
}
