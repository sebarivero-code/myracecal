# Guía de Migración: Google Sheets → Supabase

## 📋 Resumen

La app actualmente lee datos desde Google Sheets donde cada fila representa una **edición de carrera**. Necesitamos migrar estos datos al nuevo esquema de Supabase que separa:
- **Race** (carrera base - información que se mantiene entre años)
- **RaceEdition** (edición específica - información que cambia cada año)

## 🔍 Estructura Actual de Google Sheets

### Columnas del CSV

| Col | Nombre | Campo en App | Tipo | Notas |
|-----|--------|--------------|------|-------|
| A | Mes | - | String | Solo referencia, no se usa |
| B | Fecha completa | `startDate` | Date | Fecha de inicio de la edición |
| C | Carrera | `name` | String | Nombre de la carrera |
| D | id | `id` | Number | ID único de la fila |
| E | Discip. | `discipline` | String | Puede tener múltiples separadas por "/" |
| F | Formato | `format` | String | Puede tener múltiples separados por "/" |
| G | Localidad | `city` | String | Ciudad/localidad |
| H | Provincia | `province` | String | Nombre de la provincia |
| I | País | `country` | String | Nombre del país |
| J | Modalidad | `modality` | String | Puede tener múltiples separadas por "&" |
| K | Campeonato | - | String | No se usa actualmente |
| L | # Etapas | `stages` | Number | Número de etapas |
| M | # Días | `days` | Number | Número de días |
| N | Km | `distance` | String | Distancias (puede tener múltiples con "/" y "&") |
| O | M+ | `elevation` | Number | Altimetría en metros |
| P | Instagram | `instagram` | String | Handle de Instagram |
| Q | Tel | `contactPhone` | String | Teléfono de contacto |
| R | Site | `website` | String | Sitio web |
| S | Inscripcion | `registrationUrl` | String | URL de inscripción |
| T+ | Etapas | `stageDetails` | Object[] | Detalles de cada etapa (5 columnas por etapa) |

### Datos Parseados Actualmente

Cada fila del CSV se parsea como un objeto `Race` con:
- Información de la carrera (nombre, disciplina, formatos, modalidades)
- Información de la edición (fecha, ubicación, distancias, altimetría)
- Información de contacto (Instagram, teléfono, website, inscripción)
- Detalles de etapas (si aplica)

## 🎯 Mapeo al Nuevo Esquema

### ⚠️ Importante: Una Edición por Carrera

**Cada fila del CSV representa:**
- **1 Carrera (Race)** - Información base
- **1 Edición (RaceEdition)** - Edición de esa carrera

No hay múltiples ediciones por carrera en la planilla actual, por lo que el proceso es más directo.

### Paso 1: Procesar Cada Fila

**Estrategia:** Cada fila del CSV se convierte en:
1. Una entrada en la tabla `Race` (carrera base)
2. Una entrada en la tabla `RaceEdition` (edición de esa carrera)

```typescript
// Pseudocódigo simplificado
for (const row of csvRows) {
  const raceName = row[2] // Columna C - Nombre
  
  // Crear carrera base
  const race = {
    name: raceName,
    slug: generateSlug(raceName),
    discipline: row[4], // Columna E
    disciplines: parseDisciplines(row[4]),
    format: row[5], // Columna F
    formats: parseFormats(row[5]),
    modality: row[9], // Columna J
    modalities: parseModalities(row[9]),
    // ... otros campos de carrera base
  }
  
  // Crear edición de esa carrera
  const edition = {
    raceId: race.id, // FK a la carrera recién creada
    provinceId: getProvinceId(row[7], row[8]), // Columna H (provincia) y I (país)
    city: row[6], // Columna G
    year: extractYear(row[1]), // Columna B (fecha)
    startDate: parseDate(row[1]), // Columna B
    // ... otros campos de edición
  }
}
```

### Paso 2: Crear Tablas de Referencia

Antes de migrar carreras, necesitamos crear:

1. **COUNTRY** - Países
   - Insertar países únicos desde columna I
   - Ejemplo: "Argentina", "Chile", etc.

2. **PROVINCE** - Provincias
   - Insertar provincias únicas desde columna H
   - Relacionar cada provincia con su país (columna I)
   - Ejemplo: "Córdoba" → "Argentina", "Mendoza" → "Argentina"

### Paso 3: Crear Carreras Base (Race)

Para cada fila del CSV, crear una carrera:

```sql
INSERT INTO Race (
  id,                    -- UUID generado
  name,                  -- Columna C
  slug,                  -- Generado desde name
  discipline,            -- Primera disciplina de Columna E
  disciplines,           -- Array parseado de Columna E
  format,                -- Primer formato de Columna F (si existe)
  formats,               -- Array parseado de Columna F
  modality,              -- Primera modalidad de Columna J (si existe)
  modalities,            -- Array parseado de Columna J
  description,           -- NULL (no está en el CSV)
  registrationUrl,       -- Columna S (si existe)
  website,               -- Columna R (si existe)
  instagram,             -- Columna P (si existe)
  contactEmail,          -- NULL (no está en el CSV)
  contactPhone,          -- Columna Q (si existe)
  isActive,              -- true
  createdAt,             -- NOW()
  updatedAt              -- NOW()
)
RETURNING id;  -- Necesitamos el ID para crear la edición
```

**Nota:** Como hay solo una edición por carrera, usamos directamente los valores de esa fila.

### Paso 4: Crear Ediciones (RaceEdition)

Para cada fila del CSV (una por cada carrera):

```sql
INSERT INTO RaceEdition (
  id,                    -- UUID generado
  raceId,                -- FK a Race (obtenido en Paso 3)
  provinceId,            -- FK a Province (obtenido en Paso 2)
  city,                  -- Columna G (localidad)
  location,              -- Concatenación de city + province + country
  year,                  -- Extraído de Columna B (fecha)
  startDate,             -- Columna B (fecha completa)
  endDate,               -- NULL o calculado desde startDate + days
  distance,              -- Primera distancia de Columna N (si hay una sola)
  elevation,             -- Columna O (convertido a string: "2500m")
  stages,                -- Columna L (default: 1)
  days,                  -- Columna M (default: 1)
  isActive,              -- true
  createdAt,             -- NOW()
  updatedAt              -- NOW()
)
```

**Importante:**
- `provinceId` es **OBLIGATORIO** - debe existir en la tabla Province
- Si la provincia no existe, crearla primero en Paso 2
- `year` se extrae de la fecha (Columna B)

### Paso 5: Crear Etapas (Stage)

Si la edición tiene etapas (Columna L > 1):

```sql
INSERT INTO Stage (
  id,                    -- UUID generado
  editionId,             -- FK a RaceEdition
  number,                -- Número de etapa (1, 2, 3, ...)
  name,                  -- Desde columnas T, Y, AD, etc. (según etapa)
  distance,              -- Desde columnas U, Z, AE, etc.
  elevation,             -- Desde columnas V, AA, AF, etc.
  startDate,             -- Desde columnas W, AB, AG, etc.
  endDate,               -- Desde columnas X, AC, AH, etc.
  description,           -- NULL
  createdAt,             -- NOW()
  updatedAt              -- NOW()
)
```

**Mapeo de columnas por etapa:**
- Etapa 1: T(19), U(20), V(21), W(22), X(23)
- Etapa 2: Y(24), Z(25), AA(26), AB(27), AC(28)
- Etapa 3: AD(29), AE(30), AF(31), AG(32), AH(33)
- Etapa 4: AI(34), AJ(35), AK(36), AL(37), AM(38)
- Etapa 5: AN(39), AO(40), AP(41), AQ(42), AR(43)
- Etapa 6: AS(44), AT(45), AU(46), AV(47), AW(48)
- Etapa 7: AX(49), AY(50), AZ(51), BA(52), BB(53)
- Etapa 8: BC(54), BD(55), BE(56), BF(57), BG(58)

## 📝 Script de Migración

### Estructura del Script

```typescript
// scripts/migrate-from-sheets.ts

interface CsvRow {
  id: number
  name: string
  date: string
  discipline: string
  format: string
  city: string
  province: string
  country: string
  modality: string
  stages: number
  days: number
  distance: string
  elevation: number
  instagram: string
  contactPhone: string
  website: string
  registrationUrl: string
  stageDetails?: Stage[]
}

async function migrateFromGoogleSheets() {
  // 1. Leer CSV desde Google Sheets
  const races = await getRacesFromGoogleSheets(process.env.GOOGLE_SHEET_URL!)
  
  // 2. Crear países únicos
  const countries = await createCountries(races)
  
  // 3. Crear provincias únicas
  const provinces = await createProvinces(races, countries)
  
  // 4. Crear carreras y ediciones (una por cada fila)
  await createRacesAndEditions(races, provinces)
  
  // 5. Crear etapas (si las hay)
  await createStages(races)
}
```

### Funciones Clave

#### 1. Crear Países

```typescript
async function createCountries(races: Race[]): Promise<Map<string, UUID>> {
  const countryMap = new Map<string, UUID>()
  const uniqueCountries = [...new Set(races.map(r => r.country).filter(Boolean))]
  
  for (const countryName of uniqueCountries) {
    const country = await prisma.country.upsert({
      where: { name: countryName },
      update: {},
      create: {
        name: countryName,
        code: getCountryCode(countryName), // Función helper
        isActive: true
      }
    })
    countryMap.set(countryName, country.id)
  }
  
  return countryMap
}
```

#### 2. Crear Provincias

```typescript
async function createProvinces(
  races: Race[], 
  countries: Map<string, UUID>
): Promise<Map<string, UUID>> {
  const provinceMap = new Map<string, UUID>()
  const uniqueProvinces = new Map<string, string>() // province -> country
  
  // Agrupar provincias con sus países
  for (const race of races) {
    if (race.province && race.country) {
      uniqueProvinces.set(race.province, race.country)
    }
  }
  
  for (const [provinceName, countryName] of uniqueProvinces) {
    const countryId = countries.get(countryName)
    if (!countryId) continue
    
    const province = await prisma.province.upsert({
      where: {
        countryId_name: {
          countryId,
          name: provinceName
        }
      },
      update: {},
      create: {
        countryId,
        name: provinceName,
        isActive: true
      }
    })
    provinceMap.set(`${countryName}:${provinceName}`, province.id)
  }
  
  return provinceMap
}
```

#### 3. Crear Carreras Base

```typescript
async function createRaces(
  racesByName: Map<string, Race[]>
): Promise<Map<string, UUID>> {
  const raceMap = new Map<string, UUID>()
  
  for (const [raceName, editions] of racesByName) {
    // Usar la primera edición como referencia para datos base
    const firstEdition = editions[0]
    
    const race = await prisma.race.create({
      data: {
        name: raceName,
        slug: generateSlug(raceName),
        discipline: firstEdition.discipline,
        disciplines: firstEdition.disciplines || [],
        format: firstEdition.format,
        formats: firstEdition.formats || [],
        modality: firstEdition.modality,
        modalities: firstEdition.modalities || [],
        description: null,
        registrationUrl: firstEdition.registrationUrl,
        website: firstEdition.website,
        instagram: firstEdition.instagram,
        contactEmail: null,
        contactPhone: firstEdition.contactPhone,
        isActive: true
      }
    })
    
    raceMap.set(raceName, race.id)
  }
  
  return raceMap
}
```

#
#### 5. Crear Etapas

```typescript
async function createStages(races: Race[]) {
  for (const raceData of races) {
    if (!raceData.stageDetails || raceData.stageDetails.length === 0) {
      continue
    }
    
    // Obtener la edición correspondiente
    const startDate = new Date(raceData.startDate)
    const year = startDate.getFullYear()
    
    // Buscar la carrera por nombre para obtener el ID
    const race = await prisma.race.findFirst({
      where: { name: raceData.name }
    })
    
    if (!race) continue
    
    const edition = await prisma.raceEdition.findUnique({
      where: {
        raceId_year: {
          raceId: race.id,
          year
        }
      }
    })
    
    if (!edition) continue
    
    for (const stageData of raceData.stageDetails) {
      await prisma.stage.create({
        data: {
          editionId: edition.id,
          number: stageData.number,
          name: stageData.name,
          distance: stageData.distance?.toString(),
          elevation: stageData.elevation?.toString(),
          startDate: stageData.startDate ? new Date(stageData.startDate) : null,
          endDate: stageData.endDate ? new Date(stageData.endDate) : null,
          description: null
        }
      })
    }
  }
}
```

## ⚠️ Consideraciones Importantes

### 1. Duplicados
- Verificar que no haya carreras duplicadas con nombres ligeramente diferentes
- Normalizar nombres antes de agrupar (trim, lowercase, etc.)

### 2. Datos Faltantes
- **Provincia obligatoria:** Si una fila no tiene provincia, debe asignarse una o crearse una "Sin especificar"
- **País por defecto:** Si no hay país, usar "Argentina" como default

### 3. Fechas
- Validar que todas las fechas sean parseables
- Manejar diferentes formatos de fecha del CSV

### 4. Disciplinas y Formatos Múltiples
- Parsear correctamente arrays de disciplinas/formats separados por "/"
- Parsear arrays de modalidades separadas por "&"

### 5. Distancias Múltiples
- El campo `distance` en RaceEdition puede ser NULL si hay múltiples distancias
- Las distancias múltiples se manejan mejor en el frontend desde `disciplineDistances` del CSV original

## 🔄 Proceso de Migración Completo

1. **Preparación:**
   - Exportar CSV completo desde Google Sheets
   - Validar datos (fechas, provincias, países)
   - Crear backup de la base de datos actual

2. **Ejecución:**
   - Ejecutar script de migración
   - Verificar logs de errores
   - Validar integridad de datos

3. **Validación:**
   - Comparar conteo de carreras/ediciones
   - Verificar relaciones (provincias, países)
   - Probar consultas comunes

4. **Post-migración:**
   - Actualizar código de la app para usar Supabase
   - Desactivar lectura desde Google Sheets
   - Monitorear errores

## 📊 Estadísticas Esperadas

- **Países:** ~1-3 (Argentina principalmente, posiblemente Chile, Uruguay)
- **Provincias:** ~24 (provincias de Argentina)
- **Carreras base:** ~N (igual al número de filas, ya que cada fila es una carrera única)
- **Ediciones:** ~N (igual al número de filas, una edición por carrera)
- **Etapas:** ~Z (suma de todas las etapas de todas las ediciones)

**Nota:** Como hay solo una edición por carrera, el número de carreras y ediciones será el mismo (número de filas en el CSV).

## 🛠️ Herramientas Necesarias

- Script de migración TypeScript/Node.js
- Prisma Client configurado para Supabase
- Acceso a Google Sheets API o CSV exportado
- Validación de datos antes de insertar
