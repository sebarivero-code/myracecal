/**
 * Script para migrar TODAS las carreras de la pestaña "Carreras"
 * 
 * Estructura de columnas:
 * A: Nombre de la carrera
 * C: Disciplina
 * D: Formato
 * E: Localidad
 * F: Provincia
 * G: País
 * H: Modalidad
 * I: Campeonato
 * J: Cantidad de etapas
 * L: Distancia
 * M: Altimetría
 * N: Instagram
 * O: Teléfono
 * P: Sitio
 * Q: URL de inscripción
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || process.env.DIRECT_URL
    }
  }
})

interface CsvRace {
  id: number
  name: string
  discipline: string
  disciplines?: string[]
  format?: string
  formats?: string[]
  modality?: string
  modalities?: string[]
  city?: string
  province?: string
  country?: string
  stages?: number
  distance?: string
  elevation?: string
  instagram?: string
  contactPhone?: string
  website?: string
  registrationUrl?: string
}

// Función para leer desde Google Sheets (pestaña específica)
async function getRacesFromSheet(sheetUrl: string, gid: string): Promise<CsvRace[]> {
  const sheetIdMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  if (!sheetIdMatch) {
    throw new Error('URL de Google Sheets inválida')
  }
  
  const sheetId = sheetIdMatch[1]
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
  
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

function parseCsvToRaces(csvText: string): CsvRace[] {
  const lines = csvText.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  const races: CsvRace[] = []
  let skippedCount = 0
  
  console.log(`  📊 Total de filas en CSV: ${lines.length} (incluye 1 header)`)
  
  // Saltar SOLO la fila 1 (header), procesar TODAS las demás
  const headerRows = 1
  console.log(`  📊 Procesando desde fila ${headerRows + 1} hasta ${lines.length}\n`)
  
  // Debug: mostrar las primeras líneas RAW antes de parsear
  console.log(`  🔍 DEBUG - Primeras 5 líneas RAW del CSV (primeros 100 caracteres):`)
  for (let d = 0; d < Math.min(5, lines.length); d++) {
    const preview = lines[d].substring(0, 100).replace(/\n/g, '\\n').replace(/\r/g, '\\r')
    console.log(`    Línea ${d + 1}: "${preview}${lines[d].length > 100 ? '...' : ''}"`)
  }
  console.log()
  
  for (let i = headerRows; i < lines.length; i++) {
    const values = parseCsvLine(lines[i])
    
    // Omitir solo si está completamente vacía
    if (values.length === 0 || values.every(v => !v || v.trim() === '')) {
      skippedCount++
      continue
    }
    
    // Debug: mostrar estructura de las primeras 5 filas de datos
    if (i < headerRows + 5) {
      console.log(`    🔍 Fila ${i + 1} parseada: ${values.length} columnas`)
      console.log(`       A:"${values[0] || ''}"`)
      console.log(`       B:"${values[1] || ''}"`)
      console.log(`       C:"${values[2] || ''}"`)
      if (values.length < 3) {
        console.log(`       ⚠ ADVERTENCIA: Esta fila tiene solo ${values.length} columnas, debería tener más`)
      }
    }
    
    const race: Partial<CsvRace> = {}
    
    // Mapeo de columnas CORRECTO para pestaña "Carreras":
    // A (0): Nombre de la carrera
    // B (1): (puede estar vacía o tener datos)
    // C (2): Disciplina
    // D (3): Formato
    // E (4): Localidad
    // F (5): Provincia
    // G (6): País
    // H (7): Modalidad
    // I (8): Campeonato
    // J (9): Cantidad de etapas
    // K (10): (puede estar vacía)
    // L (11): Distancia
    // M (12): Altimetría
    // N (13): Instagram
    // O (14): Teléfono
    // P (15): Sitio
    // Q (16): URL de inscripción
    
    race.id = i - headerRows + 1 // ID basado en la posición real de datos (empezando desde 1)
    
    // Leer nombre (columna A)
    race.name = values[0]?.trim() || ''
    
    // Validación mínima: solo rechazar si el nombre es claramente un teléfono o email
    // (nombres válidos pueden tener números, pero no solo números/teléfonos)
    if (race.name) {
      // Detectar si es SOLO un teléfono (patrón específico: (###) ###-#### o similar)
      const phonePattern = /^\(?\d{2,4}\)?[\s\-]?\d{3,4}[\s\-]?\d{3,4}[\s\-]?\d*[,\s]*$/
      if (phonePattern.test(race.name)) {
        // Si parece teléfono, revisar si hay un nombre en otra columna
        if (values[1]?.trim() && !phonePattern.test(values[1].trim())) {
          // Usar la siguiente columna como nombre
          race.name = values[1].trim()
          console.warn(`    ⚠ Fila ${i + 1}: Corregido - A era teléfono, usando B como nombre`)
        } else {
          // No hay nombre válido, omitir
          skippedCount++
          if (i <= headerRows + 10) {
            console.warn(`    ⚠ Fila ${i + 1} omitida: nombre parece ser solo teléfono: "${race.name}"`)
          }
          continue
        }
      }
      
      // Detectar si es claramente un email (tiene @ y dominio)
      if (race.name.includes('@') && race.name.includes('.')) {
        skippedCount++
        if (i <= headerRows + 5) {
          console.warn(`    ⚠ Fila ${i + 1} omitida: nombre es email: "${race.name}"`)
        }
        continue
      }
    }
    
    race.discipline = values[2]?.trim() || '' // Columna C
    race.format = values[3]?.trim() || '' // Columna D
    race.city = values[4]?.trim() // Columna E
    race.province = values[5]?.trim() // Columna F
    race.country = values[6]?.trim() // Columna G
    race.modality = values[7]?.trim() || '' // Columna H
    race.stages = values[9] ? parseInt(values[9].trim()) || undefined : undefined // Columna J
    race.distance = values[11]?.trim() // Columna L
    race.elevation = values[12]?.trim() // Columna M
    race.instagram = values[13]?.trim() // Columna N
    race.contactPhone = values[14]?.trim() // Columna O
    race.website = values[15]?.trim() // Columna P
    race.registrationUrl = values[16]?.trim() // Columna Q
    
    // Procesar arrays
    if (race.discipline.includes('/')) {
      race.disciplines = race.discipline.split('/').map(d => d.trim()).filter(Boolean)
    } else {
      race.disciplines = race.discipline ? [race.discipline] : []
    }
    
    if (race.format.includes('/')) {
      race.formats = race.format.split('/').map(f => f.trim()).filter(Boolean)
    } else {
      race.formats = race.format ? [race.format] : []
    }
    
    if (race.modality.includes('&')) {
      race.modalities = race.modality.split('&').map(m => m.trim()).filter(Boolean)
    } else {
      race.modalities = race.modality ? [race.modality] : []
    }
    
    // Solo agregar si tiene nombre válido
    if (race.name && race.name.trim()) {
      races.push(race as CsvRace)
    } else {
      skippedCount++
      if (i <= headerRows + 10) {
        console.log(`    ⚠ Fila ${i + 1} omitida: sin nombre válido | Columna A: "${values[0]}"`)
      }
    }
  }
  
  console.log(`  ✓ ${races.length} carreras válidas encontradas`)
  if (skippedCount > 0) {
    console.log(`  ⚠ Filas omitidas: ${skippedCount} (sin nombre, vacías o inválidas)`)
  }
  const totalProcessed = races.length + skippedCount
  const expectedRows = lines.length - headerRows
  if (totalProcessed !== expectedRows) {
    console.warn(`  ⚠ DESAJUSTE: Procesadas ${totalProcessed} de ${expectedRows} filas esperadas`)
  }
  console.log()
  
  return races
}

function generateSlug(name: string, id: number): string {
  let baseSlug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 90) // Dejar espacio para el ID
  
  // Siempre agregar ID al slug para garantizar unicidad
  return `${baseSlug}-${id}`.substring(0, 100)
}

async function main() {
  console.log('🚀 Migrando TODAS las carreras de la pestaña "Carreras"...\n')
  
  try {
    const sheetUrl = process.env.GOOGLE_SHEET_URL
    if (!sheetUrl) {
      throw new Error('GOOGLE_SHEET_URL no está configurada en .env')
    }
    
    const racesGid = process.env.RACES_TAB_GID || '182926104'
    
    console.log(`📥 Leyendo carreras de la pestaña "Carreras" (GID: ${racesGid})...`)
    
    const allRaces = await getRacesFromSheet(sheetUrl, racesGid)
    console.log(`  ✓ ${allRaces.length} carreras leídas\n`)
    
    let successCount = 0
    let errorCount = 0
    
    console.log(`📝 Migrando ${allRaces.length} carreras...\n`)
    
    // Verificar slugs duplicados ANTES de migrar
    const slugMap = new Map<string, number>()
    const duplicates: string[] = []
    for (const race of allRaces) {
      const baseSlug = race.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')
      if (slugMap.has(baseSlug)) {
        if (!duplicates.includes(baseSlug)) duplicates.push(baseSlug)
      }
      slugMap.set(baseSlug, (slugMap.get(baseSlug) || 0) + 1)
    }
    
    if (duplicates.length > 0) {
      console.warn(`  ⚠ ADVERTENCIA: Se encontraron nombres duplicados (${duplicates.length}):`)
      for (const dup of duplicates.slice(0, 5)) {
        console.warn(`     - "${dup}"`)
      }
      console.warn(`  ℹ Se usarán slugs únicos con ID para evitar sobrescrituras\n`)
    }
    
    const processedRaces: string[] = [] // Para tracking
    
    for (let i = 0; i < allRaces.length; i++) {
      const race = allRaces[i]
      const slug = generateSlug(race.name, race.id)
      let retries = 3
      let success = false
      let raceProcessed = false
      
      while (retries > 0 && !success) {
        try {
          if (retries < 3) {
            await prisma.$disconnect()
            await new Promise(resolve => setTimeout(resolve, 100))
            await prisma.$connect()
          }
          
          await prisma.race.upsert({
            where: { slug },
            update: {
              name: race.name,
              discipline: race.discipline,
              disciplines: race.disciplines || [],
              format: race.format || null,
              formats: race.formats || [],
              modality: race.modality || null,
              modalities: race.modalities || [],
              registrationUrl: race.registrationUrl || null,
              website: race.website || null,
              instagram: race.instagram || null,
              contactPhone: race.contactPhone || null,
              isActive: true,
              updatedAt: new Date()
            },
            create: {
              name: race.name,
              slug,
              discipline: race.discipline,
              disciplines: race.disciplines || [],
              format: race.format || null,
              formats: race.formats || [],
              modality: race.modality || null,
              modalities: race.modalities || [],
              registrationUrl: race.registrationUrl || null,
              website: race.website || null,
              instagram: race.instagram || null,
              contactPhone: race.contactPhone || null,
              isActive: true
            }
          })
          
          successCount++
          raceProcessed = true
          processedRaces.push(`✓ ${race.name} (ID: ${race.id}, slug: ${slug})`)
          
          if ((i + 1) % 50 === 0 || i === allRaces.length - 1) {
            console.log(`  ✓ ${i + 1}/${allRaces.length} carreras migradas...`)
          }
          success = true
          
        } catch (error: any) {
          retries--
          const isPreparedStatementError = error.code === 'P2010' && error.meta?.code === '42P05'
          
          if (isPreparedStatementError && retries > 0) {
            try {
              await prisma.$disconnect()
              await new Promise(resolve => setTimeout(resolve, 200))
              await prisma.$connect()
            } catch (disconnectError) {
              // Ignorar
            }
            continue
          }
          
          if (retries === 0) {
            errorCount++
            raceProcessed = true
            processedRaces.push(`❌ ${race.name} (ID: ${race.id}, slug: ${slug}) - ERROR`)
            console.error(`  ❌ Error en ${race.name} (ID: ${race.id}):`, error.message)
          }
          break
        }
      }
      
      // Si llegamos aquí sin success ni error, algo raro pasó
      if (!raceProcessed && !success) {
        console.warn(`  ⚠ ADVERTENCIA: ${race.name} (ID: ${race.id}) no fue procesada correctamente`)
        processedRaces.push(`⚠ ${race.name} (ID: ${race.id}, slug: ${slug}) - NO PROCESADA`)
      }
    }
    
    console.log(`\n🏁 Migración finalizada`)
    console.log(`   📊 Total leídas: ${allRaces.length}`)
    console.log(`   ✅ Exitosas: ${successCount}`)
    console.log(`   ❌ Errores: ${errorCount}`)
    console.log(`   🔍 Total procesadas (exitosas + errores): ${successCount + errorCount}`)
    
    // Detectar desajuste
    if (successCount + errorCount !== allRaces.length) {
      const missing = allRaces.length - (successCount + errorCount)
      console.warn(`\n   ⚠ DESAJUSTE: Faltan ${missing} carrera(s) que no se contaron como éxito ni error`)
      console.warn(`   Buscando carreras no procesadas...\n`)
      
      // Mostrar las últimas 10 carreras procesadas para debug
      console.log(`   Últimas 10 carreras procesadas:`)
      for (const entry of processedRaces.slice(-10)) {
        console.log(`     ${entry}`)
      }
    }
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
