/**
 * Probar diferentes formatos de URL para el pooler
 */

require('dotenv').config({ path: '.env.local' })

const { PrismaClient } = require('@prisma/client')

async function testFormats() {
  const originalUrl = process.env.DATABASE_URL
  
  if (!originalUrl) {
    console.error('❌ DATABASE_URL no está configurada')
    process.exit(1)
  }
  
  console.log('🔍 Probando diferentes formatos de URL...\n')
  
  // Extraer contraseña de la URL original
  const match = originalUrl.match(/postgresql:\/\/([^:]+):([^@]+)@/)
  if (!match) {
    console.error('❌ No se pudo extraer la contraseña de la URL')
    process.exit(1)
  }
  
  const password = match[2]
  
  // Formato 1: Usuario con punto (actual)
  const format1 = `postgresql://postgres.ucbbxrmosglszjjkzdkb:${password}@aws-0-us-west-2.pooler.supabase.com:6543/postgres`
  
  // Formato 2: Usuario sin punto (alternativo)
  const format2 = `postgresql://postgres:${password}@aws-0-us-west-2.pooler.supabase.com:6543/postgres`
  
  // Formato 3: Con parámetros adicionales
  const format3 = `postgresql://postgres.ucbbxrmosglszjjkzdkb:${password}@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true`
  
  console.log('Formato 1 (actual - con postgres.ucbbxrmosglszjjkzdkb):')
  console.log(format1.replace(/:[^:@]+@/, ':****@'))
  console.log('')
  
  try {
    process.env.DATABASE_URL = format1
    const prisma1 = new PrismaClient()
    await prisma1.$connect()
    console.log('✅ Formato 1 funciona!\n')
    await prisma1.$disconnect()
    process.exit(0)
  } catch (err) {
    console.log(`❌ Formato 1 falló: ${err.message.split('\n')[0]}\n`)
  }
  
  console.log('Formato 2 (con postgres sin punto):')
  console.log(format2.replace(/:[^:@]+@/, ':****@'))
  console.log('')
  
  try {
    process.env.DATABASE_URL = format2
    const prisma2 = new PrismaClient()
    await prisma2.$connect()
    console.log('✅ Formato 2 funciona!\n')
    await prisma2.$disconnect()
    process.exit(0)
  } catch (err) {
    console.log(`❌ Formato 2 falló: ${err.message.split('\n')[0]}\n`)
  }
  
  console.log('Formato 3 (con pgbouncer=true):')
  console.log(format3.replace(/:[^:@]+@/, ':****@'))
  console.log('')
  
  try {
    process.env.DATABASE_URL = format3
    const prisma3 = new PrismaClient()
    await prisma3.$connect()
    console.log('✅ Formato 3 funciona!\n')
    await prisma3.$disconnect()
    process.exit(0)
  } catch (err) {
    console.log(`❌ Formato 3 falló: ${err.message.split('\n')[0]}\n`)
  }
  
  console.log('❌ Ningún formato funcionó\n')
  console.log('💡 Posibles causas:')
  console.log('   1. Restricciones de IP en Supabase')
  console.log('   2. La contraseña necesita URL encoding para caracteres especiales')
  console.log('   3. El pooler está deshabilitado o tiene configuración especial')
  console.log('   4. Verifica en Supabase → Settings → Database → Connection pooling')
}

testFormats()
