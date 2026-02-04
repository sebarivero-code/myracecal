/**
 * Script para migrar carreras sin edición 2026
 * 
 * Lee todas las carreras de la pestaña "Carreras" y migra solo las que
 * no tienen una edición 2026 en la base de datos
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

// Usar DATABASE_URL por defecto (funciona con pooler 6543)
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
  registrationUrl?: string
  contactPhone?: string
  website?: string
  instagram?: string
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
  let noNameCount = 0
  
  console.log(`  📊 Total de filas en CSV: ${lines.length} (incluye header)`)
  console.log(`  📊 Filas a procesar: ${lines.length - 1}`)
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i])
    
    if (values.length === 0 || values.every(v => !v || v.trim() === '')) {
      skippedCount++
      if (i <= 5) {
        console.log(`    ⚠ Fila ${i + 1} omitida: vacía`)
      }
      continue
    }
    
    const race: Partial<CsvRace> = {}
    
    // Mapeo de columnas (mismo orden que la pestaña "2026" pero sin fecha ni etapas)
    // values[0]: vacío o índice
    // values[1]: fecha (no presente en "Carreras", pero puede estar)
    // values[2]: nombre
    // values[3]: id
    // values[4]: disciplina
    // values[5]: formato
    // values[6]: ciudad (puede no estar)
    // values[7]: provincia (puede no estar)
    // values[8]: país (puede no estar)
    // values[9]: modalidad
    // values[11]: etapas (no presente en "Carreras")
    // values[12]: días (no presente en "Carreras")
    // values[13]: distancia (puede no estar)
    // values[14]: elevación (puede no estar)
    // values[15]: instagram
    // values[16]: teléfono
    // values[17]: website
    // values[18]: URL registro
    
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
    
    const formatValue = values[5]?.trim() || ''
    race.format = formatValue
    if (formatValue.includes('/')) {
      race.formats = formatValue.split('/').map(f => f.trim()).filter(Boolean)
    } else {
      race.formats = formatValue ? [formatValue] : []
    }
    
    const modalityValue = values[9]?.trim() || ''
    race.modality = modalityValue
    if (modalityValue.includes('&')) {
      race.modalities = modalityValue.split('&').map(m => m.trim()).filter(Boolean)
    } else {
      race.modalities = modalityValue ? [modalityValue] : []
    }
    
    // Contacto y redes sociales (índices pueden variar, pero intentamos los más comunes)
    // Buscar en diferentes posiciones posibles si los índices varían
    for (let j = 15; j < Math.min(20, values.length); j++) {
      const val = values[j]?.trim() || ''
      if (!val) continue
      
      // Detectar tipo de campo por contenido
      if (val.includes('instagram.com') || val.includes('@')) {
        race.instagram = val
      } else if (val.match(/^\+?\d[\d\s\-\(\)]+$/)) {
        race.contactPhone = val
      } else if (val.match(/^https?:\/\//)) {
        if (val.includes('inscrip') || val.includes('registr')) {
          race.registrationUrl = val
        } else {
          race.website = val
        }
      }
    }
    
    // Intentar campos en posiciones fijas también (fallback)
    if (!race.instagram && values[15]?.trim()) race.instagram = values[15].trim()
    if (!race.contactPhone && values[16]?.trim()) race.contactPhone = values[16].trim()
    if (!race.website && values[17]?.trim()) race.website = values[17].trim()
    if (!race.registrationUrl && values[18]?.trim()) race.registrationUrl = values[18].trim()
    
    // Solo agregar si tiene nombre (disciplina puede estar vacía)
    if (race.name && race.name.trim()) {
      // Si no tiene disciplina, usar "Desconocida" por defecto
      if (!race.discipline || !race.discipline.trim()) {
        race.discipline = 'Desconocida'
        race.disciplines = ['Desconocida']
      }
      races.push(race as CsvRace)
    } else {
      noNameCount++
      if (i <= 10) { // Mostrar primeras 10 filas omitidas para debugging
        console.log(`    ⚠ Fila ${i + 1} omitida: sin nombre | Columna 2 (nombre): "${values[2]}" | Primeras columnas: ${values.slice(0, 6).map(v => `"${v || ''}"`).join(', ')}`)
      }
    }
  }
  
  const totalOmitted = skippedCount + noNameCount
  if (totalOmitted > 0) {
    console.log(`\n  ⚠ Resumen de filas omitidas:`)
    console.log(`     - Vacías: ${skippedCount}`)
    console.log(`     - Sin nombre: ${noNameCount}`)
    console.log(`     - Total omitidas: ${totalOmitted}`)
    console.log(`     - Filas procesadas: ${races.length}\n`)
  } else {
    console.log(`  ✓ Todas las filas fueron procesadas\n`)
  }
  
  return races
}

function generateSlug(name: string, id?: number): string {
  let baseSlug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 90) // Dejar espacio para el ID
  
  // Si el nombre es muy genérico (MTB, Ruta, etc.) o si se proporciona ID, agregarlo al slug
  const genericNames = ['mtb', 'ruta', 'gravel', 'ciclocross', 'pista']
  const isGeneric = genericNames.includes(baseSlug.toLowerCase())
  
  if (id && (isGeneric || baseSlug.length < 3)) {
    // Agregar ID al slug para garantizar unicidad
    baseSlug = `${baseSlug}-${id}`
  } else if (id) {
    // Agregar ID siempre para garantizar unicidad completa
    baseSlug = `${baseSlug}-${id}`
  }
  
  return baseSlug.substring(0, 100)
}

function formatArray(arr: string[] | undefined): string {
  if (!arr || arr.length === 0) return 'ARRAY[]::TEXT[]'
  return `ARRAY[${arr.map(s => `'${s.replace(/'/g, "''")}'`).join(', ')}]`
}

async function main() {
  console.log('🚀 Migrando carreras sin edición 2026...\n')
  console.log('📋 Este script migra carreras de la pestaña "Carreras" que NO tienen edición 2026\n')
  
  try {
    const sheetUrl = process.env.GOOGLE_SHEET_URL
    if (!sheetUrl) {
      throw new Error('GOOGLE_SHEET_URL no está configurada en .env')
    }
    
    // Obtener GID de la pestaña "Carreras"
    // GID por defecto: 182926104
    const racesGid = process.env.RACES_TAB_GID || '182926104'
    
    console.log(`📥 Leyendo carreras de la pestaña "Carreras" (GID: ${racesGid})...`)
    console.log(`   URL: ${sheetUrl}\n`)
    
    const allRaces = await getRacesFromSheet(sheetUrl, racesGid)
    console.log(`  ✓ ${allRaces.length} carreras leídas\n`)
    
    // No filtrar por país - procesar todas las carreras
    // El filtro se hace verificando si tienen edición 2026
    const races = allRaces
    
    console.log(`📊 Migrando todas las carreras de la pestaña "Carreras"...\n`)
    console.log(`   ℹ Se usarán upserts para evitar duplicados\n`)
    console.log(`   ℹ Si una carrera ya existe, se actualizará\n`)
    console.log(`   ℹ Si una carrera tiene edición 2026, no se creará una edición nueva\n\n`)
    
    // NO verificar ediciones existentes - simplemente migrar todas
    // Upsert evitará duplicados en Race, y solo crearemos ediciones si no existen
    const racesWithout2026 = races
    
    console.log(`📝 Carreras a migrar: ${racesWithout2026.length}\n`)
    
    // Verificar slugs duplicados antes de migrar (usando ID para unicidad)
    const slugMap = new Map<string, string[]>()
    for (const race of racesWithout2026) {
      const slug = generateSlug(race.name, race.id)
      if (!slugMap.has(slug)) {
        slugMap.set(slug, [])
      }
      slugMap.get(slug)!.push(`${race.name} (ID: ${race.id})`)
    }
    
    const duplicateSlugs = Array.from(slugMap.entries()).filter(([_, names]) => names.length > 1)
    if (duplicateSlugs.length > 0) {
      console.warn(`  ⚠ ADVERTENCIA: Se encontraron ${duplicateSlugs.length} slugs duplicados:`)
      for (const [slug, names] of duplicateSlugs.slice(0, 5)) {
        console.warn(`     - "${slug}": ${names.join(', ')}`)
      }
      if (duplicateSlugs.length > 5) {
        console.warn(`     ... y ${duplicateSlugs.length - 5} más`)
      }
      console.warn(`  ℹ Las carreras con el mismo slug se sobrescribirán\n`)
    }
    
    let successCount = 0
    let errorCount = 0
    let skippedCount = 0
    
    // Migrar cada carrera
    for (let i = 0; i < racesWithout2026.length; i++) {
      const race = racesWithout2026[i]
      const slug = generateSlug(race.name, race.id)
      let retries = 3
      let success = false
      let lastError: any = null
      
      while (retries > 0 && !success) {
        try {
          // Desconectar y reconectar ocasionalmente para limpiar prepared statements
          if (retries < 3) {
            await prisma.$disconnect()
            await new Promise(resolve => setTimeout(resolve, 100))
            await prisma.$connect()
          }
          
          // Crear o actualizar la carrera
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
          
          // Éxito - salir del while
          successCount++
          console.log(`  ✓ ${race.name} (${slug})`)
          success = true
          
        } catch (error: any) {
          lastError = error
          retries--
          const isPreparedStatementError = error.code === 'P2010' && error.meta?.code === '42P05'
          
          // Si es error de prepared statement y quedan reintentos, reintentar
          if (isPreparedStatementError && retries > 0) {
            // Desconectar y reconectar para limpiar prepared statements
            try {
              await prisma.$disconnect()
              await new Promise(resolve => setTimeout(resolve, 200))
              await prisma.$connect()
            } catch (disconnectError) {
              // Ignorar errores de desconexión
            }
            // Continuar el while para reintentar
            continue
          }
          
          // Si no quedan reintentos, registrar error y salir del while
          if (retries === 0) {
            errorCount++
            if (isPreparedStatementError) {
              console.error(`  ❌ Error en ${race.name}: prepared statement (sin más reintentos)`)
            } else {
              console.error(`  ❌ Error en ${race.name}:`, error.message)
            }
            break
          }
        }
      }
      
      // Si el loop terminó sin éxito y no se registró error, es un caso no esperado
      if (!success && !lastError) {
        skippedCount++
        console.warn(`  ⚠ Carrera omitida sin error: ${race.name}`)
      }
    }
    
    console.log(`\n🏁 Migración finalizada`)
    console.log(`   📊 Total procesadas: ${racesWithout2026.length}`)
    console.log(`   ✅ Exitosas: ${successCount}`)
    console.log(`   ❌ Errores: ${errorCount}`)
    if (skippedCount > 0) {
      console.log(`   ⚠ Omitidas: ${skippedCount}`)
    }
    const totalCounted = successCount + errorCount + skippedCount
    if (totalCounted !== racesWithout2026.length) {
      console.warn(`   ⚠ DESAJUSTE: Total contado (${totalCounted}) no coincide con procesadas (${racesWithout2026.length})`)
    }
    console.log(`\n💡 Nota: Estas carreras NO tienen edición 2026`)
    console.log(`   Se pueden crear ediciones manualmente desde /races/new`)
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
