/**
 * Probar conexión directa (sin pooler) para descartar problemas del pooler
 */

require('dotenv').config({ path: '.env.local' })

const { PrismaClient } = require('@prisma/client')

async function testDirectConnection() {
  console.log('🔍 Probando conexión directa (sin pooler)...\n')
  
  // Extraer componentes de la URL actual
  const poolerUrl = process.env.DATABASE_URL
  if (!poolerUrl) {
    console.error('❌ DATABASE_URL no está configurada')
    process.exit(1)
  }
  
  // Convertir URL de pooler a URL directa
  // postgres.ucbbxrmosglszjjkzdkb -> postgres
  // aws-0-us-west-2.pooler.supabase.com -> db.ucbbxrmosglszjjkzdkb.supabase.co
  // 6543 -> 5432
  
  const urlPattern = /postgresql:\/\/([^:]+):([^@]+)@([^:\/]+):(\d+)\/([^?]+)/
  const match = poolerUrl.match(urlPattern)
  
  if (!match) {
    console.error('❌ No se pudo parsear la URL')
    process.exit(1)
  }
  
  const [, user, password, host, port, database] = match
  
  // Construir URL directa
  const directUser = user.replace(/\.ucbbxrmosglszjjkzdkb/, '') // postgres.ucbbxrmosglszjjkzdkb -> postgres
  const directHost = host.replace(/aws-0-[^\.]+\.pooler\.supabase\.com/, 'db.ucbbxrmosglszjjkzdkb.supabase.co')
  const directUrl = `postgresql://${directUser}:${password}@${directHost}:5432/${database}`
  
  console.log('URL del pooler (actual):')
  console.log(`  ${poolerUrl.replace(/:[^:@]+@/, ':****@')}\n`)
  
  console.log('URL directa (para probar):')
  console.log(`  ${directUrl.replace(/:[^:@]+@/, ':****@')}\n`)
  
  console.log('💡 Probando con conexión directa...\n')
  
  // Crear Prisma Client con URL directa
  process.env.DATABASE_URL = directUrl
  const prisma = new PrismaClient()
  
  try {
    await prisma.$connect()
    console.log('✅ ¡Conexión directa exitosa!\n')
    console.log('📊 Esto significa que:')
    console.log('   - La contraseña es correcta ✅')
    console.log('   - El proyecto está activo ✅')
    console.log('   - El problema está en el pooler\n')
    console.log('💡 Soluciones:')
    console.log('   1. Usa la URL directa (puerto 5432) en lugar del pooler')
    console.log('   2. O verifica la configuración del pooler en Supabase')
    console.log('')
    console.log('URL directa para usar:')
    console.log(directUrl.replace(/:[^:@]+@/, ':****@'))
    
    const count = await prisma.country.count()
    console.log(`\n✅ Query exitosa! Países: ${count}`)
    
  } catch (error) {
    console.error('\n❌ Error con conexión directa:')
    console.error(`   Mensaje: ${error.message}\n`)
    
    if (error.code === 'P1001') {
      console.log('💡 Posibles causas:')
      console.log('   1. Restricciones de IP en Supabase')
      console.log('   2. Firewall bloqueando el puerto 5432')
      console.log('   3. La URL directa necesita un formato diferente')
    } else if (error.message.includes('Authentication failed')) {
      console.log('💡 El error persiste con conexión directa')
      console.log('   Esto sugiere un problema con:')
      console.log('   1. La contraseña (aunque hayas verificado)')
      console.log('   2. Caracteres especiales que necesitan URL encoding')
      console.log('   3. Restricciones de acceso en Supabase')
    }
  } finally {
    await prisma.$disconnect()
    // Restaurar URL original
    process.env.DATABASE_URL = poolerUrl
  }
}

testDirectConnection()
