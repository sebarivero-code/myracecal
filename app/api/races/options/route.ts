import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

// GET: Obtener todas las disciplinas y modalidades únicas
export async function GET() {
  try {
    // Obtener todas las carreras activas
    const races = await prisma.race.findMany({
      where: {
        isActive: true
      },
      select: {
        discipline: true,
        disciplines: true,
        modality: true,
        modalities: true
      }
    })
    
    // Extraer todas las disciplinas únicas (individuales, no combinadas)
    const allDisciplines = new Set<string>()
    races.forEach(race => {
      // Si viene como string, separar por " / "
      if (race.discipline) {
        const disciplines = race.discipline.split(/\s*\/\s*/).filter(d => d.trim().length > 0)
        disciplines.forEach(d => allDisciplines.add(d.trim()))
      }
      // Si viene como array, cada elemento puede ser un string combinado
      if (race.disciplines && race.disciplines.length > 0) {
        race.disciplines.forEach(d => {
          // Si el elemento es un string combinado, separarlo
          if (typeof d === 'string') {
            const disciplines = d.split(/\s*\/\s*/).filter(d => d.trim().length > 0)
            disciplines.forEach(discipline => allDisciplines.add(discipline.trim()))
          } else {
            allDisciplines.add(String(d).trim())
          }
        })
      }
    })
    
    // Extraer todas las modalidades únicas (individuales, no combinadas)
    const allModalities = new Set<string>()
    races.forEach(race => {
      // Si viene como string, separar por " & "
      if (race.modality) {
        const modalities = race.modality.split(/\s*&\s*/).filter(m => m.trim().length > 0)
        modalities.forEach(m => allModalities.add(m.trim()))
      }
      // Si viene como array, cada elemento puede ser un string combinado
      if (race.modalities && race.modalities.length > 0) {
        race.modalities.forEach(m => {
          // Si el elemento es un string combinado, separarlo
          if (typeof m === 'string') {
            const modalities = m.split(/\s*&\s*/).filter(m => m.trim().length > 0)
            modalities.forEach(modality => allModalities.add(modality.trim()))
          } else {
            allModalities.add(String(m).trim())
          }
        })
      }
    })
    
    return NextResponse.json({
      disciplines: Array.from(allDisciplines).sort(),
      modalities: Array.from(allModalities).sort()
    })
  } catch (error: any) {
    console.error('Error obteniendo opciones:', error)
    return NextResponse.json(
      { error: error.message || 'Error al obtener las opciones' },
      { status: 500 }
    )
  }
}
