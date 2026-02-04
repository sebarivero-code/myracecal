import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get('q') || ''
    
    // Buscar carreras con sus ediciones y provincia
    const races = await prisma.race.findMany({
      where: {
        isActive: true,
        ...(searchQuery && {
          name: {
            contains: searchQuery,
            mode: 'insensitive'
          }
        })
      },
      include: {
        province: {
          include: {
            country: true
          }
        },
        editions: {
          where: {
            isActive: true
          },
          select: {
            id: true,
            year: true,
            startDate: true
          },
          orderBy: {
            year: 'desc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    // Formatear datos para el frontend
    const formattedRaces = races.map(race => {
      // Formatear ediciones: "Ago-2026"
      const formattedEditions = race.editions.map(edition => {
        const date = new Date(edition.startDate)
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        const month = monthNames[date.getMonth()]
        return `${month}-${edition.year}`
      }).join(' / ')
      
      // Construir ubicación
      const locationParts = []
      if (race.city) locationParts.push(race.city)
      if (race.province) locationParts.push(race.province.name)
      if (race.province?.country) locationParts.push(race.province.country.name)
      const location = locationParts.join(', ') || 'Sin ubicación'
      
      return {
        id: race.id,
        name: race.name,
        slug: race.slug,
        format: race.format || '',
        location,
        editions: formattedEditions || 'Sin ediciones',
        editionsCount: race.editions.length
      }
    })
    
    return NextResponse.json(formattedRaces)
  } catch (error: any) {
    console.error('Error obteniendo carreras:', error)
    return NextResponse.json(
      { error: error.message || 'Error al obtener las carreras' },
      { status: 500 }
    )
  }
}
