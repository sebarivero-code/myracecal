import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover tildes
    .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres especiales con guiones
    .replace(/^-+|-+$/g, '') // Remover guiones al inicio y final
    .substring(0, 100) // Limitar longitud
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const bodyName = body.name ?? body.raceName
    const {
      raceId, // Si existe, usar carrera existente
      raceName: _raceName,
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
      contactPhone,
      // Ubicación de la carrera (si se crea nueva)
      raceProvinceId,
      raceCity,
      // Campos por defecto de la carrera (si se crea nueva)
      raceDistance,
      raceElevation,
      raceStages,
      raceDays,
      // Datos de la edición
      provinceId, // Por defecto desde Race, pero editable
      city, // Por defecto desde Race, pero editable
      location,
      startDate,
      // Campos editables de la edición (por defecto desde Race)
      stages,
      days,
      // Formatos de la edición (cada formato tiene su distancia, elevación, disciplinas y modalidades)
      formats: editionFormats
    } = body
    
    // Validaciones básicas de carrera nueva
    let race
    
    // Si hay raceId, usar carrera existente
    if (raceId) {
      race = await prisma.race.findUnique({
        where: { id: raceId }
      })
      
      if (!race) {
        return NextResponse.json(
          { error: 'Carrera no encontrada' },
          { status: 404 }
        )
      }
    } else {
      // Crear nueva carrera
      if (!bodyName || !discipline) {
        return NextResponse.json(
          { error: 'El nombre de la carrera y la disciplina son obligatorios' },
          { status: 400 }
        )
      }
      
      const slug = generateSlug(bodyName)
      
      // Verificar si ya existe una carrera con ese slug
      const existingRace = await prisma.race.findUnique({
        where: { slug }
      })
      
      if (existingRace) {
        return NextResponse.json(
          { error: 'Ya existe una carrera con ese nombre' },
          { status: 409 }
        )
      }
      
      race = await prisma.race.create({
        data: {
          name: bodyName,
          slug,
          discipline: discipline,
          disciplines: disciplines || [],
          format: format || null,
          formats: Array.isArray(formats) ? formats.map((f: any) => typeof f === 'string' ? f : f?.format).filter(Boolean) : [],
          modality: modality || null,
          modalities: modalities || [],
          description: description || null,
          registrationUrl: registrationUrl || null,
          website: website || null,
          instagram: instagram || null,
          contactPhone: contactPhone || null,
          // Ubicación por defecto de la carrera
          city: raceCity || null,
          provinceId: raceProvinceId || null,
          // Campos por defecto
          distance: raceDistance || null,
          elevation: raceElevation || null,
          stages: raceStages ? parseInt(raceStages) : 1,
          days: raceDays ? parseInt(raceDays) : 1,
          isActive: true
        }
      })
    }
    
    // Si no hay fecha de inicio, solo crear/actualizar la carrera
    if (!startDate) {
      return NextResponse.json({
        success: true,
        race: {
          id: race.id,
          name: race.name,
          slug: race.slug
        }
      })
    }
    
    // Calcular año y mes a partir de la fecha de inicio (edición opcional)
    const start = new Date(startDate)
    const editionYear = start.getFullYear()
    const editionMonth = start.getMonth() + 1
    
    // Verificar si ya existe una edición para ese año y mes
    const existingEdition = await prisma.raceEdition.findUnique({
      where: {
        raceId_year_month: {
          raceId: race.id,
          year: editionYear,
          month: editionMonth
        }
      }
    })
    
    if (existingEdition) {
      return NextResponse.json(
        { error: `Ya existe una edición de ${editionMonth}/${editionYear} para esta carrera` },
        { status: 409 }
      )
    }
    
    // Crear la edición
    // Usar valores de la edición si se proporcionan, sino usar los de la carrera
    const editionProvinceId = provinceId || race.provinceId
    const editionCity = city !== undefined ? city : race.city
    const editionStages = stages !== undefined ? parseInt(stages) : race.stages
    const editionDays = days !== undefined ? parseInt(days) : race.days
    
    // Construir location string
    const locationParts = []
    if (editionCity) locationParts.push(editionCity)
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
    const editionLocation = locationParts.length > 0 ? locationParts.join(', ') : null
    
    // Validar que haya al menos un formato
    if (!editionFormats || !Array.isArray(editionFormats) || editionFormats.length === 0) {
      return NextResponse.json(
        { error: 'Debes proporcionar al menos un formato para la edición' },
        { status: 400 }
      )
    }
    
    const edition = await prisma.raceEdition.create({
      data: {
        raceId: race.id,
        provinceId: editionProvinceId,
        city: editionCity,
        location: editionLocation,
        year: editionYear,
        month: editionMonth,
        startDate: start,
        stages: editionStages,
        days: editionDays,
        isActive: true,
        formats: {
          create: editionFormats.map((f: any) => ({
            format: f.format,
            distance: f.distance || null,
            elevation: f.elevation || null,
            disciplines: f.disciplines || [],
            modalities: f.modalities || []
          }))
        }
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
          select: {
            id: true,
            name: true
          }
        },
        formats: true
      }
    })
    
    return NextResponse.json({
      success: true,
      edition: {
        id: edition.id,
        race: edition.race,
        province: edition.province,
        year: edition.year,
        startDate: edition.startDate,
        formats: edition.formats
      }
    })
  } catch (error: any) {
    console.error('Error creando carrera/edición:', error)
    
    // Manejar errores de Prisma
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe una edición con estos datos' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Error al crear la carrera/edición' },
      { status: 500 }
    )
  }
}
