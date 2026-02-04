/**
 * Vacía las tablas en Render (o cualquier PostgreSQL de DATABASE_URL)
 * para poder volver a correr migrate:sheets desde cero.
 *
 * No hace falta ningún cliente SQL: se ejecuta con:
 *   npm run truncate:render
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function truncate() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL no está definida en .env')
    process.exit(1)
  }

  console.log('🗑️  Vaciamos tablas (EditionFormat, Stage, UserCalendar, RaceEdition, Race, Province, Country)...\n')

  try {
    await prisma.$executeRawUnsafe(`
      TRUNCATE "EditionFormat", "Stage", "UserCalendar", "RaceEdition", "Race", "Province", "Country" CASCADE;
    `)
    console.log('✅ Tablas vaciadas. Podés correr: npm run migrate:sheets\n')
  } catch (e: any) {
    console.error('❌ Error:', e.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

truncate()
