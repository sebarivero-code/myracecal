import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  try {
    // Obtener formatos únicos de las carreras activas
    const races = await prisma.race.findMany({
      where: { isActive: true },
      select: {
        format: true,
        formats: true
      }
    })
    
    // Obtener formatos únicos de las ediciones activas
    const editions = await prisma.raceEdition.findMany({
      where: { isActive: true },
      include: {
        formats: {
          select: {
            format: true
          }
        }
      }
    })
    
    const formatSet = new Set<string>()
    
    // Agregar formatos de Race
    races.forEach(race => {
      if (race.format) {
        formatSet.add(race.format.trim())
      }
      if (race.formats && race.formats.length > 0) {
        race.formats.forEach(f => {
          if (f && f.trim()) {
            formatSet.add(f.trim())
          }
        })
      }
    })
    
    // Agregar formatos de EditionFormat
    editions.forEach(edition => {
      if (edition.formats && edition.formats.length > 0) {
        edition.formats.forEach(f => {
          if (f.format && f.format.trim()) {
            formatSet.add(f.format.trim())
          }
        })
      }
    })
    
    // Convertir a array y ordenar alfabéticamente
    const formats = Array.from(formatSet).filter(f => f.length > 0).sort()
    
    return NextResponse.json(formats)
  } catch (error: any) {
    console.error('Error obteniendo formatos:', error)
    return NextResponse.json(
      { error: error.message || 'Error al obtener los formatos' },
      { status: 500 }
    )
  }
}
