/**
 * Script para verificar y corregir el formato de DATABASE_URL
 * Ejecuta: node scripts/verificar-url.js
 */

require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env' })

const dbUrl = process.env.DATABASE_URL

console.log('🔍 Verificando formato de DATABASE_URL...\n')

if (!dbUrl) {
  console.error('❌ DATABASE_URL no está configurada')
  process.exit(1)
}

console.log('URL actual (enmascarada):')
console.log(dbUrl.replace(/:[^:@]+@/, ':****@'))
console.log('')

// Verificar formato
const urlPattern = /postgresql:\/\/([^:]+):([^@]+)@([^:\/]+):(\d+)\/([^?]+)(.*)/
const match = dbUrl.match(urlPattern)

if (!match) {
  console.error('❌ Formato de URL inválido')
  process.exit(1)
}

const [, user, password, host, port, database, queryParams] = match

console.log('Componentes detectados:')
console.log(`  Usuario: ${user}`)
console.log(`  Contraseña: ${password.length} caracteres`)
console.log(`  Host: ${host}`)
console.log(`  Puerto: ${port}`)
console.log(`  Base de datos: ${database}`)
console.log(`  Parámetros: ${queryParams || '(ninguno)'}`)
console.log('')

// Verificar problemas comunes
const issues = []

if (user.includes('.')) {
  issues.push(`⚠️  El usuario contiene puntos: "${user}"`)
  console.log('   En el pooler de Supabase, el usuario debe ser "postgres", no "postgres.PROJECT_REF"')
  console.log('')
}

if (host.includes('pooler.supabase.com')) {
  console.log('✓ Estás usando el pooler de Supabase (aws-0-us-west-2.pooler.supabase.com)')
  console.log('')
  console.log('📋 Formato correcto para pooler:')
  console.log('   postgresql://postgres:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres')
  console.log('')
  console.log('   Donde el usuario es SOLO "postgres", no "postgres.PROJECT_REF"')
  console.log('')
}

if (host.includes('db.') && host.includes('.supabase.co')) {
  console.log('✓ Estás usando la conexión directa (db.PROJECT.supabase.co)')
  console.log('')
  console.log('📋 Formato correcto para conexión directa:')
  console.log('   postgresql://postgres:[PASSWORD]@db.PROJECT.supabase.co:6543/postgres?pgbouncer=true')
  console.log('')
}

if (issues.length > 0) {
  console.log('🚨 Problemas detectados:')
  issues.forEach(issue => console.log(`   ${issue}`))
  console.log('')
  console.log('💡 Solución:')
  console.log('   1. Ve a Supabase → Settings → Database')
  console.log('   2. Busca "Connection string" o "Connection pooling"')
  console.log('   3. Selecciona "Transaction" o "Session" mode')
  console.log('   4. Copia la URL completa (ya tiene el formato correcto)')
  console.log('   5. Pégalo en .env.local')
} else {
  console.log('✅ El formato de la URL parece correcto')
  console.log('')
  console.log('💡 Si el error persiste, verifica:')
  console.log('   1. Que la contraseña no tenga espacios al inicio o final')
  console.log('   2. Que la contraseña se copió completamente')
  console.log('   3. Que caracteres especiales estén correctamente escapados en la URL')
  console.log('   4. Intenta copiar la URL completa directamente desde Supabase')
}
