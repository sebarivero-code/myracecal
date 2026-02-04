# Diagrama Entidad-Relación (DER) - Mi Calendario MTB
## Basado en Requerimientos Funcionales

## Entidades Principales

### 1. USER (Usuario)
**Descripción:** Usuarios del sistema (corredores y organizadores)

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | UUID | Identificador único | PK, AUTO |
| email | String | Email del usuario | UNIQUE, NOT NULL |
| name | String | Nombre completo | NOT NULL |
| image | String? | URL de la imagen de perfil | NULLABLE |
| emailVerified | DateTime? | Fecha de verificación de email | NULLABLE |
| privacyLevel | Enum | Nivel de privacidad del perfil | DEFAULT 'PUBLIC' |
| createdAt | DateTime | Fecha de creación | DEFAULT NOW() |
| updatedAt | DateTime | Última actualización | AUTO UPDATE |

**Valores de privacyLevel:**
- PUBLIC: Perfil visible para todos
- PRIVATE: Perfil visible solo para usuarios autenticados
- HIDDEN: Perfil oculto

**Relaciones:**
- 1:N con UserPreferences
- 1:N con UserCalendar (carreras en su calendario)
- 1:N con RaceOrganizer (carreras que organiza)
- 1:N con RaceReport (denuncias que hace)
- 1:N con RaceReport (denuncias recibidas como organizador)

---

### 2. ACCOUNT (Cuenta de Autenticación)
**Descripción:** Cuentas de autenticación externa (Google, etc.)

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | UUID | Identificador único | PK, AUTO |
| userId | UUID | ID del usuario | FK → USER, NOT NULL |
| type | String | Tipo de proveedor | NOT NULL (ej: 'google') |
| provider | String | Proveedor de autenticación | NOT NULL |
| providerAccountId | String | ID en el proveedor | NOT NULL |
| refresh_token | String? | Token de refresco | NULLABLE |
| access_token | String? | Token de acceso | NULLABLE |
| expires_at | Int? | Expiración del token | NULLABLE |
| token_type | String? | Tipo de token | NULLABLE |
| scope | String? | Scope del token | NULLABLE |
| id_token | String? | ID token | NULLABLE |
| session_state | String? | Estado de sesión | NULLABLE |

**Relaciones:**
- N:1 con USER

---

### 3. SESSION (Sesión)
**Descripción:** Sesiones activas de usuarios

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | UUID | Identificador único | PK, AUTO |
| sessionToken | String | Token de sesión | UNIQUE, NOT NULL |
| userId | UUID | ID del usuario | FK → USER, NOT NULL |
| expires | DateTime | Fecha de expiración | NOT NULL |

**Relaciones:**
- N:1 con USER

---

### 4. USER_PREFERENCES (Preferencias de Usuario)
**Descripción:** Preferencias del usuario para pre-cargar filtros

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | UUID | Identificador único | PK, AUTO |
| userId | UUID | ID del usuario | FK → USER, UNIQUE, NOT NULL |
| preferredDisciplines | String[] | Disciplinas preferidas | DEFAULT [] |
| preferredFormats | String[] | Formatos preferidos | DEFAULT [] |
| preferredCountries | String[] | Países preferidos | DEFAULT [] |
| preferredProvinces | String[] | Provincias preferidas | DEFAULT [] |
| preferredModalities | String[] | Modalidades preferidas | DEFAULT [] |
| createdAt | DateTime | Fecha de creación | DEFAULT NOW() |
| updatedAt | DateTime | Última actualización | AUTO UPDATE |

**Relaciones:**
- 1:1 con USER

---

### 5. COUNTRY (País)
**Descripción:** Países disponibles en el sistema

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | UUID | Identificador único | PK, AUTO |
| name | String | Nombre del país | UNIQUE, NOT NULL |
| code | String? | Código ISO (ej: "AR", "CL") | UNIQUE, NULLABLE |
| isActive | Boolean | Si el país está activo | DEFAULT true |
| createdAt | DateTime | Fecha de creación | DEFAULT NOW() |
| updatedAt | DateTime | Última actualización | AUTO UPDATE |

**Índices:**
- name
- code
- isActive

**Relaciones:**
- 1:N con PROVINCE (provincias del país)

---

### 6. PROVINCE (Provincia)
**Descripción:** Provincias/estados de los países

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | UUID | Identificador único | PK, AUTO |
| countryId | UUID | ID del país | FK → COUNTRY, NOT NULL |
| name | String | Nombre de la provincia | NOT NULL |
| code | String? | Código de la provincia | NULLABLE |
| isActive | Boolean | Si la provincia está activa | DEFAULT true |
| createdAt | DateTime | Fecha de creación | DEFAULT NOW() |
| updatedAt | DateTime | Última actualización | AUTO UPDATE |

**Índices:**
- countryId
- name
- isActive
- (countryId, name) - UNIQUE - No puede haber dos provincias con el mismo nombre en el mismo país

**Relaciones:**
- N:1 con COUNTRY
- 1:N con RACE_EDITION (ediciones de carreras en esta provincia)

**Restricciones:**
- UNIQUE(countryId, name) - No puede haber dos provincias con el mismo nombre en el mismo país

---

### 7. RACE (Carrera)
**Descripción:** Información base de una carrera

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | UUID | Identificador único | PK, AUTO |
| name | String | Nombre de la carrera | NOT NULL |
| slug | String | URL amigable | UNIQUE, NOT NULL |
| discipline | String | Disciplina principal | NOT NULL |
| disciplines | String[] | Múltiples disciplinas | DEFAULT [] |
| format | String? | Formato (ej: "Por etapas") | NULLABLE |
| formats | String[] | Múltiples formatos | DEFAULT [] |
| modality | String? | Modalidad | NULLABLE |
| modalities | String[] | Múltiples modalidades | DEFAULT [] |
| description | String? | Descripción | NULLABLE |
| registrationUrl | String? | URL de inscripción | NULLABLE |
| website | String? | Sitio web | NULLABLE |
| instagram | String? | Instagram | NULLABLE |
| contactEmail | String? | Email de contacto | NULLABLE |
| contactPhone | String? | Teléfono de contacto | NULLABLE |
| isActive | Boolean | Si la carrera está activa | DEFAULT true |
| createdAt | DateTime | Fecha de creación | DEFAULT NOW() |
| updatedAt | DateTime | Última actualización | AUTO UPDATE |

**Índices:**
- discipline
- isActive

**Relaciones:**
- 1:N con RACE_EDITION (ediciones de la carrera)
- 1:N con RACE_ORGANIZER (organizadores)
- 1:N con USER_CALENDAR (usuarios que la agregaron)
- 1:N con RACE_REPORT (denuncias)

---

### 8. RACE_EDITION (Edición de Carrera)
**Descripción:** Una edición específica de una carrera (ej: "Carrera X 2026")

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | UUID | Identificador único | PK, AUTO |
| raceId | UUID | ID de la carrera base | FK → RACE, NOT NULL |
| provinceId | UUID | ID de la provincia | FK → PROVINCE, NOT NULL |
| city | String? | Localidad/Ciudad | NULLABLE |
| location | String? | Ubicación completa (opcional) | NULLABLE |
| year | Int | Año de la edición | NOT NULL |
| startDate | DateTime | Fecha de inicio | NOT NULL |
| endDate | DateTime? | Fecha de fin | NULLABLE |
| distance | String? | Distancia (ej: "116 km") | NULLABLE |
| elevation | String? | Altimetría (ej: "2500m") | NULLABLE |
| stages | Int | Número de etapas | DEFAULT 1 |
| days | Int | Número de días | DEFAULT 1 |
| isActive | Boolean | Si la edición está activa | DEFAULT true |
| createdAt | DateTime | Fecha de creación | DEFAULT NOW() |
| updatedAt | DateTime | Última actualización | AUTO UPDATE |

**Índices:**
- raceId
- provinceId
- year
- startDate
- isActive

**Relaciones:**
- N:1 con RACE
- N:1 con PROVINCE (provincia donde se realiza la edición)
- 1:N con STAGE (etapas de la edición)

**Restricciones:**
- UNIQUE(raceId, year) - No puede haber dos ediciones del mismo año para la misma carrera
- provinceId es OBLIGATORIO - Cada edición debe pertenecer a una provincia

---

### 9. STAGE (Etapa)
**Descripción:** Etapas de una edición de carrera

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | UUID | Identificador único | PK, AUTO |
| editionId | UUID | ID de la edición | FK → RACE_EDITION, NOT NULL |
| number | Int | Número de etapa | NOT NULL |
| name | String? | Nombre de la etapa | NULLABLE |
| startDate | DateTime? | Fecha de inicio | NULLABLE |
| endDate | DateTime? | Fecha de fin | NULLABLE |
| distance | String? | Distancia | NULLABLE |
| elevation | String? | Altimetría | NULLABLE |
| description | String? | Descripción | NULLABLE |
| createdAt | DateTime | Fecha de creación | DEFAULT NOW() |
| updatedAt | DateTime | Última actualización | AUTO UPDATE |

**Índices:**
- editionId
- number

**Relaciones:**
- N:1 con RACE_EDITION

**Restricciones:**
- UNIQUE(editionId, number) - No puede haber dos etapas con el mismo número en la misma edición

---

### 10. RACE_ORGANIZER (Organizador de Carrera)
**Descripción:** Relación entre usuarios y carreras que organizan

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | UUID | Identificador único | PK, AUTO |
| raceId | UUID | ID de la carrera | FK → RACE, NOT NULL |
| userId | UUID | ID del organizador | FK → USER, NOT NULL |
| role | Enum | Rol del organizador | DEFAULT 'CO_ORGANIZER' |
| isPrimary | Boolean | Si es el organizador principal | DEFAULT false |
| addedAt | DateTime | Fecha en que se agregó | DEFAULT NOW() |
| addedBy | UUID? | Usuario que lo agregó | FK → USER, NULLABLE |

**Valores de role:**
- PRIMARY: Organizador principal
- CO_ORGANIZER: Co-organizador

**Relaciones:**
- N:1 con RACE
- N:1 con USER (organizador)
- N:1 con USER (quien lo agregó)

**Restricciones:**
- UNIQUE(raceId, userId) - Un usuario no puede ser organizador dos veces de la misma carrera
- Solo puede haber un PRIMARY por carrera (isPrimary = true)

---

### 11. USER_CALENDAR (Calendario del Usuario)
**Descripción:** Ediciones de carreras que el usuario agregó a su calendario

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | UUID | Identificador único | PK, AUTO |
| userId | UUID | ID del usuario | FK → USER, NOT NULL |
| editionId | UUID | ID de la edición | FK → RACE_EDITION, NOT NULL |
| addedAt | DateTime | Fecha en que se agregó | DEFAULT NOW() |

**Relaciones:**
- N:1 con USER
- N:1 con RACE_EDITION (OBLIGATORIO)

**Restricciones:**
- UNIQUE(userId, editionId) - Un usuario no puede agregar la misma edición dos veces

**Nota importante:**
- Los usuarios solo ven y agregan EDICIONES a su calendario, no carreras completas
- Cada entrada en el calendario corresponde a una edición específica de una carrera

---

### 12. RACE_REPORT (Denuncia de Carrera)
**Descripción:** Denuncias de usuarios sobre organizadores de carreras

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | UUID | Identificador único | PK, AUTO |
| raceId | UUID | ID de la carrera denunciada | FK → RACE, NOT NULL |
| reportedUserId | UUID | ID del organizador denunciado | FK → USER, NOT NULL |
| reporterUserId | UUID | ID del usuario que denuncia | FK → USER, NOT NULL |
| message | String | Texto libre de la denuncia | NOT NULL, MAX 1000 caracteres |
| createdAt | DateTime | Fecha de creación | DEFAULT NOW() |

**Relaciones:**
- N:1 con RACE
- N:1 con USER (organizador denunciado)
- N:1 con USER (usuario que denuncia)

**Restricciones:**
- Un usuario no puede denunciar dos veces la misma carrera al mismo organizador
- message tiene máximo 1000 caracteres

**Nota importante:**
- El sistema NO gestiona la corrección ni resolución de denuncias
- Al crear una denuncia, el sistema envía automáticamente un email al administrador:
  - **Destinatario:** sebarivero@gmail.com
  - **Asunto:** "Denuncia: Organizador mal asignado"
  - **Cuerpo:** 
    - Usuario que hizo la denuncia
    - Carrera sobre la cual se hizo la denuncia
    - Texto ingresado por el usuario (campo message)

---

## Diagrama Visual de Relaciones

```
┌─────────────┐
│    USER     │
│─────────────│
│ id (PK)     │
│ email       │◄──────────┐
│ name        │           │
│ privacyLevel│           │
└─────────────┘           │
       │                   │
       │ 1                 │ N
       │                   │
       ▼                   │
┌─────────────────┐        │
│ USER_PREFERENCES │        │
│─────────────────│        │
│ userId (FK)     │        │
│ preferred...    │        │
└─────────────────┘        │
                            │
┌─────────────┐             │
│   COUNTRY   │             │
│─────────────│             │
│ id (PK)     │             │
│ name        │             │
│ code        │             │
└─────────────┘             │
       │                    │
       │ 1                  │
       │                    │
       ▼ N                  │
┌─────────────┐             │
│  PROVINCE   │             │
│─────────────│             │
│ id (PK)     │             │
│ countryId   │             │
│ name        │             │
└─────────────┘             │
       │                    │
       │ 1                  │
       │                    │
       ▼ N                  │
┌─────────────┐             │
│    RACE     │             │
│─────────────│             │
│ id (PK)     │             │
│ name        │             │
│ slug        │             │
│ ...         │             │
└─────────────┘             │
       │                    │
       │ 1                  │
       │                    │
       ▼ N                  │
┌─────────────────┐         │
│ RACE_EDITION    │         │
│─────────────────│         │
│ id (PK)         │         │
│ raceId (FK)     │         │
│ provinceId (FK) │─────────┘
│ city            │
│ year            │
│ startDate       │
│ ...             │
└─────────────────┘
       │
       │ 1
       │
       ▼ N
┌─────────────────┐
│     STAGE       │
│─────────────────│
│ id (PK)         │
│ editionId (FK)  │
│ number          │
│ ...             │
└─────────────────┘
                            │
┌─────────────────┐         │
│ RACE_ORGANIZER  │─────────┘
│─────────────────│
│ id (PK)         │
│ raceId (FK)     │
│ userId (FK)     │
│ role            │
│ isPrimary       │
└─────────────────┘

┌─────────────┐
│    USER     │
└─────────────┘
       │
       │ 1
       │
       ▼ N
┌─────────────────┐
│ USER_CALENDAR   │
│─────────────────│
│ id (PK)         │
│ userId (FK)     │
│ editionId (FK)  │
└─────────────────┘
       │
       │ N
       │
       ▼ 1
┌─────────────────┐
│ RACE_EDITION    │
└─────────────────┘

┌─────────────┐
│    USER     │
└─────────────┘
       │
       │ 1
       │
       ▼ N
┌─────────────────┐
│  RACE_REPORT    │
│─────────────────│
│ id (PK)         │
│ raceId (FK)     │
│ reportedUserId  │
│ reporterUserId  │
│ message         │
│ createdAt       │
└─────────────────┘
```

## Consideraciones de Diseño

### 1. Separación de Carrera y Edición
- **RACE**: Información que se mantiene entre años (nombre, disciplina, etc.)
- **RACE_EDITION**: Información específica de cada año (fechas, distancias, ubicación, etc.)
- Permite reutilizar datos y mantener historial

### 1.1. Ubicación en Edición
- La ubicación (provincia, ciudad) está en **RACE_EDITION** porque una carrera puede cambiar de ubicación entre ediciones
- Cada edición **DEBE** pertenecer a una provincia (provinceId NOT NULL)
- La ciudad/localidad es un string libre (city)
- La relación con provincia permite filtros y búsquedas eficientes

### 2. Países y Provincias Normalizados
- **COUNTRY**: Tabla de países (Argentina, Chile, etc.)
- **PROVINCE**: Tabla de provincias/estados, relacionadas con países
- Cada provincia pertenece a un país (countryId NOT NULL)
- Permite filtros por país y provincia de forma eficiente
- Facilita la expansión a otros países en el futuro

### 3. Organizadores Múltiples
- Un usuario puede ser organizador de múltiples carreras
- Una carrera puede tener múltiples organizadores
- Solo un organizador principal por carrera
- Los co-organizadores pueden ser promovidos a principales

### 4. Calendario Personal
- Los usuarios solo ven y agregan **EDICIONES** a su calendario, no carreras completas
- Cada entrada en el calendario corresponde a una edición específica de una carrera
- Flujo de creación de edición:
  1. Usuario quiere dar de alta una edición
  2. Sistema lista las carreras existentes para evitar duplicados
  3. Si encuentra la carrera:
     - Usuario selecciona la carrera
     - Crea una edición con fecha obligatoria (edición de X fecha de esa carrera)
  4. Si NO encuentra la carrera:
     - Usuario crea la carrera desde cero (con nombre y todo)
     - Sistema automáticamente crea la carrera (Race) y la edición (RaceEdition)

### 5. Sistema de Denuncias
- Los usuarios pueden denunciar organizadores de carreras
- El sistema NO gestiona la corrección ni resolución de denuncias
- Al crear una denuncia, se envía automáticamente un email al administrador:
  - **Destinatario:** sebarivero@gmail.com
  - **Asunto:** "Denuncia: Organizador mal asignado"
  - **Cuerpo del email:**
    - Usuario que hizo la denuncia
    - Carrera sobre la cual se hizo la denuncia
    - Texto libre ingresado por el usuario (máximo 1000 caracteres)
- La denuncia se registra en la base de datos para auditoría

### 6. Preferencias de Usuario
- Permite pre-cargar filtros según preferencias del usuario
- Mejora la experiencia de usuario

### 7. Privacidad
- Los usuarios pueden configurar el nivel de privacidad de su perfil
- Afecta quién puede ver su perfil

## Índices Recomendados

```sql
-- USER
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_user_privacy ON "User"("privacyLevel");

-- COUNTRY
CREATE INDEX idx_country_name ON "Country"(name);
CREATE INDEX idx_country_code ON "Country"(code);
CREATE INDEX idx_country_active ON "Country"("isActive");

-- PROVINCE
CREATE INDEX idx_province_country ON "Province"("countryId");
CREATE INDEX idx_province_name ON "Province"(name);
CREATE INDEX idx_province_active ON "Province"("isActive");

-- RACE
CREATE INDEX idx_race_slug ON "Race"(slug);
CREATE INDEX idx_race_discipline ON "Race"(discipline);
CREATE INDEX idx_race_active ON "Race"("isActive");

-- RACE_EDITION
CREATE INDEX idx_edition_race ON "RaceEdition"("raceId");
CREATE INDEX idx_edition_province ON "RaceEdition"("provinceId");
CREATE INDEX idx_edition_year ON "RaceEdition"(year);
CREATE INDEX idx_edition_start ON "RaceEdition"("startDate");
CREATE INDEX idx_edition_active ON "RaceEdition"("isActive");

-- STAGE
CREATE INDEX idx_stage_edition ON "Stage"("editionId");
CREATE INDEX idx_stage_number ON "Stage"("editionId", number);

-- RACE_ORGANIZER
CREATE INDEX idx_organizer_race ON "RaceOrganizer"("raceId");
CREATE INDEX idx_organizer_user ON "RaceOrganizer"("userId");
CREATE INDEX idx_organizer_primary ON "RaceOrganizer"("raceId", "isPrimary") WHERE "isPrimary" = true;

-- USER_CALENDAR
CREATE INDEX idx_calendar_user ON "UserCalendar"("userId");
CREATE INDEX idx_calendar_edition ON "UserCalendar"("editionId");

-- RACE_REPORT
CREATE INDEX idx_report_race ON "RaceReport"("raceId");
CREATE INDEX idx_report_reported ON "RaceReport"("reportedUserId");
CREATE INDEX idx_report_reporter ON "RaceReport"("reporterUserId");
```

## Notas de Implementación

1. **UUID vs Int**: Se recomienda usar UUID para mayor seguridad y escalabilidad
2. **Soft Deletes**: Considerar agregar `deletedAt` para soft deletes en lugar de borrar registros
3. **Auditoría**: Los campos `createdAt` y `updatedAt` ayudan con auditoría
4. **Normalización**: El diseño está normalizado para evitar redundancia
5. **Escalabilidad**: Los índices están optimizados para consultas frecuentes
6. **Migración desde Google Sheets**: Ver documento `MIGRACION_GOOGLE_SHEETS.md` para detalles sobre cómo migrar los datos actuales desde la planilla de Google Sheets a Supabase
