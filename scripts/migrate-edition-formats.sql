-- Script para migrar datos existentes a la nueva estructura de EditionFormat
-- Asume que todas las ediciones actuales tienen un solo formato

-- 1. Crear la tabla EditionFormat
CREATE TABLE IF NOT EXISTS "EditionFormat" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "editionId" TEXT NOT NULL,
  format TEXT NOT NULL,
  distance TEXT,
  elevation TEXT,
  disciplines TEXT[] DEFAULT '{}',
  modalities TEXT[] DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EditionFormat_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "RaceEdition"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 2. Crear índices
CREATE INDEX IF NOT EXISTS "EditionFormat_editionId_idx" ON "EditionFormat"("editionId");
CREATE INDEX IF NOT EXISTS "EditionFormat_format_idx" ON "EditionFormat"(format);
CREATE UNIQUE INDEX IF NOT EXISTS "EditionFormat_editionId_format_key" ON "EditionFormat"("editionId", format);

-- 3. Migrar datos existentes
-- Para cada edición, crear un EditionFormat con:
-- - format: desde Race.format o Race.formats[0] (solo se migran ediciones que tienen formato)
-- - distance: desde RaceEdition.distance
-- - elevation: desde RaceEdition.elevation
-- - disciplines: desde RaceEdition.disciplines (o Race.disciplines si está vacío)
-- - modalities: desde RaceEdition.modalities (o Race.modalities si está vacío)

INSERT INTO "EditionFormat" (
  id,
  "editionId",
  format,
  distance,
  elevation,
  disciplines,
  modalities,
  "createdAt",
  "updatedAt"
)
SELECT 
  gen_random_uuid()::text as id,
  re.id as "editionId",
  NULLIF(
    COALESCE(
      NULLIF(r.format, ''),
      CASE 
        WHEN array_length(r.formats, 1) > 0 THEN r.formats[1]
        ELSE NULL
      END
    ),
    ''
  ) as format,
  re.distance,
  re.elevation,
  CASE 
    WHEN array_length(re.disciplines, 1) > 0 THEN re.disciplines
    WHEN array_length(r.disciplines, 1) > 0 THEN r.disciplines
    WHEN r.discipline IS NOT NULL AND r.discipline != '' THEN ARRAY[r.discipline]
    ELSE '{}'::TEXT[]
  END as disciplines,
  CASE 
    WHEN array_length(re.modalities, 1) > 0 THEN re.modalities
    WHEN array_length(r.modalities, 1) > 0 THEN r.modalities
    WHEN r.modality IS NOT NULL AND r.modality != '' THEN ARRAY[r.modality]
    ELSE '{}'::TEXT[]
  END as modalities,
  re."createdAt" as "createdAt",
  re."updatedAt" as "updatedAt"
FROM "RaceEdition" re
INNER JOIN "Race" r ON re."raceId" = r.id
WHERE re."isActive" = true
  AND (
    NULLIF(r.format, '') IS NOT NULL
    OR (array_length(r.formats, 1) > 0 AND r.formats[1] IS NOT NULL AND r.formats[1] != '')
  );

-- 4. Comentario: NO eliminamos las columnas distance, elevation, disciplines, modalities de RaceEdition todavía
-- para mantener compatibilidad durante la transición. Se pueden eliminar después de verificar que todo funciona.
