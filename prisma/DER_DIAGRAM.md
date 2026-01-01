# Diagrama Entidad-Relación (DER) - Calendario de Ciclismo

## Modelo de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│                         RACE (Carrera)                          │
├─────────────────────────────────────────────────────────────────┤
│ PK │ id              │ Int          │ AUTO_INCREMENT            │
│    │ name            │ String       │ NOT NULL                  │
│    │ location        │ String       │ NOT NULL                  │
│    │ city            │ String       │ NULL                      │
│    │ province        │ String       │ NULL                      │
│    │ country         │ String       │ DEFAULT 'Argentina'       │
│    │ discipline      │ String       │ NOT NULL                  │
│    │ modality        │ String       │ NULL                      │
│    │ startDate       │ DateTime     │ NOT NULL                  │
│    │ endDate         │ DateTime     │ NULL                      │
│    │ distance        │ String       │ NULL                      │
│    │ elevation       │ String       │ NULL                      │
│    │ stages          │ Int          │ DEFAULT 1                 │
│    │ days            │ Int          │ DEFAULT 1                 │
│    │ registrationUrl │ String       │ NULL                      │
│    │ description     │ String       │ NULL                      │
│    │ contactEmail    │ String       │ NULL                      │
│    │ contactPhone    │ String       │ NULL                      │
│    │ website         │ String       │ NULL                      │
│    │ instagram       │ String       │ NULL                      │
│    │ facebook        │ String       │ NULL                      │
│    │ stagesList      │ String       │ NULL (JSON)               │
│    │ createdAt       │ DateTime     │ DEFAULT NOW()             │
│    │ updatedAt       │ DateTime     │ AUTO UPDATE               │
├─────────────────────────────────────────────────────────────────┤
│ ÍNDICES:                                                         │
│   • startDate (para búsquedas por fecha)                        │
│   • discipline (para filtros por disciplina)                    │
│   • province (para filtros por provincia)                       │
└─────────────────────────────────────────────────────────────────┘
```

## Diagrama Visual Simplificado

```
                    ┌──────────────┐
                    │     RACE      │
                    │  (Carrera)    │
                    ├──────────────┤
                    │ id (PK)       │
                    │ name          │
                    │ location      │
                    │ city          │
                    │ province      │
                    │ country       │
                    │ discipline    │
                    │ modality      │
                    │ startDate     │
                    │ endDate       │
                    │ distance      │
                    │ elevation     │
                    │ stages        │
                    │ days          │
                    │ registration  │
                    │ description   │
                    │ contactEmail  │
                    │ contactPhone  │
                    │ website       │
                    │ instagram     │
                    │ facebook      │
                    │ stagesList    │
                    │ createdAt     │
                    │ updatedAt     │
                    └──────────────┘
```

## Descripción de Campos por Categoría

### 🔑 Identificación
- **id**: Clave primaria, autoincremental
- **name**: Nombre de la carrera (requerido)

### 📍 Ubicación
- **location**: Ubicación completa (requerido)
- **city**: Ciudad (opcional)
- **province**: Provincia (opcional, indexado)
- **country**: País (default: "Argentina")

### 🚴 Información de la Carrera
- **discipline**: Disciplina (requerido, indexado)
  - Valores típicos: Ruta, MTB, Rally, Gravel
- **modality**: Modalidad (opcional)
  - Valores típicos: Individual, En parejas, Equipos
- **startDate**: Fecha de inicio (requerido, indexado)
- **endDate**: Fecha de fin (opcional)
- **distance**: Distancia (opcional, ej: "116 km")
- **elevation**: Altimetría (opcional, ej: "2500m")
- **stages**: Número de etapas (default: 1)
- **days**: Número de días (default: 1)

### 📝 Descripción y Registro
- **description**: Descripción de la carrera (opcional)
- **registrationUrl**: URL de inscripción (opcional)

### 📞 Contacto
- **contactEmail**: Email de contacto (opcional)
- **contactPhone**: Teléfono de contacto (opcional)
- **website**: Sitio web (opcional)
- **instagram**: Instagram (opcional)
- **facebook**: Facebook (opcional)

### 📋 Etapas Detalladas
- **stagesList**: JSON string con array de etapas (opcional)
  - Formato: `[{"name": "Etapa 1", "date": "...", "distance": "..."}]`

### ⏰ Metadata
- **createdAt**: Fecha de creación (automático)
- **updatedAt**: Fecha de última actualización (automático)

## Relaciones

Actualmente el modelo es **independiente** (una sola tabla). 

### Posibles Extensiones Futuras:
- Relación con **Organizadores** (User/Organizer)
- Relación con **Etapas** (Stage) - si se normaliza
- Relación con **Categorías** (Category)
- Relación con **Usuarios inscritos** (UserRace)

## Tipos de Datos

| Campo          | Tipo      | Nullable | Default          |
|----------------|-----------|----------|------------------|
| id             | Int       | No       | AUTO_INCREMENT   |
| name           | String    | No       | -                |
| location       | String    | No       | -                |
| city           | String    | Sí       | NULL             |
| province       | String    | Sí       | NULL             |
| country        | String    | No       | 'Argentina'      |
| discipline     | String    | No       | -                |
| modality       | String    | Sí       | NULL             |
| startDate      | DateTime  | No       | -                |
| endDate        | DateTime  | Sí       | NULL             |
| distance       | String    | Sí       | NULL             |
| elevation      | String    | Sí       | NULL             |
| stages         | Int       | No       | 1                |
| days           | Int       | No       | 1                |
| registrationUrl| String    | Sí       | NULL             |
| description    | String    | Sí       | NULL             |
| contactEmail   | String    | Sí       | NULL             |
| contactPhone   | String    | Sí       | NULL             |
| website        | String    | Sí       | NULL             |
| instagram      | String    | Sí       | NULL             |
| facebook       | String    | Sí       | NULL             |
| stagesList     | String    | Sí       | NULL             |
| createdAt      | DateTime  | No       | NOW()            |
| updatedAt      | DateTime  | No       | AUTO UPDATE      |

