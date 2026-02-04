/**
 * Script para verificar problemas con la contraseña
 * Ejecuta: node scripts/test-password.js
 */

require('dotenv').config({ path: '.env.local' })

const dbUrl = process.env.DATABASE_URL

console.log('🔍 Verificando posibles problemas con la contraseña...\n')

if (!dbUrl) {
  console.error('❌ DATABASE_URL no está configurada')
  process.exit(1)
}

// Extraer componentes de la URL
const urlPattern = /postgresql:\/\/([^:]+):([^@]+)@([^:\/]+):(\d+)\/([^?]+)(.*)/
const match = dbUrl.match(urlPattern)

if (!match) {
  console.error('❌ Formato de URL inválido')
  process.exit(1)
}

const [, user, password, host, port, database] = match

console.log('Información detectada:')
console.log(`  Usuario: ${user}`)
console.log(`  Longitud de contraseña: ${password.length} caracteres`)
console.log(`  Host: ${host}`)
console.log(`  Puerto: ${port}`)
console.log('')

// Verificar problemas comunes con contraseñas
const issues = []

// Verificar espacios
if (password.includes(' ')) {
  issues.push('⚠️  La contraseña contiene espacios')
}

// Verificar caracteres especiales que podrían necesitar URL encoding
const specialChars = /[%#&+\/\\]/
if (specialChars.test(password)) {
  issues.push('⚠️  La contraseña contiene caracteres especiales que podrían necesitar URL encoding')
  console.log('   Caracteres especiales detectados. Estos deben estar URL-encoded en la conexión string.')
  console.log('')
}

// Verificar si está vacía o muy corta
if (password.length < 8) {
  issues.push(`⚠️  La contraseña es muy corta (${password.length} caracteres)`)
}

// Verificar que la URL no tenga comillas extras
if (dbUrl.startsWith('"') || dbUrl.endsWith('"')) {
  issues.push('⚠️  La URL tiene comillas dobles (") al inicio o final')
  console.log('   En .env.local, la URL debe estar entre comillas pero sin espacios extras')
  console.log('')
}

if (issues.length > 0) {
  console.log('🚨 Posibles problemas detectados:')
  issues.forEach(issue => console.log(`   ${issue}`))
  console.log('')
}

console.log('💡 Soluciones:')
console.log('')
console.log('1. Verifica que copiaste la contraseña completa desde Supabase')
console.log('   - No debe tener espacios al inicio o final')
console.log('   - Debe ser exactamente como aparece en Supabase')
console.log('')
console.log('2. Si la contraseña tiene caracteres especiales, usa la URL completa desde Supabase')
console.log('   - Supabase ya incluye los caracteres correctamente escapados')
console.log('   - Ve a Settings → Database → Connection string → Transaction pooler')
console.log('   - Copia la URL completa (incluye [YOUR-PASSWORD] ya reemplazado)')
console.log('')
console.log('3. Revisa que .env.local tenga el formato correcto:')
console.log('   DATABASE_URL="postgresql://postgres.ucbbxrmosglszjjkzdkb:PASSWORD@aws-0-us-west-2.pooler.supabase.com:6543/postgres"')
console.log('   (Sin espacios antes o después de las comillas)')
console.log('')
console.log('4. Si acabas de resetear la contraseña:')
console.log('   - Asegúrate de usar la NUEVA contraseña')
console.log('   - La contraseña antigua ya no funciona')
console.log('')

// Mostrar primeros y últimos caracteres (enmascarados) para verificar
if (password.length > 4) {
  const masked = password.substring(0, 2) + '***' + password.substring(password.length - 2)
  console.log(`   Contraseña (enmascarada): ${masked}`)
  console.log(`   Primeros 2 caracteres: "${password.substring(0, 2)}"`)
  console.log(`   Últimos 2 caracteres: "${password.substring(password.length - 2)}"`)
  console.log('')
  console.log('   Verifica que estos caracteres coincidan con los de la contraseña que copiaste')
}
