# Crear Tablas Manualmente en Supabase

Si Prisma Migrate no puede conectarse, puedes crear las tablas manualmente desde el SQL Editor de Supabase.

## 📝 Pasos

### 1. Ve al SQL Editor de Supabase

1. Abre tu proyecto en Supabase
2. Ve a **SQL Editor** en el menú lateral
3. Haz clic en **"New query"**

### 2. Ejecuta este SQL

Copia y pega el siguiente SQL completo en el editor y haz clic en **"Run"**:

```sql
-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- AUTENTICACIÓN Y USUARIOS
-- ============================================

-- Enum para PrivacyLevel
CREATE TYPE "PrivacyLevel" AS ENUM ('PUBLIC', 'PRIVATE', 'HIDDEN');

-- Tabla User
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "emailVerified" TIMESTAMP(3),
    "privacyLevel" "PrivacyLevel" NOT NULL DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Tabla Account
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- Tabla Session
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- PREFERENCIAS Y CALENDARIO
-- ============================================

-- Tabla UserPreferences
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preferredDisciplines" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredFormats" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredCountries" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredProvinces" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredModalities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- Tabla UserCalendar
CREATE TABLE "UserCalendar" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCalendar_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- PAÍSES Y PROVINCIAS
-- ============================================

-- Tabla Country
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- Tabla Province
CREATE TABLE "Province" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Province_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- CARRERAS Y EDICIONES
-- ============================================

-- Tabla Race
CREATE TABLE "Race" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "discipline" TEXT NOT NULL,
    "disciplines" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "format" TEXT,
    "formats" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "modality" TEXT,
    "modalities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "registrationUrl" TEXT,
    "website" TEXT,
    "instagram" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Race_pkey" PRIMARY KEY ("id")
);

-- Tabla RaceEdition
CREATE TABLE "RaceEdition" (
    "id" TEXT NOT NULL,
    "raceId" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,
    "city" TEXT,
    "location" TEXT,
    "year" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "distance" TEXT,
    "elevation" TEXT,
    "stages" INTEGER NOT NULL DEFAULT 1,
    "days" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RaceEdition_pkey" PRIMARY KEY ("id")
);

-- Tabla Stage
CREATE TABLE "Stage" (
    "id" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "distance" TEXT,
    "elevation" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- ORGANIZADORES
-- ============================================

-- Enum para OrganizerRole
CREATE TYPE "OrganizerRole" AS ENUM ('PRIMARY', 'CO_ORGANIZER');

-- Tabla RaceOrganizer
CREATE TABLE "RaceOrganizer" (
    "id" TEXT NOT NULL,
    "raceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "OrganizerRole" NOT NULL DEFAULT 'CO_ORGANIZER',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedBy" TEXT,

    CONSTRAINT "RaceOrganizer_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- DENUNCIAS
-- ============================================

-- Tabla RaceReport
CREATE TABLE "RaceReport" (
    "id" TEXT NOT NULL,
    "raceId" TEXT NOT NULL,
    "reportedUserId" TEXT NOT NULL,
    "reporterUserId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RaceReport_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- ÍNDICES Y CONSTRAINTS
-- ============================================

-- User
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_privacyLevel_idx" ON "User"("privacyLevel");

-- Account
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- Session
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE INDEX "Session_sessionToken_idx" ON "Session"("sessionToken");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- UserPreferences
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");

-- UserCalendar
CREATE UNIQUE INDEX "UserCalendar_userId_editionId_key" ON "UserCalendar"("userId", "editionId");
CREATE INDEX "UserCalendar_userId_idx" ON "UserCalendar"("userId");
CREATE INDEX "UserCalendar_editionId_idx" ON "UserCalendar"("editionId");

-- Country
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");
CREATE INDEX "Country_name_idx" ON "Country"("name");
CREATE INDEX "Country_code_idx" ON "Country"("code");
CREATE INDEX "Country_isActive_idx" ON "Country"("isActive");

-- Province
CREATE UNIQUE INDEX "Province_countryId_name_key" ON "Province"("countryId", "name");
CREATE INDEX "Province_countryId_idx" ON "Province"("countryId");
CREATE INDEX "Province_name_idx" ON "Province"("name");
CREATE INDEX "Province_isActive_idx" ON "Province"("isActive");

-- Race
CREATE UNIQUE INDEX "Race_slug_key" ON "Race"("slug");
CREATE INDEX "Race_slug_idx" ON "Race"("slug");
CREATE INDEX "Race_discipline_idx" ON "Race"("discipline");
CREATE INDEX "Race_isActive_idx" ON "Race"("isActive");

-- RaceEdition
CREATE UNIQUE INDEX "RaceEdition_raceId_year_key" ON "RaceEdition"("raceId", "year");
CREATE INDEX "RaceEdition_raceId_idx" ON "RaceEdition"("raceId");
CREATE INDEX "RaceEdition_provinceId_idx" ON "RaceEdition"("provinceId");
CREATE INDEX "RaceEdition_year_idx" ON "RaceEdition"("year");
CREATE INDEX "RaceEdition_startDate_idx" ON "RaceEdition"("startDate");
CREATE INDEX "RaceEdition_isActive_idx" ON "RaceEdition"("isActive");

-- Stage
CREATE UNIQUE INDEX "Stage_editionId_number_key" ON "Stage"("editionId", "number");
CREATE INDEX "Stage_editionId_idx" ON "Stage"("editionId");
CREATE INDEX "Stage_number_idx" ON "Stage"("number");

-- RaceOrganizer
CREATE UNIQUE INDEX "RaceOrganizer_raceId_userId_key" ON "RaceOrganizer"("raceId", "userId");
CREATE INDEX "RaceOrganizer_raceId_idx" ON "RaceOrganizer"("raceId");
CREATE INDEX "RaceOrganizer_userId_idx" ON "RaceOrganizer"("userId");
CREATE INDEX "RaceOrganizer_raceId_isPrimary_idx" ON "RaceOrganizer"("raceId", "isPrimary");

-- RaceReport
CREATE INDEX "RaceReport_raceId_idx" ON "RaceReport"("raceId");
CREATE INDEX "RaceReport_reportedUserId_idx" ON "RaceReport"("reportedUserId");
CREATE INDEX "RaceReport_reporterUserId_idx" ON "RaceReport"("reporterUserId");

-- ============================================
-- FOREIGN KEYS
-- ============================================

-- Account
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Session
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- UserPreferences
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- UserCalendar
ALTER TABLE "UserCalendar" ADD CONSTRAINT "UserCalendar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserCalendar" ADD CONSTRAINT "UserCalendar_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "RaceEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Province
ALTER TABLE "Province" ADD CONSTRAINT "Province_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RaceEdition
ALTER TABLE "RaceEdition" ADD CONSTRAINT "RaceEdition_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RaceEdition" ADD CONSTRAINT "RaceEdition_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Stage
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "RaceEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RaceOrganizer
ALTER TABLE "RaceOrganizer" ADD CONSTRAINT "RaceOrganizer_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RaceOrganizer" ADD CONSTRAINT "RaceOrganizer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RaceOrganizer" ADD CONSTRAINT "RaceOrganizer_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RaceReport
ALTER TABLE "RaceReport" ADD CONSTRAINT "RaceReport_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RaceReport" ADD CONSTRAINT "RaceReport_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RaceReport" ADD CONSTRAINT "RaceReport_reporterUserId_fkey" FOREIGN KEY ("reporterUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

### 3. Verificar

Después de ejecutar el SQL:

1. Ve a **Table Editor** en Supabase
2. Deberías ver todas las tablas creadas
3. Verifica que no haya errores en el SQL Editor

### 4. Generar el Cliente de Prisma

Una vez que las tablas estén creadas, genera el cliente:

```bash
npx prisma generate
```

### 5. Marcar la Migración como Aplicada

Para que Prisma sepa que las tablas ya existen:

```bash
npx prisma migrate resolve --applied init
```

O crea manualmente el archivo de migración:

```bash
mkdir -p prisma/migrations/init
```

Y crea un archivo `migration.sql` vacío en esa carpeta.

## ✅ Ventajas de este Método

- No depende de la conexión desde Prisma Migrate
- Puedes ver los errores directamente en Supabase
- Más control sobre el proceso
- Funciona incluso si hay problemas de red
