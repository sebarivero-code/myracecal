'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import LoadingAnimation from '@/app/components/LoadingAnimation'

interface Country {
  id: string
  name: string
}

interface Province {
  id: string
  name: string
  country: {
    id: string
    name: string
  }
}

interface EditionFormat {
  id?: string
  format: string
  distance?: string | null
  elevation?: string | null
  disciplines?: string[]
  modalities?: string[]
}

interface Edition {
  id: string
  year: number
  startDate: string
  city?: string | null
  province?: {
    id: string
    name: string
    country: {
      name: string
    }
  } | null
  stages?: number | null
  days?: number | null
  formats?: EditionFormat[]
  // Campos legacy (se mantienen para compatibilidad durante migración)
  distance?: string | null
  elevation?: string | null
  disciplines?: string[]
  modalities?: string[]
}

interface Race {
  id: string
  name: string
  discipline: string
  disciplines: string[]
  format?: string | null
  formats: string[]
  modality?: string | null
  modalities: string[]
  description?: string | null
  registrationUrl?: string | null
  website?: string | null
  instagram?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  city?: string | null
  provinceId?: string | null
  province?: {
    id: string
    name: string
    country: {
      name: string
    }
  } | null
  distance?: string | null
  elevation?: string | null
  stages?: number | null
  days?: number | null
  editions: Edition[]
}

// Orden preferido para modalidades
const MODALITY_ORDER = ['Individual', 'Dupla', 'Equipo de 3', 'Equipo de 4']

// Función para ordenar modalidades según el orden preferido
function sortModalities(modalities: string[]): string[] {
  const ordered: string[] = []
  const unordered: string[] = []
  
  // Primero agregar las que están en el orden preferido
  MODALITY_ORDER.forEach(modality => {
    if (modalities.includes(modality)) {
      ordered.push(modality)
    }
  })
  
  // Luego agregar las que no están en el orden preferido
  modalities.forEach(modality => {
    if (!MODALITY_ORDER.includes(modality)) {
      unordered.push(modality)
    }
  })
  
  return [...ordered, ...unordered.sort()]
}

export default function ManageRacePage() {
  const router = useRouter()
  const params = useParams()
  const raceId = params.id as string
  
  const [race, setRace] = useState<Race | null>(null)
  const [countries, setCountries] = useState<Country[]>([])
  const [provinces, setProvinces] = useState<Province[]>([])
  const [selectedCountryId, setSelectedCountryId] = useState<string>('')
  const [allDisciplines, setAllDisciplines] = useState<string[]>([])
  const [allModalities, setAllModalities] = useState<string[]>([])
  const [allFormats, setAllFormats] = useState<string[]>([])
  const initialProvinceIdRef = useRef<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCreateEdition, setShowCreateEdition] = useState(false)
  const [editingEditionId, setEditingEditionId] = useState<string | null>(null)
  
  // Formulario de carrera
  const [formData, setFormData] = useState({
    name: '',
    discipline: '',
    disciplines: [] as string[],
    format: '',
    formats: [] as string[],
    modality: '',
    modalities: [] as string[],
    description: '',
    registrationUrl: '',
    website: '',
    instagram: '',
    contactEmail: '',
    contactPhone: '',
    city: '',
    countryId: '',
    provinceId: '',
    distance: '',
    elevation: '',
    stages: '1',
    days: '1'
  })
  
  // Formulario de edición
  const [editionFormData, setEditionFormData] = useState({
    startDate: '',
    city: '',
    countryId: '',
    provinceId: '',
    stages: '1',
    days: '1',
    formats: [] as Array<{
      id?: string
      format: string
      distance: string
      elevation: string
      disciplines: string[]
      modalities: string[]
    }>
  })
  
  // Cargar países y opciones
  useEffect(() => {
    // Cargar países
    fetch('/api/countries')
      .then(async res => {
        if (!res.ok) {
          console.error('Error en respuesta de países:', res.status, res.statusText)
          return []
        }
        const data = await res.json().catch((err) => {
          console.error('Error parseando JSON de países:', err)
          return []
        })
        if (!Array.isArray(data)) {
          console.error('Datos de países no son un array:', data)
          return []
        }
        console.log(`✅ ${data.length} países cargados`)
        return data
      })
      .then(data => {
        setCountries(data)
        if (data.length === 0) {
          console.warn('⚠️ No se cargaron países. Verifica la conexión a la base de datos.')
        }
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
      // Usar el ref para mantener el provinceId inicial o el actual del formData
      const currentProvinceId = initialProvinceIdRef.current || formData.provinceId
      
      fetch(`/api/provinces?countryId=${encodeURIComponent(selectedCountryId)}`)
        .then(async res => {
          if (!res.ok) {
            console.error('Error en respuesta de provincias:', res.status, res.statusText)
            return []
          }
          const data = await res.json().catch((err) => {
            console.error('Error parseando JSON de provincias:', err)
            return []
          })
          if (!Array.isArray(data)) {
            console.error('Datos de provincias no son un array:', data)
            return []
          }
          console.log(`✅ ${data.length} provincias cargadas para el país seleccionado`)
          return data
        })
        .then(data => {
          setProvinces(data)
          
          // Si hay un provinceId guardado y está en la lista de provincias cargadas, mantenerlo
          if (currentProvinceId && data.some((p: Province) => p.id === currentProvinceId)) {
            // La provincia es válida, establecerla
            setFormData(prev => {
              if (prev.provinceId !== currentProvinceId) {
                return { ...prev, provinceId: currentProvinceId }
              }
              return prev
            })
            // Limpiar el ref después de usarlo
            initialProvinceIdRef.current = ''
          } else if (formData.countryId !== selectedCountryId) {
            // Cambió el país manualmente, limpiar la provincia seleccionada
            setFormData(prev => ({ ...prev, provinceId: '' }))
            initialProvinceIdRef.current = ''
          }
        })
        .catch(err => {
          console.error('Error cargando provincias:', err)
          setProvinces([])
        })
    } else {
      setProvinces([])
    }
  }, [selectedCountryId, formData.countryId])
  
  // Cargar carrera
  useEffect(() => {
    if (!raceId) return
    
    setLoading(true)
    fetch(`/api/races/manage/${raceId}`)
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || `Error ${res.status}`)
        }
        return res.json()
      })
      .then((data: Race) => {
        setRace(data)
        
        // Parsear disciplinas: extraer cada disciplina individual
        let disciplinesArray: string[] = []
        if (data.disciplines && data.disciplines.length > 0) {
          // Si viene como array, cada elemento puede ser un string combinado
          data.disciplines.forEach(d => {
            const disciplines = String(d).split(/\s*\/\s*/).filter(d => d.trim().length > 0)
            disciplines.forEach(discipline => {
              const trimmed = discipline.trim()
              if (trimmed && !disciplinesArray.includes(trimmed)) {
                disciplinesArray.push(trimmed)
              }
            })
          })
        } else if (data.discipline) {
          // Si es string, separar por " / "
          disciplinesArray = data.discipline.split(/\s*\/\s*/)
            .filter(d => d.trim().length > 0)
            .map(d => d.trim())
        }
        
        // Parsear modalidades: extraer cada modalidad individual
        let modalitiesArray: string[] = []
        if (data.modalities && data.modalities.length > 0) {
          // Si viene como array, cada elemento puede ser un string combinado
          data.modalities.forEach(m => {
            const modalities = String(m).split(/\s*&\s*/).filter(m => m.trim().length > 0)
            modalities.forEach(modality => {
              const trimmed = modality.trim()
              if (trimmed && !modalitiesArray.includes(trimmed)) {
                modalitiesArray.push(trimmed)
              }
            })
          })
        } else if (data.modality) {
          // Si es string, separar por " & "
          modalitiesArray = data.modality.split(/\s*&\s*/)
            .filter(m => m.trim().length > 0)
            .map(m => m.trim())
        }
        
        // Obtener countryId de la provincia si existe
        const countryId = data.province?.country?.id || data.province?.countryId || ''
        const provinceId = data.provinceId || ''
        
        // Guardar el provinceId inicial en el ref para que se preserve cuando se carguen las provincias
        if (provinceId) {
          initialProvinceIdRef.current = provinceId
        }
        
        // Precargar formulario con datos de la carrera
        setFormData({
          name: data.name || '',
          discipline: data.discipline || '',
          disciplines: disciplinesArray,
          format: data.format || '',
          formats: data.formats || [],
          modality: data.modality || '',
          modalities: modalitiesArray,
          description: data.description || '',
          registrationUrl: data.registrationUrl || '',
          website: data.website || '',
          instagram: data.instagram || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          city: data.city || '',
          countryId: countryId,
          provinceId: provinceId,
          distance: data.distance || '',
          elevation: data.elevation || '',
          stages: data.stages?.toString() || '1',
          days: data.days?.toString() || '1'
        })
        
        // Establecer el país seleccionado para cargar las provincias
        // Esto disparará el useEffect que cargará las provincias y restaurará el provinceId
        if (countryId) {
          setSelectedCountryId(countryId)
        }
      })
      .catch(err => {
        console.error('Error cargando carrera:', err)
        setError(err.message || 'Error al cargar la carrera')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [raceId])
  
  // Precargar formulario de edición cuando se muestra (solo si no se está editando una edición existente)
  useEffect(() => {
    if (showCreateEdition && race && !editingEditionId) {
      // Parsear disciplinas: extraer cada disciplina individual
      let disciplinesArray: string[] = []
      if (race.disciplines && race.disciplines.length > 0) {
        race.disciplines.forEach(d => {
          const disciplines = String(d).split(/\s*\/\s*/).filter(d => d.trim().length > 0)
          disciplines.forEach(discipline => {
            const trimmed = discipline.trim()
            if (trimmed && !disciplinesArray.includes(trimmed)) {
              disciplinesArray.push(trimmed)
            }
          })
        })
      } else if (race.discipline) {
        disciplinesArray = race.discipline.split(/\s*\/\s*/)
          .filter(d => d.trim().length > 0)
          .map(d => d.trim())
      }
      
      // Parsear modalidades: extraer cada modalidad individual
      let modalitiesArray: string[] = []
      if (race.modalities && race.modalities.length > 0) {
        race.modalities.forEach(m => {
          const modalities = String(m).split(/\s*&\s*/).filter(m => m.trim().length > 0)
          modalities.forEach(modality => {
            const trimmed = modality.trim()
            if (trimmed && !modalitiesArray.includes(trimmed)) {
              modalitiesArray.push(trimmed)
            }
          })
        })
      } else if (race.modality) {
        modalitiesArray = race.modality.split(/\s*&\s*/)
          .filter(m => m.trim().length > 0)
          .map(m => m.trim())
      }
      
      const countryId = race.province?.country?.id || race.province?.countryId || ''
      
      // Crear formato por defecto desde los datos de la carrera
      // Si no hay formato, dejar vacío para que el usuario seleccione uno
      const defaultFormat = race.format || 
                           (race.formats && race.formats.length > 0 ? race.formats[0] : '')
      
      setEditionFormData({
        startDate: '',
        city: race.city || '',
        countryId: countryId,
        provinceId: race.provinceId || '',
        stages: race.stages?.toString() || '1',
        days: race.days?.toString() || '1',
        formats: [{
          format: defaultFormat,
          distance: race.distance || '',
          elevation: race.elevation || '',
          disciplines: disciplinesArray,
          modalities: modalitiesArray
        }]
      })
      
      // Establecer el país seleccionado para cargar las provincias
      if (countryId) {
        setSelectedCountryId(countryId)
      }
    }
  }, [showCreateEdition, race])
  
  const handleSaveRace = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    
    try {
      // Generar modality string desde las modalidades seleccionadas (para el campo legacy)
      const modalityString = formData.modalities.length > 0 
        ? formData.modalities.join(' & ')
        : null
      
      // Generar discipline string desde las disciplinas seleccionadas (para el campo legacy)
      const disciplineString = formData.disciplines.length > 0
        ? formData.disciplines.join(' / ')
        : formData.discipline || null
      
      const payload = {
        ...formData,
        modality: modalityString,
        discipline: disciplineString,
        // Enviar arrays directamente para que se guarden en la BD
        disciplines: formData.disciplines,
        modalities: formData.modalities
      }
      
      const response = await fetch(`/api/races/manage/${raceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar la carrera')
      }
      
      // Recargar carrera
      const raceResponse = await fetch(`/api/races/manage/${raceId}`)
      const updatedRace = await raceResponse.json()
      setRace(updatedRace)
      
      alert('Carrera actualizada correctamente')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }
  
  // Funciones helper para manejar formatos
  const addFormat = () => {
    setEditionFormData({
      ...editionFormData,
      formats: [...editionFormData.formats, {
        format: '',
        distance: '',
        elevation: '',
        disciplines: [],
        modalities: []
      }]
    })
  }
  
  const removeFormat = (index: number) => {
    setEditionFormData({
      ...editionFormData,
      formats: editionFormData.formats.filter((_, i) => i !== index)
    })
  }
  
  const updateFormat = (index: number, field: string, value: any) => {
    const newFormats = [...editionFormData.formats]
    newFormats[index] = { ...newFormats[index], [field]: value }
    setEditionFormData({ ...editionFormData, formats: newFormats })
  }
  
  const handleSaveEdition = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    
    try {
      // Validar que haya al menos un formato
      if (editionFormData.formats.length === 0) {
        throw new Error('Debes agregar al menos un formato')
      }
      
      // Validar que cada formato tenga un nombre
      for (const format of editionFormData.formats) {
        if (!format.format || format.format.trim() === '') {
          throw new Error('Todos los formatos deben tener un nombre')
        }
      }
      
      let response
      
      if (editingEditionId) {
        // Actualizar edición existente
        response = await fetch(`/api/races/manage/${raceId}/editions/${editingEditionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            startDate: editionFormData.startDate,
            city: editionFormData.city,
            provinceId: editionFormData.provinceId,
            stages: editionFormData.stages,
            days: editionFormData.days,
            formats: editionFormData.formats
          })
        })
      } else {
        // Crear nueva edición
        const year = new Date(editionFormData.startDate).getFullYear()
        
        response = await fetch('/api/races/new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            raceId: raceId,
            provinceId: editionFormData.provinceId,
            city: editionFormData.city,
            year,
            startDate: editionFormData.startDate,
            stages: editionFormData.stages,
            days: editionFormData.days,
            formats: editionFormData.formats
          })
        })
      }
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || `Error al ${editingEditionId ? 'actualizar' : 'crear'} la edición`)
      }
      
      // Recargar carrera
      const raceResponse = await fetch(`/api/races/manage/${raceId}`)
      const updatedRace = await raceResponse.json()
      setRace(updatedRace)
      
      setShowCreateEdition(false)
      setEditingEditionId(null)
      const countryId = race?.province?.country?.id || race?.province?.countryId || ''
      
      setEditionFormData({
        startDate: '',
        city: race?.city || '',
        countryId: countryId,
        provinceId: race?.provinceId || '',
        distance: race?.distance || '',
        elevation: race?.elevation || '',
        stages: race?.stages?.toString() || '1',
        days: race?.days?.toString() || '1',
        disciplines: race?.disciplines || [],
        modalities: race?.modalities || []
      })
      
      if (countryId) {
        setSelectedCountryId(countryId)
      }
      
      alert(`Edición ${editingEditionId ? 'actualizada' : 'creada'} correctamente`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }
  
  const handleEditEdition = (edition: Edition) => {
    setEditingEditionId(edition.id)
    
    // Parsear la fecha correctamente
    let dateString = ''
    if (edition.startDate) {
      try {
        const date = new Date(edition.startDate)
        // Verificar que la fecha sea válida
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          dateString = `${year}-${month}-${day}`
        } else {
          console.warn('Fecha inválida:', edition.startDate)
        }
      } catch (e) {
        console.error('Error parseando fecha:', e, edition.startDate)
      }
    }
    
    // Parsear disciplinas de la edición o de la carrera
    let disciplinesArray: string[] = []
    if (edition.disciplines && edition.disciplines.length > 0) {
      edition.disciplines.forEach(d => {
        const disciplines = String(d).split(/\s*\/\s*/).filter(d => d.trim().length > 0)
        disciplines.forEach(discipline => {
          const trimmed = discipline.trim()
          if (trimmed && !disciplinesArray.includes(trimmed)) {
            disciplinesArray.push(trimmed)
          }
        })
      })
    } else if (race) {
      // Usar disciplinas de la carrera
      if (race.disciplines && race.disciplines.length > 0) {
        race.disciplines.forEach(d => {
          const disciplines = String(d).split(/\s*\/\s*/).filter(d => d.trim().length > 0)
          disciplines.forEach(discipline => {
            const trimmed = discipline.trim()
            if (trimmed && !disciplinesArray.includes(trimmed)) {
              disciplinesArray.push(trimmed)
            }
          })
        })
      } else if (race.discipline) {
        disciplinesArray = race.discipline.split(/\s*\/\s*/)
          .filter(d => d.trim().length > 0)
          .map(d => d.trim())
      }
    }
    
    // Parsear modalidades de la edición o de la carrera
    let modalitiesArray: string[] = []
    if (edition.modalities && edition.modalities.length > 0) {
      edition.modalities.forEach(m => {
        const modalities = String(m).split(/\s*&\s*/).filter(m => m.trim().length > 0)
        modalities.forEach(modality => {
          const trimmed = modality.trim()
          if (trimmed && !modalitiesArray.includes(trimmed)) {
            modalitiesArray.push(trimmed)
          }
        })
      })
    } else if (race) {
      // Usar modalidades de la carrera
      if (race.modalities && race.modalities.length > 0) {
        race.modalities.forEach(m => {
          const modalities = String(m).split(/\s*&\s*/).filter(m => m.trim().length > 0)
          modalities.forEach(modality => {
            const trimmed = modality.trim()
            if (trimmed && !modalitiesArray.includes(trimmed)) {
              modalitiesArray.push(trimmed)
            }
          })
        })
      } else if (race.modality) {
        modalitiesArray = race.modality.split(/\s*&\s*/)
          .filter(m => m.trim().length > 0)
          .map(m => m.trim())
      }
    }
    
    // Obtener countryId de la edición o de la carrera
    const countryId = edition.province?.country?.id || 
                     (edition.province?.country ? 
                       (race?.province?.country?.id || race?.province?.countryId || '') : 
                       (race?.province?.country?.id || race?.province?.countryId || ''))
    
    // Cargar formatos de la edición o crear uno por defecto desde la carrera
    let formatsArray: Array<{
      id?: string
      format: string
      distance: string
      elevation: string
      disciplines: string[]
      modalities: string[]
    }> = []
    
    if (edition.formats && edition.formats.length > 0) {
      // Usar formatos de la edición
      formatsArray = edition.formats.map(f => ({
        id: f.id,
        format: f.format,
        distance: f.distance || '',
        elevation: f.elevation || '',
        disciplines: f.disciplines || [],
        modalities: f.modalities || []
      }))
    } else {
      // Crear un formato por defecto desde los datos legacy o de la carrera
      // Si no hay formato, dejar vacío para que el usuario seleccione uno
      const defaultFormat = race?.format || 
                           (race?.formats && race.formats.length > 0 ? race.formats[0] : '')
      formatsArray = [{
        format: defaultFormat,
        distance: edition.distance !== undefined ? edition.distance : (race?.distance || ''),
        elevation: edition.elevation !== undefined ? edition.elevation : (race?.elevation || ''),
        disciplines: disciplinesArray,
        modalities: modalitiesArray
      }]
    }
    
    // Usar datos de la edición si existen, sino usar los de la carrera
    const formData = {
      startDate: dateString,
      city: edition.city !== undefined ? edition.city : (race?.city || ''),
      countryId: countryId,
      provinceId: edition.province?.id || race?.provinceId || '',
      stages: edition.stages !== undefined ? edition.stages.toString() : (race?.stages?.toString() || '1'),
      days: edition.days !== undefined ? edition.days.toString() : (race?.days?.toString() || '1'),
      formats: formatsArray
    }
    
    console.log('📅 Editando edición - Fecha parseada:', dateString, 'Desde:', edition.startDate)
    console.log('📝 FormData completo:', formData)
    
    setEditionFormData(formData)
    
    // Establecer el país seleccionado para cargar las provincias
    if (countryId) {
      setSelectedCountryId(countryId)
    }
    
    setShowCreateEdition(true)
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <LoadingAnimation size={400} />
        </div>
      </div>
    )
  }
  
  if (!race) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-600 text-white p-4 rounded mb-4">
            <strong>Error:</strong> {error || 'Carrera no encontrada'}
          </div>
          <Link href="/races/manage" className="text-blue-400 hover:text-blue-300">
            ← Volver a gestión de carreras
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/races/manage" className="text-blue-400 hover:text-blue-300 mb-2 inline-block">
            ← Volver a gestión de carreras
          </Link>
          <h1 className="text-3xl font-bold">{race.name}</h1>
        </div>
        
        {error && (
          <div className="bg-red-600 text-white p-4 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {/* Formulario de carrera */}
        <form onSubmit={handleSaveRace} className="bg-gray-800 p-6 rounded-lg space-y-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Datos de la Carrera</h2>
          
          {/* Nombre y Formato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre de la Carrera *</label>
              <input
                type="text"
                required
                value={formData.name || race.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Formato</label>
              <input
                type="text"
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
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
              <label className="block text-sm font-medium mb-1">Provincia</label>
              <select
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
          
          {/* Distancia y Elevación en la misma línea */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Distancia</label>
              <input
                type="text"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                placeholder="Ej: 50 km"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Elevación</label>
              <input
                type="text"
                value={formData.elevation}
                onChange={(e) => setFormData({ ...formData, elevation: e.target.value })}
                placeholder="Ej: 1500m"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded"
              />
            </div>
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
                        checked={formData.disciplines.includes(disc)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              disciplines: [...formData.disciplines, disc]
                            })
                          } else {
                            setFormData({
                              ...formData,
                              disciplines: formData.disciplines.filter(d => d !== disc)
                            })
                          }
                        }}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <span>{disc}</span>
                    </label>
                  ))}
                </div>
              )}
              {formData.disciplines.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">Selecciona al menos una disciplina</p>
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
                        checked={formData.modalities.includes(mod)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              modalities: [...formData.modalities, mod]
                            })
                          } else {
                            setFormData({
                              ...formData,
                              modalities: formData.modalities.filter(m => m !== mod)
                            })
                          }
                        }}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <span>{mod}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Datos de contacto agrupados */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-4">Datos de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sitio Web</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Instagram</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-gray-600 text-gray-300 rounded-l border-r border-gray-500">
                    @
                  </span>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="usuario"
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-r"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">URL de Inscripción</label>
                <input
                  type="url"
                  value={formData.registrationUrl}
                  onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Teléfono de Contacto</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded"
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
        
        {/* Listado de ediciones */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Ediciones</h2>
            <button
              onClick={() => {
                setShowCreateEdition(!showCreateEdition)
                setEditingEditionId(null)
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition"
            >
              {showCreateEdition ? 'Cancelar' : 'Crear Edición'}
            </button>
          </div>
          
          {race.editions.length === 0 ? (
            <p className="text-gray-400">No hay ediciones creadas</p>
          ) : (
            <div className="space-y-2">
              {race.editions.map(edition => {
                const date = new Date(edition.startDate)
                const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
                const month = monthNames[date.getMonth()]
                const locationParts = []
                if (edition.city) locationParts.push(edition.city)
                if (edition.province) {
                  locationParts.push(edition.province.name)
                  if (edition.province.country) locationParts.push(edition.province.country.name)
                }
                const location = locationParts.join(', ') || 'Sin ubicación'
                
                return (
                  <div
                    key={edition.id}
                    onClick={() => handleEditEdition(edition)}
                    className="p-4 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{month}-{edition.year}</div>
                        <div className="text-sm text-gray-400">{location}</div>
                      </div>
                      <div className="text-blue-400">Editar →</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        
        {/* Formulario de crear/editar edición - Modal en desktop, normal en mobile */}
        {showCreateEdition && (
          <>
            {/* Overlay para desktop */}
            <div className="hidden md:block fixed inset-0 bg-black bg-opacity-50 z-40" />
            
            {/* Modal en desktop, formulario normal en mobile */}
            <div className="relative md:fixed md:inset-0 md:flex md:items-center md:justify-center md:z-50 md:p-4">
              <div className="w-full md:max-w-3xl md:max-h-[90vh] md:overflow-y-auto bg-gray-800 rounded-lg md:shadow-xl">
                <form onSubmit={handleSaveEdition} className="p-6 space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                      {editingEditionId ? 'Editar Edición' : 'Crear Nueva Edición'}
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateEdition(false)
                        setEditingEditionId(null)
                      }}
                      className="text-gray-400 hover:text-white text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="text-lg font-medium text-gray-300 mb-4">
                    Carrera: {race.name}
                  </div>
                  
                  {/* Fecha de la Edición */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha de la Edición *</label>
                    <input
                      type="date"
                      required
                      value={editionFormData.startDate}
                      onChange={(e) => setEditionFormData({ ...editionFormData, startDate: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    />
                  </div>
                  
                  {/* País y Provincia en la misma línea */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">País</label>
                      <select
                        value={editionFormData.countryId}
                        onChange={(e) => {
                          const newCountryId = e.target.value
                          setEditionFormData({ ...editionFormData, countryId: newCountryId, provinceId: '' })
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
                      <label className="block text-sm font-medium mb-1">Provincia</label>
                      <select
                        value={editionFormData.provinceId}
                        onChange={(e) => setEditionFormData({ ...editionFormData, provinceId: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                        disabled={!editionFormData.countryId}
                      >
                        <option value="">{editionFormData.countryId ? 'Seleccionar provincia' : 'Primero selecciona un país'}</option>
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
                      value={editionFormData.city}
                      onChange={(e) => setEditionFormData({ ...editionFormData, city: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                    />
                  </div>
                  
                  {/* Etapas y Días en la misma línea */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Etapas</label>
                      <input
                        type="number"
                        value={editionFormData.stages}
                        onChange={(e) => setEditionFormData({ ...editionFormData, stages: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded"
                        min="1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Días</label>
                      <input
                        type="number"
                        value={editionFormData.days}
                        onChange={(e) => setEditionFormData({ ...editionFormData, days: e.target.value })}
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
                    
                    {editionFormData.formats.map((formatData, formatIndex) => (
                      <div key={formatIndex} className="bg-gray-700 p-4 rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Formato {formatIndex + 1}</h4>
                          {editionFormData.formats.length > 1 && (
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
                      onClick={() => {
                        setShowCreateEdition(false)
                        setEditingEditionId(null)
                      }}
                      className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded transition disabled:opacity-50"
                    >
                      {saving ? 'Guardando...' : (editingEditionId ? 'Actualizar Edición' : 'Crear Edición')}
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
