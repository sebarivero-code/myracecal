# Cómo Ejecutar la Migración

## ✅ Requisitos Previos

1. ✅ Tablas creadas en Supabase
2. ✅ Países y provincias creados
3. ✅ Archivo `.env` configurado con `DATABASE_URL` y `GOOGLE_SHEET_URL`
4. ✅ Cliente de Prisma generado (`npx prisma generate`)

## 🚀 Ejecutar la Migración

### Opción 1: Usando npm script (Recomendado)

```bash
npm run migrate:sheets
```

### Opción 2: Usando tsx directamente

```bash
npx tsx scripts/migrate-from-sheets.ts
```

## 📊 Qué Hace el Script

1. **Lee datos desde Google Sheets** usando la URL en `GOOGLE_SHEET_URL`
2. **Crea países únicos** (si no existen) - usa `upsert` así que es seguro ejecutarlo múltiples veces
3. **Crea provincias únicas** (si no existen) - mismo caso
4. **Para cada fila del CSV:**
   - Crea una **Race** (carrera base)
   - Crea una **RaceEdition** (edición de esa carrera)
   - Crea **Stages** (si la edición tiene etapas)

## ⚠️ Comportamiento con Duplicados

- **Carreras:** Si una carrera ya existe (por slug), usa la existente
- **Ediciones:** Si una edición ya existe (misma carrera + mismo año), la salta
- **Países/Provincias:** Usa `upsert`, así que es seguro ejecutar múltiples veces

## 📝 Salida del Script

El script mostrará:
- ✅ Carreras creadas
- ✅ Ediciones creadas
- ✅ Etapas creadas
- ⚠️ Advertencias (datos faltantes, provincias no encontradas, etc.)
- ✗ Errores (si los hay)
- 📊 Resumen final con estadísticas

## 🔍 Verificar Resultados

Después de ejecutar el script:

1. Ve a Supabase → **Table Editor**
2. Verifica las tablas:
   - **Race**: Debería tener todas las carreras
   - **RaceEdition**: Debería tener todas las ediciones
   - **Stage**: Debería tener todas las etapas (si las hay)

## 🐛 Si Hay Errores

El script mostrará qué fila causó el error y por qué. Revisa:
- Si falta provincia/país en alguna fila
- Si hay datos inválidos (fechas, etc.)
- Si hay problemas de conexión a Supabase

## 🔄 Re-ejecutar

Es seguro ejecutar el script múltiples veces:
- No creará duplicados (usa `upsert` y verifica existencia)
- Solo insertará carreras/ediciones que no existan
