import { NextResponse } from 'next/server'
import { getRacesFromGoogleSheets } from '@/lib/google-sheets'

export const runtime = 'edge'

/**
 * Detalle de una carrera para el listado público.
 * Lee de la planilla (GOOGLE_SHEET_URL); el id es el de la fila en la planilla (numérico).
 * La gestión (/manage/) sigue usando la base de datos en sus propias rutas.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sheetUrl = process.env.GOOGLE_SHEET_URL
    if (!sheetUrl) {
      return NextResponse.json(
        { error: 'GOOGLE_SHEET_URL no configurada' },
        { status: 500 }
      )
    }

    const races = await getRacesFromGoogleSheets(sheetUrl)
    const idParam = params.id
    const race = races.find(
      (r) => String(r.id) === idParam || r.id === Number(idParam)
    )

    if (!race) {
      return NextResponse.json(
        { error: 'Carrera no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(race)
  } catch (error: any) {
    console.error('Error obteniendo carrera:', error)
    return NextResponse.json(
      { error: error.message || 'Error al obtener la carrera' },
      { status: 500 }
    )
  }
}
