/**
 * Carga Argentina y las 23 provincias argentinas en la base de datos.
 * Útil si la DB se pobló solo con migrate-from-sheets y faltan provincias (ej. Santa Fe).
 *
 * Uso: npm run seed:provinces
 */
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

const PROVINCIAS_ARGENTINA = [
  'Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán'
]

async function main() {
  console.log('🌍 Buscando o creando país Argentina...')
  const country = await prisma.country.upsert({
    where: { name: 'Argentina' },
    update: {},
    create: {
      name: 'Argentina',
      code: 'AR',
      isActive: true
    }
  })
  console.log(`   ✓ Argentina (${country.id})\n`)

  console.log('📦 Cargando provincias argentinas...')
  for (const name of PROVINCIAS_ARGENTINA) {
    const province = await prisma.province.upsert({
      where: {
        countryId_name: {
          countryId: country.id,
          name
        }
      },
      update: { isActive: true },
      create: {
        countryId: country.id,
        name,
        isActive: true
      }
    })
    console.log(`   ✓ ${name} (${province.id})`)
  }
  console.log('\n✅ Listo. Todas las provincias (incluida Santa Fe) están disponibles.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
