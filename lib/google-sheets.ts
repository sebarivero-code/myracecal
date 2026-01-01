/**
 * Función para leer datos desde Google Sheets
 * 
 * La URL debe ser pública y exportada como CSV
 * Formato: https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid={GID}
 */

export interface Stage {
  number: number
  name?: string
  distance?: number
  elevation?: number
  startDate?: string
  endDate?: string
}

export interface DisciplineDistance {
  discipline: string
  distances: number[]
}

export interface Race {
  id: number
  name: string
  location: string
  city?: string
  province?: string
  country?: string
  discipline: string // Mantener para compatibilidad (primera disciplina o todas separadas por "/")
  disciplines?: string[] // Array de disciplinas
  disciplineDistances?: DisciplineDistance[] // Disciplinas con sus distancias
  format?: string // Formato (XCO, XCM, Rally, etc.)
  modality?: string // Mantener para compatibilidad
  modalities?: string[] // Array de modalidades (separadas por &)
  startDate: string
  endDate?: string
  distance?: number // Numérico para filtros (primera distancia o undefined si hay múltiples)
  elevation?: number // Numérico para filtros
  stages?: number
  stageDetails?: Stage[] // Detalles de cada etapa
  days?: number
  registrationUrl?: string
  description?: string
  contactEmail?: string
  contactPhone?: string
  website?: string
  instagram?: string
  facebook?: string
}

/**
 * Lee datos desde Google Sheets y los convierte a formato Race
 */
export async function getRacesFromGoogleSheets(sheetUrl: string): Promise<Race[]> {
  try {
    const csvUrl = convertToCsvUrl(sheetUrl)
    const response = await fetch(csvUrl, {
      next: { revalidate: 60 }
    })
    
    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.status} ${response.statusText}`)
    }
    
    const csvText = await response.text()
    if (!csvText || csvText.trim().length === 0) {
      throw new Error('El CSV está vacío')
    }
    
    return parseCsvToRaces(csvText)
  } catch (error: any) {
    throw new Error(`Error al leer Google Sheets: ${error.message}`)
  }
}

/**
 * Convierte URL de Google Sheets a URL de CSV
 */
function convertToCsvUrl(sheetUrl: string): string {
  // Si ya es una URL de export CSV, devolverla tal cual
  if (sheetUrl.includes('/export?format=csv')) {
    return sheetUrl
  }
  
  // Extraer el Sheet ID de la URL
  const sheetIdMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  if (!sheetIdMatch) {
    throw new Error('URL de Google Sheets inválida')
  }
  
  const sheetId = sheetIdMatch[1]
  
  // Extraer GID si existe
  const gidMatch = sheetUrl.match(/[#&]gid=([0-9]+)/)
  const gid = gidMatch ? gidMatch[1] : '0'
  
  // Construir URL de export CSV
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
}

/**
 * Parsea CSV a array de objetos Race
 * Estructura de columnas:
 * Col A (0): Mes (referencia, no se usa)
 * Col B (1): Fecha completa de la carrera
 * Col C (2): Carrera (name)
 * Col D (3): id
 * Col E (4): Discip. (discipline)
 * Col F (5): Formato (format) - XCO, XCM, Rally, etc.
 * Col G (6): Localidad (city)
 * Col H (7): Provincia (province)
 * Col I (8): País (country)
 * Col J (9): Modalidad (modality)
 * Col K (10): Campeonato
 * Col L (11): # Etapas (stages)
 * Col M (12): # Días (days)
 * Col N (13): Km (distance) - numérico
 * Col O (14): M+ (elevation) - numérico
 * Col P (15): Instagram
 * Col Q (16): Tel (contactPhone)
 * Col R (17): Site (website)
 * Col S (18): Inscripcion (registrationUrl)
 */
function parseCsvToRaces(csvText: string): Race[] {
  const lines = csvText.split('\n').filter(line => line.trim())
  
  if (lines.length === 0) {
    return []
  }
  
  const races: Race[] = []
  
  // Empezar desde la fila 2 (índice 1) porque la fila 1 son los headers
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i])
    
    // Saltar filas vacías
    if (values.length === 0 || values.every(v => !v || v.trim() === '')) {
      continue
    }
    
    const race: Partial<Race> = {}
    console.log(`[Row ${i}] Processing race, column N (distance):`, values[13])
    
    // ID desde columna D (índice 3) o usar el índice de fila
    const idValue = values[3]?.trim()
    race.id = idValue ? parseInt(idValue) || i : i
    
    // Nombre desde columna C (índice 2)
    race.name = values[2]?.trim()
    
    // Disciplina desde columna E (índice 4) - puede tener múltiples separadas por "/"
    const disciplineValue = values[4]?.trim() || ''
    race.discipline = disciplineValue // Mantener para compatibilidad
    
    // Parsear múltiples disciplinas
    if (disciplineValue.includes('/')) {
      race.disciplines = disciplineValue.split('/').map(d => d.trim()).filter(Boolean)
    } else {
      race.disciplines = disciplineValue ? [disciplineValue] : []
    }
    console.log(`[Row ${i}] Parsed disciplines:`, race.disciplines)
    
    // Formato se parsea más abajo junto con las distancias
    
    // Modalidad desde columna J (índice 9) - puede tener múltiples separadas por "&"
    const modalityValue = values[9]?.trim() || ''
    race.modality = modalityValue // Mantener para compatibilidad
    
    // Parsear múltiples modalidades
    if (modalityValue.includes('&')) {
      race.modalities = modalityValue.split('&').map(m => m.trim()).filter(Boolean)
    } else {
      race.modalities = modalityValue ? [modalityValue] : []
    }
    
    // Ubicación: combinamos Localidad, Provincia, País
    const city = values[6]?.trim()
    const province = values[7]?.trim()
    const country = values[8]?.trim()
    
    race.city = city || undefined
    race.province = province || undefined
    race.country = country || undefined
    
    // Location: combinación de ciudad, provincia, país
    const locationParts = [city, province, country].filter(Boolean)
    race.location = locationParts.join(', ') || ''
    
    // Fecha: Col B (índice 1) tiene la fecha completa de la carrera
    const dateValue = values[1]?.trim()
    if (dateValue) {
      let parsedDate: Date | null = null
      
      // Intentar formato MM/DD/YYYY (formato común de Google Sheets CSV)
      const mmddyyyyMatch = dateValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
      if (mmddyyyyMatch) {
        const month = parseInt(mmddyyyyMatch[1]) - 1
        const day = parseInt(mmddyyyyMatch[2])
        const year = parseInt(mmddyyyyMatch[3])
        if (month >= 0 && month <= 11 && day > 0 && day <= 31 && year > 2000) {
          parsedDate = new Date(year, month, day)
        }
      } else {
        // Intentar formato DD/MM/YYYY (formato alternativo)
        const ddmmyyyyMatch = dateValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
        if (ddmmyyyyMatch) {
          const day = parseInt(ddmmyyyyMatch[1])
          const month = parseInt(ddmmyyyyMatch[2]) - 1
          const year = parseInt(ddmmyyyyMatch[3])
          if (month >= 0 && month <= 11 && day > 0 && day <= 31 && year > 2000) {
            parsedDate = new Date(year, month, day)
          }
        } else {
          // Intentar parsear directamente como fecha (ISO, etc.)
          parsedDate = new Date(dateValue)
          
          // Si no es válida, intentar formato "ENE 7" (mes abreviado + día)
          if (isNaN(parsedDate.getTime())) {
            const monthMap: Record<string, number> = {
              'ENE': 0, 'FEB': 1, 'MAR': 2, 'ABR': 3, 'MAY': 4, 'JUN': 5,
              'JUL': 6, 'AGO': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DIC': 11
            }
            
            const parts = dateValue.split(/\s+/)
            if (parts.length === 2) {
              const monthAbbr = parts[0].toUpperCase()
              const day = parseInt(parts[1])
              const month = monthMap[monthAbbr]
              if (month !== undefined && !isNaN(day) && day > 0) {
                const currentYear = new Date().getFullYear()
                parsedDate = new Date(currentYear, month, day)
              }
            }
          }
        }
      }
      
      if (parsedDate && !isNaN(parsedDate.getTime()) && parsedDate.getFullYear() > 2000) {
        race.startDate = parsedDate.toISOString()
      } else if (dateValue && race.name) {
        console.warn(`No se pudo parsear fecha para "${race.name}": "${dateValue}"`)
      }
    }
    
    // Etapas desde columna L (índice 11)
    const stagesValue = values[11]?.trim()
    if (stagesValue) {
      const stages = parseInt(stagesValue)
      if (!isNaN(stages) && stages > 0) {
        race.stages = stages
      }
    }
    
    // Días desde columna M (índice 12)
    const daysValue = values[12]?.trim()
    if (daysValue) {
      const days = parseInt(daysValue)
      if (!isNaN(days) && days > 0) {
        race.days = days
      }
    }
    
    // Formato desde columna F (índice 5) - puede tener múltiples formatos separados por "/"
    const formatValue = values[5]?.trim() || ''
    race.format = formatValue // Mantener para compatibilidad
    
    // Parsear múltiples formatos
    let formats: string[] = []
    if (formatValue.includes('/')) {
      formats = formatValue.split('/').map(f => f.trim()).filter(Boolean)
    } else {
      formats = formatValue ? [formatValue] : []
    }
    race.formats = formats // Guardar el array de formatos parseados
    
    // Distancia desde columna N (índice 13) - puede tener múltiples distancias separadas por "&" y "/"
    const distanceValue = values[13]?.trim()
    console.log(`[Race ${race.id || 'unknown'}] Distance column value:`, distanceValue)
    console.log(`[Race ${race.id || 'unknown'}] Formats:`, formats)
    console.log(`[Race ${race.id || 'unknown'}] Disciplines:`, race.disciplines)
    
    if (distanceValue) {
      // Si la distancia tiene "/", parsear distancias por formato (no por disciplina)
      if (distanceValue.includes('/')) {
        // Dividir por "/" para obtener grupos de distancias por formato
        const distanceGroups = distanceValue.split('/').map(d => d.trim()).filter(Boolean)
        race.disciplineDistances = []
        
        // Usar los formatos para asociar las distancias
        // Si hay múltiples formatos, cada formato se asocia con su grupo de distancias correspondiente
        // Si solo hay un formato pero múltiples grupos, duplicamos el formato
        let formatsToUse = formats.length > 0 ? formats : []
        
        if (formatsToUse.length === 1 && distanceGroups.length > 1) {
          // Hay un solo formato pero múltiples grupos de distancias
          // Duplicamos el formato para cada grupo
          console.log(`[Race ${race.id}] Single format "${formatsToUse[0]}" but ${distanceGroups.length} distance groups.`)
          formatsToUse = distanceGroups.map(() => formatsToUse[0])
        } else if (formatsToUse.length === 0 && distanceGroups.length > 0) {
          // No hay formatos pero sí hay grupos de distancias
          // Usamos la disciplina como identificador
          formatsToUse = distanceGroups.map((_, idx) => race.disciplines?.[0] || `Formato ${idx + 1}`)
        }
        
        // Debug: verificar qué estamos parseando
        console.log(`[Race ${race.id}] Parsing distances by format:`, {
          distanceValue,
          formats: formats,
          formatsToUse,
          distanceGroups
        })
        
        // Asociar cada formato con su grupo de distancias correspondiente (por posición)
        formatsToUse.forEach((format, index) => {
          if (distanceGroups[index]) {
            // Parsear distancias separadas por "&" dentro de cada grupo
            const distanceString = distanceGroups[index].trim()
            const distanceParts = distanceString.split('&').map(d => d.trim()).filter(Boolean)
            const distances = distanceParts
              .map(d => {
                // Limpiar y parsear cada distancia (solo después del split)
                const cleaned = d.replace(/[^\d.,]/g, '').replace(',', '.')
                const num = parseFloat(cleaned)
                return !isNaN(num) && num > 0 ? num : null
              })
              .filter((d): d is number => d !== null)
            
            console.log(`[Race ${race.id}] Processing format "${format}":`, {
              distanceString,
              distanceParts,
              distances
            })
            
            if (distances.length > 0) {
              race.disciplineDistances!.push({
                discipline: format.trim(), // Usamos el formato como "discipline" en el array
                distances
              })
            }
          }
        })
        
        // Debug: verificar resultado final
        console.log(`[Race ${race.id}] Final disciplineDistances:`, JSON.stringify(race.disciplineDistances, null, 2))
        
        // No establecer race.distance si hay múltiples grupos de distancias
      } else if (race.disciplines && race.disciplines.length > 1) {
        // Múltiples disciplinas pero distancias sin "/" - todas las disciplinas comparten las mismas distancias
        // Parsear distancias separadas por "&" si las hay
        if (distanceValue.includes('&')) {
          // Múltiples distancias compartidas por todas las disciplinas
          const distances = distanceValue
            .split('&')
            .map(d => {
              const cleaned = d.trim().replace(/[^\d.,]/g, '').replace(',', '.')
              const num = parseFloat(cleaned)
              return !isNaN(num) && num > 0 ? num : null
            })
            .filter((d): d is number => d !== null)
          
          if (distances.length > 0) {
            // Crear un solo elemento con las distancias compartidas (usamos la primera disciplina como identificador)
            race.disciplineDistances = [{
              discipline: race.disciplines[0].trim(),
              distances
            }]
            // También establecer race.distance para compatibilidad
            race.distance = distances[0]
          }
        } else {
          // Una sola distancia compartida por todas las disciplinas
          const distanceNum = parseFloat(distanceValue.replace(/[^\d.,]/g, '').replace(',', '.'))
          if (!isNaN(distanceNum) && distanceNum > 0) {
            // Crear un solo elemento con la distancia compartida
            race.disciplineDistances = [{
              discipline: race.disciplines[0].trim(),
              distances: [distanceNum]
            }]
            race.distance = distanceNum
          }
        }
      } else {
        // Una sola disciplina o formato simple
        if (distanceValue.includes('&')) {
          // Múltiples distancias para una sola disciplina
          const distances = distanceValue
            .split('&')
            .map(d => {
              const cleaned = d.trim().replace(/[^\d.,]/g, '').replace(',', '.')
              const num = parseFloat(cleaned)
              return !isNaN(num) && num > 0 ? num : null
            })
            .filter((d): d is number => d !== null)
          
          if (distances.length > 0) {
            race.distance = distances[0] // Primera distancia para compatibilidad
            const discipline = race.disciplines && race.disciplines.length > 0 
              ? race.disciplines[0] 
              : race.discipline
            if (discipline) {
              race.disciplineDistances = [{
                discipline: discipline.trim(),
                distances
              }]
            }
          }
        } else {
          // Una sola distancia
          const distanceNum = parseFloat(distanceValue.replace(/[^\d.,]/g, '').replace(',', '.'))
          if (!isNaN(distanceNum) && distanceNum > 0) {
            race.distance = distanceNum
            const discipline = race.disciplines && race.disciplines.length > 0 
              ? race.disciplines[0] 
              : race.discipline
            if (discipline) {
              race.disciplineDistances = [{
                discipline: discipline.trim(),
                distances: [distanceNum]
              }]
            }
          }
        }
      }
    }
    
    // Elevación desde columna O (índice 14) - numérico
    const elevationValue = values[14]?.trim()
    if (elevationValue) {
      // Remover "m+", "m", etc. si existe y convertir a número
      // Primero limpiar el valor, manteniendo solo dígitos, puntos y comas
      let cleaned = elevationValue.replace(/[^\d.,]/g, '')
      
      // Detectar si la coma es separador de miles o decimal
      // Si hay una coma seguida de exactamente 3 dígitos, es separador de miles → eliminar
      // Si hay una coma seguida de 1-2 dígitos, es separador decimal → convertir a punto
      if (cleaned.includes(',')) {
        const parts = cleaned.split(',')
        if (parts.length === 2) {
          const afterComma = parts[1]
          if (afterComma.length === 3) {
            // Separador de miles: "5,000" → "5000"
            cleaned = cleaned.replace(',', '')
          } else if (afterComma.length <= 2) {
            // Separador decimal: "5,5" → "5.5"
            cleaned = cleaned.replace(',', '.')
          }
        } else {
          // Múltiples comas, probablemente separadores de miles → eliminar todas
          cleaned = cleaned.replace(/,/g, '')
        }
      }
      
      const elevationNum = parseFloat(cleaned)
      if (!isNaN(elevationNum) && elevationNum > 0) {
        race.elevation = elevationNum
      }
    }
    
    // Instagram desde columna P (índice 15)
    if (values[15]?.trim()) {
      race.instagram = values[15].trim()
    }
    
    // Teléfono desde columna Q (índice 16)
    if (values[16]?.trim()) {
      race.contactPhone = values[16].trim()
    }
    
    // Website desde columna R (índice 17)
    if (values[17]?.trim()) {
      race.website = values[17].trim()
    }
    
    // URL de inscripción desde columna S (índice 18)
    if (values[18]?.trim()) {
      race.registrationUrl = values[18].trim()
    }
    
    // Parsear etapas si la carrera tiene etapas
    if (race.stages && race.stages > 0) {
      const stageDetails: Stage[] = []
      for (let stageNum = 1; stageNum <= Math.min(race.stages, 8); stageNum++) {
        // Calcular índices de columnas para cada etapa
        // Etapa 1: T(19), U(20), V(21), W(22), X(23)
        // Etapa 2: Y(24), Z(25), AA(26), AB(27), AC(28)
        // Etapa 3: AD(29), AE(30), AF(31), AG(32), AH(33)
        // Etapa 4: AI(34), AJ(35), AK(36), AL(37), AM(38)
        // Etapa 5: AN(39), AO(40), AP(41), AQ(42), AR(43)
        // Etapa 6: AS(44), AT(45), AU(46), AV(47), AW(48)
        // Etapa 7: AX(49), AY(50), AZ(51), BA(52), BB(53)
        // Etapa 8: BC(54), BD(55), BE(56), BF(57), BG(58)
        // Cada etapa tiene 5 columnas: Nombre, Distancia, Altimetría, Desde, Hasta
        const baseIndex = 19 + (stageNum - 1) * 5 // T=19, Y=24, AD=29, etc.
        
        const stage: Stage = {
          number: stageNum,
          name: values[baseIndex]?.trim() || undefined,
          distance: values[baseIndex + 1]?.trim() ? parseFloat(values[baseIndex + 1].trim().replace(/[^\d.,]/g, '').replace(',', '.')) : undefined,
          elevation: values[baseIndex + 2]?.trim() ? parseFloat(values[baseIndex + 2].trim().replace(/[^\d.,]/g, '').replace(',', '.')) : undefined,
          startDate: values[baseIndex + 3]?.trim() || undefined,
          endDate: values[baseIndex + 4]?.trim() || undefined
        }
        
        stageDetails.push(stage)
      }
      
      if (stageDetails.length > 0) {
        race.stageDetails = stageDetails
      }
    }
    
    // Validar campos requeridos
    if (race.name && race.startDate && race.discipline) {
      races.push(race as Race)
    } else if (race.name) {
      console.warn(`Carrera omitida - Faltan campos requeridos:`, {
        name: race.name,
        hasStartDate: !!race.startDate,
        hasDiscipline: !!race.discipline,
        dateValue: values[1]?.trim()
      })
    }
  }
  
  return races
}

/**
 * Parsea una línea CSV manejando comillas y comas dentro de valores
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}

