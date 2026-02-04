-- =============================================================================
-- Script: Agregar DEFAULT para id (UUID) y fechas en todas las tablas
-- =============================================================================
-- Ejecutá este script en tu base de Render (pgAdmin, DBeaver, psql) para que
-- los INSERT sin "id", "createdAt" o "updatedAt" los generen automáticamente.
--
-- Requiere PostgreSQL 13+ (gen_random_uuid() viene incluido).
-- =============================================================================

-- User
ALTER TABLE "User"           ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "User"           ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "User"           ALTER COLUMN "updatedAt" SET DEFAULT now();

-- Account
ALTER TABLE "Account"        ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- Session
ALTER TABLE "Session"        ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- UserPreferences
ALTER TABLE "UserPreferences" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "UserPreferences" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "UserPreferences" ALTER COLUMN "updatedAt" SET DEFAULT now();

-- UserCalendar
ALTER TABLE "UserCalendar"   ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "UserCalendar"   ALTER COLUMN "addedAt" SET DEFAULT now();

-- Country
ALTER TABLE "Country"        ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Country"        ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "Country"        ALTER COLUMN "updatedAt" SET DEFAULT now();

-- Province
ALTER TABLE "Province"       ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Province"       ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "Province"       ALTER COLUMN "updatedAt" SET DEFAULT now();

-- Race
ALTER TABLE "Race"           ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Race"           ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "Race"           ALTER COLUMN "updatedAt" SET DEFAULT now();

-- RaceEdition
ALTER TABLE "RaceEdition"    ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "RaceEdition"    ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "RaceEdition"    ALTER COLUMN "updatedAt" SET DEFAULT now();

-- EditionFormat
ALTER TABLE "EditionFormat"  ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "EditionFormat"  ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "EditionFormat"  ALTER COLUMN "updatedAt" SET DEFAULT now();

-- Stage
ALTER TABLE "Stage"          ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Stage"          ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "Stage"          ALTER COLUMN "updatedAt" SET DEFAULT now();

-- RaceOrganizer
ALTER TABLE "RaceOrganizer"  ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "RaceOrganizer"  ALTER COLUMN "addedAt" SET DEFAULT now();

-- RaceReport
ALTER TABLE "RaceReport"     ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "RaceReport"     ALTER COLUMN "createdAt" SET DEFAULT now();
