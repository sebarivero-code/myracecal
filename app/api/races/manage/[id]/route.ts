import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

// GET: Obtener carrera con todas sus ediciones
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const race = await prisma.race.findUnique({
      where: { id: params.id },
      include: {
        province: {
          include: {
            country: true
          }
        },
        editions: {
          where: {
            isActive: true
          },
          include: {
            province: {
              include: {
                country: true
              }
            },
            formats: true
          },
          orderBy: {
            year: 'desc'
          }
        }
      }
    })
    
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

// PUT: Actualizar carrera
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const {
      name,
      discipline,
      disciplines,
      format,
      formats,
      modality,
      modalities,
      description,
      registrationUrl,
      website,
      instagram,
      contactEmail,
      contactPhone,
      city,
      provinceId,
      distance,
      elevation,
      stages,
      days
    } = body
    
    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name
    if (discipline !== undefined) updateData.discipline = discipline
    if (disciplines !== undefined) {
      if (Array.isArray(disciplines)) {
        updateData.disciplines = disciplines
      } else if (typeof disciplines === 'string' && disciplines.trim()) {
        updateData.disciplines = disciplines.split(/\s*\/\s*/).filter(d => d.trim().length > 0)
      } else {
        updateData.disciplines = []
      }
    }
    if (format !== undefined) updateData.format = format
    if (formats !== undefined) updateData.formats = formats
    if (modality !== undefined) updateData.modality = modality
    if (modalities !== undefined) {
      if (Array.isArray(modalities)) {
        updateData.modalities = modalities
      } else if (typeof modalities === 'string' && modalities.trim()) {
        updateData.modalities = modalities.split(/\s*&\s*/).filter(m => m.trim().length > 0)
      } else {
        updateData.modalities = []
      }
    }
    if (description !== undefined) updateData.description = description
    if (registrationUrl !== undefined) updateData.registrationUrl = registrationUrl
    if (website !== undefined) updateData.website = website
    if (instagram !== undefined) updateData.instagram = instagram
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail
    if (contactPhone !== undefined) updateData.contactPhone = contactPhone
    if (city !== undefined) updateData.city = city
    if (provinceId !== undefined) updateData.provinceId = provinceId || null
    if (distance !== undefined) updateData.distance = distance
    if (elevation !== undefined) updateData.elevation = elevation
    if (stages !== undefined) updateData.stages = parseInt(stages) || 1
    if (days !== undefined) updateData.days = parseInt(days) || 1
    
    const race = await prisma.race.update({
      where: { id: params.id },
      data: updateData,
      include: {
        province: {
          include: {
            country: true
          }
        }
      }
    })
    
    return NextResponse.json(race)
  } catch (error: any) {
    console.error('Error actualizando carrera:', error)
    return NextResponse.json(
      { error: error.message || 'Error al actualizar la carrera' },
      { status: 500 }
    )
  }
}
