import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const countries = await prisma.country.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    return NextResponse.json(countries)
  } catch (error: any) {
    console.error('Error obteniendo países:', error)
    return NextResponse.json(
      { error: error.message || 'Error al obtener los países' },
      { status: 500 }
    )
  }
}
