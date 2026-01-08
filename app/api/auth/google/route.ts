import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  
  if (!code) {
    // Iniciar el flujo OAuth
    const clientId = process.env.GOOGLE_CLIENT_ID
    
    if (!clientId) {
      console.error('GOOGLE_CLIENT_ID no está configurado')
      return NextResponse.json({ error: 'GOOGLE_CLIENT_ID no configurado' }, { status: 500 })
    }
    
    // Determinar la URL base - siempre usar myracecal.net en producción
    const baseUrl = process.env.NEXTAUTH_URL || 'https://myracecal.net'
    const redirectUri = `${baseUrl}/api/auth/callback/google`
    
    // Log para debugging (remover en producción si es necesario)
    console.log('OAuth redirect URI:', redirectUri)
    console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
    
    const state = crypto.randomUUID()
    
    // Guardar state en cookie
    const response = NextResponse.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=openid email profile&` +
      `state=${state}&` +
      `access_type=offline&` +
      `prompt=consent`
    )
    
    // Guardar state en cookie
    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutos
    })
    
    return response
  }
  
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
}

