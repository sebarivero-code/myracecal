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

async function exportSupabase() {
  console.log('📤 Exportando datos de Supabase...\n')
  console.log('💡 Usando pg_dump es más confiable. Si tienes psql instalado, usa:')
  console.log('   pg_dump $DATABASE_URL > supabase-export.sql\n')
  
  try {
    // Obtener todas las tablas y sus datos
    const tables = [
      'Country',
      'Province',
      'Race',
      'RaceEdition',
      'EditionFormat',
      'Stage',
      'User',
      'UserCalendar',
      'RaceReport'
    ]
    
    let sqlContent = `-- Exportación de datos de Supabase\n`
    sqlContent += `-- Generado: ${new Date().toISOString()}\n`
    sqlContent += `-- NOTA: Esta es una exportación básica. Para una exportación completa usa pg_dump\n\n`
    
    // Exportar cada tabla
    for (const table of tables) {
      console.log(`📋 Exportando tabla: ${table}`)
      
      try {
        // Obtener columnas primero
        const columns = await prisma.$queryRawUnsafe<Array<{column_name: string}>>(
          `SELECT column_name FROM information_schema.columns WHERE table_name = '${table}' ORDER BY ordinal_position`
        )
        
        if (columns.length === 0) {
          console.log(`  ⚠️  Tabla no existe o sin columnas`)
          continue
        }
        
        const columnNames = columns.map(c => c.column_name)
        
        // Obtener datos
        const data = await prisma.$queryRawUnsafe(`SELECT * FROM "${table}"`)
        
        if (Array.isArray(data) && data.length > 0) {
          sqlContent += `\n-- Datos de ${table} (${data.length} registros)\n`
          
          // Construir INSERT statements
          for (const row of data as any[]) {
            const values = columnNames.map(col => {
              const val = row[col]
              if (val === null || val === undefined) return 'NULL'
              if (typeof val === 'string') {
                return `'${val.replace(/'/g, "''").replace(/\\/g, '\\\\')}'`
              }
              if (Array.isArray(val)) {
                // Arrays de PostgreSQL como texto
                return `'${JSON.stringify(val).replace(/'/g, "''")}'::text[]`
              }
              if (val instanceof Date) {
                return `'${val.toISOString()}'::timestamp`
              }
              if (typeof val === 'boolean') {
                return val ? 'true' : 'false'
              }
              return String(val)
            })
            
            sqlContent += `INSERT INTO "${table}" (${columnNames.map(c => `"${c}"`).join(', ')}) VALUES (${values.join(', ')});\n`
          }
          
          console.log(`  ✅ ${data.length} registros exportados`)
        } else {
          console.log(`  ⚠️  Tabla vacía`)
        }
      } catch (error: any) {
        console.error(`  ❌ Error exportando ${table}:`, error.message)
        // Continuar con la siguiente tabla
      }
    }
    
    // Guardar archivo
    const outputPath = path.join(process.cwd(), 'supabase-export.sql')
    fs.writeFileSync(outputPath, sqlContent, 'utf-8')
    
    console.log(`\n✅ Exportación completada: ${outputPath}`)
    console.log(`📊 Total de tablas procesadas: ${tables.length}`)
    console.log(`\n💡 Para importar: npm run import:render`)
    
  } catch (error: any) {
    console.error('❌ Error en la exportación:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

exportSupabase()
  .then(() => {
    console.log('\n✨ Proceso completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error)
    process.exit(1)
  })
