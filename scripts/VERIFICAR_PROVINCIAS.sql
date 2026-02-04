-- Script para verificar los nombres exactos de las provincias en la base de datos
-- Ejecuta esto en Supabase SQL Editor para ver cómo están guardadas las provincias

SELECT 
    p.id,
    p.name as "Nombre Provincia",
    c.name as "País"
FROM "Province" p
INNER JOIN "Country" c ON p."countryId" = c.id
WHERE c.name = 'Argentina'
ORDER BY p.name;

-- Buscar específicamente Buenos Aires
SELECT 
    p.id,
    p.name as "Nombre Provincia",
    c.name as "País"
FROM "Province" p
INNER JOIN "Country" c ON p."countryId" = c.id
WHERE c.name = 'Argentina' 
AND (p.name LIKE '%Buenos%' OR p.name LIKE '%Bs%' OR p.name LIKE '%Aires%')
ORDER BY p.name;
