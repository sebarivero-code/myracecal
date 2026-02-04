import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import 'dotenv/config'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// Columnas que sí tiene RaceEdition en Render (schema actual). Las que no estén se ignoran.
const RACE_EDITION_COLUMNS = new Set([
  'id', 'raceId', 'provinceId', 'city', 'location', 'year', 'startDate',
  'stages', 'days', 'isActive', 'createdAt', 'updatedAt'
])

/**
 * Parsea la lista VALUES (val1, val2, ...) respetando strings con comas y ::casts.
 */
function parseValues(valStr: string): string[] {
  const values: string[] = []
  let i = 0
  const trim = () => { while (i < valStr.length && /\s/.test(valStr[i])) i++ }
  while (i < valStr.length) {
    trim()
    if (i >= valStr.length) break
    if (valStr[i] === 'N' && valStr.slice(i, i + 4) === 'NULL') {
      values.push('NULL')
      i += 4
      trim()
      if (valStr[i] === ',') i++
      continue
    }
    if (valStr[i] === 't' && valStr.slice(i, i + 4) === 'true') {
      values.push('true')
      i += 4
      trim()
      if (valStr[i] === ',') i++
      continue
    }
    if (valStr[i] === 'f' && valStr.slice(i, i + 5) === 'false') {
      values.push('false')
      i += 5
      trim()
      if (valStr[i] === ',') i++
      continue
    }
    if (valStr[i] === "'") {
      let token = "'"
      i++
      while (i < valStr.length) {
        if (valStr[i] === "'" && valStr[i + 1] === "'") {
          token += "''"
          i += 2
        } else if (valStr[i] === "'") {
          token += "'"
          i++
          while (i < valStr.length && /[\w\[\]]/.test(valStr[i])) token += valStr[i++]
          values.push(token.trim())
          trim()
          if (valStr[i] === ',') i++
          break
        } else {
          token += valStr[i++]
        }
      }
      continue
    }
    // número
    const numMatch = valStr.slice(i).match(/^(-?\d+)\s*(?:,|$)/)
    if (numMatch) {
      values.push(numMatch[1])
      i += numMatch[1].length
      trim()
      if (valStr[i] === ',') i++
      continue
    }
    i++
  }
  return values
}

/**
 * Si el statement es INSERT INTO "RaceEdition" con columnas viejas (distance, elevation, disciplines, modalities),
 * devuelve { sql } con solo las columnas del schema actual y opcionalmente { editionId, distance, elevation, disciplines, modalities }
 * para insertar en EditionFormat.
 */
function transformRaceEditionStatement(statement: string): { sql: string; editionFormat?: { editionId: string; distance: string | null; elevation: string | null; disciplines: string; modalities: string } } | null {
  const m = statement.match(/INSERT INTO "RaceEdition" \(([^)]+)\)\s*VALUES\s*\((.+)\)\s*;?\s*$/is)
  if (!m) return null
  const colStr = m[1]
  const valStr = m[2].trim()
  const columns = colStr.split(/,\s*/).map((c) => c.replace(/^"|"$/g, '').trim())
  const values = parseValues(valStr)
  if (columns.length !== values.length) return null
  const hasOldColumns = columns.some((c) => ['distance', 'elevation', 'disciplines', 'modalities'].includes(c))
  if (!hasOldColumns) return null

  const colVal: Record<string, string> = {}
  columns.forEach((col, idx) => { colVal[col] = values[idx] })

  const targetCols: string[] = []
  const targetVals: string[] = []
  for (const col of columns) {
    if (RACE_EDITION_COLUMNS.has(col)) {
      targetCols.push(`"${col}"`)
      targetVals.push(colVal[col])
    }
  }
  const sql = `INSERT INTO "RaceEdition" (${targetCols.join(', ')}) VALUES (${targetVals.join(', ')});`

  const editionId = colVal['id']
  if (!editionId || editionId === 'NULL') return { sql }

  const distanceRaw = colVal['distance']
  const elevationRaw = colVal['elevation']
  const distance = distanceRaw && distanceRaw !== 'NULL' ? distanceRaw.replace(/^'|'$/g, '') : null
  const elevation = elevationRaw && elevationRaw !== 'NULL' ? elevationRaw.replace(/^'|'$/g, '') : null
  const disciplines = colVal['disciplines'] ?? "'[]'::text[]"
  const modalities = colVal['modalities'] ?? "'[]'::text[]"

  return {
    sql,
    editionFormat: {
      editionId: editionId.replace(/^'|'$/g, ''),
      distance,
      elevation,
      disciplinesRaw: disciplines,
      modalitiesRaw: modalities
    }
  }
}

async function importRender() {
  console.log('📥 Importando datos a Render PostgreSQL...\n')

  const sqlFile = path.join(process.cwd(), 'supabase-export.sql')

  if (!fs.existsSync(sqlFile)) {
    console.error(`❌ Archivo no encontrado: ${sqlFile}`)
    console.log('💡 Primero ejecuta: npm run export:supabase')
    process.exit(1)
  }

  try {
    const sqlContent = fs.readFileSync(sqlFile, 'utf-8')

    const statements = sqlContent
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'))

    console.log(`📋 Procesando ${statements.length} statements...\n`)

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.startsWith('--') || statement.length === 0) continue

      try {
        const transformed = transformRaceEditionStatement(statement)
        const toRun = transformed ? transformed.sql : statement

        await prisma.$executeRawUnsafe(toRun)
        successCount++

        if (transformed?.editionFormat) {
          const { editionId, distance, elevation, disciplinesRaw, modalitiesRaw } = transformed.editionFormat
          const distVal = distance != null && distance !== 'NULL' ? `'${String(distance).replace(/'/g, "''")}'` : 'NULL'
          const elevVal = elevation != null && elevation !== 'NULL' ? `'${String(elevation).replace(/'/g, "''")}'` : 'NULL'
          const efSql = `INSERT INTO "EditionFormat" ("id", "editionId", "format", "distance", "elevation", "disciplines", "modalities", "createdAt", "updatedAt") VALUES (gen_random_uuid(), '${editionId.replace(/'/g, "''")}', 'General', ${distVal}, ${elevVal}, ${disciplinesRaw}, ${modalitiesRaw}, NOW(), NOW());`
          try {
            await prisma.$executeRawUnsafe(efSql)
          } catch (_) {
            // Si falla (ej. formato del array), no romper toda la importación
          }
        }

        if ((i + 1) % 50 === 0) {
          console.log(`  ✅ Procesados ${i + 1}/${statements.length} statements...`)
        }
      } catch (error: any) {
        errorCount++
        if (!error.message.includes('already exists') && !error.message.includes('duplicate key')) {
          console.error(`  ⚠️  Error en statement ${i + 1}:`, error.message.substring(0, 120))
        }
      }
    }

    console.log(`\n✅ Importación completada`)
    console.log(`   Exitosos: ${successCount}`)
    console.log(`   Errores: ${errorCount}`)
  } catch (error: any) {
    console.error('❌ Error en la importación:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

importRender()
  .then(() => {
    console.log('\n✨ Proceso completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error)
    process.exit(1)
  })
