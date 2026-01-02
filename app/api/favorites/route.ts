import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const raceId = searchParams.get('raceId')
    
    const token = await getToken({ req: request as any })
    
    if (!token?.sub) {
      if (raceId) {
        return NextResponse.json({ isFavorite: false }, { status: 200 })
      }
      return NextResponse.json({ favorites: [] }, { status: 200 })
    }

    // TODO: Obtener favoritos de Cloudflare KV
    // Por ahora retornamos un array vacío o false
    if (raceId) {
      return NextResponse.json({ isFavorite: false })
    }
    return NextResponse.json({ favorites: [] })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({ error: 'Error al obtener favoritos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = await getToken({ req: request as any })
    
    if (!token?.sub) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { raceId, isFavorite } = await request.json()
    
    if (!raceId) {
      return NextResponse.json({ error: 'raceId es requerido' }, { status: 400 })
    }

    // TODO: Guardar/eliminar favorito en Cloudflare KV
    // Por ahora solo retornamos éxito
    return NextResponse.json({ success: true, isFavorite })
  } catch (error) {
    console.error('Error updating favorite:', error)
    return NextResponse.json({ error: 'Error al actualizar favorito' }, { status: 500 })
  }
}

