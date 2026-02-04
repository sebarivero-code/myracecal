/**
 * Prueba simple de conexión usando la URL exacta de .env.local
 */

require('dotenv').config({ path: '.env.local' })

const { PrismaClient } = require('@prisma/client')

async function test() {
  console.log('🔍 Probando conexión...\n')
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL no encontrada en .env.local')
    process.exit(1)
  }
  
  console.log('✓ DATABASE_URL encontrada')
  console.log(`  URL (enmascarada): ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}\n`)
  
  const prisma = new PrismaClient({
    log: ['error', 'warn']
  })
  
  try {
    console.log('🔄 Conectando...')
    await prisma.$connect()
    console.log('✅ Conexión exitosa!\n')
    
    console.log('🔄 Haciendo query de prueba...')
    const count = await prisma.country.count()
    console.log(`✅ Query exitosa! Países en la base de datos: ${count}\n`)
    
    console.log('✅ ¡Todo funciona correctamente!')
    
  } catch (error) {
    console.error('\n❌ Error:')
    console.error(`   ${error.message}\n`)
    
    if (error.message.includes('Authentication failed')) {
      console.log('💡 El error de autenticación persiste.')
      console.log('   Verifica:')
      console.log('   1. Que la contraseña en .env.local sea la misma que en Supabase')
      console.log('   2. Que no haya espacios antes o después de la contraseña')
      console.log('   3. Que la URL completa sea exactamente como aparece en Supabase')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

test()
