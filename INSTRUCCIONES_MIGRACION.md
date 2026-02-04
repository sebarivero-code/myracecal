# Instrucciones para Migración Correcta de Datos

## ⚠️ IMPORTANTE: Borrar Datos Existentes Primero

Antes de migrar, **DEBES borrar todos los datos** de las tablas en Supabase:

1. Abre Supabase SQL Editor
2. Ejecuta el contenido de `scripts/truncate-all-tables.sql`
3. Verifica que las tablas estén vacías

## 📋 Pasos de Migración

### Paso 1: Migrar Carreras desde Pestaña "Carreras"

```bash
npm run migrate:races-carreras
```

Este script:
- Lee todas las carreras de la pestaña "Carreras" (GID: 182926104)
- Mapea correctamente las columnas (A=nombre, C=disciplina, etc.)
- Crea todas las carreras en la tabla `Race`
- Usa slug basado en el nombre (sin duplicados por ID)

### Paso 2: Migrar Ediciones desde Pestaña "2026"

```bash
npm run migrate:editions-2026
```

Este script:
- Lee todas las ediciones de la pestaña "2026"
- Matchea ediciones con carreras por nombre (columna C de "2026" = columna A de "Carreras")
- Crea `RaceEdition` vinculadas a las `Race` existentes
- Crea `Stage` para ediciones multi-etapa
- Asocia a provincias correctamente

## 📊 Estructura de Columnas

### Pestaña "Carreras":
- **A**: Nombre de la carrera
- **C**: Disciplina
- **D**: Formato
- **E**: Localidad
- **F**: Provincia
- **G**: País
- **H**: Modalidad
- **I**: Campeonato
- **J**: Cantidad de etapas
- **L**: Distancia
- **M**: Altimetría
- **N**: Instagram
- **O**: Teléfono
- **P**: Sitio
- **Q**: URL de inscripción

### Pestaña "2026":
- **B**: Fecha
- **C**: Nombre de la carrera (para matchear)
- **E**: Disciplina
- **F**: Formato
- **G**: Localidad
- **H**: Provincia
- **I**: País
- **J**: Modalidad
- **K**: Campeonato
- **L**: Cantidad de etapas
- **N**: Distancia
- **O**: Altimetría
- **P**: Instagram
- **Q**: Teléfono
- **R**: Sitio web
- **S**: Link de inscripción
- **T+**: Info de etapas (FROM, TO, etc.)
