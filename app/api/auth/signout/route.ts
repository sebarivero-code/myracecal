import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST() {
  // TODO: Eliminar sesión de Supabase
  const response = NextResponse.json({ success: true })
  // Eliminar ambas cookies
  response.cookies.delete('session_token')
  response.cookies.delete('user_data')
  return response
}

