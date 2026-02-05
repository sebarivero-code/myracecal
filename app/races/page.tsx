'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AuthButton from '@/app/components/AuthButton'
import FiltersColumn from '@/app/components/FiltersColumn'
import { parseLocalDate } from '@/lib/date'
import HeaderLogo from '@/app/components/HeaderLogo'
import RaceDetailModal from '@/app/components/RaceDetailModal'

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
  campeonato?: string
}

interface WeekGroup {
  week: number
  startDate: Date
  endDate: Date
  races: Race[]
}

interface MonthGroup {
  month: number
  monthName: string
  races: Race[]
}

export default function RaceListPage() {
  const pathname = usePathname()
  const [races, setRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [sliderValue, setSliderValue] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'week' | 'month'>('month')
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [showPastRaces, setShowPastRaces] = useState(false)
  const viewModeChangedRef = useRef(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mainScrollRef = useRef<HTMLDivElement>(null)
  const contentScrollRef = useRef<HTMLDivElement>(null)
  const [appliedFilters, setAppliedFilters] = useState<{
    selectedCountry: string | null
    selectedProvinces: string[]
    selectedDiscipline: string | null
    selectedFormats: string[]
    selectedModalities: string[]
    selectedCampeonatos: string[]
  } | null>(null)
  const weekRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const userSelectedMonth = useRef<number | null>(null)
  const scrollTargetPosition = useRef<number | null>(null)
  const isSliderDragging = useRef(false)
  const scrollPositions = useRef<number[]>([])
  const sliderSteps = useRef(52) // Número de porciones (52 semanas del año)
  const currentSection = useRef(-1)
  const [isDesktop, setIsDesktop] = useState(false)
  const [modalRaceId, setModalRaceId] = useState<number | null>(null)
  const [modalRaceName, setModalRaceName] = useState<string | null>(null)
  const [mobileHeaderCompact, setMobileHeaderCompact] = useState(false)

  // En mobile: al hacer scroll, mostrar barra chica sticky con logo + año (el header normal se va con el scroll)
  useEffect(() => {
    const threshold = 80
    const checkScroll = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) return
      setMobileHeaderCompact(window.scrollY > threshold)
    }
    checkScroll()
    window.addEventListener('scroll', checkScroll, { passive: true })
    return () => window.removeEventListener('scroll', checkScroll)
  }, [])

  useEffect(() => {
    const m = window.matchMedia('(min-width: 1024px)')
    const handler = () => setIsDesktop(m.matches)
    setIsDesktop(m.matches)
    m.addEventListener('change', handler)
    return () => m.removeEventListener('change', handler)
  }, [])

  // Callback estable para evitar loops infinitos
  const handleFiltersChange = useCallback((filters: {
    selectedCountry: string | null
    selectedProvinces: string[]
    selectedDiscipline: string | null
    selectedFormats: string[]
    selectedModalities: string[]
    selectedCampeonatos: string[]
  }) => {
    setAppliedFilters(filters)
  }, [])

  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  // Función para normalizar texto removiendo tildes
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  /** Nombres de campeonato para mostrar: divide por " / " y quita " #N" de cada parte */
  const getCampeonatoDisplayNames = (raw: string): string[] => {
    return raw
      .split(/\s*\/\s*/)
      .map(p => p.trim())
      .filter(Boolean)
      .map(p => {
        const m = p.match(/^(.+?)\s*#\s*\d+\s*$/)
        return m ? m[1].trim() : p
      })
  }

  // Función para verificar si una carrera es pasada
  const isPastRace = (startDate: string): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const raceDate = parseLocalDate(startDate)
    raceDate.setHours(0, 0, 0, 0)
    return raceDate < today
  }

  // Función para verificar si una semana es pasada (basada en el domingo de la semana)
  const isPastWeek = (sunday: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const sundayOnly = new Date(sunday)
    sundayOnly.setHours(23, 59, 59, 999)
    return sundayOnly < today
  }

  // Función para verificar si un mes es pasado (basado en el último día del mes)
  const isPastMonth = (month: number, year: number): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    // Obtener el último día del mes
    const lastDayOfMonth = new Date(year, month + 1, 0)
    lastDayOfMonth.setHours(23, 59, 59, 999)
    return lastDayOfMonth < today
  }

  // Función compartida para filtrar carreras
  const getFilteredRaces = (): Race[] => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return races.filter(race => {
      if (!race.startDate) return false
      const raceDate = parseLocalDate(race.startDate)
      if (isNaN(raceDate.getTime())) return false
      
      // Filtrar por año
      if (raceDate.getFullYear() !== selectedYear) return false
      
      // Filtrar carreras pasadas si no se muestran
      if (!showPastRaces) {
        const raceDateOnly = new Date(raceDate)
        raceDateOnly.setHours(0, 0, 0, 0)
        if (raceDateOnly < today) return false
      }
      
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
        // Filtro por campeonato: " / " separa varios campeonatos; cada uno puede ser "nombre #N"
        const selectedCampeonatos = appliedFilters.selectedCampeonatos ?? []
        if (selectedCampeonatos.length > 0) {
          if (!race.campeonato) return false
          const parts = race.campeonato.split(/\s*\/\s*/).map(p => p.trim()).filter(Boolean)
          const raceCampeonatoNames = parts.map(p => {
            const m = p.match(/^(.+?)\s*#\s*\d+\s*$/)
            return m ? m[1].trim() : p
          })
          const hasMatch = raceCampeonatoNames.some(name => selectedCampeonatos.includes(name))
          if (!hasMatch) return false
        }
      }
      
      return true
    })
  }

  const getWeekGroups = (): WeekGroup[] => {
    const filteredRaces = getFilteredRaces()

    // Calcular el primer lunes del año
    const jan1 = new Date(selectedYear, 0, 1)
    const jan1Day = jan1.getDay()
    const daysToMonday = jan1Day === 0 ? 6 : jan1Day - 1
    const firstMonday = new Date(jan1)
    firstMonday.setDate(1 - daysToMonday)
    const yearStart = new Date(selectedYear, 0, 1)

    // Crear mapa de carreras por semana
    // Usar un mapa con clave de fecha de lunes de la semana para evitar problemas con números de semana
    const weekMap = new Map<string, Race[]>()
    filteredRaces.forEach(race => {
      const date = parseLocalDate(race.startDate)
      const monday = getMondayOfWeek(date)
      const weekKey = `${monday.getFullYear()}-${monday.getMonth()}-${monday.getDate()}`
      
      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, [])
      }
      weekMap.get(weekKey)!.push(race)
    })

    // Detectar si hay algún filtro activo (búsqueda o filtros aplicados)
    const hasSearchFilter = searchQuery.trim().length > 0
    const hasAppliedFilters = appliedFilters && (
      appliedFilters.selectedCountry !== null ||
      appliedFilters.selectedProvinces.length > 0 ||
      appliedFilters.selectedDiscipline !== null ||
      appliedFilters.selectedFormats.length > 0 ||
      appliedFilters.selectedModalities.length > 0 ||
      (appliedFilters.selectedCampeonatos?.length ?? 0) > 0
    )
    const hasAnyFilter = hasSearchFilter || hasAppliedFilters
    
    if (hasAnyFilter) {
      // Solo mostrar semanas que tienen carreras filtradas (con filtros activos)
      const groups: WeekGroup[] = []
      weekMap.forEach((weekRaces, weekKey) => {
        if (weekRaces.length > 0) {
          // Calcular las fechas de la semana basándonos en la primera carrera
          const firstRace = weekRaces[0]
          const raceDate = parseLocalDate(firstRace.startDate)
          const monday = getMondayOfWeek(raceDate)
          const sunday = new Date(monday)
          sunday.setDate(monday.getDate() + 6)
          const weekNum = getWeekOfYear(monday, yearStart, firstMonday)
          
          const sortedRaces = weekRaces.sort((a, b) => 
            parseLocalDate(a.startDate).getTime() - parseLocalDate(b.startDate).getTime()
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
    const yearEnd = new Date(selectedYear, 11, 31)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Continuar hasta que el lunes sea del año siguiente
    while (currentMonday.getFullYear() <= selectedYear + 1) {
      const monday = new Date(currentMonday)
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)
      
      // Incluir semanas que tengan al menos un día del año seleccionado
      // (el lunes debe ser <= 31 dic del año, o el domingo debe ser >= 1 ene del año)
      if (monday <= yearEnd && sunday >= yearStart) {
        // Si no se muestran carreras pasadas, filtrar semanas que ya pasaron completamente
        if (!showPastRaces) {
          const sundayOnly = new Date(sunday)
          sundayOnly.setHours(23, 59, 59, 999)
          // Si el domingo de la semana es anterior a hoy, omitir esta semana
          // Esto permite que la semana actual (donde hoy está entre lunes y domingo) se muestre
          if (sundayOnly < today) {
            currentMonday.setDate(currentMonday.getDate() + 7)
            week++
            if (week > 53) break
            continue
          }
        }
        
        // Buscar carreras usando la clave de fecha del lunes
        const weekKey = `${monday.getFullYear()}-${monday.getMonth()}-${monday.getDate()}`
        const weekRaces = weekMap.get(weekKey) || []
        const sortedRaces = weekRaces.sort((a, b) => 
          parseLocalDate(a.startDate).getTime() - parseLocalDate(b.startDate).getTime()
        )
        
        // Usar el contador de semana secuencial, no el cálculo de getWeekOfYear
        // para evitar problemas con semanas del año anterior
        const weekNum = week
        groups.push({ week: weekNum, startDate: monday, endDate: sunday, races: sortedRaces })
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

  const getWeekOfYear = (date: Date, yearStart: Date, firstMonday: Date): number => {
    const d = new Date(date)
    
    // Si la fecha es anterior al primer lunes del año, pertenece a la semana 0 (del año anterior)
    if (d < firstMonday) {
      return 0
    }
    
    const diffTime = d.getTime() - firstMonday.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    return Math.floor(diffDays / 7) + 1
  }

  const weekGroups = useMemo(() => getWeekGroups(), [races, selectedYear, searchQuery, appliedFilters, showPastRaces])

  // Función para agrupar carreras por mes
  const getMonthGroups = (): MonthGroup[] => {
    const filteredRaces = getFilteredRaces()
    
    // Crear mapa de carreras por mes
    const monthMap = new Map<number, Race[]>()
    
    filteredRaces.forEach(race => {
      const date = parseLocalDate(race.startDate)
      const month = date.getMonth() // 0-11
      
      if (!monthMap.has(month)) {
        monthMap.set(month, [])
      }
      monthMap.get(month)!.push(race)
    })
    
    // Convertir a array y ordenar por mes
    const groups: MonthGroup[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    
    for (let month = 0; month < 12; month++) {
      const monthRaces = monthMap.get(month) || []
      
      // Si no se muestran carreras pasadas, filtrar meses anteriores al actual
      if (!showPastRaces) {
        // Si el mes es anterior al mes actual del año seleccionado, omitir
        if (selectedYear < currentYear || (selectedYear === currentYear && month < currentMonth)) {
          continue
        }
      }
      
      if (monthRaces.length > 0) {
        // Ordenar carreras cronológicamente dentro del mes
        monthRaces.sort((a, b) => {
          const dateA = parseLocalDate(a.startDate).getTime()
          const dateB = parseLocalDate(b.startDate).getTime()
          return dateA - dateB
        })
        
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        groups.push({
          month,
          monthName: monthNames[month],
          races: monthRaces
        })
      }
    }
    
    return groups
  }

  const monthGroups = useMemo(() => getMonthGroups(), [races, selectedYear, searchQuery, appliedFilters, showPastRaces])

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
    if (typeof window !== 'undefined') {
      try {
        const savedFilters = sessionStorage.getItem('raceFilters')
        if (savedFilters) {
          const filters = JSON.parse(savedFilters)
          setAppliedFilters(filters)
        }
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

  // Detectar scroll para mostrar/ocultar botón "scroll to top"
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Restaurar posición de scroll al cargar la página, o posicionar en la semana actual
  useEffect(() => {
    // No restaurar scroll si el usuario acaba de cambiar de vista
    if (viewModeChangedRef.current) {
      viewModeChangedRef.current = false
      return
    }
    
    if (!loading && races.length > 0 && weekGroups.length > 0) {
      const savedScrollPosition = sessionStorage.getItem('racesListScrollPosition')
      if (savedScrollPosition) {
        const scrollY = parseInt(savedScrollPosition, 10)
        // Esperar a que el DOM se renderice completamente
        const restoreScroll = () => {
          window.scrollTo(0, scrollY)
          sessionStorage.removeItem('racesListScrollPosition')
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
          const jan1 = new Date(currentYear, 0, 1)
          const jan1Day = jan1.getDay()
          const daysToMonday = jan1Day === 0 ? 6 : jan1Day - 1
          const firstMonday = new Date(jan1)
          firstMonday.setDate(1 - daysToMonday)
          const yearStart = new Date(currentYear, 0, 1)
          targetWeek = getWeekOfYear(today, yearStart, firstMonday)
        } else {
          // Si el año seleccionado es diferente al año actual, posicionar en la primera semana
          targetWeek = 1
        }
        
        if (targetWeek && weekGroups.length > 0) {
          const targetWeekGroup = weekGroups.find(group => group.week === targetWeek)
          
          if (targetWeekGroup) {
            const scrollToTargetWeek = () => {
              const weekElement = weekRefs.current.get(targetWeek!)
              
              if (weekElement) {
                const headerElement = document.querySelector('header')
                const filterHeaderElement = document.querySelector('div.bg-gray-200.border-b') as HTMLElement
                
                const headerOffset = headerElement && filterHeaderElement
                  ? filterHeaderElement.getBoundingClientRect().bottom - headerElement.getBoundingClientRect().top
                  : 165
                
                const elementRect = weekElement.getBoundingClientRect()
                const elementTop = elementRect.top + window.scrollY
                const targetPosition = Math.max(0, elementTop - headerOffset)
                
                window.scrollTo(0, targetPosition)
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
  }, [loading, races.length, weekGroups.length, selectedYear, viewMode])

  useEffect(() => {
    // Calcular posiciones de scroll al cargar las semanas
    if (weekGroups.length === 0) return
    if (viewMode !== 'week') return // Solo calcular posiciones en vista por semana
    
    let scrollHandler: (() => void) | null = null
    let retryCount = 0
    const maxRetries = 20 // Aumentar reintentos ya que ahora dependemos del renderizado del DOM
    
    const calculatePositions = () => {
      if (retryCount >= maxRetries) {
        console.warn('No se pudieron calcular las posiciones después de múltiples intentos')
        return
      }
      
      const positions: number[] = []
      const headerOffset = 165
      
      // Verificar que todos los elementos de semana estén renderizados
      let allElementsReady = true
      weekGroups.forEach((group) => {
        const weekElement = weekRefs.current.get(group.week)
        if (!weekElement) {
          allElementsReady = false
        }
      })
      
      // Si no todos los elementos están listos, reintentar
      if (!allElementsReady) {
        retryCount++
        setTimeout(calculatePositions, 150)
        return
      }
      
      // Calcular la posición de scroll de cada semana
      weekGroups.forEach((group) => {
        const weekElement = weekRefs.current.get(group.week)
        if (weekElement) {
          // Usar getBoundingClientRect y window.scrollY para obtener la posición absoluta
          const elementRect = weekElement.getBoundingClientRect()
          const elementTop = elementRect.top + window.scrollY
          positions.push(Math.max(0, elementTop - headerOffset))
        }
      })
      
      // Si no hay posiciones, reintentar después
      if (positions.length === 0) {
        retryCount++
        setTimeout(calculatePositions, 150)
        return
      }
      
      retryCount = 0 // Resetear contador si tuvo éxito
      
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
      const currentScrollTop = window.scrollY
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
        
        const currentScrollTop = window.scrollY
        
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
      
      window.addEventListener('scroll', scrollHandler, { passive: true })
      scrollHandler()
    }
    
    // Esperar un poco más para que el DOM se renderice completamente
    setTimeout(calculatePositions, 200)
    
    return () => {
      if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler)
      }
    }
  }, [weekGroups, viewMode])


  const fetchRaces = async () => {
    setLoadError(null)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000)
    try {
      const response = await fetch('/api/races', { signal: controller.signal })
      clearTimeout(timeoutId)
      if (response.ok) {
        const data = await response.json()
        setRaces(data)
        if (data.length > 0) {
          for (const race of data) {
            if (race.startDate) {
              const date = parseLocalDate(race.startDate)
              if (!isNaN(date.getTime()) && date.getFullYear() > 2000) {
                setSelectedYear(date.getFullYear())
                setSelectedMonth(date.getMonth())
                break
              }
            }
          }
        }
      } else {
        const err = await response.json().catch(() => ({}))
        setLoadError(err?.error || `Error ${response.status} al cargar carreras`)
      }
    } catch (error: unknown) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        setLoadError('La carga tardó demasiado. Revisá que GOOGLE_SHEET_URL esté en .env.local y que la planilla sea accesible.')
      } else {
        console.error('Error al cargar carreras:', error)
        setLoadError('No se pudieron cargar las carreras. Revisá la consola y que /api/races responda.')
      }
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
      if (weekElement) {
        const elementRect = weekElement.getBoundingClientRect()
        const elementTop = elementRect.top + window.scrollY
        const headerOffset = 165
        const targetPosition = elementTop - headerOffset
        scrollTargetPosition.current = targetPosition
        
        window.scrollTo({
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
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
      
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
    const date = parseLocalDate(dateString)
    if (isNaN(date.getTime())) return ''
    return date.getDate().toString()
  }

  const formatDateMonth = (dateString: string): string => {
    const date = parseLocalDate(dateString)
    if (isNaN(date.getTime())) return ''
    return months[date.getMonth()].toLowerCase()
  }

  const formatDateDayOfWeek = (dateString: string): string => {
    const date = parseLocalDate(dateString)
    if (isNaN(date.getTime())) return ''
    const dayNames = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sab']
    return dayNames[date.getDay()]
  }

  if (loading && !loadError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Cargando carreras...</div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <p className="text-red-600 text-center mb-4">{loadError}</p>
        <p className="text-sm text-gray-500 text-center mb-4">
          En desarrollo: revisá que en <code className="bg-gray-100 px-1 rounded">.env.local</code> tengas <code className="bg-gray-100 px-1 rounded">GOOGLE_SHEET_URL</code> con la URL de tu planilla (ej. con gid de la pestaña).
        </p>
        <button
          type="button"
          onClick={() => { setLoadError(null); setLoading(true); fetchRaces(); }}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white lg:flex-row">
      {/* Header: en mobile va en el flujo; en desktop fijo y siempre igual */}
      <header className="flex-shrink-0 bg-gray-900 border-b border-gray-700 min-h-[73px] lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:z-50">
        <div className="px-4 py-1.5 flex items-center justify-between min-h-[73px] gap-4">
          <HeaderLogo year={selectedYear} showYear={false} />
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-base font-bold italic whitespace-nowrap" style={{ color: '#E85D04' }}>
              {selectedYear}
            </span>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* En mobile: barra chica sticky con logo + año cuando el usuario scrolleó. La línea oscura es ~35% más baja; solo el logo pisa el gris. */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          mobileHeaderCompact ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-gray-900 border-b border-gray-700 px-4 flex items-center justify-between h-[28px] overflow-visible">
          <div className="flex items-center flex-shrink-0 self-end" style={{ marginBottom: '-10px' }}>
            <img
              src="/logo-header-compacto.png"
              alt=""
              className="h-9 w-9 object-contain flex-shrink-0 drop-shadow-md"
              style={{ background: 'transparent' }}
              aria-hidden
            />
          </div>
          <span className="text-sm font-bold italic whitespace-nowrap self-center" style={{ color: '#E85D04' }}>
            {selectedYear}
          </span>
        </div>
      </div>

      {/* Contenido Principal. En mobile el scroll es del body; en desktop altura fija y scroll en main. */}
      <div className="flex-1 flex flex-row min-h-0 lg:ml-56 lg:mt-16 lg:h-[calc(100vh-4rem)]">
      {/* Columna de Filtros - Solo visible en desktop */}
      {!loading && (
        <FiltersColumn 
          races={races} 
          compact={true}
          onFiltersChange={handleFiltersChange}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={(mode) => {
            viewModeChangedRef.current = true
            // Limpiar posición guardada para evitar que se restaure
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('racesListScrollPosition')
            }
            setViewMode(mode)
            // Usar requestAnimationFrame para asegurar que el scroll se ejecute después del render
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                if (typeof window !== 'undefined') {
                  window.scrollTo({ top: 0, behavior: 'auto' })
                }
              })
            })
          }}
          showPastRaces={showPastRaces}
          onShowPastRacesChange={(show) => {
            viewModeChangedRef.current = true
            // Limpiar posición guardada para evitar que se restaure
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('racesListScrollPosition')
            }
            setShowPastRaces(show)
            // Usar requestAnimationFrame para asegurar que el scroll se ejecute después del render
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                if (typeof window !== 'undefined') {
                  window.scrollTo({ top: 0, behavior: 'auto' })
                }
              })
            })
          }}
        />
      )}
      
      {/* Columna listado */}
      <div ref={contentScrollRef} className="flex-1 flex flex-col min-h-0 lg:overflow-hidden">
      {/* Línea 1 (mobile): Búsqueda + filtros. Sticky debajo de la barra oscura cuando está visible (no superponer fondos). */}
      <div
        className={`lg:hidden sticky z-40 bg-gray-200 border-b border-gray-300 shadow-sm px-4 py-3 transition-[top] duration-300 ${
          mobileHeaderCompact ? 'top-[28px]' : 'top-0'
        }`}
      >
        <div className="flex gap-2">
          <div className="relative flex-1 min-w-0">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur()
                }
              }}
              placeholder="Buscar por nombre..."
              className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-[#E85D04] focus:border-[#E85D04]"
            />
            {searchQuery.length > 0 && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                aria-label="Borrar búsqueda"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              href="/races/filters"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filtros</span>
              {appliedFilters && (appliedFilters.selectedCountry || appliedFilters.selectedDiscipline || appliedFilters.selectedModalities.length > 0 || (appliedFilters.selectedCampeonatos?.length ?? 0) > 0) && (
                <span className="w-2 h-2 rounded-full bg-[#E85D04]" aria-hidden />
              )}
            </Link>
            {appliedFilters && (appliedFilters.selectedCountry || appliedFilters.selectedDiscipline || appliedFilters.selectedModalities.length > 0 || (appliedFilters.selectedCampeonatos?.length ?? 0) > 0) && (
              <button
                type="button"
                onClick={() => { setAppliedFilters(null); sessionStorage.removeItem('raceFilters') }}
                className="p-2.5 rounded-xl border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                aria-label="Quitar filtros"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Línea 2 (mobile): Visualización — mismo nivel que la anterior */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    viewModeChangedRef.current = true
                    if (typeof window !== 'undefined') sessionStorage.removeItem('racesListScrollPosition')
                    setShowPastRaces(false)
                    window.scrollTo({ top: 0, behavior: 'auto' })
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    !showPastRaces ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-white text-gray-500 border-gray-200'
                  }`}
                >
                  Sólo próximas
                </button>
                <button
                  type="button"
                  onClick={() => {
                    viewModeChangedRef.current = true
                    if (typeof window !== 'undefined') sessionStorage.removeItem('racesListScrollPosition')
                    setShowPastRaces(true)
                    window.scrollTo({ top: 0, behavior: 'auto' })
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    showPastRaces ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-white text-gray-500 border-gray-200'
                  }`}
                >
                  Todas
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    viewModeChangedRef.current = true
                    if (typeof window !== 'undefined') sessionStorage.removeItem('racesListScrollPosition')
                    setViewMode('month')
                    window.scrollTo({ top: 0, behavior: 'auto' })
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    viewMode === 'month' ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-white text-gray-500 border-gray-200'
                  }`}
                >
                  Mes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    viewModeChangedRef.current = true
                    if (typeof window !== 'undefined') sessionStorage.removeItem('racesListScrollPosition')
                    setViewMode('week')
                    window.scrollTo({ top: 0, behavior: 'auto' })
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    viewMode === 'week' ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-white text-gray-500 border-gray-200'
                  }`}
                >
                  Semana
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Lista de Carreras */}
      <main ref={mainScrollRef} className="px-4 py-4 pb-4 lg:pb-4 flex-1 lg:overflow-y-auto lg:h-full">
        {viewMode === 'week' ? (
          // Vista por Semana
          weekGroups.length === 0 ? (
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
              <div 
                className={`px-4 py-2 rounded-t-2xl ${
                  isPastWeek(group.endDate)
                    ? 'bg-gray-300 text-gray-600'
                    : group.races.length > 0 
                      ? 'text-white' 
                      : 'bg-gray-300 text-gray-600'
                }`}
                style={!isPastWeek(group.endDate) && group.races.length > 0 ? { backgroundColor: '#E85D04' } : {}}
              >
                <h2 className="text-sm font-semibold flex justify-between items-center">
                  <span>{formatWeekRange(group.startDate, group.endDate)}</span>
                  <span>Semana {group.week}</span>
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
                      onClick={(e) => {
                        sessionStorage.setItem('racesListScrollPosition', window.scrollY.toString())
                        sessionStorage.setItem('racesListSearchQuery', searchQuery)
                        sessionStorage.setItem('racesListIsSearching', isSearching.toString())
                        if (isDesktop) {
                          e.preventDefault()
                          setModalRaceId(race.id)
                          setModalRaceName(race.name)
                        }
                      }}
                      className={`block px-4 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                        index === 0 ? 'rounded-t-none' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Número de Día */}
                        <div 
                          className={`flex-shrink-0 w-12 h-16 rounded-xl flex flex-col items-center justify-center gap-0.5 ${
                            isPastRace(race.startDate) 
                              ? 'bg-gray-200' 
                              : ''
                          }`}
                          style={!isPastRace(race.startDate) ? { backgroundColor: '#F3F4F6' } : {}}
                        >
                          <span 
                            className={`text-xs leading-none ${
                              isPastRace(race.startDate) 
                                ? 'text-gray-500' 
                                : ''
                            }`}
                            style={!isPastRace(race.startDate) ? { color: '#C24A03' } : {}}
                          >
                            {formatDateDayOfWeek(race.startDate)}
                          </span>
                          <span 
                            className={`font-bold text-lg leading-none ${
                              isPastRace(race.startDate) 
                                ? 'text-gray-500' 
                                : ''
                            }`}
                            style={!isPastRace(race.startDate) ? { color: '#C24A03' } : {}}
                          >
                            {formatDate(race.startDate)}
                          </span>
                          <span 
                            className={`text-xs leading-none ${
                              isPastRace(race.startDate) 
                                ? 'text-gray-500' 
                                : ''
                            }`}
                            style={!isPastRace(race.startDate) ? { color: '#C24A03' } : {}}
                          >
                            {formatDateMonth(race.startDate)}
                          </span>
                        </div>

                        {/* Información de la Carrera */}
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-bold text-sm leading-tight ${race.campeonato ? 'mb-0.5' : 'mb-1.5'} ${
                            isPastRace(race.startDate) 
                              ? 'text-gray-400' 
                              : 'text-gray-900'
                          }`}>
                            {race.name}
                          </h3>
                          <div className={`text-xs mb-2 flex flex-col gap-0.5 justify-between ${
                            isPastRace(race.startDate) 
                              ? 'text-gray-400' 
                              : 'text-gray-600'
                          }`}>
                            {race.campeonato && (() => {
                              const campeonatos = getCampeonatoDisplayNames(race.campeonato)
                              return (
                                <span className="flex items-center gap-1 text-[11px] italic" style={{ color: '#d9732a' }}>
                                  <svg className="w-3.5 h-3.5 flex-shrink-0 self-center" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H8v2h8v-2h-3v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
                                  </svg>
                                  <span className="flex flex-col leading-tight">
                                    {campeonatos.map((name) => (
                                      <span key={name}>{name}</span>
                                    ))}
                                  </span>
                                </span>
                              )
                            })()}
                            <div className="flex justify-between items-center">
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
                                    ? `${race.stages} etapas`
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
                          </div>

                          <div className="text-xs text-gray-500 flex justify-between items-center">
                            <span>{race.city || race.location}</span>
                            {(race.province || race.country) && (
                              <span>{[race.province, race.country].filter(Boolean).join(' | ')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          ))
          )
        ) : (
          // Vista por Mes
          monthGroups.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Sin carreras este año</p>
            </div>
          ) : (
            monthGroups.map((group) => (
              <div 
                key={group.month} 
                className="mb-6"
              >
                {/* Header de Mes */}
                <div 
                  className={`px-4 py-2 rounded-t-2xl ${
                    isPastMonth(group.month, selectedYear)
                      ? 'bg-gray-300 text-gray-600'
                      : 'text-white'
                  }`}
                  style={!isPastMonth(group.month, selectedYear) ? { backgroundColor: '#E85D04' } : {}}
                >
                  <h2 className="text-sm font-semibold">
                    {group.monthName}
                  </h2>
                </div>

                {/* Carreras del Mes */}
                <div className="bg-white border-x border-b border-gray-200 rounded-b-2xl overflow-hidden">
                  {group.races.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                      Sin carreras este mes
                    </div>
                  ) : (
                    group.races.map((race, index) => (
                      <Link
                        key={race.id}
                        href={`/races/${race.id}`}
                        onClick={(e) => {
                          sessionStorage.setItem('racesListScrollPosition', window.scrollY.toString())
                          sessionStorage.setItem('racesListSearchQuery', searchQuery)
                          sessionStorage.setItem('racesListIsSearching', isSearching.toString())
                          if (isDesktop) {
                            e.preventDefault()
                            setModalRaceId(race.id)
                            setModalRaceName(race.name)
                          }
                        }}
                        className={`block px-4 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                          index === 0 ? 'rounded-t-none' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Número de Día */}
                          <div 
                            className={`flex-shrink-0 w-12 h-16 rounded-xl flex flex-col items-center justify-center gap-0.5 ${
                              isPastRace(race.startDate) 
                                ? 'bg-gray-200' 
                                : ''
                            }`}
                            style={!isPastRace(race.startDate) ? { backgroundColor: '#F3F4F6' } : {}}
                          >
                            <span 
                              className={`text-xs leading-none ${
                                isPastRace(race.startDate) 
                                  ? 'text-gray-500' 
                                  : ''
                              }`}
                              style={!isPastRace(race.startDate) ? { color: '#C24A03' } : {}}
                            >
                              {formatDateDayOfWeek(race.startDate)}
                            </span>
                            <span 
                              className={`font-bold text-lg leading-none ${
                                isPastRace(race.startDate) 
                                  ? 'text-gray-500' 
                                  : ''
                              }`}
                              style={!isPastRace(race.startDate) ? { color: '#C24A03' } : {}}
                            >
                              {formatDate(race.startDate)}
                            </span>
                            <span 
                              className={`text-xs leading-none ${
                                isPastRace(race.startDate) 
                                  ? 'text-gray-500' 
                                  : ''
                              }`}
                              style={!isPastRace(race.startDate) ? { color: '#C24A03' } : {}}
                            >
                              {formatDateMonth(race.startDate)}
                            </span>
                          </div>

                          {/* Información de la Carrera */}
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-bold text-sm leading-tight ${race.campeonato ? 'mb-0.5' : 'mb-1.5'} ${
                              isPastRace(race.startDate) 
                                ? 'text-gray-400' 
                                : 'text-gray-900'
                            }`}>
                              {race.name}
                            </h3>
                            <div className={`text-xs mb-2 flex flex-col gap-0.5 ${
                              isPastRace(race.startDate) 
                                ? 'text-gray-400' 
                                : 'text-gray-600'
                            }`}>
                              {race.campeonato && (() => {
                                const campeonatos = getCampeonatoDisplayNames(race.campeonato)
                                return (
                                  <span className="flex items-center gap-1 text-[11px] italic" style={{ color: '#d9732a' }}>
                                    <svg className="w-3.5 h-3.5 flex-shrink-0 self-center" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                                      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H8v2h8v-2h-3v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
                                    </svg>
                                    <span className="flex flex-col leading-tight">
                                      {campeonatos.map((name) => (
                                        <span key={name}>{name}</span>
                                      ))}
                                    </span>
                                  </span>
                                )
                              })()}
                              <div className="flex justify-between items-center">
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
                                      ? `${race.stages} etapas`
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
                                
                                if (hasMultipleDisciplines || hasMultipleFormats) {
                                  return race.elevation ? (
                                    <span>{race.elevation} m+</span>
                                  ) : null
                                } else {
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
                            </div>

                            <div className="text-xs text-gray-500 flex justify-between items-center">
                              <span>{race.city || race.location}</span>
                              {(race.province || race.country) && (
                                <span>{[race.province, race.country].filter(Boolean).join(' | ')}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            ))
          )
        )}
      </main>

      {/* Slider - Debajo del listado (solo cuando no hay filtro activo y vista por semana) */}
      {/* TEMPORALMENTE COMENTADO - Se implementará para iOS y Android */}
      {/* El código del slider ha sido removido temporalmente para evitar errores de compilación.
          Se restaurará cuando se implemente para iOS y Android. */}

      {/* Sidebar - Vertical en desktop, horizontal abajo en mobile */}
      <nav className="bg-gray-900 border-t border-gray-700 lg:border-t-0 lg:border-r lg:fixed lg:left-0 lg:top-16 lg:bottom-0 lg:w-56 lg:flex lg:flex-col lg:justify-start lg:pt-4">
        <div className="flex justify-around items-center lg:flex-col lg:gap-2 lg:justify-start px-4 py-2 lg:py-0 lg:px-3">
          <Link 
            href="/races" 
            className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-3 py-2 lg:py-3 lg:w-full lg:px-3 lg:rounded-lg lg:transition-colors ${
              pathname === '/races' || pathname.startsWith('/races/') && !pathname.startsWith('/races/my-calendar')
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
              style={pathname === '/races' || (pathname.startsWith('/races/') && !pathname.startsWith('/races/my-calendar')) ? { backgroundColor: '#E85D04' } : {}}
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
              style={pathname === '/races' || (pathname.startsWith('/races/') && !pathname.startsWith('/races/my-calendar')) ? { color: '#E85D04' } : {}}
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

      {/* Botón flotante "Scroll to Top" */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 lg:bottom-8 right-4 w-12 h-12 bg-gray-700 hover:bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50 hover:scale-110 active:scale-95"
          aria-label="Subir al inicio"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Modal de detalle (solo desktop) */}
      {isDesktop && modalRaceId != null && (
        <RaceDetailModal raceId={String(modalRaceId)} title={modalRaceName ?? undefined} onClose={() => { setModalRaceId(null); setModalRaceName(null) }} />
      )}
      </div>
      </div>
    </div>
  )
}
