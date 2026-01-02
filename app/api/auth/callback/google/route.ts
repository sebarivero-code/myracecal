import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  
  if (!code) {
    return NextResponse.redirect('/auth/signin?error=no_code')
  }
  
  // Verificar state desde cookies
  const cookies = request.headers.get('cookie') || ''
  const cookieState = cookies
    .split(';')
    .find(c => c.trim().startsWith('oauth_state='))
    ?.split('=')[1]
    ?.trim()
  
  if (state !== cookieState) {
    return NextResponse.redirect('/auth/signin?error=invalid_state')
  }
  
  // Intercambiar code por token
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = `${process.env.NEXTAUTH_URL || 'https://myracecal.net'}/api/auth/callback/google`
  
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
      return NextResponse.redirect('/auth/signin?error=token_exchange_failed')
    }
    
    const tokens = await tokenResponse.json()
    
    // Obtener información del usuario
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })
    
    if (!userResponse.ok) {
      return NextResponse.redirect('/auth/signin?error=user_info_failed')
    }
    
    const user = await userResponse.json()
    
    // Crear sesión (simplificado - en producción usar JWT o cookies seguras)
    const sessionToken = crypto.randomUUID()
    
    // Redirigir a la app con el token de sesión
    const response = NextResponse.redirect('/races')
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    })
    
    // Guardar información del usuario (en producción usar KV o D1)
    // Por ahora solo redirigimos
    
    return response
  } catch (error) {
    console.error('OAuth error:', error)
    return NextResponse.redirect('/auth/signin?error=oauth_failed')
  }
}

