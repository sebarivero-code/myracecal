import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const countryId = searchParams.get('countryId')
    const countryName = searchParams.get('country') || 'Argentina'
    
    const whereClause: any = {
      isActive: true
    }
    
    if (countryId) {
      whereClause.countryId = countryId
    } else {
      whereClause.country = {
        name: countryName
      }
    }
    
    const provinces = await prisma.province.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        country: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    return NextResponse.json(provinces)
  } catch (error: any) {
    console.error('Error obteniendo provincias:', error)
    return NextResponse.json(
      { error: error.message || 'Error al obtener las provincias' },
      { status: 500 }
    )
  }
}
