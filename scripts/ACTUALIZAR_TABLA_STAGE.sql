-- ============================================
-- ACTUALIZAR TABLA Stage
-- ============================================
-- Este script renombra las columnas startDate y endDate
-- a fromLocation y toLocation para mayor claridad
-- (son localidades, no fechas)
-- ============================================

DO $$
BEGIN
    -- Renombrar startDate a fromLocation (si existe)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Stage' AND column_name = 'startDate'
    ) THEN
        ALTER TABLE "Stage" RENAME COLUMN "startDate" TO "fromLocation";
        RAISE NOTICE 'Columna startDate renombrada a fromLocation';
    ELSE
        RAISE NOTICE 'Columna startDate no existe (puede que ya esté renombrada)';
    END IF;

    -- Renombrar endDate a toLocation (si existe)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Stage' AND column_name = 'endDate'
    ) THEN
        ALTER TABLE "Stage" RENAME COLUMN "endDate" TO "toLocation";
        RAISE NOTICE 'Columna endDate renombrada a toLocation';
    ELSE
        RAISE NOTICE 'Columna endDate no existe (puede que ya esté renombrada)';
    END IF;

    -- Cambiar el tipo de dato de timestamp a text (si aún no está como text)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Stage' AND column_name = 'fromLocation'
        AND data_type = 'timestamp without time zone'
    ) THEN
        ALTER TABLE "Stage" 
          ALTER COLUMN "fromLocation" TYPE TEXT USING COALESCE("fromLocation"::TEXT, NULL);
        RAISE NOTICE 'Tipo de fromLocation cambiado a TEXT';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Stage' AND column_name = 'toLocation'
        AND data_type = 'timestamp without time zone'
    ) THEN
        ALTER TABLE "Stage" 
          ALTER COLUMN "toLocation" TYPE TEXT USING COALESCE("toLocation"::TEXT, NULL);
        RAISE NOTICE 'Tipo de toLocation cambiado a TEXT';
    END IF;
END $$;

-- Verificar que los cambios se aplicaron correctamente
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'Stage' 
AND column_name IN ('fromLocation', 'toLocation', 'startDate', 'endDate')
ORDER BY column_name;
