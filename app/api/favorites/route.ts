import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const raceId = searchParams.get('raceId')
    
    // Verificar sesión
    const cookies = request.headers.get('cookie') || ''
    const sessionToken = cookies
      .split(';')
      .find(c => c.trim().startsWith('session_token='))
      ?.split('=')[1]
      ?.trim()
    
    if (!sessionToken) {
      if (raceId) {
        return NextResponse.json({ isFavorite: false }, { status: 200 })
      }
      return NextResponse.json({ favorites: [] }, { status: 200 })
    }

    // TODO: Obtener favoritos de Cloudflare KV usando sessionToken
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
    // Verificar sesión
    const cookies = request.headers.get('cookie') || ''
    const sessionToken = cookies
      .split(';')
      .find(c => c.trim().startsWith('session_token='))
      ?.split('=')[1]
      ?.trim()
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { raceId, isFavorite } = await request.json()
    
    if (!raceId) {
      return NextResponse.json({ error: 'raceId es requerido' }, { status: 400 })
    }

    // TODO: Guardar/eliminar favorito en Cloudflare KV usando sessionToken
    // Por ahora solo retornamos éxito
    return NextResponse.json({ success: true, isFavorite })
  } catch (error) {
    console.error('Error updating favorite:', error)
    return NextResponse.json({ error: 'Error al actualizar favorito' }, { status: 500 })
  }
}

