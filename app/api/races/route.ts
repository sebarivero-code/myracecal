import { NextResponse } from 'next/server'
import { getRacesFromGoogleSheets } from '@/lib/google-sheets'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const sheetUrl = process.env.GOOGLE_SHEET_URL
    
    if (!sheetUrl) {
      return NextResponse.json(
        { error: 'GOOGLE_SHEET_URL no configurada. Agrega GOOGLE_SHEET_URL en .env.local y reinicia el servidor' },
        { status: 500 }
      )
    }
    
    const races = await getRacesFromGoogleSheets(sheetUrl)
    console.log(`Total carreras parseadas: ${races.length}`)
    
    // Filtros opcionales desde query params
    const { searchParams } = new URL(request.url)
    const discipline = searchParams.get('discipline')
    const province = searchParams.get('province')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    let filteredRaces = races
    
    if (discipline) {
      filteredRaces = filteredRaces.filter(r => 
        r.discipline.toLowerCase() === discipline.toLowerCase()
      )
    }
    
    if (province) {
      filteredRaces = filteredRaces.filter(r => 
        r.province?.toLowerCase() === province.toLowerCase()
      )
    }
    
    if (startDate) {
      filteredRaces = filteredRaces.filter(r => 
        new Date(r.startDate) >= new Date(startDate)
      )
    }
    
    if (endDate) {
      filteredRaces = filteredRaces.filter(r => 
        new Date(r.startDate) <= new Date(endDate)
      )
    }
    
    return NextResponse.json(filteredRaces)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al obtener carreras' },
      { status: 500 }
    )
  }
}

