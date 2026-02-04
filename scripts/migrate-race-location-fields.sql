-- Script para migrar campos de ubicación y otros a Race
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar columnas a Race
ALTER TABLE "Race" 
  ADD COLUMN IF NOT EXISTS "city" TEXT,
  ADD COLUMN IF NOT EXISTS "provinceId" TEXT,
  ADD COLUMN IF NOT EXISTS "distance" TEXT,
  ADD COLUMN IF NOT EXISTS "elevation" TEXT,
  ADD COLUMN IF NOT EXISTS "stages" INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS "days" INTEGER DEFAULT 1;

-- 2. Agregar foreign key para provinceId en Race
-- Nota: Si la constraint ya existe, este comando fallará silenciosamente
-- Puedes ignorar el error si dice que ya existe
ALTER TABLE "Race" 
  ADD CONSTRAINT "Race_provinceId_fkey" 
  FOREIGN KEY ("provinceId") 
  REFERENCES "Province"("id") 
  ON DELETE SET NULL;

-- 3. Migrar datos desde RaceEdition a Race (tomar los valores más recientes)
UPDATE "Race" r
SET 
  "city" = re."city",
  "provinceId" = re."provinceId",
  "distance" = re."distance",
  "elevation" = re."elevation",
  "stages" = COALESCE(re."stages", 1),
  "days" = COALESCE(re."days", 1)
FROM (
  SELECT DISTINCT ON ("raceId")
    "raceId",
    "city",
    "provinceId",
    "distance",
    "elevation",
    "stages",
    "days"
  FROM "RaceEdition"
  WHERE "raceId" IS NOT NULL
  ORDER BY "raceId", "year" DESC, "createdAt" DESC
) re
WHERE r.id = re."raceId"
  AND (r."city" IS NULL OR r."provinceId" IS NULL);

-- 4. Agregar columnas disciplines y modalities a RaceEdition
ALTER TABLE "RaceEdition"
  ADD COLUMN IF NOT EXISTS "disciplines" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "modalities" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- 5. Migrar disciplines y modalities desde Race a RaceEdition (si no tienen)
UPDATE "RaceEdition" re
SET 
  "disciplines" = COALESCE(
    NULLIF(re."disciplines", ARRAY[]::TEXT[]),
    r."disciplines"
  ),
  "modalities" = COALESCE(
    NULLIF(re."modalities", ARRAY[]::TEXT[]),
    r."modalities"
  )
FROM "Race" r
WHERE re."raceId" = r.id
  AND (
    re."disciplines" = ARRAY[]::TEXT[] OR 
    re."disciplines" IS NULL OR
    array_length(re."disciplines", 1) IS NULL
  );

-- 6. Hacer provinceId nullable en RaceEdition (ya debería serlo, pero por si acaso)
ALTER TABLE "RaceEdition" 
  ALTER COLUMN "provinceId" DROP NOT NULL;

-- 7. Eliminar columna endDate de RaceEdition
ALTER TABLE "RaceEdition" 
  DROP COLUMN IF EXISTS "endDate";

-- 8. Crear índices
CREATE INDEX IF NOT EXISTS "Race_provinceId_idx" ON "Race"("provinceId");

-- Verificar cambios
SELECT 
  'Race' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'Race'
  AND column_name IN ('city', 'provinceId', 'distance', 'elevation', 'stages', 'days')
ORDER BY column_name;

SELECT 
  'RaceEdition' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'RaceEdition'
  AND column_name IN ('endDate', 'disciplines', 'modalities', 'provinceId')
ORDER BY column_name;
