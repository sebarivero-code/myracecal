'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Race {
  id: string
  name: string
  slug: string
  discipline: string
  disciplines?: string[]
  modality?: string
  modalities?: string[]
  city?: string | null
  provinceId?: string | null
  distance?: string | null
  elevation?: string | null
  stages?: number
  days?: number
  province?: {
    id: string
    name: string
    country: {
      name: string
    }
  } | null
  editions: { year: number }[]
}

interface Province {
  id: string
  name: string
  country: { name: string }
}

export default function NewRacePage() {
  const router = useRouter()
  const [step, setStep] = useState<'search' | 'edition' | 'new'>('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [races, setRaces] = useState<Race[]>([])
  const [selectedRace, setSelectedRace] = useState<Race | null>(null)
  const [countries, setCountries] = useState<{ id: string; name: string }[]>([])
  const [provinces, setProvinces] = useState<Province[]>([])
  const [selectedCountryId, setSelectedCountryId] = useState<string>('')
  const [allDisciplines, setAllDisciplines] = useState<string[]>([])
  const [allModalities, setAllModalities] = useState<string[]>([])
  const [allFormats, setAllFormats] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Función para ordenar modalidades (Individual, Dupla, Equipo de 3, Equipo de 4 primero, luego alfabéticamente)
  const sortModalities = (modalities: string[]): string[] => {
    const priority = ['Individual', 'Dupla', 'Equipo de 3', 'Equipo de 4']
    const sorted = [...modalities].sort((a, b) => {
      const aIndex = priority.indexOf(a)
      const bIndex = priority.indexOf(b)
      
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
      if (aIndex !== -1) return -1
      if (bIndex !== -1) return 1
      return a.localeCompare(b)
    })
    return sorted
  }
  
  // Formulario de edición
  const [formData, setFormData] = useState({
    countryId: '',
    provinceId: '',
    city: '',
    startDate: '',
    stages: '1',
    days: '1',
    hasEditionDate: false,
    formats: [] as Array<{
      format: string
      distance: string
      elevation: string
      disciplines: string[]
      modalities: string[]
    }>
  })
  
  // Formulario de carrera nueva (nombre + contacto; resto en formData y formats)
  const [raceFormData, setRaceFormData] = useState({
    name: '',
    description: '',
    registrationUrl: '',
    website: '',
    instagram: '',
    contactPhone: ''
  })
  
  // Cargar países, provincias y opciones
  useEffect(() => {
    // Cargar países
    fetch('/api/countries')
      .then(async res => {
        const data = await res.json().catch(() => [])
        return Array.isArray(data) ? data : []
      })
      .then(data => {
        setCountries(data)
      })
      .catch(err => {
        console.error('Error cargando países:', err)
        setCountries([])
      })
    
    // Cargar disciplinas y modalidades disponibles
    fetch('/api/races/options')
      .then(async res => {
        if (!res.ok) return { disciplines: [], modalities: [] }
        return res.json()
      })
      .then(data => {
        setAllDisciplines(data.disciplines || [])
        setAllModalities(data.modalities || [])
      })
      .catch(err => console.error('Error cargando opciones:', err))
    
    // Cargar formatos disponibles
    fetch('/api/formats')
      .then(async res => {
        if (!res.ok) return []
        return res.json()
      })
      .then(data => {
        setAllFormats(Array.isArray(data) ? data : [])
      })
      .catch(err => console.error('Error cargando formatos:', err))
  }, [])
  
  // Cargar provincias cuando se selecciona un país
  useEffect(() => {
    if (selectedCountryId) {
      fetch(`/api/provinces?countryId=${encodeURIComponent(selectedCountryId)}`)
        .then(async res => {
          const data = await res.json().catch(() => [])
          return Array.isArray(data) ? data : []
        })
        .then(data => {
          setProvinces(data)
        })
        .catch(err => {
          console.error('Error cargando provincias:', err)
          setProvinces([])
        })
    } else {
      setProvinces([])
    }
  }, [selectedCountryId])
  
  // Buscar carreras
  useEffect(() => {
    if (searchQuery.length < 2) {
      setRaces([])
      return
    }
    
    const timeoutId = setTimeout(() => {
      setSearching(true)
      fetch(`/api/races/search?q=${encodeURIComponent(searchQuery)}`)
        .then(async res => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            throw new Error(errorData.error || `Error ${res.status}`)
          }
          return res.json()
        })
        .then(data => {
          // Si la respuesta tiene un error, mostrarlo
          if (data.error) {
            setError(data.error)
            setRaces([])
          } else {
            setRaces(data)
            setError(null)
          }
        })
        .catch(err => {
          console.error('Error buscando carreras:', err)
          setError(err.message || 'Error al buscar carreras')
          setRaces([])
        })
        .finally(() => {
          setSearching(false)
        })
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [searchQuery])
  
  const handleSelectRace = async (race: Race) => {
    setSelectedRace(race)
    setStep('edition')
    setSearchQuery(race.name)
    
    // Cargar datos completos de la carrera
    try {
      const response = await fetch(`/api/races/${race.id}`)
      if (response.ok) {
        const fullRace = await response.json()
        setSelectedRace(fullRace)
        
        // Obtener countryId de la provincia si existe
        const countryId = fullRace.province?.country?.id || fullRace.province?.countryId || ''
        
        // Crear formato por defecto desde los datos de la carrera
        const defaultFormat = fullRace.format || 
                             (fullRace.formats && fullRace.formats.length > 0 ? fullRace.formats[0] : '')
        
        // Parsear disciplinas
        let disciplinesArray: string[] = []
        if (fullRace.disciplines && fullRace.disciplines.length > 0) {
          fullRace.disciplines.forEach((d: string) => {
            const disciplines = String(d).split(/\s*\/\s*/).filter(d => d.trim().length > 0)
            disciplines.forEach(discipline => {
              const trimmed = discipline.trim()
              if (trimmed && !disciplinesArray.includes(trimmed)) {
                disciplinesArray.push(trimmed)
              }
            })
          })
        } else if (fullRace.discipline) {
          disciplinesArray = fullRace.discipline.split(/\s*\/\s*/)
            .filter(d => d.trim().length > 0)
            .map(d => d.trim())
        }
        
        // Parsear modalidades
        let modalitiesArray: string[] = []
        if (fullRace.modalities && fullRace.modalities.length > 0) {
          fullRace.modalities.forEach((m: string) => {
            const modalities = String(m).split(/\s*&\s*/).filter(m => m.trim().length > 0)
            modalities.forEach(modality => {
              const trimmed = modality.trim()
              if (trimmed && !modalitiesArray.includes(trimmed)) {
                modalitiesArray.push(trimmed)
              }
            })
          })
        } else if (fullRace.modality) {
          modalitiesArray = fullRace.modality.split(/\s*&\s*/)
            .filter(m => m.trim().length > 0)
            .map(m => m.trim())
        }
        
        // Precargar formulario con datos de la carrera
        setFormData({
          countryId: countryId,
          provinceId: fullRace.provinceId || '',
          city: fullRace.city || '',
          startDate: '',
          stages: fullRace.stages?.toString() || '1',
          days: fullRace.days?.toString() || '1',
          formats: [{
            format: defaultFormat,
            distance: fullRace.distance || '',
            elevation: fullRace.elevation || '',
            disciplines: disciplinesArray,
            modalities: modalitiesArray
          }]
        })
        
        // Establecer el país seleccionado para cargar las provincias
        if (countryId) {
          setSelectedCountryId(countryId)
        }
      }
    } catch (err) {
      console.error('Error cargando detalles de la carrera:', err)
      // Continuar con los datos básicos que ya tenemos
    }
  }
  
  const handleCreateNew = () => {
    setSelectedRace(null)
    setStep('new')
  }
  
  // Funciones helper para manejar formatos en el formulario de nueva carrera
  const addFormat = () => {
    setFormData({
      ...formData,
      formats: [...formData.formats, {
        format: '',
        distance: '',
        elevation: '',
        disciplines: [],
        modalities: []
      }]
    })
  }
  
  const removeFormat = (index: number) => {
    setFormData({
      ...formData,
      formats: formData.formats.filter((_, i) => i !== index)
    })
  }
  
  const updateFormat = (index: number, field: string, value: any) => {
    const newFormats = [...formData.formats]
    newFormats[index] = { ...newFormats[index], [field]: value }
    setFormData({ ...formData, formats: newFormats })
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Validar que haya al menos un formato
      if (formData.formats.length === 0) {
        throw new Error('Debes agregar al menos un formato')
      }
      
      for (const format of formData.formats) {
        if (!format.format || format.format.trim() === '') {
          throw new Error('Todos los formatos deben tener un nombre')
        }
      }
      
      const hasEditionDate = selectedRace ? true : formData.hasEditionDate
      const startDateToSend = hasEditionDate ? formData.startDate : undefined
      if (hasEditionDate && !selectedRace && !formData.startDate?.trim()) {
        throw new Error('La fecha de inicio es obligatoria cuando la edición tiene fecha definida')
      }
      
      // Agregar disciplinas y modalidades desde los formatos (para la carrera)
      const allDisciplines = Array.from(new Set(formData.formats.flatMap(f => f.disciplines).filter(Boolean)))
      const allModalities = Array.from(new Set(formData.formats.flatMap(f => f.modalities).filter(Boolean)))
      const formatNames = formData.formats.map(f => f.format).filter(Boolean)
      const firstFormat = formData.formats[0]
      
      const payload: Record<string, unknown> = {
        ...(selectedRace ? { raceId: selectedRace.id } : {
          name: raceFormData.name,
          raceName: raceFormData.name,
          discipline: firstFormat?.disciplines?.[0] || allDisciplines[0] || '',
          disciplines: allDisciplines,
          format: firstFormat?.format || formatNames[0] || '',
          formats: formatNames,
          modality: allModalities[0] || null,
          modalities: allModalities,
          description: raceFormData.description,
          registrationUrl: raceFormData.registrationUrl,
          website: raceFormData.website,
          instagram: raceFormData.instagram,
          contactPhone: raceFormData.contactPhone,
          raceProvinceId: formData.provinceId,
          raceCity: formData.city,
          raceStages: formData.stages,
          raceDays: formData.days,
          raceDistance: firstFormat?.distance || null,
          raceElevation: firstFormat?.elevation || null
        }),
        countryId: formData.countryId,
        provinceId: formData.provinceId,
        city: formData.city,
        stages: formData.stages,
        days: formData.days,
        formats: formData.formats
      }
      if (startDateToSend) payload.startDate = startDateToSend
      
      const response = await fetch('/api/races/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Error al crear la carrera/edición')
      
      const slug = data.edition?.race?.slug ?? data.race?.slug
      if (slug) router.push(`/races/${slug}`)
      else setError('No se recibió la carrera creada')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Crear nueva carrera</h1>
        
        {error && (
          <div className="bg-red-600 text-white p-4 rounded mb-4">
            <strong>Error:</strong> {error}
            {error.includes('DATABASE_URL') && (
              <div className="mt-2 text-sm">
                Asegúrate de tener DATABASE_URL configurada en tu archivo .env.local
              </div>
            )}
          </div>
        )}
        
        {/* Paso 1: Buscar carrera existente */}
        {step === 'search' && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Buscar Carrera Existente</h2>
            <p className="text-gray-300 mb-4">
              Busca si la carrera ya existe para evitar duplicados. Si la encuentras, solo necesitarás crear la edición.
            </p>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar carrera por nombre..."
              className="w-full px-4 py-2 bg-gray-700 text-white rounded mb-4"
            />
            
            {races.length > 0 && (
              <div className="space-y-2 mb-4">
                {races.map(race => (
                  <button
                    key={race.id}
                    onClick={() => handleSelectRace(race)}
                    className="w-full text-left p-4 bg-gray-700 hover:bg-gray-600 rounded transition"
                  >
                    <div className="font-semibold">{race.name}</div>
                    <div className="text-sm text-gray-400">
                      {race.discipline} • Ediciones: {race.editions.map(e => e.year).join(', ')}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {searchQuery.length >= 2 && races.length === 0 && !searching && (
              <div className="mb-4 p-4 bg-gray-700 rounded-lg text-center">
                <p className="text-gray-300 mb-4">
                  No se encontraron carreras con el nombre "{searchQuery}"
                </p>
                <button
                  onClick={handleCreateNew}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                >
                  Crear Nueva Carrera
                </button>
              </div>
            )}
            
            {searching && (
              <div className="mb-4 p-4 bg-gray-700 rounded-lg text-center">
                <p className="text-gray-300">Buscando...</p>
              </div>
            )}
            
            <button
              onClick={handleCreateNew}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
            >
              Crear Nueva Carrera
            </button>
          </div>
        )}
        
        {/* Paso 2: Formulario de edición (carrera existente) */}
        {step === 'edition' && selectedRace && (
          <>
            {/* Overlay para desktop */}
            <div className="hidden md:block fixed inset-0 bg-black bg-opacity-50 z-40" />
            
            {/* Modal en desktop, formulario normal en mobile */}
            <div className="relative md:fixed md:inset-0 md:flex md:items-center md:justify-center md:z-50 md:p-4">
              <div className="w-full md:max-w-3xl md:max-h-[90vh] md:overflow-y-auto bg-gray-800 rounded-lg md:shadow-xl">
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                      Crear Edición para: {selectedRace.name}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setStep('search')}
                      className="text-gray-400 hover:text-white text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                  
                  {/* Fecha de Inicio */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Fecha de Inicio</label>
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                      />
                    </div>
                  </div>
                  
                  {/* País y Provincia en la misma línea */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">País</label>
                      <select
                        value={formData.countryId}
                        onChange={(e) => {
                          const newCountryId = e.target.value
                          setFormData({ ...formData, countryId: newCountryId, provinceId: '' })
                          setSelectedCountryId(newCountryId)
                        }}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                      >
                        <option value="">Seleccionar país</option>
                        {countries.map(country => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Provincia *</label>
                      <select
                        required
                        value={formData.provinceId}
                        onChange={(e) => setFormData({ ...formData, provinceId: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                        disabled={!formData.countryId}
                      >
                        <option value="">{formData.countryId ? 'Seleccionar provincia' : 'Primero selecciona un país'}</option>
                        {provinces.map(province => (
                          <option key={province.id} value={province.id}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Localidad línea de abajo */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Localidad</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    />
                  </div>
                  
                  {/* Etapas y Días en la misma línea */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Etapas</label>
                      <input
                        type="number"
                        value={formData.stages}
                        onChange={(e) => setFormData({ ...formData, stages: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                        min="1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Días</label>
                      <input
                        type="number"
                        value={formData.days}
                        onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                        min="1"
                      />
                    </div>
                  </div>
                  
                  {/* Formatos */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Formatos</h3>
                      <button
                        type="button"
                        onClick={addFormat}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition text-sm"
                      >
                        + Agregar Formato
                      </button>
                    </div>
                    
                    {formData.formats.map((formatData, formatIndex) => (
                      <div key={formatIndex} className="bg-gray-700 p-4 rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Formato {formatIndex + 1}</h4>
                          {formData.formats.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFormat(formatIndex)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                        
                        {/* Nombre del Formato */}
                        <div>
                          <label className="block text-sm font-medium mb-1">Formato *</label>
                          <select
                            required
                            value={formatData.format}
                            onChange={(e) => updateFormat(formatIndex, 'format', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-600 text-white rounded"
                          >
                            <option value="">Seleccionar formato</option>
                            {allFormats.map((format: string) => (
                              <option key={format} value={format}>
                                {format}
                              </option>
                            ))}
                          </select>
                          {formatData.format && !allFormats.includes(formatData.format) && (
                            <p className="text-xs text-yellow-400 mt-1">
                              Este formato no está en la lista. Se guardará como nuevo formato.
                            </p>
                          )}
                        </div>
                        
                        {/* Distancia y Elevación en la misma línea */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Distancia</label>
                            <input
                              type="text"
                              value={formatData.distance}
                              onChange={(e) => updateFormat(formatIndex, 'distance', e.target.value)}
                              placeholder="Ej: 50 km"
                              className="w-full px-4 py-2 bg-gray-600 text-white rounded"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Elevación</label>
                            <input
                              type="text"
                              value={formatData.elevation}
                              onChange={(e) => updateFormat(formatIndex, 'elevation', e.target.value)}
                              placeholder="Ej: 1500m"
                              className="w-full px-4 py-2 bg-gray-600 text-white rounded"
                            />
                          </div>
                        </div>
                        
                        {/* Disciplinas y Modalidades en columnas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Disciplinas */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Disciplinas</label>
                            {allDisciplines.length === 0 ? (
                              <p className="text-sm text-gray-400 mb-2">Cargando disciplinas...</p>
                            ) : (
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {allDisciplines.map((disc: string) => (
                                  <label key={disc} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={formatData.disciplines.includes(disc)}
                                      onChange={(e) => {
                                        const newDisciplines = e.target.checked
                                          ? [...formatData.disciplines, disc]
                                          : formatData.disciplines.filter(d => d !== disc)
                                        updateFormat(formatIndex, 'disciplines', newDisciplines)
                                      }}
                                      className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                                    />
                                    <span>{disc}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Modalidades */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Modalidades</label>
                            {allModalities.length === 0 ? (
                              <p className="text-sm text-gray-400 mb-2">Cargando modalidades...</p>
                            ) : (
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {sortModalities(allModalities).map((mod: string) => (
                                  <label key={mod} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={formatData.modalities.includes(mod)}
                                      onChange={(e) => {
                                        const newModalities = e.target.checked
                                          ? [...formatData.modalities, mod]
                                          : formatData.modalities.filter(m => m !== mod)
                                        updateFormat(formatIndex, 'modalities', newModalities)
                                      }}
                                      className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                                    />
                                    <span>{mod}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
            
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep('search')}
                      className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition disabled:opacity-50"
                    >
                      {loading ? 'Creando...' : 'Crear Edición'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
        
        {/* Paso 3: Formulario completo (carrera nueva) */}
        {step === 'new' && (
          <>
            <div className="hidden md:block fixed inset-0 bg-black bg-opacity-50 z-40" />
            <div className="relative md:fixed md:inset-0 md:flex md:items-center md:justify-center md:z-50 md:p-4">
              <div className="w-full md:max-w-4xl md:max-h-[90vh] md:overflow-y-auto bg-gray-800 rounded-lg md:shadow-xl">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Crear nueva carrera</h2>
                    <button
                      type="button"
                      onClick={() => setStep('search')}
                      className="text-gray-400 hover:text-white text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                  
                  {/* Nombre de la Carrera */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre de la Carrera *</label>
                    <input
                      type="text"
                      required
                      value={raceFormData.name}
                      onChange={(e) => setRaceFormData({ ...raceFormData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    />
                  </div>
                  
                  {/* País y Provincia */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">País</label>
                      <select
                        value={formData.countryId}
                        onChange={(e) => {
                          const newCountryId = e.target.value
                          setFormData({ ...formData, countryId: newCountryId, provinceId: '' })
                          setSelectedCountryId(newCountryId)
                        }}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                      >
                        <option value="">Seleccionar país</option>
                        {countries.map(country => (
                          <option key={country.id} value={country.id}>{country.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Provincia *</label>
                      <select
                        required
                        value={formData.provinceId}
                        onChange={(e) => setFormData({ ...formData, provinceId: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                        disabled={!formData.countryId}
                      >
                        <option value="">{formData.countryId ? 'Seleccionar provincia' : 'Primero selecciona un país'}</option>
                        {provinces.map(province => (
                          <option key={province.id} value={province.id}>{province.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Localidad */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Localidad</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    />
                  </div>
                  
                  {/* Etapas y Días */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Etapas</label>
                      <input
                        type="number"
                        value={formData.stages}
                        onChange={(e) => setFormData({ ...formData, stages: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                        min={1}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Días</label>
                      <input
                        type="number"
                        value={formData.days}
                        onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                        min={1}
                      />
                    </div>
                  </div>
                  
                  {/* Caja de formatos */}
                  <div className="bg-gray-700/60 border border-gray-600 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Formatos</h3>
                      <button
                        type="button"
                        onClick={addFormat}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition text-sm"
                      >
                        + Agregar Formato
                      </button>
                    </div>
                    {formData.formats.length === 0 ? (
                      <p className="text-sm text-gray-400">Agrega al menos un formato.</p>
                    ) : (
                      formData.formats.map((formatData, formatIndex) => (
                        <div key={formatIndex} className="bg-gray-700 p-4 rounded-lg space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Formato {formatIndex + 1}</h4>
                            {formData.formats.length > 1 && (
                              <button type="button" onClick={() => removeFormat(formatIndex)} className="text-red-400 hover:text-red-300 text-sm">Eliminar</button>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Formato *</label>
                            <select
                              required
                              value={formatData.format}
                              onChange={(e) => updateFormat(formatIndex, 'format', e.target.value)}
                              className="w-full px-4 py-2 bg-gray-600 text-white rounded"
                            >
                              <option value="">Seleccionar formato</option>
                              {allFormats.map((f: string) => (
                                <option key={f} value={f}>{f}</option>
                              ))}
                            </select>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Disciplinas</label>
                              {allDisciplines.length === 0 ? (
                                <p className="text-sm text-gray-400">Cargando...</p>
                              ) : (
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                  {allDisciplines.map((disc: string) => (
                                    <label key={disc} className="flex items-center space-x-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={formatData.disciplines.includes(disc)}
                                        onChange={(e) => {
                                          const next = e.target.checked ? [...formatData.disciplines, disc] : formatData.disciplines.filter(d => d !== disc)
                                          updateFormat(formatIndex, 'disciplines', next)
                                        }}
                                        className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded"
                                      />
                                      <span>{disc}</span>
                                    </label>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Modalidades</label>
                              {allModalities.length === 0 ? (
                                <p className="text-sm text-gray-400">Cargando...</p>
                              ) : (
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                  {sortModalities(allModalities).map((mod: string) => (
                                    <label key={mod} className="flex items-center space-x-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={formatData.modalities.includes(mod)}
                                        onChange={(e) => {
                                          const next = e.target.checked ? [...formatData.modalities, mod] : formatData.modalities.filter(m => m !== mod)
                                          updateFormat(formatIndex, 'modalities', next)
                                        }}
                                        className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded"
                                      />
                                      <span>{mod}</span>
                                    </label>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Distancias y altimetrías</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input
                                type="text"
                                value={formatData.distance}
                                onChange={(e) => updateFormat(formatIndex, 'distance', e.target.value)}
                                placeholder="Ej: 50 km o 50 km & 80 km"
                                className="w-full px-4 py-2 bg-gray-600 text-white rounded"
                              />
                              <input
                                type="text"
                                value={formatData.elevation}
                                onChange={(e) => updateFormat(formatIndex, 'elevation', e.target.value)}
                                placeholder="Ej: 1500m o 1500m & 2000m"
                                className="w-full px-4 py-2 bg-gray-600 text-white rounded"
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Separar con & si hay más de una.</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Caja de datos de contacto */}
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-4">Datos de Contacto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Sitio Web</label>
                        <input
                          type="url"
                          value={raceFormData.website}
                          onChange={(e) => setRaceFormData({ ...raceFormData, website: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-600 text-white rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Instagram</label>
                        <div className="flex">
                          <span className="px-3 py-2 bg-gray-600 text-gray-300 rounded-l border-r border-gray-500">@</span>
                          <input
                            type="text"
                            value={raceFormData.instagram}
                            onChange={(e) => setRaceFormData({ ...raceFormData, instagram: e.target.value })}
                            placeholder="usuario"
                            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-r"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">URL de Inscripción</label>
                        <input
                          type="url"
                          value={raceFormData.registrationUrl}
                          onChange={(e) => setRaceFormData({ ...raceFormData, registrationUrl: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-600 text-white rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Teléfono de Contacto</label>
                        <input
                          type="tel"
                          value={raceFormData.contactPhone}
                          onChange={(e) => setRaceFormData({ ...raceFormData, contactPhone: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-600 text-white rounded"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Tiene fecha de edición definida? */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="hasEditionDate"
                      checked={formData.hasEditionDate}
                      onChange={(e) => setFormData({ ...formData, hasEditionDate: e.target.checked })}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                    />
                    <label htmlFor="hasEditionDate" className="text-sm font-medium">Tiene fecha de edición definida?</label>
                  </div>
                  
                  {/* Fecha de inicio (solo visible si checkbox tildado) */}
                  {formData.hasEditionDate && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Fecha de Inicio *</label>
                      <input
                        type="date"
                        required={formData.hasEditionDate}
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                      />
                    </div>
                  )}
                  
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setStep('search')} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded transition">Cancelar</button>
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition disabled:opacity-50">
                      {loading ? 'Creando...' : formData.hasEditionDate ? 'Crear Carrera y Edición' : 'Crear Carrera'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
