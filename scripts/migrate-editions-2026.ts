/**
 * Script para migrar ediciones 2026 desde la pestaña "2026" de Google Sheets
 * 
 * Estructura de columnas de la pestaña "2026":
 * A: Mes
 * B: Fecha completa
 * C: Nombre de la carrera
 * D: ID
 * E: Disciplina
 * F: Formato
 * G: Localidad
 * H: Provincia
 * I: País
 * J: Modalidad
 * K: Campeonato
 * L: # Etapas
 * M: # Días
 * N: Km (distancia)
 * O: M+ (elevación)
 * P: Instagram
 * Q: Tel
 * R: Site
 * S: Inscripción
 * T+: Etapas (5 columnas por etapa: nombre, distancia, elevación, fromLocation, toLocation)
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

interface Stage {
  number: number
  name?: string
  distance?: string
  elevation?: string
  fromLocation?: string
  toLocation?: string
}

interface CsvEdition {
  id: number
  name: string
  date: string
  discipline: string
  format?: string
  city?: string
  province?: string
  country?: string
  modality?: string
  stages?: number
  days?: number
  distance?: string
  elevation?: string
  instagram?: string
  contactPhone?: string
  website?: string
  registrationUrl?: string
  stageDetails?: Stage[]
}

// Función para leer desde Google Sheets (pestaña específica)
async function getEditionsFromSheet(sheetUrl: string, gid: string): Promise<CsvEdition[]> {
  const sheetIdMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  if (!sheetIdMatch) {
    throw new Error('URL de Google Sheets inválida')
  }
  
  const sheetId = sheetIdMatch[1]
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
  
  console.log(`  📥 URL: ${csvUrl}`)
  
  const response = await fetch(csvUrl)
  
  if (!response.ok) {
    throw new Error(`Error al obtener datos: ${response.status} ${response.statusText}`)
  }
  
  const csvText = await response.text()
  if (!csvText || csvText.trim().length === 0) {
    throw new Error('El CSV está vacío')
  }
  
  return parseCsvToEditions(csvText)
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

function parseCsvToEditions(csvText: string): CsvEdition[] {
  const lines = csvText.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  const editions: CsvEdition[] = []
  let skippedCount = 0
  
  console.log(`  📊 Total de filas en CSV: ${lines.length} (incluye 1 header)`)
  
  // Saltar SOLO la fila 1 (header)
  const headerRows = 1
  console.log(`  📊 Procesando desde fila ${headerRows + 1} hasta ${lines.length}\n`)
  
  for (let i = headerRows; i < lines.length; i++) {
    const values = parseCsvLine(lines[i])
    
    // Omitir si está completamente vacía
    if (values.length === 0 || values.every(v => !v || v.trim() === '')) {
      skippedCount++
      continue
    }
    
    const edition: Partial<CsvEdition> = {}
    
    // Mapeo de columnas para pestaña "2026":
    // A (0): Mes - no se usa
    // B (1): Fecha completa
    // C (2): Nombre de la carrera
    // D (3): ID
    // E (4): Disciplina
    // F (5): Formato
    // G (6): Localidad
    // H (7): Provincia
    // I (8): País
    // J (9): Modalidad
    // K (10): Campeonato - no se usa
    // L (11): # Etapas
    // M (12): # Días
    // N (13): Km (distancia)
    // O (14): M+ (elevación)
    // P (15): Instagram
    // Q (16): Tel
    // R (17): Site
    // S (18): Inscripción
    
    edition.name = values[2]?.trim()
    
    const idValue = values[3]?.trim()
    edition.id = idValue ? parseInt(idValue) || i : i
    
    edition.date = values[1]?.trim() || ''
    edition.discipline = values[4]?.trim() || ''
    edition.format = values[5]?.trim()
    edition.city = values[6]?.trim()
    edition.province = values[7]?.trim()
    edition.country = values[8]?.trim()
    edition.modality = values[9]?.trim()
    
    const stagesValue = values[11]?.trim()
    if (stagesValue) {
      const stages = parseInt(stagesValue)
      if (!isNaN(stages) && stages > 0) {
        edition.stages = stages
      }
    }
    
    const daysValue = values[12]?.trim()
    if (daysValue) {
      const days = parseInt(daysValue)
      if (!isNaN(days) && days > 0) {
        edition.days = days
      }
    }
    
    edition.distance = values[13]?.trim()
    edition.elevation = values[14]?.trim()
    edition.instagram = values[15]?.trim()
    edition.contactPhone = values[16]?.trim()
    edition.website = values[17]?.trim()
    edition.registrationUrl = values[18]?.trim()
    
    // Procesar etapas (desde columna T=19, 5 columnas por etapa)
    if (edition.stages && edition.stages > 0) {
      const stageDetails: Stage[] = []
      for (let stageNum = 1; stageNum <= Math.min(edition.stages, 8); stageNum++) {
        const baseIndex = 19 + (stageNum - 1) * 5
        const stage: Stage = {
          number: stageNum,
          name: values[baseIndex]?.trim() || undefined,
          distance: values[baseIndex + 1]?.trim() || undefined,
          elevation: values[baseIndex + 2]?.trim() || undefined,
          fromLocation: values[baseIndex + 3]?.trim() || undefined,
          toLocation: values[baseIndex + 4]?.trim() || undefined
        }
        // Solo agregar etapa si tiene al menos un campo
        if (stage.name || stage.distance || stage.elevation || stage.fromLocation || stage.toLocation) {
          stageDetails.push(stage)
        }
      }
      if (stageDetails.length > 0) {
        edition.stageDetails = stageDetails
      }
    }
    
    // Solo agregar si tiene nombre válido y fecha
    if (edition.name && edition.name.trim() && edition.date && edition.date.trim()) {
      editions.push(edition as CsvEdition)
    } else {
      skippedCount++
      if (i <= headerRows + 10) {
        console.log(`    ⚠ Fila ${i + 1} omitida: sin nombre o fecha válida | Nombre: "${edition.name}" | Fecha: "${edition.date}"`)
      }
    }
  }
  
  console.log(`  ✓ ${editions.length} ediciones válidas encontradas`)
  if (skippedCount > 0) {
    console.log(`  ⚠ Filas omitidas: ${skippedCount} (sin nombre, fecha, vacías o inválidas)`)
  }
  console.log()
  
  return editions
}

async function main() {
  console.log('🚀 Migrando ediciones 2026 desde la pestaña "2026"...\n')
  
  try {
    const sheetUrl = process.env.GOOGLE_SHEET_URL
    if (!sheetUrl) {
      throw new Error('GOOGLE_SHEET_URL no está configurada en .env')
    }
    
    const editionsGid = process.env.EDITIONS_TAB_GID || '490773918'
    
    console.log(`📥 Leyendo ediciones de la pestaña "2026" (GID: ${editionsGid})...`)
    
    const allEditions = await getEditionsFromSheet(sheetUrl, editionsGid)
    console.log(`  ✓ ${allEditions.length} ediciones leídas\n`)
    
    let successCount = 0
    let errorCount = 0
    let notFoundCount = 0
    
    console.log(`📝 Migrando ${allEditions.length} ediciones...\n`)
    
    const processedEditions: string[] = []
    
    for (let i = 0; i < allEditions.length; i++) {
      const csvEdition = allEditions[i]
      let retries = 3
      let success = false
      let editionProcessed = false
      
      // Debug: mostrar las primeras 3 ediciones
      if (i < 3) {
        console.log(`\n  🔍 Procesando edición ${i + 1}/${allEditions.length}: "${csvEdition.name}"`)
        console.log(`     Fecha: "${csvEdition.date}" | Provincia: "${csvEdition.province}" | País: "${csvEdition.country}"`)
      }
      
      while (retries > 0 && !success) {
        try {
          if (i < 3) {
            console.log(`     Intento ${4 - retries}/3...`)
          }
          // Siempre desconectar/reconectar antes de cada operación para evitar prepared statements
          await prisma.$disconnect()
          await new Promise(resolve => setTimeout(resolve, 100))
          await prisma.$connect()
          
          // 1. Buscar la carrera por nombre
          const race = await prisma.race.findFirst({
            where: {
              name: {
                equals: csvEdition.name.trim(),
                mode: 'insensitive'
              }
            }
          })
          
          if (i < 3) {
            console.log(`     ${race ? '✓' : '✗'} Carrera encontrada: ${race ? 'SÍ' : 'NO'}`)
          }
          
          if (!race) {
            notFoundCount++
            editionProcessed = true
            processedEditions.push(`⚠ "${csvEdition.name}" (ID CSV: ${csvEdition.id}) - CARRERA NO ENCONTRADA`)
            console.warn(`  ⚠ Carrera no encontrada: "${csvEdition.name}" (ID CSV: ${csvEdition.id})`)
            success = true // Considerar como "procesada" aunque no se haya migrado
            break
          }
          
          // 2. Obtener provincia
          let provinceId: string | null = null
          if (csvEdition.province && csvEdition.country) {
            // Normalizar nombre de país
            let countryName = csvEdition.country
            if (countryName === 'ARG') countryName = 'Argentina'
            if (countryName === 'CHI') countryName = 'Chile'
            if (countryName === 'URU') countryName = 'Uruguay'
            if (countryName === 'BRA') countryName = 'Brasil'
            
            // Buscar primero por el nombre exacto de la provincia
            let province = await prisma.province.findFirst({
              where: {
                name: {
                  equals: csvEdition.province,
                  mode: 'insensitive'
                },
                country: {
                  name: {
                    equals: countryName,
                    mode: 'insensitive'
                  }
                }
              }
            })
            
            if (province) {
              provinceId = province.id
            } else {
              // Si no encuentra, intentar variaciones comunes
              const provinceVariations: string[] = []
              
              // Para "Bs. As." buscar "Buenos Aires"
              if (csvEdition.province.toUpperCase() === 'BS. AS.' || csvEdition.province.toUpperCase() === 'BS AS' || csvEdition.province.toUpperCase() === 'BS.AS.') {
                provinceVariations.push('Buenos Aires')
              }
              
              // Buscar con las variaciones
              for (const variation of provinceVariations) {
                province = await prisma.province.findFirst({
                  where: {
                    name: {
                      equals: variation,
                      mode: 'insensitive'
                    },
                    country: {
                      name: {
                        equals: countryName,
                        mode: 'insensitive'
                      }
                    }
                  }
                })
                
                if (province) {
                  provinceId = province.id
                  break
                }
              }
            }
          }
          
          if (i < 3) {
            console.log(`     ${provinceId ? '✓' : '✗'} Provincia encontrada: ${provinceId ? 'SÍ' : 'NO'}`)
          }
          
          if (!provinceId) {
            throw new Error(`Provincia no encontrada: "${csvEdition.province}" (País: "${csvEdition.country}")`)
          }
          
          // 3. Parsear fecha
          let startDate: Date | null = null
          let year = 2026
          
          if (csvEdition.date) {
            const mmddyyyyMatch = csvEdition.date.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
            if (mmddyyyyMatch) {
              const month = parseInt(mmddyyyyMatch[1]) - 1
              const day = parseInt(mmddyyyyMatch[2])
              year = parseInt(mmddyyyyMatch[3])
              if (month >= 0 && month <= 11 && day > 0 && day <= 31 && year > 2000) {
                startDate = new Date(Date.UTC(year, month, day, 12, 0, 0))
              }
            } else {
              const parsedDate = new Date(csvEdition.date)
              if (!isNaN(parsedDate.getTime()) && parsedDate.getFullYear() > 2000) {
                startDate = parsedDate
                year = parsedDate.getFullYear()
              }
            }
          }
          
          if (i < 3) {
            console.log(`     ${startDate ? '✓' : '✗'} Fecha parseada: ${startDate ? startDate.toISOString() : 'NO'}`)
          }
          
          if (!startDate) {
            throw new Error(`Fecha inválida: "${csvEdition.date}"`)
          }
          
          // 4. Crear location string
          const locationParts = [csvEdition.city, csvEdition.province, csvEdition.country].filter(Boolean)
          const location = locationParts.join(', ') || ''
          
          // 5. Crear o actualizar RaceEdition
          const raceEdition = await prisma.raceEdition.upsert({
            where: {
              raceId_year_month: {
                raceId: race.id,
                year,
                month
              }
            },
            update: {
              provinceId,
              city: csvEdition.city || null,
              location,
              startDate,
              distance: csvEdition.distance || null,
              elevation: csvEdition.elevation || null,
              stages: csvEdition.stages || 1,
              days: csvEdition.days || 1,
              disciplines: race.disciplines && race.disciplines.length > 0 ? race.disciplines : [race.discipline],
              modalities: race.modalities && race.modalities.length > 0 ? race.modalities : (race.modality ? [race.modality] : []),
              isActive: true,
              updatedAt: new Date()
            },
            create: {
              raceId: race.id,
              provinceId,
              city: csvEdition.city || null,
              location,
              year,
              month,
              startDate,
              distance: csvEdition.distance || null,
              elevation: csvEdition.elevation || null,
              stages: csvEdition.stages || 1,
              days: csvEdition.days || 1,
              disciplines: race.disciplines && race.disciplines.length > 0 ? race.disciplines : [race.discipline],
              modalities: race.modalities && race.modalities.length > 0 ? race.modalities : (race.modality ? [race.modality] : []),
              isActive: true
            }
          })
          
          // 6. Crear etapas si las hay
          if (csvEdition.stageDetails && csvEdition.stageDetails.length > 0) {
            for (const stageData of csvEdition.stageDetails) {
              await prisma.stage.upsert({
                where: {
                  editionId_number: {
                    editionId: raceEdition.id,
                    number: stageData.number
                  }
                },
                update: {
                  name: stageData.name || null,
                  distance: stageData.distance || null,
                  elevation: stageData.elevation || null,
                  fromLocation: stageData.fromLocation || null,
                  toLocation: stageData.toLocation || null,
                  updatedAt: new Date()
                },
                create: {
                  editionId: raceEdition.id,
                  number: stageData.number,
                  name: stageData.name || null,
                  distance: stageData.distance || null,
                  elevation: stageData.elevation || null,
                  fromLocation: stageData.fromLocation || null,
                  toLocation: stageData.toLocation || null
                }
              })
            }
          }
          
          successCount++
          editionProcessed = true
          processedEditions.push(`✓ "${csvEdition.name}" (ID CSV: ${csvEdition.id}) - MIGRADA`)
          
          if ((i + 1) % 50 === 0 || i === allEditions.length - 1) {
            console.log(`  ✓ ${i + 1}/${allEditions.length} ediciones migradas...`)
          }
          success = true
          
        } catch (error: any) {
          retries--
          // Detectar error de PreparedStatement: puede venir en error.meta?.code o error.code
          const isPreparedStatementError = 
            (error.code === 'P2010' && error.meta?.code === '42P05') ||
            error.meta?.code === '42P05' ||
            (error.message && error.message.includes('prepared statement') && error.message.includes('already exists'))
          
          // Debug: mostrar TODOS los errores para las primeras 3 ediciones
          if (i < 3) {
            console.error(`     ❌ Error capturado (retries restantes: ${retries}):`, error.message)
            if (error.code) {
              console.error(`     Código de error: ${error.code}`)
            }
          }
          
          if (isPreparedStatementError && retries > 0) {
            if (i < 3) {
              console.log(`     ⚠ PreparedStatement error, reintentando...`)
            }
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
            editionProcessed = true
            processedEditions.push(`❌ "${csvEdition.name}" (ID CSV: ${csvEdition.id}) - ERROR: ${error.message}`)
            console.error(`  ❌ Error en "${csvEdition.name}" (ID CSV: ${csvEdition.id}):`, error.message)
            if (error.stack) {
              console.error(`     Stack: ${error.stack.split('\n')[1]?.trim()}`)
            }
            success = true // Marcar como procesada aunque haya error
          } else {
            // Si hay retries pero el error no es PreparedStatement, contar y salir
            errorCount++
            editionProcessed = true
            processedEditions.push(`❌ "${csvEdition.name}" (ID CSV: ${csvEdition.id}) - ERROR (retries agotados): ${error.message}`)
            console.error(`  ❌ Error en "${csvEdition.name}" (ID CSV: ${csvEdition.id}): ${error.message} (no es PreparedStatement error, retries restantes: ${retries})`)
            success = true
          }
          break
        }
      }
      
      // Si llegamos aquí sin success ni error, algo raro pasó
      if (!editionProcessed && !success) {
        console.warn(`  ⚠ ADVERTENCIA: "${csvEdition.name}" (ID CSV: ${csvEdition.id}) no fue procesada correctamente`)
        processedEditions.push(`⚠ "${csvEdition.name}" (ID CSV: ${csvEdition.id}) - NO PROCESADA`)
      }
    }
    
    console.log(`\n🏁 Migración finalizada`)
    console.log(`   📊 Total leídas: ${allEditions.length}`)
    console.log(`   ✅ Exitosas: ${successCount}`)
    console.log(`   ⚠ Carreras no encontradas: ${notFoundCount}`)
    console.log(`   ❌ Errores: ${errorCount}`)
    console.log(`   🔍 Total procesadas (exitosas + no encontradas + errores): ${successCount + notFoundCount + errorCount}`)
    
    // Detectar desajuste
    if (successCount + notFoundCount + errorCount !== allEditions.length) {
      const missing = allEditions.length - (successCount + notFoundCount + errorCount)
      console.warn(`\n   ⚠ DESAJUSTE: Faltan ${missing} edición(es) que no se contaron`)
      console.warn(`   Mostrando primeras 10 ediciones procesadas para debug:\n`)
      for (const entry of processedEditions.slice(0, 10)) {
        console.log(`     ${entry}`)
      }
    }
    
    // Si no hubo éxitos, mostrar más info de debug
    if (successCount === 0 && errorCount === 0 && notFoundCount === 0) {
      console.warn(`\n   ⚠ ADVERTENCIA: No se procesó ninguna edición.`)
      console.warn(`   Esto sugiere que el loop no está entrando correctamente.`)
      console.warn(`   Mostrando primeras 5 ediciones para verificar:\n`)
      for (let d = 0; d < Math.min(5, allEditions.length); d++) {
        const e = allEditions[d]
        console.log(`     ${d + 1}. "${e.name}" | Fecha: "${e.date}" | Provincia: "${e.province}" | País: "${e.country}"`)
      }
    }
    
  } catch (error: any) {
    console.error('\n❌ Error general en la migración:', error.message)
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
