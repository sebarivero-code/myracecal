import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  const cookies = request.headers.get('cookie') || ''
  
  // Verificar si hay token de sesión
  const sessionToken = cookies
    .split(';')
    .find(c => c.trim().startsWith('session_token='))
    ?.split('=')[1]
    ?.trim()
  
  if (!sessionToken) {
    return NextResponse.json({ user: null })
  }
  
  // Obtener datos del usuario de la cookie (temporalmente hasta implementar Supabase)
  const userDataCookieMatch = cookies
    .split(';')
    .find(c => c.trim().startsWith('user_data='))
  
  if (!userDataCookieMatch) {
    return NextResponse.json({ user: null })
  }
  
  // Extraer el valor de la cookie (puede contener =)
  const userDataCookieValue = userDataCookieMatch.split('=').slice(1).join('=').trim()
  
  if (!userDataCookieValue) {
    return NextResponse.json({ user: null })
  }
  
  try {
    // Decodificar Base64 y parsear datos del usuario
    // Primero intentar decodificar URI (por si Next.js lo codifica)
    let userDataEncoded = userDataCookieValue
    try {
      userDataEncoded = decodeURIComponent(userDataCookieValue)
    } catch {
      // Si falla el decode URI, usar el valor original
      userDataEncoded = userDataCookieValue
    }
    
    // Decodificar Base64 usando atob (disponible en Edge Runtime)
    const userDataStr = decodeURIComponent(escape(atob(userDataEncoded)))
    const userData = JSON.parse(userDataStr)
    
    // TODO: Validar token y obtener usuario de Supabase
    // Por ahora retornamos los datos de la cookie
    return NextResponse.json({ 
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        image: userData.image
      }
    })
  } catch (error) {
    console.error('Error parsing user data:', error)
    return NextResponse.json({ user: null })
  }
}

