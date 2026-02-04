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
    
    // Dividir en statements individuales
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    console.log(`📋 Procesando ${statements.length} statements...\n`)
    
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      // Saltar comentarios y líneas vacías
      if (statement.startsWith('--') || statement.length === 0) {
        continue
      }
      
      try {
        // Ejecutar statement
        await prisma.$executeRawUnsafe(statement)
        successCount++
        
        if ((i + 1) % 10 === 0) {
          console.log(`  ✅ Procesados ${i + 1}/${statements.length} statements...`)
        }
      } catch (error: any) {
        errorCount++
        // Algunos errores son esperados (tablas que ya existen, etc.)
        if (!error.message.includes('already exists') && 
            !error.message.includes('duplicate key')) {
          console.error(`  ⚠️  Error en statement ${i + 1}:`, error.message.substring(0, 100))
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
