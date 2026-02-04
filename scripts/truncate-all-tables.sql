-- ============================================
-- BORRAR TODOS LOS DATOS DE LAS TABLAS
-- ============================================
-- Ejecutar este SQL en Supabase SQL Editor
-- para borrar todos los datos antes de migrar de nuevo

-- Borrar en orden para respetar foreign keys
TRUNCATE TABLE "Stage" CASCADE;
TRUNCATE TABLE "RaceEdition" CASCADE;
TRUNCATE TABLE "UserCalendar" CASCADE;
TRUNCATE TABLE "RaceReport" CASCADE;
TRUNCATE TABLE "Race" CASCADE;
-- Province y Country NO se borran (son maestros)

-- Verificar que las tablas estén vacías
SELECT 'Race' as tabla, COUNT(*) as registros FROM "Race"
UNION ALL
SELECT 'RaceEdition', COUNT(*) FROM "RaceEdition"
UNION ALL
SELECT 'Stage', COUNT(*) FROM "Stage";
