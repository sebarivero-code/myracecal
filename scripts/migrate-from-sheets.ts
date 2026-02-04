/**
 * Script de Migración: Google Sheets / Excel → Base de datos (Render u otra PostgreSQL)
 *
 * Lee UNA pestaña según la URL (GOOGLE_SHEET_URL con gid de la pestaña).
 * MIGRATE_SHEET_LAYOUT=2026 (default) o carreras para elegir el mapeo de columnas.
 *
 * Pestaña "2026": B=Fecha, C=Carrera, D=Id, E=Discip., F=Formato, G=Localidad, H=Provincia, I=País,
 * J=Modalidad, L=# Etapas, M=# Días, N=Km, O=M+, P=Instagram, Q=Tel, R=Site, S=Inscripcion, etc.
 *
 * Pestaña "Carreras": A=Carrera, B=Id, C=Disciplina, D=Formato, E=Localidad, F=Provincia, G=País.
 * (Sin fecha en la hoja; se usa 2026-01-01 por defecto para crear una edición.)
 *
 * Para migrar también las carreras de la solapa "Carreras" (ej. 2 de Santa Fe), pon en .env:
 * GOOGLE_SHEET_URL=<url con gid de la pestaña Carreras>
 * MIGRATE_SHEET_LAYOUT=carreras
 * y ejecuta npm run migrate:sheets una segunda vez (o usa una URL con gid de Carreras).
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

// Importar solo las funciones necesarias y adaptarlas para Node.js
// (sin dependencias de Next.js)

interface Stage {
  number: number
  name?: string
  distance?: number
  elevation?: number
  startDate?: string
  endDate?: string
}

interface CsvRace {
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
  stageDetails?: Stage[]
  days?: number
  registrationUrl?: string
  contactPhone?: string
  website?: string
  instagram?: string
}

// Función para leer desde Google Sheets (adaptada para Node.js)
async function getRacesFromGoogleSheets(sheetUrl: string, layout: SheetLayout = '2026'): Promise<CsvRace[]> {
  const csvUrl = convertToCsvUrl(sheetUrl)
  const response = await fetch(csvUrl)
  
  if (!response.ok) {
    throw new Error(`Error al obtener datos: ${response.status} ${response.statusText}`)
  }
  
  const csvText = await response.text()
  if (!csvText || csvText.trim().length === 0) {
    throw new Error('El CSV está vacío')
  }
  
  return parseCsvToRaces(csvText, layout)
}

function convertToCsvUrl(sheetUrl: string): string {
  if (sheetUrl.includes('/export?format=csv')) {
    return sheetUrl
  }
  
  const sheetIdMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  if (!sheetIdMatch) {
    throw new Error('URL de Google Sheets inválida')
  }
  
  const sheetId = sheetIdMatch[1]
  const gidMatch = sheetUrl.match(/[#&]gid=([0-9]+)/)
  const gid = gidMatch ? gidMatch[1] : '0'
  
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
}

// Pestaña "2026": B=Fecha, C=Carrera, D=Id, E=Discip., F=Formato, G=Localidad, H=Provincia, I=País, J=Modalidad, L=# Etapas, M=# Días, N=Km, O=M+, P=Instagram, Q=Tel, R=Site, S=Inscripcion, etc.
const COL_2026 = {
  fecha: 1,       // B
  carrera: 2,     // C
  id: 3,          // D
  discip: 4,      // E
  formato: 5,      // F
  localidad: 6,   // G
  provincia: 7,    // H
  pais: 8,         // I
  modalidad: 9,   // J
  stages: 11,     // L # Etapas
  days: 12,       // M # Días
  distance: 13,   // N Km
  elevation: 14,  // O M+
  instagram: 15,  // P
  tel: 16,        // Q
  site: 17,       // R
  inscripcion: 18,// S
  etapa1Start: 19 // T (T=name, U=dist, V=alt, W=from, X=to); Etapa2 en 24, Etapa3 en 29, ...
}

// Pestaña "Carreras": A=Carrera, B=Id, C=Disciplina, D=Formato, E=Localidad, F=Provincia, G=País, H=Modalidad, I=Campeonato, J=#Etapas, K=#Días, L=Kms
const COL_CARRERAS = {
  carrera: 0,     // A
  id: 1,          // B
  discip: 2,      // C
  formato: 3,     // D
  localidad: 4,   // E
  provincia: 5,   // F
  pais: 6,        // G (puede ser "ARG" → se normaliza a "Argentina")
  modalidad: 7,   // H
  stages: 9,      // J #Etapas
  days: 10,       // K #Días
  distance: 11,   // L Kms
}

function normalizeCountryCarreras(value: string): string {
  const v = (value || '').trim().toUpperCase()
  if (v === 'ARG' || v === 'AR') return 'Argentina'
  if (v === 'CHILE' || v === 'CL') return 'Chile'
  if (v === 'URUGUAY' || v === 'UY') return 'Uruguay'
  if (v === 'PARAGUAY' || v === 'PY') return 'Paraguay'
  if (v === 'BOLIVIA' || v === 'BO') return 'Bolivia'
  if (v === 'BRASIL' || v === 'BR') return 'Brasil'
  if (v === 'PERU' || v === 'PERÚ' || v === 'PE') return 'Perú'
  if (v === 'COLOMBIA' || v === 'CO') return 'Colombia'
  return value.trim() || ''
}

type SheetLayout = '2026' | 'carreras'

/**
 * Parsea fecha en formato d/m/aaaa (día, mes, año).
 * Acepta también d/m/aa: año 00-99 → 2000-2099.
 * Separadores: / - .
 * Ignora texto extra (ej. "26/4/2026 0:00:00").
 */
function parseDateDMY(dateValue: string): string | null {
  const s = dateValue.trim()
  if (!s) return null
  const m = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})(?:\s|$)/)
  if (!m) return null
  const day = parseInt(m[1], 10)
  const month = parseInt(m[2], 10) - 1
  let year = parseInt(m[3], 10)
  if (m[3].length === 2) {
    year = year >= 0 && year <= 99 ? 2000 + year : year
  }
  if (year < 2000 || year > 2100) return null
  if (month < 0 || month > 11 || day < 1 || day > 31) return null
  const d = new Date(Date.UTC(year, month, day, 12, 0, 0))
  if (isNaN(d.getTime())) return null
  return d.toISOString()
}

function parseCsvToRaces(csvText: string, layout: SheetLayout = '2026'): CsvRace[] {
  const lines = csvText.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  const isCarreras = layout === 'carreras'
  const col = isCarreras ? COL_CARRERAS : COL_2026
  const races: CsvRace[] = []
  const defaultStartDate = '2026-01-01T12:00:00.000Z' // para pestaña Carreras sin columna Fecha

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i])
    
    if (values.length === 0 || values.every(v => !v || v.trim() === '')) {
      continue
    }
    
    const race: Partial<CsvRace> = {}
    
    const idValue = values[col.id]?.trim()
    race.id = idValue ? parseInt(idValue) || i : i
    race.name = values[col.carrera]?.trim()
    
    const disciplineValue = values[col.discip]?.trim() || ''
    race.discipline = disciplineValue
    if (disciplineValue.includes('/')) {
      race.disciplines = disciplineValue.split('/').map(d => d.trim()).filter(Boolean)
    } else {
      race.disciplines = disciplineValue ? [disciplineValue] : []
    }
    
    if (!isCarreras) {
      const modalityValue = values[COL_2026.modalidad]?.trim() || ''
      race.modality = modalityValue
      if (modalityValue.includes('&')) {
        race.modalities = modalityValue.split('&').map(m => m.trim()).filter(Boolean)
      } else {
        race.modalities = modalityValue ? [modalityValue] : []
      }
    }
    
    race.city = values[col.localidad]?.trim()
    race.province = values[col.provincia]?.trim()
    race.country = isCarreras ? normalizeCountryCarreras(values[col.pais] || '') : values[col.pais]?.trim()
    
    const locationParts = [race.city, race.province, race.country].filter(Boolean)
    race.location = locationParts.join(', ') || ''
    
    if (isCarreras) {
      race.startDate = defaultStartDate
      const stagesVal = values[COL_CARRERAS.stages]?.trim()
      race.stages = stagesVal ? (parseInt(stagesVal) || 1) : 1
      const daysVal = values[COL_CARRERAS.days]?.trim()
      race.days = daysVal ? (parseInt(daysVal) || 1) : 1
      const modalityVal = values[COL_CARRERAS.modalidad]?.trim() || ''
      race.modality = modalityVal
      race.modalities = modalityVal.includes('&') ? modalityVal.split('&').map(m => m.trim()).filter(Boolean) : (modalityVal ? [modalityVal] : [])
      const kmsVal = values[COL_CARRERAS.distance]?.trim()
      if (kmsVal) {
        const firstPart = kmsVal.includes('&') ? kmsVal.split('&')[0].trim() : kmsVal
        const cleaned = firstPart.replace(/[^\d.,]/g, '').replace(',', '.')
        const num = parseFloat(cleaned)
        if (!isNaN(num) && num > 0) race.distance = num
      }
    } else {
      const dateValue = values[COL_2026.fecha]?.trim()
      if (dateValue) {
        let parsed = parseDateDMY(dateValue)
        if (!parsed && /^\d{4}-\d{2}-\d{2}/.test(dateValue)) {
          const iso = dateValue.slice(0, 10)
          const [y, mo, d] = iso.split('-').map(Number)
          if (y >= 2000 && y <= 2100 && mo >= 1 && mo <= 12 && d >= 1 && d <= 31) {
            parsed = new Date(Date.UTC(y, mo - 1, d, 12, 0, 0)).toISOString()
          }
        }
        if (parsed) race.startDate = parsed
      }
      const stagesValue = values[COL_2026.stages]?.trim()
      if (stagesValue) {
        const stages = parseInt(stagesValue)
        if (!isNaN(stages) && stages > 0) race.stages = stages
      }
      const daysValue = values[COL_2026.days]?.trim()
      if (daysValue) {
        const days = parseInt(daysValue)
        if (!isNaN(days) && days > 0) race.days = days
      }
    }
    
    const formatValue = values[col.formato]?.trim() || ''
    race.format = formatValue
    if (formatValue.includes('/')) {
      race.formats = formatValue.split('/').map(f => f.trim()).filter(Boolean)
    } else {
      race.formats = formatValue ? [formatValue] : []
    }
    
    if (!isCarreras) {
      const distanceValue = values[COL_2026.distance]?.trim()
      if (distanceValue) {
        const cleaned = distanceValue.replace(/[^\d.,]/g, '').replace(',', '.')
        const distanceNum = parseFloat(cleaned)
        if (!isNaN(distanceNum) && distanceNum > 0) race.distance = distanceNum
      }
      const elevationValue = values[COL_2026.elevation]?.trim()
      if (elevationValue) {
        let cleaned = elevationValue.replace(/[^\d.,]/g, '')
        if (cleaned.includes(',')) {
          const parts = cleaned.split(',')
          if (parts.length === 2) {
            const afterComma = parts[1]
            if (afterComma.length === 3) cleaned = cleaned.replace(',', '')
            else if (afterComma.length <= 2) cleaned = cleaned.replace(',', '.')
          } else cleaned = cleaned.replace(/,/g, '')
        }
        const elevationNum = parseFloat(cleaned)
        if (!isNaN(elevationNum) && elevationNum > 0) race.elevation = elevationNum
      }
      if (values[COL_2026.instagram]?.trim()) race.instagram = values[COL_2026.instagram].trim()
      if (values[COL_2026.tel]?.trim()) race.contactPhone = values[COL_2026.tel].trim()
      if (values[COL_2026.site]?.trim()) race.website = values[COL_2026.site].trim()
      if (values[COL_2026.inscripcion]?.trim()) race.registrationUrl = values[COL_2026.inscripcion].trim()
      if (race.stages && race.stages > 0) {
        const stageDetails: Stage[] = []
        for (let stageNum = 1; stageNum <= Math.min(race.stages, 8); stageNum++) {
          const baseIndex = COL_2026.etapa1Start + (stageNum - 1) * 5
          stageDetails.push({
            number: stageNum,
            name: values[baseIndex]?.trim() || undefined,
            distance: values[baseIndex + 1]?.trim() ? parseFloat(values[baseIndex + 1].trim().replace(/[^\d.,]/g, '').replace(',', '.')) : undefined,
            elevation: values[baseIndex + 2]?.trim() ? parseFloat(values[baseIndex + 2].trim().replace(/[^\d.,]/g, '').replace(',', '.')) : undefined,
            startDate: values[baseIndex + 3]?.trim() || undefined,
            endDate: values[baseIndex + 4]?.trim() || undefined
          })
        }
        if (stageDetails.length > 0) race.stageDetails = stageDetails
      }
    }
    
    const hasRequired = race.name && race.discipline && (race.startDate || isCarreras)
    if (hasRequired) {
      races.push(race as CsvRace)
    }
  }
  
  return races
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

const prisma = new PrismaClient()

// Función para generar slug desde nombre
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover tildes
    .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres especiales con guiones
    .replace(/^-+|-+$/g, '') // Remover guiones al inicio y final
    .substring(0, 100) // Limitar longitud
}

// Función para parsear primera distancia
function parseFirstDistance(distanceValue?: string): string | null {
  if (!distanceValue) return null
  
  // Si tiene "/", tomar la primera parte
  if (distanceValue.includes('/')) {
    const firstPart = distanceValue.split('/')[0].trim()
    // Si tiene "&", tomar la primera distancia
    if (firstPart.includes('&')) {
      const firstDist = firstPart.split('&')[0].trim()
      const cleaned = firstDist.replace(/[^\d.,]/g, '').replace(',', '.')
      const num = parseFloat(cleaned)
      return !isNaN(num) && num > 0 ? `${num} km` : null
    } else {
      const cleaned = firstPart.replace(/[^\d.,]/g, '').replace(',', '.')
      const num = parseFloat(cleaned)
      return !isNaN(num) && num > 0 ? `${num} km` : null
    }
  } else if (distanceValue.includes('&')) {
    // Múltiples distancias separadas por "&", tomar la primera
    const firstDist = distanceValue.split('&')[0].trim()
    const cleaned = firstDist.replace(/[^\d.,]/g, '').replace(',', '.')
    const num = parseFloat(cleaned)
    return !isNaN(num) && num > 0 ? `${num} km` : null
  } else {
    // Una sola distancia
    const cleaned = distanceValue.replace(/[^\d.,]/g, '').replace(',', '.')
    const num = parseFloat(cleaned)
    return !isNaN(num) && num > 0 ? `${num} km` : null
  }
}

// Función para obtener código de país
function getCountryCode(countryName: string): string | null {
  const codes: Record<string, string> = {
    'Argentina': 'AR',
    'Chile': 'CL',
    'Uruguay': 'UY',
    'Paraguay': 'PY',
    'Bolivia': 'BO',
    'Brasil': 'BR',
    'Perú': 'PE',
    'Colombia': 'CO',
    'Ecuador': 'EC',
    'Venezuela': 'VE'
  }
  return codes[countryName] || null
}

async function createCountries(races: CsvRace[]): Promise<Map<string, string>> {
  console.log('📦 Creando países...')
  const countryMap = new Map<string, string>()
  const uniqueCountries = [...new Set(races.map(r => r.country).filter(Boolean))]
  
  for (const countryName of uniqueCountries) {
    if (!countryName) continue
    
    const country = await prisma.country.upsert({
      where: { name: countryName },
      update: {},
      create: {
        name: countryName,
        code: getCountryCode(countryName),
        isActive: true
      }
    })
    
    countryMap.set(countryName, country.id)
    console.log(`  ✓ ${countryName} (${country.id})`)
  }
  
  return countryMap
}

async function createProvinces(
  races: CsvRace[],
  countries: Map<string, string>
): Promise<Map<string, string>> {
  console.log('📦 Creando provincias...')
  const provinceMap = new Map<string, string>()
  const uniqueProvinces = new Map<string, string>() // province -> country
  
  // Agrupar provincias con sus países
  for (const race of races) {
    if (race.province && race.country) {
      const key = `${race.country}:${race.province}`
      if (!uniqueProvinces.has(key)) {
        uniqueProvinces.set(key, race.country)
      }
    }
  }
  
  for (const [provinceKey, countryName] of uniqueProvinces) {
    const provinceName = provinceKey.split(':')[1]
    const countryId = countries.get(countryName)
    
    if (!countryId) {
      console.warn(`  ⚠ País no encontrado para provincia: ${provinceName} en ${countryName}`)
      continue
    }
    
    const province = await prisma.province.upsert({
      where: {
        countryId_name: {
          countryId,
          name: provinceName
        }
      },
      update: {},
      create: {
        countryId,
        name: provinceName,
        isActive: true
      }
    })
    
    provinceMap.set(provinceKey, province.id)
    console.log(`  ✓ ${provinceName} (${province.id})`)
  }
  
  return provinceMap
}

async function createRacesAndEditions(
  races: CsvRace[],
  provinces: Map<string, string>
): Promise<void> {
  console.log('🏁 Creando carreras y ediciones...')
  
  let successCount = 0
  let errorCount = 0
  
  for (let i = 0; i < races.length; i++) {
    const raceData = races[i]
    
    try {
      // Validar datos requeridos
      if (!raceData.name || !raceData.startDate || !raceData.discipline) {
        console.warn(`  ⚠ Fila ${i + 1}: Faltan campos requeridos - ${raceData.name || 'Sin nombre'}`)
        errorCount++
        continue
      }
      
      // Validar provincia
      if (!raceData.province || !raceData.country) {
        console.warn(`  ⚠ Fila ${i + 1}: Faltan provincia/país - ${raceData.name}`)
        errorCount++
        continue
      }
      
      const provinceKey = `${raceData.country}:${raceData.province}`
      const provinceId = provinces.get(provinceKey)
      
      if (!provinceId) {
        console.warn(`  ⚠ Fila ${i + 1}: Provincia no encontrada - ${raceData.province} en ${raceData.country}`)
        errorCount++
        continue
      }
      
      // 1. Crear carrera base
      const slug = generateSlug(raceData.name)
      
      // Verificar si la carrera ya existe (por slug)
      const existingRace = await prisma.race.findUnique({
        where: { slug }
      })
      
      let race
      if (existingRace) {
        console.log(`  ℹ Carrera ya existe: ${raceData.name} (usando existente)`)
        race = existingRace
        if (!existingRace.provinceId && provinceId) {
          await prisma.race.update({
            where: { id: existingRace.id },
            data: { city: raceData.city || null, provinceId }
          })
        }
      } else {
        race = await prisma.race.create({
          data: {
            name: raceData.name,
            slug,
            discipline: raceData.discipline,
            disciplines: raceData.disciplines || [],
            format: raceData.format || null,
            formats: raceData.formats || [],
            modality: raceData.modality || null,
            modalities: raceData.modalities || [],
            description: null,
            registrationUrl: raceData.registrationUrl || null,
            website: raceData.website || null,
            instagram: raceData.instagram || null,
            contactEmail: null,
            contactPhone: raceData.contactPhone || null,
            isActive: true,
            city: raceData.city || null,
            provinceId
          }
        })
        console.log(`  ✓ Carrera creada: ${raceData.name}`)
      }
      
      // 2. Crear edición
      const startDate = new Date(raceData.startDate)
      const year = startDate.getFullYear()
      const month = startDate.getMonth() + 1
      
      // Verificar si la edición ya existe
      const existingEdition = await prisma.raceEdition.findUnique({
        where: {
          raceId_year_month: {
            raceId: race.id,
            year,
            month
          }
        }
      })
      
      if (existingEdition) {
        console.log(`  ℹ Edición ya existe: ${raceData.name} ${year} (saltando)`)
        continue
      }

      // Construir location
      const locationParts = [raceData.city, raceData.province, raceData.country].filter(Boolean)
      const location = locationParts.length > 0 ? locationParts.join(', ') : null

      // RaceEdition: schema actual solo tiene estos campos (sin distance/elevation/endDate)
      const edition = await prisma.raceEdition.create({
        data: {
          raceId: race.id,
          provinceId,
          city: raceData.city || null,
          location,
          year,
          month,
          startDate,
          stages: raceData.stages || 1,
          days: raceData.days || 1,
          isActive: true
        }
      })

      // EditionFormat: distance, elevation, disciplines, modalities van en formato
      const formatName = raceData.format || (raceData.formats?.[0]) || 'General'
      const distanceStr = parseFirstDistance(raceData.distance?.toString())
      const elevationStr = raceData.elevation ? `${raceData.elevation}` : null
      await prisma.editionFormat.create({
        data: {
          editionId: edition.id,
          format: formatName,
          distance: distanceStr,
          elevation: elevationStr,
          disciplines: raceData.disciplines || [],
          modalities: raceData.modalities || []
        }
      })

      console.log(`  ✓ Edición creada: ${raceData.name} ${year}`)
      successCount++

      // 3. Crear etapas si las hay (schema: fromLocation, toLocation; no startDate/endDate)
      if (raceData.stageDetails && raceData.stageDetails.length > 0) {
        for (const stageData of raceData.stageDetails) {
          await prisma.stage.create({
            data: {
              editionId: edition.id,
              number: stageData.number,
              name: stageData.name || null,
              fromLocation: stageData.startDate ? String(stageData.startDate) : null,
              toLocation: stageData.endDate ? String(stageData.endDate) : null,
              distance: stageData.distance?.toString() || null,
              elevation: stageData.elevation?.toString() || null,
              description: null
            }
          })
        }
        console.log(`    ✓ ${raceData.stageDetails.length} etapa(s) creada(s)`)
      }
      
    } catch (error: any) {
      console.error(`  ✗ Error en fila ${i + 1} (${raceData.name}):`, error.message)
      errorCount++
    }
  }
  
  console.log(`\n📊 Resumen:`)
  console.log(`  ✓ Exitosas: ${successCount}`)
  console.log(`  ✗ Errores: ${errorCount}`)
  console.log(`  Total procesadas: ${races.length}`)
}

async function main() {
  console.log('🚀 Iniciando migración desde Google Sheets...\n')
  
  try {
    const layout = (process.env.MIGRATE_SHEET_LAYOUT || '2026').toLowerCase() as SheetLayout
    if (layout !== '2026' && layout !== 'carreras') {
      throw new Error('MIGRATE_SHEET_LAYOUT debe ser "2026" o "carreras"')
    }
    console.log(`  Layout: ${layout}\n`)
    
    // 1. Leer datos desde Google Sheets
    console.log('📥 Leyendo datos desde Google Sheets...')
    const sheetUrl = process.env.GOOGLE_SHEET_URL
    
    if (!sheetUrl) {
      throw new Error('GOOGLE_SHEET_URL no está configurada en .env')
    }
    
    const races = await getRacesFromGoogleSheets(sheetUrl, layout)
    console.log(`  ✓ ${races.length} carreras leídas\n`)
    
    // 2. Crear países únicos
    const countries = await createCountries(races)
    console.log('')
    
    // 3. Crear provincias únicas
    const provinces = await createProvinces(races, countries)
    console.log('')
    
    // 4. Crear carreras y ediciones
    await createRacesAndEditions(races, provinces)
    
    console.log('\n✅ Migración completada!')
    
  } catch (error: any) {
    console.error('\n❌ Error durante la migración:', error.message)
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar migración
main()
