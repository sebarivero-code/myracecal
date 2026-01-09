import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  // TODO: Implementar con Supabase
  // Por ahora retornamos null
  const cookies = request.headers.get('cookie') || ''
  const sessionToken = cookies
    .split(';')
    .find(c => c.trim().startsWith('session_token='))
    ?.split('=')[1]
    ?.trim()
  
  if (!sessionToken) {
    return NextResponse.json({ user: null })
  }
  
  // TODO: Validar token y obtener usuario de Supabase
  // Por ahora retornamos null
  return NextResponse.json({ user: null })
}

