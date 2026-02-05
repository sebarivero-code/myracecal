import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    
    if (!query || query.length < 2) {
      return NextResponse.json([])
    }
    
    // Verificar conexión a la base de datos
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL no está configurada')
      // Si no hay DATABASE_URL, devolver array vacío en lugar de error
      console.warn('Devolviendo array vacío porque DATABASE_URL no está configurada')
      return NextResponse.json([])
    }
    
    try {
      const races = await prisma.race.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive'
          },
          isActive: true
        },
        select: {
          id: true,
          name: true,
          slug: true,
          discipline: true,
          editions: {
            select: {
              year: true
            },
            orderBy: {
              year: 'desc'
            },
            take: 5
          }
        },
        take: 10,
        orderBy: {
          name: 'asc'
        }
      })
      
      return NextResponse.json(races || [])
    } catch (dbError: any) {
      // Si hay un error de conexión, devolver array vacío en lugar de error
      if (dbError.code === 'P1001' || dbError.code === 'P1017') {
        console.warn('Base de datos no disponible, devolviendo array vacío')
        return NextResponse.json([])
      }
      throw dbError
    }
  } catch (error: any) {
    console.error('Error buscando carreras:', error)
    console.error('Stack:', error.stack)
    
    // Mensajes de error más específicos
    let errorMessage = 'Error al buscar carreras'
    
    if (error.code === 'P1001') {
      errorMessage = 'No se puede conectar a la base de datos. Verifica DATABASE_URL en .env.local'
    } else if (error.code === 'P2025') {
      errorMessage = 'Registro no encontrado'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
