import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'edge'

// PUT: Actualizar edición
export async function PUT(
  request: Request,
  { params }: { params: { id: string; editionId: string } }
) {
  try {
    const body = await request.json()
    
    const {
      startDate,
      city,
      provinceId,
      stages,
      days,
      formats
    } = body
    
    // Obtener la carrera para construir location
    const race = await prisma.race.findUnique({
      where: { id: params.id },
      include: {
        province: {
          include: {
            country: true
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
    
    // Construir location string
    const locationParts = []
    const editionCity = city !== undefined ? city : race.city
    if (editionCity) locationParts.push(editionCity)
    
    const editionProvinceId = provinceId !== undefined ? provinceId : race.provinceId
    if (editionProvinceId) {
      const province = await prisma.province.findUnique({
        where: { id: editionProvinceId },
        include: { country: true }
      })
      if (province) {
        locationParts.push(province.name)
        if (province.country) locationParts.push(province.country.name)
      }
    }
    const location = locationParts.length > 0 ? locationParts.join(', ') : null
    
    // Actualizar la edición
    const edition = await prisma.raceEdition.update({
      where: { id: params.editionId },
      data: {
        ...(startDate && { startDate: new Date(startDate) }),
        ...(city !== undefined && { city }),
        ...(provinceId !== undefined && { provinceId }),
        ...(location !== undefined && { location }),
        ...(stages !== undefined && { stages: parseInt(stages) }),
        ...(days !== undefined && { days: parseInt(days) })
      },
      include: {
        race: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        province: {
          include: {
            country: true
          }
        },
        formats: true
      }
    })
    
    // Actualizar formatos si se proporcionan
    if (formats && Array.isArray(formats)) {
      // Eliminar todos los formatos existentes
      await prisma.editionFormat.deleteMany({
        where: { editionId: params.editionId }
      })
      
      // Crear los nuevos formatos
      if (formats.length > 0) {
        await prisma.editionFormat.createMany({
          data: formats.map((f: any) => ({
            editionId: params.editionId,
            format: f.format,
            distance: f.distance || null,
            elevation: f.elevation || null,
            disciplines: f.disciplines || [],
            modalities: f.modalities || []
          }))
        })
      }
    }
    
    // Recargar la edición con los formatos actualizados
    const updatedEdition = await prisma.raceEdition.findUnique({
      where: { id: params.editionId },
      include: {
        race: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        province: {
          include: {
            country: true
          }
        },
        formats: true
      }
    })
    
    return NextResponse.json(updatedEdition)
  } catch (error: any) {
    console.error('Error actualizando edición:', error)
    return NextResponse.json(
      { error: error.message || 'Error al actualizar la edición' },
      { status: 500 }
    )
  }
}
