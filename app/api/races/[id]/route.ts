import { NextResponse } from 'next/server'
import { getRacesFromGoogleSheets } from '@/lib/google-sheets'

export const runtime = 'edge'

const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL || ''

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!GOOGLE_SHEET_URL) {
      return NextResponse.json(
        { error: 'GOOGLE_SHEET_URL no configurada' },
        { status: 500 }
      )
    }
    
    const races = await getRacesFromGoogleSheets(GOOGLE_SHEET_URL)
    const race = races.find(r => r.id === parseInt(params.id))
    
    if (!race) {
      return NextResponse.json(
        { error: 'Carrera no encontrada' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(race)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al obtener la carrera' },
      { status: 500 }
    )
  }
}

