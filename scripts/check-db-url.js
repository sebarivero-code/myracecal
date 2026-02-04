/**
 * Script para verificar la configuración de DATABASE_URL
 * Ejecuta: node scripts/check-db-url.js
 */

require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env' })

const dbUrl = process.env.DATABASE_URL
const directUrl = process.env.DIRECT_URL

console.log('🔍 Verificando configuración de DATABASE_URL...\n')

if (!dbUrl) {
  console.error('❌ DATABASE_URL no está configurada')
  console.log('\n💡 Agrega DATABASE_URL en tu archivo .env.local')
  process.exit(1)
}

console.log('✓ DATABASE_URL encontrada')
console.log(`  URL (enmascarada): ${dbUrl.replace(/:[^:@]+@/, ':****@')}\n`)

// Verificar formato
if (!dbUrl.startsWith('postgresql://')) {
  console.warn('⚠️  La URL no comienza con "postgresql://"')
}

// Verificar puerto
const portMatch = dbUrl.match(/:(\d+)/)
if (portMatch) {
  const port = portMatch[1]
  console.log(`  Puerto: ${port}`)
  
  if (port === '5432') {
    console.log('  ✓ Puerto 5432 (directo)')
  } else if (port === '6543') {
    console.log('  ✓ Puerto 6543 (pgbouncer - correcto para aplicación)')
  } else {
    console.warn(`  ⚠️  Puerto inusual: ${port}`)
  }
} else {
  console.warn('⚠️  No se pudo detectar el puerto en la URL')
}

// Verificar pgbouncer
if (dbUrl.includes('pgbouncer=true')) {
  console.log('  ✓ pgbouncer=true encontrado')
} else {
  console.log('  ℹ️  No tiene pgbouncer=true (conexión directa)')
}

// Verificar host
const hostMatch = dbUrl.match(/@([^:/]+)/)
if (hostMatch) {
  const host = hostMatch[1]
  console.log(`  Host: ${host}`)
}

console.log('')

// Verificar DIRECT_URL si existe
if (directUrl) {
  console.log('✓ DIRECT_URL encontrada (para Prisma Migrate)')
  console.log(`  URL (enmascarada): ${directUrl.replace(/:[^:@]+@/, ':****@')}\n`)
} else {
  console.log('ℹ️  DIRECT_URL no configurada (solo necesaria para Prisma Migrate)')
}

console.log('\n💡 Recomendaciones:')
console.log('')
console.log('Para la aplicación (DATABASE_URL), usa una de estas opciones:')
console.log('')
console.log('Opción 1 - Connection Pooling (Recomendado):')
console.log('  postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:6543/postgres?pgbouncer=true')
console.log('')
console.log('Opción 2 - Directo (si pooler no funciona):')
console.log('  postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres')
console.log('')
console.log('Para Prisma Migrate (DIRECT_URL), siempre usa directo:')
console.log('  postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres')
