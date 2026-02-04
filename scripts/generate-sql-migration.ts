/**
 * Script para Generar SQL de Migración
 * 
 * Este script lee datos desde Google Sheets y genera SQL
 * que puedes ejecutar directamente en el SQL Editor de Supabase
 */

// Cargar variables de entorno
import 'dotenv/config'

// Importar funciones de parseo (sin Prisma)
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

// Función para leer desde Google Sheets
async function getRacesFromGoogleSheets(sheetUrl: string): Promise<CsvRace[]> {
  const csvUrl = convertToCsvUrl(sheetUrl)
  const response = await fetch(csvUrl)
  
  if (!response.ok) {
    throw new Error(`Error al obtener datos: ${response.status} ${response.statusText}`)
  }
  
  const csvText = await response.text()
  if (!csvText || csvText.trim().length === 0) {
    throw new Error('El CSV está vacío')
  }
  
  return parseCsvToRaces(csvText)
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

function parseCsvToRaces(csvText: string): CsvRace[] {
  const lines = csvText.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  const races: CsvRace[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i])
    
    if (values.length === 0 || values.every(v => !v || v.trim() === '')) {
      continue
    }
    
    const race: Partial<CsvRace> = {}
    
    const idValue = values[3]?.trim()
    race.id = idValue ? parseInt(idValue) || i : i
    race.name = values[2]?.trim()
    
    const disciplineValue = values[4]?.trim() || ''
    race.discipline = disciplineValue
    if (disciplineValue.includes('/')) {
      race.disciplines = disciplineValue.split('/').map(d => d.trim()).filter(Boolean)
    } else {
      race.disciplines = disciplineValue ? [disciplineValue] : []
    }
    
    const modalityValue = values[9]?.trim() || ''
    race.modality = modalityValue
    if (modalityValue.includes('&')) {
      race.modalities = modalityValue.split('&').map(m => m.trim()).filter(Boolean)
    } else {
      race.modalities = modalityValue ? [modalityValue] : []
    }
    
    race.city = values[6]?.trim()
    race.province = values[7]?.trim()
    race.country = values[8]?.trim()
    
    const locationParts = [race.city, race.province, race.country].filter(Boolean)
    race.location = locationParts.join(', ') || ''
    
    const dateValue = values[1]?.trim()
    if (dateValue) {
      const mmddyyyyMatch = dateValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
      if (mmddyyyyMatch) {
        const month = parseInt(mmddyyyyMatch[1]) - 1
        const day = parseInt(mmddyyyyMatch[2])
        const year = parseInt(mmddyyyyMatch[3])
        if (month >= 0 && month <= 11 && day > 0 && day <= 31 && year > 2000) {
          race.startDate = new Date(Date.UTC(year, month, day, 12, 0, 0)).toISOString()
        }
      } else {
        const parsedDate = new Date(dateValue)
        if (!isNaN(parsedDate.getTime()) && parsedDate.getFullYear() > 2000) {
          race.startDate = parsedDate.toISOString()
        }
      }
    }
    
    const stagesValue = values[11]?.trim()
    if (stagesValue) {
      const stages = parseInt(stagesValue)
      if (!isNaN(stages) && stages > 0) {
        race.stages = stages
      }
    }
    
    const daysValue = values[12]?.trim()
    if (daysValue) {
      const days = parseInt(daysValue)
      if (!isNaN(days) && days > 0) {
        race.days = days
      }
    }
    
    const formatValue = values[5]?.trim() || ''
    race.format = formatValue
    if (formatValue.includes('/')) {
      race.formats = formatValue.split('/').map(f => f.trim()).filter(Boolean)
    } else {
      race.formats = formatValue ? [formatValue] : []
    }
    
    const distanceValue = values[13]?.trim()
    if (distanceValue) {
      const cleaned = distanceValue.replace(/[^\d.,]/g, '').replace(',', '.')
      const distanceNum = parseFloat(cleaned)
      if (!isNaN(distanceNum) && distanceNum > 0) {
        race.distance = distanceNum
      }
    }
    
    const elevationValue = values[14]?.trim()
    if (elevationValue) {
      let cleaned = elevationValue.replace(/[^\d.,]/g, '')
      if (cleaned.includes(',')) {
        const parts = cleaned.split(',')
        if (parts.length === 2) {
          const afterComma = parts[1]
          if (afterComma.length === 3) {
            cleaned = cleaned.replace(',', '')
          } else if (afterComma.length <= 2) {
            cleaned = cleaned.replace(',', '.')
          }
        } else {
          cleaned = cleaned.replace(/,/g, '')
        }
      }
      const elevationNum = parseFloat(cleaned)
      if (!isNaN(elevationNum) && elevationNum > 0) {
        race.elevation = elevationNum
      }
    }
    
    if (values[15]?.trim()) race.instagram = values[15].trim()
    if (values[16]?.trim()) race.contactPhone = values[16].trim()
    if (values[17]?.trim()) race.website = values[17].trim()
    if (values[18]?.trim()) race.registrationUrl = values[18].trim()
    
    if (race.stages && race.stages > 0) {
      const stageDetails: Stage[] = []
      for (let stageNum = 1; stageNum <= Math.min(race.stages, 8); stageNum++) {
        const baseIndex = 19 + (stageNum - 1) * 5
        const stage: Stage = {
          number: stageNum,
          name: values[baseIndex]?.trim() || undefined,
          distance: values[baseIndex + 1]?.trim() ? parseFloat(values[baseIndex + 1].trim().replace(/[^\d.,]/g, '').replace(',', '.')) : undefined,
          elevation: values[baseIndex + 2]?.trim() ? parseFloat(values[baseIndex + 2].trim().replace(/[^\d.,]/g, '').replace(',', '.')) : undefined,
          startDate: values[baseIndex + 3]?.trim() || undefined,
          endDate: values[baseIndex + 4]?.trim() || undefined
        }
        stageDetails.push(stage)
      }
      if (stageDetails.length > 0) {
        race.stageDetails = stageDetails
      }
    }
    
    if (race.name && race.startDate && race.discipline) {
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

// Función para escapar strings SQL
function escapeSql(str: string | null | undefined): string {
  if (!str) return 'NULL'
  return `'${str.replace(/'/g, "''")}'`
}

// Función para generar slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100)
}

// Función para parsear primera distancia
function parseFirstDistance(distanceValue?: string | number): string | null {
  if (!distanceValue) return null
  const str = distanceValue.toString()
  
  if (str.includes('/')) {
    const firstPart = str.split('/')[0].trim()
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
  } else if (str.includes('&')) {
    const firstDist = str.split('&')[0].trim()
    const cleaned = firstDist.replace(/[^\d.,]/g, '').replace(',', '.')
    const num = parseFloat(cleaned)
    return !isNaN(num) && num > 0 ? `${num} km` : null
  } else {
    const cleaned = str.replace(/[^\d.,]/g, '').replace(',', '.')
    const num = parseFloat(cleaned)
    return !isNaN(num) && num > 0 ? `${num} km` : null
  }
}

// Función para formatear array SQL
function formatArray(arr: string[] | undefined): string {
  if (!arr || arr.length === 0) return 'ARRAY[]::TEXT[]'
  return `ARRAY[${arr.map(s => `'${s.replace(/'/g, "''")}'`).join(', ')}]`
}

// Función para normalizar nombre de país (código -> nombre completo)
function normalizeCountryName(countryCodeOrName: string): string {
  const mapping: Record<string, string> = {
    'ARG': 'Argentina',
    'CHI': 'Chile',
    'CL': 'Chile',
    'URU': 'Uruguay',
    'UY': 'Uruguay',
    'BRA': 'Brasil',
    'BR': 'Brasil',
    'PAR': 'Paraguay',
    'PY': 'Paraguay',
    'BOL': 'Bolivia',
    'BO': 'Bolivia',
    'PER': 'Perú',
    'PE': 'Perú',
    'COL': 'Colombia',
    'CO': 'Colombia',
    'ECU': 'Ecuador',
    'EC': 'Ecuador',
    'VEN': 'Venezuela',
    'VE': 'Venezuela'
  }
  return mapping[countryCodeOrName] || countryCodeOrName
}

async function main() {
  console.log('🚀 Generando SQL de migración...\n')
  
  try {
    const sheetUrl = process.env.GOOGLE_SHEET_URL
    if (!sheetUrl) {
      throw new Error('GOOGLE_SHEET_URL no está configurada en .env')
    }
    
    console.log('📥 Leyendo datos desde Google Sheets...')
    const allRaces = await getRacesFromGoogleSheets(sheetUrl)
    console.log(`  ✓ ${allRaces.length} carreras leídas`)
    
    // Filtrar solo carreras de Argentina
    const races = allRaces.filter(race => {
      if (!race.country) return false
      const normalizedCountry = normalizeCountryName(race.country)
      return normalizedCountry === 'Argentina'
    })
    
    console.log(`  ✓ ${races.length} carreras de Argentina filtradas\n`)
    
    // Obtener provincias únicas (solo de Argentina)
    const provinces = new Map<string, string>() // provinceKey -> countryName
    const countryVars = new Map<string, string>() // countryName -> varName
    
    // Solo Argentina
    const countryName = 'Argentina'
    const varName = 'argentina_id'
    countryVars.set(countryName, varName)
    
    for (const race of races) {
      if (race.province && race.country) {
        const normalizedCountry = normalizeCountryName(race.country)
        if (normalizedCountry === 'Argentina') {
          const key = `${normalizedCountry}:${race.province}`
          if (!provinces.has(key)) {
            provinces.set(key, normalizedCountry)
          }
        }
      }
    }
    
    // Generar SQL
    let sql = `-- ============================================\n`
    sql += `-- MIGRACIÓN DE DATOS DESDE GOOGLE SHEETS\n`
    sql += `-- Generado automáticamente\n`
    sql += `-- SOLO CARRERAS DE ARGENTINA\n`
    sql += `-- Total de carreras: ${races.length}\n`
    sql += `-- ============================================\n\n`
    
    // Obtener IDs de países y provincias (asumiendo que ya existen)
    sql += `-- NOTA: Este SQL asume que los países y provincias ya existen.\n`
    sql += `-- Si no existen, créalos primero desde el SQL Editor.\n\n`
    
    sql += `-- Variables temporales para IDs\n`
    sql += `DO $$\n`
    sql += `DECLARE\n`
    sql += `    argentina_id TEXT;\n`
    // Variables para provincias
    for (const [provinceKey, countryName] of provinces) {
      const provinceName = provinceKey.split(':')[1]
      const varName = provinceName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_province_id'
      sql += `    ${varName} TEXT;\n`
    }
    sql += `BEGIN\n\n`
    
    // Obtener ID de Argentina
    sql += `    -- Obtener ID de Argentina\n`
    sql += `    SELECT id INTO argentina_id FROM "Country" WHERE name = 'Argentina';\n\n`
    
    // Obtener IDs de provincias (solo de Argentina)
    // Mapeo de nombres alternativos a nombres canónicos
    const provinceNameMap: Record<string, string> = {
      'Bs. As.': 'Buenos Aires',
      'Buenos Aires': 'Buenos Aires',
      'Bs As': 'Buenos Aires',
      'Bs.As.': 'Buenos Aires'
    }
    
    for (const [provinceKey, countryName] of provinces) {
      const provinceName = provinceKey.split(':')[1]
      const provinceVarName = provinceName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_province_id'
      
      // Usar nombre canónico si existe, sino usar el original
      const canonicalName = provinceNameMap[provinceName] || provinceName
      
      sql += `    -- Obtener ID de ${provinceName} (buscando como '${canonicalName}')\n`
      sql += `    SELECT id INTO ${provinceVarName} FROM "Province" WHERE name = '${canonicalName.replace(/'/g, "''")}' AND "countryId" = argentina_id;\n`
      sql += `    IF ${provinceVarName} IS NULL THEN\n`
      sql += `        -- Intentar con el nombre original si no se encontró\n`
      sql += `        SELECT id INTO ${provinceVarName} FROM "Province" WHERE name = '${provinceName.replace(/'/g, "''")}' AND "countryId" = argentina_id;\n`
      sql += `    END IF;\n\n`
    }
    
    // Insertar carreras y ediciones
    sql += `    -- ============================================\n`
    sql += `    -- INSERTAR CARRERAS Y EDICIONES\n`
    sql += `    -- ============================================\n\n`
    
    for (let i = 0; i < races.length; i++) {
      const race = races[i]
      
      // Validar datos requeridos
      if (!race.name || !race.startDate || !race.discipline || !race.province || !race.country) {
        continue
      }
      
      // Filtrar solo carreras de Argentina
      const normalizedCountry = normalizeCountryName(race.country)
      if (normalizedCountry !== 'Argentina') {
        continue
      }
      
      const slug = generateSlug(race.name)
      const provinceName = race.province
      const provinceVarName = provinceName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_province_id'
      const startDate = new Date(race.startDate)
      const year = startDate.getFullYear()
      const endDate = race.days && race.days > 1
        ? new Date(startDate.getTime() + (race.days - 1) * 24 * 60 * 60 * 1000).toISOString()
        : null
      const distance = parseFirstDistance(race.distance?.toString())
      const elevation = race.elevation ? `${race.elevation}m` : null
      const locationParts = [race.city, race.province, race.country].filter(Boolean)
      const location = locationParts.length > 0 ? locationParts.join(', ') : null
      
      sql += `    -- Carrera ${i + 1}: ${race.name}\n`
      sql += `    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")\n`
      sql += `    VALUES (\n`
      sql += `        gen_random_uuid(),\n`
      sql += `        ${escapeSql(race.name)},\n`
      sql += `        ${escapeSql(slug)},\n`
      sql += `        ${escapeSql(race.discipline)},\n`
      sql += `        ${formatArray(race.disciplines)},\n`
      sql += `        ${escapeSql(race.format)},\n`
      sql += `        ${formatArray(race.formats)},\n`
      sql += `        ${escapeSql(race.modality)},\n`
      sql += `        ${formatArray(race.modalities)},\n`
      sql += `        ${escapeSql(race.registrationUrl)},\n`
      sql += `        ${escapeSql(race.website)},\n`
      sql += `        ${escapeSql(race.instagram)},\n`
      sql += `        ${escapeSql(race.contactPhone)},\n`
      sql += `        true,\n`
      sql += `        NOW(),\n`
      sql += `        NOW()\n`
      sql += `    )\n`
      sql += `    ON CONFLICT (slug) DO UPDATE SET\n`
      sql += `        name = EXCLUDED.name,\n`
      sql += `        "updatedAt" = NOW();\n\n`
      
      sql += `    -- Edición ${year} de ${race.name}\n`
      sql += `    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")\n`
      sql += `    SELECT\n`
      sql += `        gen_random_uuid(),\n`
      sql += `        r.id,\n`
      sql += `        ${provinceVarName},\n`
      sql += `        ${escapeSql(race.city)},\n`
      sql += `        ${escapeSql(location)},\n`
      sql += `        ${year},\n`
      sql += `        ${escapeSql(startDate.toISOString())}::timestamp,\n`
      sql += `        ${endDate ? escapeSql(endDate) + '::timestamp' : 'NULL'},\n`
      sql += `        ${escapeSql(distance)},\n`
      sql += `        ${escapeSql(elevation)},\n`
      sql += `        ${race.stages || 1},\n`
      sql += `        ${race.days || 1},\n`
      sql += `        true,\n`
      sql += `        NOW(),\n`
      sql += `        NOW()\n`
      sql += `    FROM "Race" r\n`
      sql += `    WHERE r.slug = ${escapeSql(slug)}\n`
      sql += `    AND NOT EXISTS (\n`
      sql += `        SELECT 1 FROM "RaceEdition" re\n`
      sql += `        WHERE re."raceId" = r.id AND re.year = ${year}\n`
      sql += `    );\n\n`
      
      // Etapas
      if (race.stageDetails && race.stageDetails.length > 0) {
        sql += `    -- Etapas de ${race.name} ${year}\n`
        for (const stage of race.stageDetails) {
          // startDate y endDate son localidades (FROM y TO), no fechas
          sql += `    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")\n`
          sql += `    SELECT\n`
          sql += `        gen_random_uuid(),\n`
          sql += `        re.id,\n`
          sql += `        ${stage.number},\n`
          sql += `        ${escapeSql(stage.name)},\n`
          sql += `        ${escapeSql(stage.distance?.toString())},\n`
          sql += `        ${escapeSql(stage.elevation?.toString())},\n`
          sql += `        ${escapeSql(stage.startDate)},\n`
          sql += `        ${escapeSql(stage.endDate)},\n`
          sql += `        NOW(),\n`
          sql += `        NOW()\n`
          sql += `    FROM "RaceEdition" re\n`
          sql += `    INNER JOIN "Race" r ON re."raceId" = r.id\n`
          sql += `    WHERE r.slug = ${escapeSql(slug)} AND re.year = ${year}\n`
          sql += `    ON CONFLICT ("editionId", number) DO NOTHING;\n\n`
        }
      }
    }
    
    sql += `END $$;\n\n`
    sql += `-- ============================================\n`
    sql += `-- MIGRACIÓN COMPLETADA\n`
    sql += `-- ============================================\n`
    
    // Escribir a archivo
    const fs = require('fs')
    const path = require('path')
    const outputPath = path.join(__dirname, 'migration-data.sql')
    fs.writeFileSync(outputPath, sql, 'utf-8')
    
    console.log(`✅ SQL generado exitosamente!`)
    console.log(`📄 Archivo: ${outputPath}`)
    console.log(`\n📋 Próximos pasos:`)
    console.log(`1. Abre el archivo migration-data.sql`)
    console.log(`2. Copia todo el contenido`)
    console.log(`3. Pégalo en Supabase → SQL Editor`)
    console.log(`4. Ejecuta el SQL (Run o Ctrl+Enter)`)
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    console.error(error)
    process.exit(1)
  }
}

main()
