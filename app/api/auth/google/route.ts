import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  
  if (!code) {
    // Iniciar el flujo OAuth
    const clientId = process.env.GOOGLE_CLIENT_ID
    const redirectUri = `${process.env.NEXTAUTH_URL || 'https://myracecal.net'}/api/auth/google/callback`
    const state = crypto.randomUUID()
    
    // Guardar state en cookie o session
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=openid email profile&` +
      `state=${state}`
    
    return NextResponse.redirect(authUrl)
  }
  
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
}

