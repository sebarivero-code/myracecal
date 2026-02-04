/**
 * Script para probar la conexión a Supabase
 * Ejecuta: node scripts/test-db-connection.js
 */

require('dotenv').config({ path: '.env.local' })

const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const prisma = new PrismaClient()
  
  console.log('🔍 Verificando conexión a Supabase...\n')
  
  // Verificar DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL no está configurada en .env.local')
    console.log('\n💡 Agrega DATABASE_URL en tu archivo .env.local:')
    console.log('   DATABASE_URL="postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres"')
    process.exit(1)
  }
  
  console.log('✓ DATABASE_URL encontrada')
  console.log(`  URL: ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}\n`)
  
  try {
    console.log('🔄 Intentando conectar...')
    
    // Probar conexión simple
    await prisma.$connect()
    console.log('✅ Conexión exitosa!\n')
    
    // Probar una query simple
    console.log('🔄 Probando query...')
    const countryCount = await prisma.country.count()
    console.log(`✅ Query exitosa!`)
    console.log(`   Países en la base de datos: ${countryCount}\n`)
    
    // Probar obtener provincias
    const provinceCount = await prisma.province.count()
    console.log(`   Provincias en la base de datos: ${provinceCount}\n`)
    
    // Probar obtener carreras
    const raceCount = await prisma.race.count()
    console.log(`   Carreras en la base de datos: ${raceCount}\n`)
    
    console.log('✅ Todo funciona correctamente!')
    
  } catch (error) {
    console.error('\n❌ Error de conexión:')
    console.error(`   Código: ${error.code || 'N/A'}`)
    console.error(`   Mensaje: ${error.message}\n`)
    
    if (error.code === 'P1001') {
      console.log('💡 Posibles soluciones:')
      console.log('   1. Verifica que el proyecto de Supabase esté activo')
      console.log('   2. Ve a Supabase Dashboard → Settings → General')
      console.log('   3. Verifica que la URL de conexión sea correcta')
      console.log('   4. Verifica que la contraseña sea correcta')
      console.log('   5. Si el proyecto está pausado, reactívalo desde el dashboard')
    } else if (error.message && error.message.includes('Authentication failed')) {
      console.log('💡 Error de autenticación - La contraseña es incorrecta\n')
      console.log('📋 Pasos para solucionarlo:')
      console.log('   1. Ve a Supabase → Settings → Database')
      console.log('   2. Haz clic en "Reset database password"')
      console.log('   3. Copia la nueva contraseña')
      console.log('   4. Actualiza DATABASE_URL en .env.local con la nueva contraseña')
      console.log('   5. O copia la URL completa desde "Connection string" en Supabase')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
