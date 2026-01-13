import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  
  // Determinar la URL base - usar NEXTAUTH_URL o detectar desde el request
  const requestUrl = new URL(request.url)
  const baseUrl = process.env.NEXTAUTH_URL || `${requestUrl.protocol}//${requestUrl.host}`
  
  if (!code) {
    return NextResponse.redirect(`${baseUrl}/auth/signin?error=no_code`)
  }
  
  // Verificar state desde cookies
  const cookies = request.headers.get('cookie') || ''
  const cookieState = cookies
    .split(';')
    .find(c => c.trim().startsWith('oauth_state='))
    ?.split('=')[1]
    ?.trim()
  
  if (state !== cookieState) {
    return NextResponse.redirect(`${baseUrl}/auth/signin?error=invalid_state`)
  }
  
  // Intercambiar code por token
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  
  const redirectUri = `${baseUrl}/api/auth/callback/google`
  
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId || '',
        client_secret: clientSecret || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })
    
    if (!tokenResponse.ok) {
      return NextResponse.redirect(`${baseUrl}/auth/signin?error=token_exchange_failed`)
    }
    
    const tokens = await tokenResponse.json()
    
    // Obtener información del usuario
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })
    
    if (!userResponse.ok) {
      return NextResponse.redirect(`${baseUrl}/auth/signin?error=user_info_failed`)
    }
    
    const user = await userResponse.json()
    
    // Crear sesión (simplificado - en producción usar Supabase)
    const sessionToken = crypto.randomUUID()
    
    // TODO: Guardar usuario y sesión en Supabase
    // Por ahora guardamos los datos del usuario en una cookie temporalmente
    
    // Redirigir a la app con el token de sesión y datos del usuario
    const response = NextResponse.redirect(`${baseUrl}/races`)
    
    // Guardar token de sesión
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    })
    
    // Guardar datos del usuario (temporalmente hasta implementar Supabase)
    // En producción esto debería ir en la base de datos
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.picture || user.image
    }
    
    // Codificar en Base64 usando btoa (disponible en Edge Runtime)
    const userDataStr = JSON.stringify(userData)
    const userDataEncoded = btoa(unescape(encodeURIComponent(userDataStr)))
    
    response.cookies.set('user_data', userDataEncoded, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    })
    
    return response
  } catch (error) {
    console.error('OAuth error:', error)
    return NextResponse.redirect(`${baseUrl}/auth/signin?error=oauth_failed`)
  }
}

