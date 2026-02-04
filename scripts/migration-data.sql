-- ============================================
-- MIGRACIÓN DE DATOS DESDE GOOGLE SHEETS
-- Generado automáticamente
-- SOLO CARRERAS DE ARGENTINA
-- Total de carreras: 101
-- ============================================

-- NOTA: Este SQL asume que los países y provincias ya existen.
-- Si no existen, créalos primero desde el SQL Editor.

-- Variables temporales para IDs
DO $$
DECLARE
    argentina_id TEXT;
    mendoza_province_id TEXT;
    san_juan_province_id TEXT;
    catamarca_province_id TEXT;
    jujuy_province_id TEXT;
    bs__as__province_id TEXT;
    c_rdoba_province_id TEXT;
    tucum_n_province_id TEXT;
    r_o_negro_province_id TEXT;
    neuqu_n_province_id TEXT;
    entre_r_os_province_id TEXT;
    san_luis_province_id TEXT;
    salta_province_id TEXT;
    la_pampa_province_id TEXT;
    santa_fe_province_id TEXT;
BEGIN

    -- Obtener ID de Argentina
    SELECT id INTO argentina_id FROM "Country" WHERE name = 'Argentina';

    -- Obtener ID de Mendoza (buscando como 'Mendoza')
    SELECT id INTO mendoza_province_id FROM "Province" WHERE name = 'Mendoza' AND "countryId" = argentina_id;
    IF mendoza_province_id IS NULL THEN
        -- Intentar con el nombre original si no se encontró
        SELECT id INTO mendoza_province_id FROM "Province" WHERE name = 'Mendoza' AND "countryId" = argentina_id;
    END IF;

    -- Obtener ID de San Juan (buscando como 'San Juan')
    SELECT id INTO san_juan_province_id FROM "Province" WHERE name = 'San Juan' AND "countryId" = argentina_id;
    IF san_juan_province_id IS NULL THEN
        -- Intentar con el nombre original si no se encontró
        SELECT id INTO san_juan_province_id FROM "Province" WHERE name = 'San Juan' AND "countryId" = argentina_id;
    END IF;

    -- Obtener ID de Catamarca (buscando como 'Catamarca')
    SELECT id INTO catamarca_province_id FROM "Province" WHERE name = 'Catamarca' AND "countryId" = argentina_id;
    IF catamarca_province_id IS NULL THEN
        -- Intentar con el nombre original si no se encontró
        SELECT id INTO catamarca_province_id FROM "Province" WHERE name = 'Catamarca' AND "countryId" = argentina_id;
    END IF;

    -- Obtener ID de Jujuy (buscando como 'Jujuy')
    SELECT id INTO jujuy_province_id FROM "Province" WHERE name = 'Jujuy' AND "countryId" = argentina_id;
    IF jujuy_province_id IS NULL THEN
        -- Intentar con el nombre original si no se encontró
        SELECT id INTO jujuy_province_id FROM "Province" WHERE name = 'Jujuy' AND "countryId" = argentina_id;
    END IF;

    -- Obtener ID de Bs. As. (buscando como 'Buenos Aires')
    SELECT id INTO bs__as__province_id FROM "Province" WHERE name = 'Buenos Aires' AND "countryId" = argentina_id;
    IF bs__as__province_id IS NULL THEN
        -- Intentar con el nombre original si no se encontró
        SELECT id INTO bs__as__province_id FROM "Province" WHERE name = 'Bs. As.' AND "countryId" = argentina_id;
    END IF;

    -- Obtener ID de Córdoba (buscando como 'Córdoba')
    SELECT id INTO c_rdoba_province_id FROM "Province" WHERE name = 'Córdoba' AND "countryId" = argentina_id;
    IF c_rdoba_province_id IS NULL THEN
        -- Intentar con el nombre original si no se encontró
        SELECT id INTO c_rdoba_province_id FROM "Province" WHERE name = 'Córdoba' AND "countryId" = argentina_id;
    END IF;

    -- Obtener ID de Tucumán (buscando como 'Tucumán')
    SELECT id INTO tucum_n_province_id FROM "Province" WHERE name = 'Tucumán' AND "countryId" = argentina_id;
    IF tucum_n_province_id IS NULL THEN
        -- Intentar con el nombre original si no se encontró
        SELECT id INTO tucum_n_province_id FROM "Province" WHERE name = 'Tucumán' AND "countryId" = argentina_id;
    END IF;

    -- Obtener ID de Río Negro (buscando como 'Río Negro')
    SELECT id INTO r_o_negro_province_id FROM "Province" WHERE name = 'Río Negro' AND "countryId" = argentina_id;
    IF r_o_negro_province_id IS NULL THEN
        -- Intentar con el nombre original si no se encontró
        SELECT id INTO r_o_negro_province_id FROM "Province" WHERE name = 'Río Negro' AND "countryId" = argentina_id;
    END IF;

    -- Obtener ID de Neuquén (buscando como 'Neuquén')
    SELECT id INTO neuqu_n_province_id FROM "Province" WHERE name = 'Neuquén' AND "countryId" = argentina_id;
    IF neuqu_n_province_id IS NULL THEN
        -- Intentar con el nombre original si no se encontró
        SELECT id INTO neuqu_n_province_id FROM "Province" WHERE name = 'Neuquén' AND "countryId" = argentina_id;
    END IF;

    -- Obtener ID de Entre Ríos (buscando como 'Entre Ríos')
    SELECT id INTO entre_r_os_province_id FROM "Province" WHERE name = 'Entre Ríos' AND "countryId" = argentina_id;
    IF entre_r_os_province_id IS NULL THEN
        -- Intentar con el nombre original si no se encontró
        SELECT id INTO entre_r_os_province_id FROM "Province" WHERE name = 'Entre Ríos' AND "countryId" = argentina_id;
    END IF;

    -- Obtener ID de San Luis (buscando como 'San Luis')
    SELECT id INTO san_luis_province_id FROM "Province" WHERE name = 'San Luis' AND "countryId" = argentina_id;
    IF san_luis_province_id IS NULL THEN
        -- Intentar con el nombre original si no se encontró
        SELECT id INTO san_luis_province_id FROM "Province" WHERE name = 'San Luis' AND "countryId" = argentina_id;
    END IF;

    -- Obtener ID de Salta (buscando como 'Salta')
    SELECT id INTO salta_province_id FROM "Province" WHERE name = 'Salta' AND "countryId" = argentina_id;
    IF salta_province_id IS NULL THEN
        -- Intentar con el nombre original si no se encontró
        SELECT id INTO salta_province_id FROM "Province" WHERE name = 'Salta' AND "countryId" = argentina_id;
    END IF;

    -- Obtener ID de La Pampa (buscando como 'La Pampa')
    SELECT id INTO la_pampa_province_id FROM "Province" WHERE name = 'La Pampa' AND "countryId" = argentina_id;
    IF la_pampa_province_id IS NULL THEN
        -- Intentar con el nombre original si no se encontró
        SELECT id INTO la_pampa_province_id FROM "Province" WHERE name = 'La Pampa' AND "countryId" = argentina_id;
    END IF;

    -- Obtener ID de Santa Fe (buscando como 'Santa Fe')
    SELECT id INTO santa_fe_province_id FROM "Province" WHERE name = 'Santa Fe' AND "countryId" = argentina_id;
    IF santa_fe_province_id IS NULL THEN
        -- Intentar con el nombre original si no se encontró
        SELECT id INTO santa_fe_province_id FROM "Province" WHERE name = 'Santa Fe' AND "countryId" = argentina_id;
    END IF;

    -- ============================================
    -- INSERTAR CARRERAS Y EDICIONES
    -- ============================================

    -- Carrera 1: Gran Premio Muni. de Maipú
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Gran Premio Muni. de Maipú',
        'gran-premio-muni-de-maipu',
        'Ruta',
        ARRAY['Ruta'],
        'Ruta',
        ARRAY['Ruta'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Gran Premio Muni. de Maipú
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        mendoza_province_id,
        'Maipú',
        'Maipú, Mendoza, ARG',
        2026,
        '2026-01-04T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'gran-premio-muni-de-maipu'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Gran Premio Muni. de Maipú 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        'Etapa 1',
        '44',
        '2164',
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'gran-premio-muni-de-maipu' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 2: Clásica Doble Difunta Correa
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Clásica Doble Difunta Correa',
        'clasica-doble-difunta-correa',
        'Ruta',
        ARRAY['Ruta'],
        'Ruta',
        ARRAY['Ruta'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Clásica Doble Difunta Correa
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        san_juan_province_id,
        'Nueve de Julio',
        'Nueve de Julio, San Juan, ARG',
        2026,
        '2026-01-04T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'clasica-doble-difunta-correa'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Clásica Doble Difunta Correa 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        'Etapa 2',
        '44',
        '2164',
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'clasica-doble-difunta-correa' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 3: 24º Giro del Sol
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        '24º Giro del Sol',
        '24-giro-del-sol',
        'Ruta',
        ARRAY['Ruta'],
        'Ruta',
        ARRAY['Ruta'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de 24º Giro del Sol
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        san_juan_province_id,
        'San Juan',
        'San Juan, San Juan, ARG',
        2026,
        '2026-01-09T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = '24-giro-del-sol'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de 24º Giro del Sol 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        'Etapa 4',
        '44',
        '2164',
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = '24-giro-del-sol' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 4: Campeonato Nac. Nocturno en Parejas
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Campeonato Nac. Nocturno en Parejas',
        'campeonato-nac-nocturno-en-parejas',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Dupla',
        ARRAY['Dupla'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Campeonato Nac. Nocturno en Parejas
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        catamarca_province_id,
        'Santa María',
        'Santa María, Catamarca, ARG',
        2026,
        '2026-01-10T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'campeonato-nac-nocturno-en-parejas'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Campeonato Nac. Nocturno en Parejas 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        'Etapa 5',
        '44',
        '2164',
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'campeonato-nac-nocturno-en-parejas' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 5: Trasyunga nocturno
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Trasyunga nocturno',
        'trasyunga-nocturno',
        'MTB',
        ARRAY['MTB'],
        'XCM',
        ARRAY['XCM'],
        'Dupla & Equipo de 3',
        ARRAY['Dupla', 'Equipo de 3'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Trasyunga nocturno
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        jujuy_province_id,
        'San Pedro de Jujuy',
        'San Pedro de Jujuy, Jujuy, ARG',
        2026,
        '2026-01-10T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'trasyunga-nocturno'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Trasyunga nocturno 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        'Etapa 6',
        '44',
        '2164',
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'trasyunga-nocturno' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 6: Club Enrique Laverriere
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Club Enrique Laverriere',
        'club-enrique-laverriere',
        'Ruta',
        ARRAY['Ruta'],
        'Ruta',
        ARRAY['Ruta'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Club Enrique Laverriere
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        mendoza_province_id,
        'Villavicencio',
        'Villavicencio, Mendoza, ARG',
        2026,
        '2026-01-11T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'club-enrique-laverriere'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Club Enrique Laverriere 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        'Etapa 7',
        '44',
        '2164',
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'club-enrique-laverriere' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 7: Circuito Homenaje al Ciclista
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Circuito Homenaje al Ciclista',
        'circuito-homenaje-al-ciclista',
        'Ruta',
        ARRAY['Ruta'],
        'Ruta',
        ARRAY['Ruta'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Circuito Homenaje al Ciclista
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        san_juan_province_id,
        'San Juan',
        'San Juan, San Juan, ARG',
        2026,
        '2026-01-18T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'circuito-homenaje-al-ciclista'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Circuito Homenaje al Ciclista 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        'Etapa 8',
        '44',
        '2164',
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'circuito-homenaje-al-ciclista' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 8: GP Municipalidad de Tunuyán
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'GP Municipalidad de Tunuyán',
        'gp-municipalidad-de-tunuyan',
        'Ruta',
        ARRAY['Ruta'],
        'Ruta',
        ARRAY['Ruta'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de GP Municipalidad de Tunuyán
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        mendoza_province_id,
        'Tunuyán',
        'Tunuyán, Mendoza, ARG',
        2026,
        '2026-01-18T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'gp-municipalidad-de-tunuyan'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de GP Municipalidad de Tunuyán 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        'Etapa 9',
        '44',
        '2164',
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'gp-municipalidad-de-tunuyan' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 9: Revancha de la Doble
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Revancha de la Doble',
        'revancha-de-la-doble',
        'Ruta',
        ARRAY['Ruta'],
        'Ruta',
        ARRAY['Ruta'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Revancha de la Doble
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'Bragado',
        'Bragado, Bs. As., ARG',
        2026,
        '2026-01-23T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'revancha-de-la-doble'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Revancha de la Doble 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        'Etapa 10',
        '44',
        '2164',
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'revancha-de-la-doble' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 10: Vuelta a San Juan
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Vuelta a San Juan',
        'vuelta-a-san-juan',
        'Ruta',
        ARRAY['Ruta'],
        'Ruta',
        ARRAY['Ruta'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Vuelta a San Juan
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        san_juan_province_id,
        'San Juan',
        'San Juan, San Juan, ARG',
        2026,
        '2026-01-23T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'vuelta-a-san-juan'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Vuelta a San Juan 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        'Etapa 11',
        '44',
        '2164',
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'vuelta-a-san-juan' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 11: Wolf Bike Race
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Wolf Bike Race',
        'wolf-bike-race',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Dupla',
        ARRAY['Dupla'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Wolf Bike Race
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'La Falda',
        'La Falda, Córdoba, ARG',
        2026,
        '2026-01-24T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'wolf-bike-race'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Wolf Bike Race 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        'Etapa 12',
        '44',
        '2164',
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'wolf-bike-race' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 12: 3º Vuelta a San Carlos
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        '3º Vuelta a San Carlos',
        '3-vuelta-a-san-carlos',
        'Ruta',
        ARRAY['Ruta'],
        'Ruta',
        ARRAY['Ruta'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de 3º Vuelta a San Carlos
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        mendoza_province_id,
        'San Carlos',
        'San Carlos, Mendoza, ARG',
        2026,
        '2026-01-25T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = '3-vuelta-a-san-carlos'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de 3º Vuelta a San Carlos 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        'Etapa 13',
        '44',
        '2164',
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = '3-vuelta-a-san-carlos' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 13: Rally de Verano Felipe Delgado
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Rally de Verano Felipe Delgado',
        'rally-de-verano-felipe-delgado',
        'MTB / Ebike',
        ARRAY['MTB', 'Ebike'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        'https://www.cronobottiming.com/rally-de-verano-fd-2026',
        NULL,
        'aventura_pinosport',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Rally de Verano Felipe Delgado
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        tucum_n_province_id,
        'Tafí del Valle',
        'Tafí del Valle, Tucumán, ARG',
        2026,
        '2026-01-31T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'rally-de-verano-felipe-delgado'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Rally de Verano Felipe Delgado 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'rally-de-verano-felipe-delgado' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 14: El Mollar
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'El Mollar',
        'el-mollar',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'aventura_pinosport',
        '3816815034',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de El Mollar
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        catamarca_province_id,
        'El Mollar',
        'El Mollar, Catamarca, ARG',
        2026,
        '2026-01-31T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'el-mollar'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de El Mollar 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'el-mollar' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 15: Crono en parejas nocturna
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Crono en parejas nocturna',
        'crono-en-parejas-nocturna',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        'Dupla',
        ARRAY['Dupla'],
        NULL,
        NULL,
        'ciclorural.arg',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Crono en parejas nocturna
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'San Andrés de Giles',
        'San Andrés de Giles, Bs. As., ARG',
        2026,
        '2026-02-07T12:00:00.000Z'::timestamp,
        NULL,
        '50 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'crono-en-parejas-nocturna'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Crono en parejas nocturna 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'crono-en-parejas-nocturna' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 16: Ascochinga
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Ascochinga',
        'ascochinga',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Ascochinga
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'Ascochinga',
        'Ascochinga, Córdoba, ARG',
        2026,
        '2026-02-08T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'ascochinga'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Ascochinga 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'ascochinga' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 17: Vuelta a Los Molinos
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Vuelta a Los Molinos',
        'vuelta-a-los-molinos',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        'https://docs.google.com/forms/d/e/1FAIpQLSfzhefRLxHWRvrGvPCm0dLQc1uG_KqU5x8q79tNHydI6QC_YQ/viewform',
        NULL,
        'vueltaalosmolinos',
        '358 574-1015',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Vuelta a Los Molinos
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'Achiras',
        'Achiras, Córdoba, ARG',
        2026,
        '2026-02-08T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'vuelta-a-los-molinos'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Vuelta a Los Molinos 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'vuelta-a-los-molinos' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 18: Desafío ACCB Emex
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Desafío ACCB Emex',
        'desafio-accb-emex',
        'MTB / Gravel',
        ARRAY['MTB', 'Gravel'],
        'Rural',
        ARRAY['Rural'],
        'Individual',
        ARRAY['Individual'],
        'https://cronometrajeinstantaneo.com/inscripciones/desafio-rally-mtb-accb-emex',
        NULL,
        'accbrandsen',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Desafío ACCB Emex
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'Brandsen',
        'Brandsen, Bs. As., ARG',
        2026,
        '2026-02-08T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'desafio-accb-emex'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Desafío ACCB Emex 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'desafio-accb-emex' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 19: Rally en parejas Coronel Belisle
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Rally en parejas Coronel Belisle',
        'rally-en-parejas-coronel-belisle',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Dupla',
        ARRAY['Dupla'],
        'https://forms.gle/3H9w7Eq5SrFR6tQR9',
        NULL,
        'crono_vazquez37',
        '2920 562576 / 298 4958016',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Rally en parejas Coronel Belisle
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        r_o_negro_province_id,
        'Coronel Belisle',
        'Coronel Belisle, Río Negro, ARG',
        2026,
        '2026-02-08T12:00:00.000Z'::timestamp,
        NULL,
        '6028 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'rally-en-parejas-coronel-belisle'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Rally en parejas Coronel Belisle 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'rally-en-parejas-coronel-belisle' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 20: Desafío La Chilca MTB
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Desafío La Chilca MTB',
        'desafio-la-chilca-mtb',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        'https://forms.gle/3drvPrN276LSnJiA9',
        NULL,
        'desafiolachilcamtb',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Desafío La Chilca MTB
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        catamarca_province_id,
        'Aconquija',
        'Aconquija, Catamarca, ARG',
        2026,
        '2026-02-08T12:00:00.000Z'::timestamp,
        NULL,
        '8358 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'desafio-la-chilca-mtb'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Desafío La Chilca MTB 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'desafio-la-chilca-mtb' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 21: Rural Bike Centenario
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Rural Bike Centenario',
        'rural-bike-centenario',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        'Individual',
        ARRAY['Individual'],
        'https://forms.gle/93GCkdFibriUREJs9',
        NULL,
        'rural.bike.centenario',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Rural Bike Centenario
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        neuqu_n_province_id,
        'Centenario',
        'Centenario, Neuquén, ARG',
        2026,
        '2026-02-14T12:00:00.000Z'::timestamp,
        NULL,
        '4020 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'rural-bike-centenario'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Rural Bike Centenario 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'rural-bike-centenario' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 22: Araucanía
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Araucanía',
        'araucania',
        'MTB / Gravel',
        ARRAY['MTB', 'Gravel'],
        'Rural',
        ARRAY['Rural'],
        'Individual & Dupla',
        ARRAY['Individual', 'Dupla'],
        NULL,
        NULL,
        NULL,
        '1164077596',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Araucanía
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        neuqu_n_province_id,
        'San Martín de los Andes',
        'San Martín de los Andes, Neuquén, ARG',
        2026,
        '2026-02-14T12:00:00.000Z'::timestamp,
        '2026-02-16T12:00:00.000Z'::timestamp,
        '726236 km',
        '9232m',
        3,
        3,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'araucania'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Araucanía 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'araucania' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        2,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'araucania' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        3,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'araucania' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 23: Emex Xco Circuito de la Rivera
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Emex Xco Circuito de la Rivera',
        'emex-xco-circuito-de-la-rivera',
        'MTB',
        ARRAY['MTB'],
        'XCO',
        ARRAY['XCO'],
        'Individual',
        ARRAY['Individual'],
        'https://cronometrajeinstantaneo.com/inscripciones/emex-xco-2026-circuito-de-la-rivera?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnuoKGlFJzVgiFP3ZhzbSszsSiTRMX2NVMEpebw2AoQ4QUKImnnPQWf45dMT4_aem_mL7p5zbwWQLxG2M9hH5rNg',
        NULL,
        'emex_cross',
        '1123998304 / 1168947010',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Emex Xco Circuito de la Rivera
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'Merlo',
        'Merlo, Bs. As., ARG',
        2026,
        '2026-02-14T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'emex-xco-circuito-de-la-rivera'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Emex Xco Circuito de la Rivera 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'emex-xco-circuito-de-la-rivera' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 24: Desafío Los Reartes
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Desafío Los Reartes',
        'desafio-los-reartes',
        'MTB',
        ARRAY['MTB'],
        'Por etapas',
        ARRAY['Por etapas'],
        'Individual & Dupla',
        ARRAY['Individual', 'Dupla'],
        'https://inscripciones.desafiolosreartes.com.ar/',
        'https://www.desafiolosreartes.com.ar/',
        'desafiolosreartes',
        '3546416299',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Desafío Los Reartes
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'Los Reartes',
        'Los Reartes, Córdoba, ARG',
        2026,
        '2026-02-15T12:00:00.000Z'::timestamp,
        '2026-02-17T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        3,
        3,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'desafio-los-reartes'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Desafío Los Reartes 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        'Escalada',
        '41',
        '1210',
        'Villa Gral Belgrano',
        'Villa Gral Belgrano',
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'desafio-los-reartes' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        2,
        'Senderos',
        'NaN',
        NULL,
        'Los Reartes',
        'Los Reartes',
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'desafio-los-reartes' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        3,
        'Marathon',
        '62',
        '1864',
        'Los Reartes',
        'Los Reartes',
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'desafio-los-reartes' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 25: Flatlands Race
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Flatlands Race',
        'flatlands-race',
        'MTB / Gravel',
        ARRAY['MTB', 'Gravel'],
        'Rural',
        ARRAY['Rural'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'arglandsrace',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Flatlands Race
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'San Andrés de Giles',
        'San Andrés de Giles, Bs. As., ARG',
        2026,
        '2026-02-15T12:00:00.000Z'::timestamp,
        NULL,
        '320 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'flatlands-race'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Flatlands Race 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'flatlands-race' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 26: Desafío San Esteban
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Desafío San Esteban',
        'desafio-san-esteban',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'desafio_san_esteban.mtb',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Desafío San Esteban
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'San Esteban',
        'San Esteban, Córdoba, ARG',
        2026,
        '2026-02-15T12:00:00.000Z'::timestamp,
        NULL,
        '44 km',
        '570m',
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'desafio-san-esteban'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Desafío San Esteban 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'desafio-san-esteban' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 27: Castelli Rural Bike Nocturna en Duplas
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Castelli Rural Bike Nocturna en Duplas',
        'castelli-rural-bike-nocturna-en-duplas',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        'Dupla',
        ARRAY['Dupla'],
        NULL,
        NULL,
        'desafiomtbchascomus',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Castelli Rural Bike Nocturna en Duplas
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'Castelli',
        'Castelli, Bs. As., ARG',
        2026,
        '2026-02-21T12:00:00.000Z'::timestamp,
        NULL,
        '5432 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'castelli-rural-bike-nocturna-en-duplas'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Castelli Rural Bike Nocturna en Duplas 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'castelli-rural-bike-nocturna-en-duplas' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 28: Vuelta a Villa Espil
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Vuelta a Villa Espil',
        'vuelta-a-villa-espil',
        'MTB / Gravel',
        ARRAY['MTB', 'Gravel'],
        'Rural',
        ARRAY['Rural'],
        'Individual & Dupla',
        ARRAY['Individual', 'Dupla'],
        NULL,
        NULL,
        'ciclismo_365',
        '2325415582',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Vuelta a Villa Espil
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'San Andrés de Giles',
        'San Andrés de Giles, Bs. As., ARG',
        2026,
        '2026-02-22T12:00:00.000Z'::timestamp,
        NULL,
        '644221 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'vuelta-a-villa-espil'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Vuelta a Villa Espil 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'vuelta-a-villa-espil' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 29: Campeonato Prov. MTB Jujuy - 1º fecha
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Campeonato Prov. MTB Jujuy - 1º fecha',
        'campeonato-prov-mtb-jujuy-1-fecha',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'cjmtb',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Campeonato Prov. MTB Jujuy - 1º fecha
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        jujuy_province_id,
        'Tilquiza',
        'Tilquiza, Jujuy, ARG',
        2026,
        '2026-02-22T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'campeonato-prov-mtb-jujuy-1-fecha'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Campeonato Prov. MTB Jujuy - 1º fecha 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'campeonato-prov-mtb-jujuy-1-fecha' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 30: Copa Argentina XCO - Round 1
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Copa Argentina XCO - Round 1',
        'copa-argentina-xco-round-1',
        'MTB',
        ARRAY['MTB'],
        'XCO',
        ARRAY['XCO'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'regionalpatagoniconorte',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Copa Argentina XCO - Round 1
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        neuqu_n_province_id,
        'Piedra del Aguila',
        'Piedra del Aguila, Neuquén, ARG',
        2026,
        '2026-02-22T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'copa-argentina-xco-round-1'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Copa Argentina XCO - Round 1 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'copa-argentina-xco-round-1' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 31: La Villa Bike Race
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'La Villa Bike Race',
        'la-villa-bike-race',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de La Villa Bike Race
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'Villa General Belgrano',
        'Villa General Belgrano, Córdoba, ARG',
        2026,
        '2026-03-01T12:00:00.000Z'::timestamp,
        NULL,
        '71 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'la-villa-bike-race'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de La Villa Bike Race 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'la-villa-bike-race' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 32: Carrera de los senderos
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Carrera de los senderos',
        'carrera-de-los-senderos',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual & Dupla',
        ARRAY['Individual', 'Dupla'],
        'https://docs.google.com/forms/d/e/1FAIpQLSc8-VcKKSvEgGvKuBTJs1vb36xUA9VdVHvVA59uT4V3bkzvZA/viewform',
        NULL,
        'carrera.margensur',
        '2995015679',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Carrera de los senderos
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        r_o_negro_province_id,
        'Fernández Oro',
        'Fernández Oro, Río Negro, ARG',
        2026,
        '2026-03-01T12:00:00.000Z'::timestamp,
        NULL,
        '45 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'carrera-de-los-senderos'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Carrera de los senderos 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'carrera-de-los-senderos' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 33: Ñandubay Challenge Rally Bike
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Ñandubay Challenge Rally Bike',
        'nandubay-challenge-rally-bike',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual & Dupla',
        ARRAY['Individual', 'Dupla'],
        'https://eventols.com/p/100k-nandubay-challenge',
        'www.odisseatr.com.ar/rallybike',
        'rally_mtb',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Ñandubay Challenge Rally Bike
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        entre_r_os_province_id,
        'María Grande',
        'María Grande, Entre Ríos, ARG',
        2026,
        '2026-03-01T12:00:00.000Z'::timestamp,
        NULL,
        '10035 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'nandubay-challenge-rally-bike'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Ñandubay Challenge Rally Bike 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'nandubay-challenge-rally-bike' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 34: Gran Fondo Mendoza
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Gran Fondo Mendoza',
        'gran-fondo-mendoza',
        'Ruta',
        ARRAY['Ruta'],
        'Ruta',
        ARRAY['Ruta'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        'https://granfondomendoza.com.ar/',
        'granfondomendoza',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Gran Fondo Mendoza
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        mendoza_province_id,
        'Mendoza',
        'Mendoza, Mendoza, ARG',
        2026,
        '2026-03-01T12:00:00.000Z'::timestamp,
        NULL,
        '11050 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'gran-fondo-mendoza'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Gran Fondo Mendoza 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'gran-fondo-mendoza' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 35: Rural Batán
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Rural Batán',
        'rural-batan',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'batan.bike',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Rural Batán
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'Batán',
        'Batán, Bs. As., ARG',
        2026,
        '2026-03-01T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'rural-batan'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Rural Batán 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'rural-batan' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 36: Kuntur Ñam
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Kuntur Ñam',
        'kuntur-nam',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        'https://docs.google.com/forms/d/e/1FAIpQLScpKQ1kvyj2LRz1xfHtJBXKN2Xd_ObAAAqc4wHOeE5O3WcoSw/viewform',
        NULL,
        'kuntur.nam.vy',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Kuntur Ñam
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'Villa Yacanto',
        'Villa Yacanto, Córdoba, ARG',
        2026,
        '2026-03-07T12:00:00.000Z'::timestamp,
        NULL,
        '7048 km',
        '1170m',
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'kuntur-nam'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Kuntur Ñam 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'kuntur-nam' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 37: Desafío Pan de Azúcar
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Desafío Pan de Azúcar',
        'desafio-pan-de-azucar',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        NULL,
        '(351) 599-8915',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Desafío Pan de Azúcar
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'Villa Allende',
        'Villa Allende, Córdoba, ARG',
        2026,
        '2026-03-08T12:00:00.000Z'::timestamp,
        NULL,
        '52 km',
        '860m',
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'desafio-pan-de-azucar'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Desafío Pan de Azúcar 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'desafio-pan-de-azucar' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 38: Gran Fondo Ciclorural Giles
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Gran Fondo Ciclorural Giles',
        'gran-fondo-ciclorural-giles',
        'MTB / Gravel',
        ARRAY['MTB', 'Gravel'],
        'Rural',
        ARRAY['Rural'],
        'Individual & Dupla & Equipo de 4',
        ARRAY['Individual', 'Dupla', 'Equipo de 4'],
        NULL,
        NULL,
        'ciclorural.arg',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Gran Fondo Ciclorural Giles
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'San Andrés de Giles',
        'San Andrés de Giles, Bs. As., ARG',
        2026,
        '2026-03-08T12:00:00.000Z'::timestamp,
        NULL,
        '13065 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'gran-fondo-ciclorural-giles'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Gran Fondo Ciclorural Giles 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'gran-fondo-ciclorural-giles' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 39: MTB KIÑEWN
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'MTB KIÑEWN',
        'mtb-kinewn',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        NULL,
        ARRAY[]::TEXT[],
        NULL,
        NULL,
        'grupokinewn',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de MTB KIÑEWN
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'Olavarría',
        'Olavarría, Bs. As., ARG',
        2026,
        '2026-03-08T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'mtb-kinewn'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de MTB KIÑEWN 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'mtb-kinewn' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 40: Juan Llerena - 1ra fecha San Luis
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Juan Llerena - 1ra fecha San Luis',
        'juan-llerena-1ra-fecha-san-luis',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'uniendopueblos.mtb.sanluis',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Juan Llerena - 1ra fecha San Luis
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        san_luis_province_id,
        NULL,
        'San Luis, ARG',
        2026,
        '2026-03-08T12:00:00.000Z'::timestamp,
        NULL,
        '7035 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'juan-llerena-1ra-fecha-san-luis'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Juan Llerena - 1ra fecha San Luis 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'juan-llerena-1ra-fecha-san-luis' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 41: Copa Argentina XCO - Round 2
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Copa Argentina XCO - Round 2',
        'copa-argentina-xco-round-2',
        'MTB',
        ARRAY['MTB'],
        'XCO',
        ARRAY['XCO'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'corredoresdemetanmtb',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Copa Argentina XCO - Round 2
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        salta_province_id,
        'Metan',
        'Metan, Salta, ARG',
        2026,
        '2026-03-09T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'copa-argentina-xco-round-2'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Copa Argentina XCO - Round 2 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'copa-argentina-xco-round-2' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 42: Desafío Move
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Desafío Move',
        'desafio-move',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        'https://esfuerzodeportivo.com/desafiomove2026',
        'desafiomove.com',
        'desafio.move',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Desafío Move
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        neuqu_n_province_id,
        'Huinganco',
        'Huinganco, Neuquén, ARG',
        2026,
        '2026-03-14T12:00:00.000Z'::timestamp,
        NULL,
        '75 km',
        '1500m',
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'desafio-move'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Desafío Move 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'desafio-move' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 43: El Reto
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'El Reto',
        'el-reto',
        'MTB / Gravel',
        ARRAY['MTB', 'Gravel'],
        'Rural',
        ARRAY['Rural'],
        'Individual',
        ARRAY['Individual'],
        'https://www.deportesydesafios.com.ar/pag.php?t=ev&e=714',
        NULL,
        'elreto.lapampa',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de El Reto
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        la_pampa_province_id,
        'General Pico',
        'General Pico, La Pampa, ARG',
        2026,
        '2026-03-15T12:00:00.000Z'::timestamp,
        NULL,
        '90603090 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'el-reto'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de El Reto 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'el-reto' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 44: L'Étape Argentina
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'L''Étape Argentina',
        'l-etape-argentina',
        'Ruta',
        ARRAY['Ruta'],
        'Ruta',
        ARRAY['Ruta'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de L'Étape Argentina
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'Córdoba',
        'Córdoba, Córdoba, ARG',
        2026,
        '2026-03-22T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'l-etape-argentina'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de L'Étape Argentina 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'l-etape-argentina' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 45: Desafío Cristo Rey del Valle
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Desafío Cristo Rey del Valle',
        'desafio-cristo-rey-del-valle',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'rally_cristodelvalletupungato',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Desafío Cristo Rey del Valle
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        mendoza_province_id,
        'Tupungato',
        'Tupungato, Mendoza, ARG',
        2026,
        '2026-03-22T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'desafio-cristo-rey-del-valle'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Desafío Cristo Rey del Valle 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'desafio-cristo-rey-del-valle' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 46: Rally de los 4 vientos
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Rally de los 4 vientos',
        'rally-de-los-4-vientos',
        'MTB / Gravel',
        ARRAY['MTB', 'Gravel'],
        'Rural',
        ARRAY['Rural'],
        'Individual',
        ARRAY['Individual'],
        'https://docs.google.com/forms/d/e/1FAIpQLSfAlAYfyr0Bg4myQOLOWEyT8nQ5CeogcWvpiRBadK4qqhvjfg/viewform?fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGn_N69dK2YHGjSkBGhPHDaZclBWhduXQoy5dlAqusEL1T3ig3Z3zzmIgECwjw_aem_NgJw3-0674tddyHg9XHeMQ',
        NULL,
        'ceresciclesclub',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Rally de los 4 vientos
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        santa_fe_province_id,
        'Ceres',
        'Ceres, Santa Fe, ARG',
        2026,
        '2026-03-22T12:00:00.000Z'::timestamp,
        NULL,
        '8040 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'rally-de-los-4-vientos'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Rally de los 4 vientos 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'rally-de-los-4-vientos' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 47: Vuela a Duggan
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Vuela a Duggan',
        'vuela-a-duggan',
        'MTB / Gravel',
        ARRAY['MTB', 'Gravel'],
        'Rural',
        ARRAY['Rural'],
        'Individual & Dupla',
        ARRAY['Individual', 'Dupla'],
        NULL,
        NULL,
        'vueltaduggan',
        '2325415582',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Vuela a Duggan
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'San Antonio de Areco',
        'San Antonio de Areco, Bs. As., ARG',
        2026,
        '2026-03-22T12:00:00.000Z'::timestamp,
        NULL,
        '703514 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'vuela-a-duggan'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Vuela a Duggan 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'vuela-a-duggan' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 48: Campeonato Prov. MTB Jujuy - 2º fecha
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Campeonato Prov. MTB Jujuy - 2º fecha',
        'campeonato-prov-mtb-jujuy-2-fecha',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'cjmtb',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Campeonato Prov. MTB Jujuy - 2º fecha
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        jujuy_province_id,
        NULL,
        'Jujuy, ARG',
        2026,
        '2026-03-22T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'campeonato-prov-mtb-jujuy-2-fecha'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Campeonato Prov. MTB Jujuy - 2º fecha 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'campeonato-prov-mtb-jujuy-2-fecha' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 49: MTB Race San Pedro - 1º fecha
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'MTB Race San Pedro - 1º fecha',
        'mtb-race-san-pedro-1-fecha',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        NULL,
        ARRAY[]::TEXT[],
        NULL,
        NULL,
        'entrepedales',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de MTB Race San Pedro - 1º fecha
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'San Pedro',
        'San Pedro, Bs. As., ARG',
        2026,
        '2026-03-29T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'mtb-race-san-pedro-1-fecha'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de MTB Race San Pedro - 1º fecha 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'mtb-race-san-pedro-1-fecha' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 50: Desafío de la muerte
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Desafío de la muerte',
        'desafio-de-la-muerte',
        'MTB / Gravel',
        ARRAY['MTB', 'Gravel'],
        'Rural',
        ARRAY['Rural'],
        'Individual',
        ARRAY['Individual'],
        'https://desafiodelamuerte.com/inscripcion-2026/',
        'desafiodelamuerte.com',
        'desafiodelamuerte',
        '2944100444',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Desafío de la muerte
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'Tandil',
        'Tandil, Bs. As., ARG',
        2026,
        '2026-03-29T12:00:00.000Z'::timestamp,
        NULL,
        '7238 km',
        '577m',
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'desafio-de-la-muerte'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Desafío de la muerte 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'desafio-de-la-muerte' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 51: VAC - Vuelta Altas Cumbres
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'VAC - Vuelta Altas Cumbres',
        'vac-vuelta-altas-cumbres',
        'MTB / Gravel',
        ARRAY['MTB', 'Gravel'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de VAC - Vuelta Altas Cumbres
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'Villa Cura Brochero',
        'Villa Cura Brochero, Córdoba, ARG',
        2026,
        '2026-03-29T12:00:00.000Z'::timestamp,
        NULL,
        '82120 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'vac-vuelta-altas-cumbres'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de VAC - Vuelta Altas Cumbres 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'vac-vuelta-altas-cumbres' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 52: Desafío Las Grutas
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Desafío Las Grutas',
        'desafio-las-grutas',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'crono_vazquez37',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Desafío Las Grutas
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        r_o_negro_province_id,
        'Las Grutas',
        'Las Grutas, Río Negro, ARG',
        2026,
        '2026-04-04T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'desafio-las-grutas'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Desafío Las Grutas 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'desafio-las-grutas' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 53: Circuito MTB - 1º fecha
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Circuito MTB - 1º fecha',
        'circuito-mtb-1-fecha',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'amigosdelmtb',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Circuito MTB - 1º fecha
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        entre_r_os_province_id,
        'Concordia',
        'Concordia, Entre Ríos, ARG',
        2026,
        '2026-04-11T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'circuito-mtb-1-fecha'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Circuito MTB - 1º fecha 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'circuito-mtb-1-fecha' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 54: Rally BTT en parejas
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Rally BTT en parejas',
        'rally-btt-en-parejas',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Dupla',
        ARRAY['Dupla'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Rally BTT en parejas
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'Tandil',
        'Tandil, Bs. As., ARG',
        2026,
        '2026-04-12T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'rally-btt-en-parejas'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Rally BTT en parejas 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'rally-btt-en-parejas' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 55: 100k de los Palmares
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        '100k de los Palmares',
        '100k-de-los-palmares',
        'MTB / Gravel / Ebike',
        ARRAY['MTB', 'Gravel', 'Ebike'],
        'Rally',
        ARRAY['Rally'],
        'Individual & Dupla',
        ARRAY['Individual', 'Dupla'],
        NULL,
        NULL,
        '100krallybike',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de 100k de los Palmares
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        entre_r_os_province_id,
        'Colón',
        'Colón, Entre Ríos, ARG',
        2026,
        '2026-04-12T12:00:00.000Z'::timestamp,
        NULL,
        '11647 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = '100k-de-los-palmares'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de 100k de los Palmares 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = '100k-de-los-palmares' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 56: Vuelta del Limón
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Vuelta del Limón',
        'vuelta-del-limon',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Dupla',
        ARRAY['Dupla'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Vuelta del Limón
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        tucum_n_province_id,
        'Tafí Viejo',
        'Tafí Viejo, Tucumán, ARG',
        2026,
        '2026-04-12T12:00:00.000Z'::timestamp,
        NULL,
        '3550 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'vuelta-del-limon'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Vuelta del Limón 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'vuelta-del-limon' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 57: Ciclorural San Andrés de Giles - 1º fecha
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Ciclorural San Andrés de Giles - 1º fecha',
        'ciclorural-san-andres-de-giles-1-fecha',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'ciclorural.arg',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Ciclorural San Andrés de Giles - 1º fecha
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'San Andrés de Giles',
        'San Andrés de Giles, Bs. As., ARG',
        2026,
        '2026-04-12T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'ciclorural-san-andres-de-giles-1-fecha'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Ciclorural San Andrés de Giles - 1º fecha 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'ciclorural-san-andres-de-giles-1-fecha' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 58: La Vuelta Alpa Corral
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'La Vuelta Alpa Corral',
        'la-vuelta-alpa-corral',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de La Vuelta Alpa Corral
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'Alpa Corral',
        'Alpa Corral, Córdoba, ARG',
        2026,
        '2026-04-12T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'la-vuelta-alpa-corral'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de La Vuelta Alpa Corral 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'la-vuelta-alpa-corral' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 59: Desafío Pisco Huasi
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Desafío Pisco Huasi',
        'desafio-pisco-huasi',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Desafío Pisco Huasi
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'San José de la Dormida',
        'San José de la Dormida, Córdoba, ARG',
        2026,
        '2026-04-19T12:00:00.000Z'::timestamp,
        NULL,
        '6842 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'desafio-pisco-huasi'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Desafío Pisco Huasi 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'desafio-pisco-huasi' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 60: Potrero de los Funes - 2da fecha San Luis
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Potrero de los Funes - 2da fecha San Luis',
        'potrero-de-los-funes-2da-fecha-san-luis',
        'MTB',
        ARRAY['MTB'],
        NULL,
        ARRAY[]::TEXT[],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'uniendopueblos.mtb.sanluis',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Potrero de los Funes - 2da fecha San Luis
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        san_luis_province_id,
        'Potrero de los Funes',
        'Potrero de los Funes, San Luis, ARG',
        2026,
        '2026-04-26T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'potrero-de-los-funes-2da-fecha-san-luis'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Potrero de los Funes - 2da fecha San Luis 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'potrero-de-los-funes-2da-fecha-san-luis' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 61: Desafío Río Pinto
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Desafío Río Pinto',
        'desafio-rio-pinto',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        'https://www.desafiopinto.com.ar/inscripcion.php',
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Desafío Río Pinto
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'La Cumbre',
        'La Cumbre, Córdoba, ARG',
        2026,
        '2026-05-03T12:00:00.000Z'::timestamp,
        NULL,
        '85 km',
        '1062m',
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'desafio-rio-pinto'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Desafío Río Pinto 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'desafio-rio-pinto' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 62: Copa Argentina XCO - Round 3
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Copa Argentina XCO - Round 3',
        'copa-argentina-xco-round-3',
        'MTB',
        ARRAY['MTB'],
        'XCO',
        ARRAY['XCO'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'xco.sanjuan',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Copa Argentina XCO - Round 3
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        san_juan_province_id,
        'El Zonda',
        'El Zonda, San Juan, ARG',
        2026,
        '2026-05-10T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'copa-argentina-xco-round-3'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Copa Argentina XCO - Round 3 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'copa-argentina-xco-round-3' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 63: Desafío al Arroyón
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Desafío al Arroyón',
        'desafio-al-arroyon',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'desafioal',
        '2996157004',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Desafío al Arroyón
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        r_o_negro_province_id,
        'Cinco Saltos',
        'Cinco Saltos, Río Negro, ARG',
        2026,
        '2026-05-10T12:00:00.000Z'::timestamp,
        NULL,
        '4525 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'desafio-al-arroyon'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Desafío al Arroyón 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'desafio-al-arroyon' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 64: Circuito MTB - 2º fecha
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Circuito MTB - 2º fecha',
        'circuito-mtb-2-fecha',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'amigosdelmtb',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Circuito MTB - 2º fecha
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        entre_r_os_province_id,
        'Concordia',
        'Concordia, Entre Ríos, ARG',
        2026,
        '2026-05-16T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'circuito-mtb-2-fecha'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Circuito MTB - 2º fecha 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'circuito-mtb-2-fecha' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 65: Rally Bike Anisacate
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Rally Bike Anisacate',
        'rally-bike-anisacate',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'rallybikeanisacate2026',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Rally Bike Anisacate
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'Anisacate',
        'Anisacate, Córdoba, ARG',
        2026,
        '2026-05-17T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'rally-bike-anisacate'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Rally Bike Anisacate 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'rally-bike-anisacate' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 66: Rally MTB Pilar
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Rally MTB Pilar',
        'rally-mtb-pilar',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual & Dupla',
        ARRAY['Individual', 'Dupla'],
        NULL,
        'www.rallymtbpilar.com.ar',
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Rally MTB Pilar
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'Pilar',
        'Pilar, Bs. As., ARG',
        2026,
        '2026-05-17T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'rally-mtb-pilar'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Rally MTB Pilar 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'rally-mtb-pilar' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 67: Campeonato Argentino de parejas
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Campeonato Argentino de parejas',
        'campeonato-argentino-de-parejas',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Dupla',
        ARRAY['Dupla'],
        NULL,
        NULL,
        'cjmtb',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Campeonato Argentino de parejas
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        jujuy_province_id,
        NULL,
        'Jujuy, ARG',
        2026,
        '2026-05-17T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'campeonato-argentino-de-parejas'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Campeonato Argentino de parejas 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'campeonato-argentino-de-parejas' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 68: Vuelta a Luján
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Vuelta a Luján',
        'vuelta-a-lujan',
        'MTB / Gravel / Tandem',
        ARRAY['MTB', 'Gravel', 'Tandem'],
        'Rural',
        ARRAY['Rural'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'desafioslujan',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Vuelta a Luján
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'Luján',
        'Luján, Bs. As., ARG',
        2026,
        '2026-05-24T12:00:00.000Z'::timestamp,
        NULL,
        '13010560 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'vuelta-a-lujan'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Vuelta a Luján 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'vuelta-a-lujan' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 69: Virorco Trapiche - 3ra fecha San Luis
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Virorco Trapiche - 3ra fecha San Luis',
        'virorco-trapiche-3ra-fecha-san-luis',
        'MTB',
        ARRAY['MTB'],
        NULL,
        ARRAY[]::TEXT[],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'uniendopueblos.mtb.sanluis',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Virorco Trapiche - 3ra fecha San Luis
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        san_luis_province_id,
        NULL,
        'San Luis, ARG',
        2026,
        '2026-05-24T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'virorco-trapiche-3ra-fecha-san-luis'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Virorco Trapiche - 3ra fecha San Luis 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'virorco-trapiche-3ra-fecha-san-luis' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 70: MTB Race San Pedro - 2º fecha
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'MTB Race San Pedro - 2º fecha',
        'mtb-race-san-pedro-2-fecha',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        NULL,
        ARRAY[]::TEXT[],
        NULL,
        NULL,
        'entrepedales',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de MTB Race San Pedro - 2º fecha
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'San Pedro',
        'San Pedro, Bs. As., ARG',
        2026,
        '2026-05-31T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'mtb-race-san-pedro-2-fecha'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de MTB Race San Pedro - 2º fecha 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'mtb-race-san-pedro-2-fecha' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 71: Desafío de las nubes
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Desafío de las nubes',
        'desafio-de-las-nubes',
        'MTB',
        ARRAY['MTB'],
        'XCM / Rural',
        ARRAY['XCM', 'Rural'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Desafío de las nubes
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        salta_province_id,
        'Salta',
        'Salta, Salta, ARG',
        2026,
        '2026-06-07T12:00:00.000Z'::timestamp,
        NULL,
        '35505080 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'desafio-de-las-nubes'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Desafío de las nubes 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'desafio-de-las-nubes' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 72: Ciclorural San Andrés de Giles - 2º fecha
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Ciclorural San Andrés de Giles - 2º fecha',
        'ciclorural-san-andres-de-giles-2-fecha',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'ciclorural.arg',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Ciclorural San Andrés de Giles - 2º fecha
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'San Andrés de Giles',
        'San Andrés de Giles, Bs. As., ARG',
        2026,
        '2026-06-20T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'ciclorural-san-andres-de-giles-2-fecha'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Ciclorural San Andrés de Giles - 2º fecha 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'ciclorural-san-andres-de-giles-2-fecha' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 73: Revancha a la Sierrita
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Revancha a la Sierrita',
        'revancha-a-la-sierrita',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        'https://forms.gle/2XPVLpdfq2G437T7A',
        NULL,
        'vueltaalasierrita',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Revancha a la Sierrita
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'Embalse',
        'Embalse, Córdoba, ARG',
        2026,
        '2026-06-21T12:00:00.000Z'::timestamp,
        NULL,
        '60 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'revancha-a-la-sierrita'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Revancha a la Sierrita 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'revancha-a-la-sierrita' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 74: Vuelta de los Bosques
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Vuelta de los Bosques',
        'vuelta-de-los-bosques',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        'Dupla',
        ARRAY['Dupla'],
        NULL,
        NULL,
        'tandil_btt',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Vuelta de los Bosques
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'Tandil',
        'Tandil, Bs. As., ARG',
        2026,
        '2026-06-28T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'vuelta-de-los-bosques'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Vuelta de los Bosques 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'vuelta-de-los-bosques' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 75: Trasyunga
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Trasyunga',
        'trasyunga',
        'MTB',
        ARRAY['MTB'],
        'XCM',
        ARRAY['XCM'],
        'Dupla & Equipo de 3',
        ARRAY['Dupla', 'Equipo de 3'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Trasyunga
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        jujuy_province_id,
        'San Pedro de Jujuy',
        'San Pedro de Jujuy, Jujuy, ARG',
        2026,
        '2026-07-19T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'trasyunga'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Trasyunga 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'trasyunga' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 76: Rural Bike La Criolla
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Rural Bike La Criolla',
        'rural-bike-la-criolla',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'amigosdelmtb',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Rural Bike La Criolla
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        entre_r_os_province_id,
        'Concordia',
        'Concordia, Entre Ríos, ARG',
        2026,
        '2026-08-08T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'rural-bike-la-criolla'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Rural Bike La Criolla 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'rural-bike-la-criolla' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 77: Vuelta al Via Crucis
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Vuelta al Via Crucis',
        'vuelta-al-via-crucis',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'vueltaalviacrucis',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Vuelta al Via Crucis
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'Las Albahacas',
        'Las Albahacas, Córdoba, ARG',
        2026,
        '2026-08-16T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'vuelta-al-via-crucis'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Vuelta al Via Crucis 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'vuelta-al-via-crucis' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 78: MTB Race San Pedro - 3º fecha
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'MTB Race San Pedro - 3º fecha',
        'mtb-race-san-pedro-3-fecha',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        NULL,
        ARRAY[]::TEXT[],
        NULL,
        NULL,
        'entrepedales',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de MTB Race San Pedro - 3º fecha
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'San Pedro',
        'San Pedro, Bs. As., ARG',
        2026,
        '2026-08-23T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'mtb-race-san-pedro-3-fecha'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de MTB Race San Pedro - 3º fecha 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'mtb-race-san-pedro-3-fecha' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 79: Duatlón La Cruz
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Duatlón La Cruz',
        'duatlon-la-cruz',
        'Duatlón de montaña',
        ARRAY['Duatlón de montaña'],
        NULL,
        ARRAY[]::TEXT[],
        'Individual & Dupla',
        ARRAY['Individual', 'Dupla'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Duatlón La Cruz
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'La Cruz',
        'La Cruz, Córdoba, ARG',
        2026,
        '2026-08-30T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'duatlon-la-cruz'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Duatlón La Cruz 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'duatlon-la-cruz' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 80: Rally Bike Calamuchita
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Rally Bike Calamuchita',
        'rally-bike-calamuchita',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual & Dupla',
        ARRAY['Individual', 'Dupla'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Rally Bike Calamuchita
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'Santa Rosa de Calamuchita',
        'Santa Rosa de Calamuchita, Córdoba, ARG',
        2026,
        '2026-09-06T12:00:00.000Z'::timestamp,
        NULL,
        '92 km',
        '1700m',
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'rally-bike-calamuchita'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Rally Bike Calamuchita 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'rally-bike-calamuchita' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 81: Campeonato Prov. MTB Jujuy - 3º fecha
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Campeonato Prov. MTB Jujuy - 3º fecha',
        'campeonato-prov-mtb-jujuy-3-fecha',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'cjmtb',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Campeonato Prov. MTB Jujuy - 3º fecha
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        jujuy_province_id,
        NULL,
        'Jujuy, ARG',
        2026,
        '2026-09-06T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'campeonato-prov-mtb-jujuy-3-fecha'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Campeonato Prov. MTB Jujuy - 3º fecha 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'campeonato-prov-mtb-jujuy-3-fecha' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 82: Abierto Argentino
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Abierto Argentino',
        'abierto-argentino',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'cjmtb',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Abierto Argentino
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        jujuy_province_id,
        NULL,
        'Jujuy, ARG',
        2026,
        '2026-09-06T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'abierto-argentino'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Abierto Argentino 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'abierto-argentino' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 83: Villa Larca - 4ta fecha San Luis
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Villa Larca - 4ta fecha San Luis',
        'villa-larca-4ta-fecha-san-luis',
        'MTB',
        ARRAY['MTB'],
        NULL,
        ARRAY[]::TEXT[],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'uniendopueblos.mtb.sanluis',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Villa Larca - 4ta fecha San Luis
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        san_luis_province_id,
        NULL,
        'San Luis, ARG',
        2026,
        '2026-09-06T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'villa-larca-4ta-fecha-san-luis'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Villa Larca - 4ta fecha San Luis 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'villa-larca-4ta-fecha-san-luis' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 84: Tucuman Epic
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Tucuman Epic',
        'tucuman-epic',
        'MTB',
        ARRAY['MTB'],
        'Por etapas',
        ARRAY['Por etapas'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Tucuman Epic
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        tucum_n_province_id,
        'San Javier',
        'San Javier, Tucumán, ARG',
        2026,
        '2026-09-11T12:00:00.000Z'::timestamp,
        '2026-09-13T12:00:00.000Z'::timestamp,
        '190 km',
        '5000m',
        3,
        3,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'tucuman-epic'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Tucuman Epic 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'tucuman-epic' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        2,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'tucuman-epic' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        3,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'tucuman-epic' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 85: Desafío Camino Real
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Desafío Camino Real',
        'desafio-camino-real',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Desafío Camino Real
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'Villa del Totoral',
        'Villa del Totoral, Córdoba, ARG',
        2026,
        '2026-09-13T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'desafio-camino-real'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Desafío Camino Real 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'desafio-camino-real' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 86: Circuito MTB - 3º fecha
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Circuito MTB - 3º fecha',
        'circuito-mtb-3-fecha',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'amigosdelmtb',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Circuito MTB - 3º fecha
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        entre_r_os_province_id,
        'Concordia',
        'Concordia, Entre Ríos, ARG',
        2026,
        '2026-09-19T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'circuito-mtb-3-fecha'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Circuito MTB - 3º fecha 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'circuito-mtb-3-fecha' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 87: Ciclorural San Andrés de Giles - 3º fecha
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Ciclorural San Andrés de Giles - 3º fecha',
        'ciclorural-san-andres-de-giles-3-fecha',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'ciclorural.arg',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Ciclorural San Andrés de Giles - 3º fecha
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'San Andrés de Giles',
        'San Andrés de Giles, Bs. As., ARG',
        2026,
        '2026-09-20T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'ciclorural-san-andres-de-giles-3-fecha'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Ciclorural San Andrés de Giles - 3º fecha 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'ciclorural-san-andres-de-giles-3-fecha' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 88: Trans Catamarca Épica Bikepacking
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Trans Catamarca Épica Bikepacking',
        'trans-catamarca-epica-bikepacking',
        'MTB / Gravel',
        ARRAY['MTB', 'Gravel'],
        'Por etapas',
        ARRAY['Por etapas'],
        'Individual & Dupla',
        ARRAY['Individual', 'Dupla'],
        'https://ecocatamarca.com.ar/trans-catamarca-epica-bikepacking-2026/',
        NULL,
        'ecocatamarcaok',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Trans Catamarca Épica Bikepacking
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        catamarca_province_id,
        'Catamarca',
        'Catamarca, Catamarca, ARG',
        2026,
        '2026-10-09T12:00:00.000Z'::timestamp,
        '2026-10-11T12:00:00.000Z'::timestamp,
        '415 km',
        '3000m',
        3,
        3,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'trans-catamarca-epica-bikepacking'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Trans Catamarca Épica Bikepacking 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'trans-catamarca-epica-bikepacking' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        2,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'trans-catamarca-epica-bikepacking' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        3,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'trans-catamarca-epica-bikepacking' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 89: Circuito MTB - 4º fecha
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Circuito MTB - 4º fecha',
        'circuito-mtb-4-fecha',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'amigosdelmtb',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Circuito MTB - 4º fecha
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        entre_r_os_province_id,
        'Concordia',
        'Concordia, Entre Ríos, ARG',
        2026,
        '2026-10-10T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'circuito-mtb-4-fecha'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Circuito MTB - 4º fecha 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'circuito-mtb-4-fecha' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 90: Rally de las Estancias
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Rally de las Estancias',
        'rally-de-las-estancias',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'rallydelasestancias',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Rally de las Estancias
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'Sinsacate',
        'Sinsacate, Córdoba, ARG',
        2026,
        '2026-10-11T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'rally-de-las-estancias'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Rally de las Estancias 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'rally-de-las-estancias' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 91: Gran Fondo Argentina
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Gran Fondo Argentina',
        'gran-fondo-argentina',
        'Ruta',
        ARRAY['Ruta'],
        NULL,
        ARRAY[]::TEXT[],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'granfondoargentina',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Gran Fondo Argentina
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'Capital Federal',
        'Capital Federal, Bs. As., ARG',
        2026,
        '2026-10-11T12:00:00.000Z'::timestamp,
        NULL,
        '124 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'gran-fondo-argentina'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Gran Fondo Argentina 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'gran-fondo-argentina' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 92: Rally Los Loros
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Rally Los Loros',
        'rally-los-loros',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'rallylosloros2025',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Rally Los Loros
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        r_o_negro_province_id,
        'Catriel',
        'Catriel, Río Negro, ARG',
        2026,
        '2026-10-11T12:00:00.000Z'::timestamp,
        NULL,
        '502515 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'rally-los-loros'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Rally Los Loros 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'rally-los-loros' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 93: Villa Mercedes - 5ta fecha San Luis
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Villa Mercedes - 5ta fecha San Luis',
        'villa-mercedes-5ta-fecha-san-luis',
        'MTB',
        ARRAY['MTB'],
        NULL,
        ARRAY[]::TEXT[],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'uniendopueblos.mtb.sanluis',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Villa Mercedes - 5ta fecha San Luis
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        san_luis_province_id,
        NULL,
        'San Luis, ARG',
        2026,
        '2026-10-18T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'villa-mercedes-5ta-fecha-san-luis'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Villa Mercedes - 5ta fecha San Luis 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'villa-mercedes-5ta-fecha-san-luis' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 94: Desafío Valle de la Luna
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Desafío Valle de la Luna',
        'desafio-valle-de-la-luna',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'desafiovalledelaluna',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Desafío Valle de la Luna
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        san_juan_province_id,
        'Ischigualasco',
        'Ischigualasco, San Juan, ARG',
        2026,
        '2026-10-24T12:00:00.000Z'::timestamp,
        NULL,
        '65 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'desafio-valle-de-la-luna'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Desafío Valle de la Luna 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'desafio-valle-de-la-luna' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 95: Doble Giulio Cesare
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Doble Giulio Cesare',
        'doble-giulio-cesare',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'doblegiuliocesare',
        '3544561964',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Doble Giulio Cesare
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        c_rdoba_province_id,
        'Mina Clavero',
        'Mina Clavero, Córdoba, ARG',
        2026,
        '2026-10-24T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'doble-giulio-cesare'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Doble Giulio Cesare 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'doble-giulio-cesare' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 96: Rally en las sierras de Tandil
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Rally en las sierras de Tandil',
        'rally-en-las-sierras-de-tandil',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'tandil_btt',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Rally en las sierras de Tandil
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'Tandil',
        'Tandil, Bs. As., ARG',
        2026,
        '2026-11-01T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'rally-en-las-sierras-de-tandil'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Rally en las sierras de Tandil 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'rally-en-las-sierras-de-tandil' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 97: Campeonato Prov. MTB Jujuy - 4º fecha
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Campeonato Prov. MTB Jujuy - 4º fecha',
        'campeonato-prov-mtb-jujuy-4-fecha',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'cjmtb',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Campeonato Prov. MTB Jujuy - 4º fecha
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        jujuy_province_id,
        NULL,
        'Jujuy, ARG',
        2026,
        '2026-11-01T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'campeonato-prov-mtb-jujuy-4-fecha'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Campeonato Prov. MTB Jujuy - 4º fecha 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'campeonato-prov-mtb-jujuy-4-fecha' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 98: MTB Race San Pedro - 4º fecha
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'MTB Race San Pedro - 4º fecha',
        'mtb-race-san-pedro-4-fecha',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        NULL,
        ARRAY[]::TEXT[],
        NULL,
        NULL,
        'entrepedales',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de MTB Race San Pedro - 4º fecha
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'San Pedro',
        'San Pedro, Bs. As., ARG',
        2026,
        '2026-11-01T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'mtb-race-san-pedro-4-fecha'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de MTB Race San Pedro - 4º fecha 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'mtb-race-san-pedro-4-fecha' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 99: Ciclorural San Andrés de Giles - 4º fecha
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Ciclorural San Andrés de Giles - 4º fecha',
        'ciclorural-san-andres-de-giles-4-fecha',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'ciclorural.arg',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Ciclorural San Andrés de Giles - 4º fecha
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        bs__as__province_id,
        'San Andrés de Giles',
        'San Andrés de Giles, Bs. As., ARG',
        2026,
        '2026-11-08T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'ciclorural-san-andres-de-giles-4-fecha'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Ciclorural San Andrés de Giles - 4º fecha 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'ciclorural-san-andres-de-giles-4-fecha' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 100: Vuelta al Trapiche - 6ta fecha San Luis
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Vuelta al Trapiche - 6ta fecha San Luis',
        'vuelta-al-trapiche-6ta-fecha-san-luis',
        'MTB',
        ARRAY['MTB'],
        'Rally',
        ARRAY['Rally'],
        'Individual',
        ARRAY['Individual'],
        NULL,
        NULL,
        'vueltaaltrapiche',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Vuelta al Trapiche - 6ta fecha San Luis
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        san_luis_province_id,
        'El Trapiche',
        'El Trapiche, San Luis, ARG',
        2026,
        '2026-11-15T12:00:00.000Z'::timestamp,
        '2026-11-16T12:00:00.000Z'::timestamp,
        NULL,
        NULL,
        2,
        2,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'vuelta-al-trapiche-6ta-fecha-san-luis'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Vuelta al Trapiche - 6ta fecha San Luis 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'vuelta-al-trapiche-6ta-fecha-san-luis' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        2,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'vuelta-al-trapiche-6ta-fecha-san-luis' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

    -- Carrera 101: Desafío Km 248
    INSERT INTO "Race" (id, name, slug, discipline, disciplines, format, formats, modality, modalities, "registrationUrl", website, instagram, "contactPhone", "isActive", "createdAt", "updatedAt")
    VALUES (
        gen_random_uuid(),
        'Desafío Km 248',
        'desafio-km-248',
        'MTB',
        ARRAY['MTB'],
        'Rural',
        ARRAY['Rural'],
        'Individual & Dupla',
        ARRAY['Individual', 'Dupla'],
        NULL,
        NULL,
        'amigosdelmtb',
        NULL,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        "updatedAt" = NOW();

    -- Edición 2026 de Desafío Km 248
    INSERT INTO "RaceEdition" (id, "raceId", "provinceId", city, location, year, "startDate", "endDate", distance, elevation, stages, days, "isActive", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        r.id,
        entre_r_os_province_id,
        'Concordia',
        'Concordia, Entre Ríos, ARG',
        2026,
        '2026-11-22T12:00:00.000Z'::timestamp,
        NULL,
        '7238 km',
        NULL,
        1,
        1,
        true,
        NOW(),
        NOW()
    FROM "Race" r
    WHERE r.slug = 'desafio-km-248'
    AND NOT EXISTS (
        SELECT 1 FROM "RaceEdition" re
        WHERE re."raceId" = r.id AND re.year = 2026
    );

    -- Etapas de Desafío Km 248 2026
    INSERT INTO "Stage" (id, "editionId", number, name, distance, elevation, "fromLocation", "toLocation", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid(),
        re.id,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NOW(),
        NOW()
    FROM "RaceEdition" re
    INNER JOIN "Race" r ON re."raceId" = r.id
    WHERE r.slug = 'desafio-km-248' AND re.year = 2026
    ON CONFLICT ("editionId", number) DO NOTHING;

END $$;

-- ============================================
-- MIGRACIÓN COMPLETADA
-- ============================================
