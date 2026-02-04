/**
 * Actualiza todas las RaceEdition existentes para que:
 * - year = año de startDate
 * - month = mes de startDate (1–12)
 *
 * Debe ejecutarse una vez después de agregar el campo month
 * y antes de confiar en la unique [raceId, year, month].
 *
 * Ejecutar con:
 *   npm run migrate:raceedition-months
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Actualizando year y month en RaceEdition a partir de startDate...\n')

  try {
    await prisma.$executeRawUnsafe(`
      UPDATE "RaceEdition"
      SET "year" = EXTRACT(YEAR FROM "startDate")::int,
          "month" = EXTRACT(MONTH FROM "startDate")::int
      WHERE "startDate" IS NOT NULL;
    `)

    const count = await prisma.raceEdition.count()
    console.log(`✅ RaceEdition actualizadas. Total filas: ${count}`)
  } catch (e: any) {
    console.error('❌ Error actualizando RaceEdition:', e.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

