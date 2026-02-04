# Guía de Setup: Supabase + Prisma

## 📋 Pasos en Supabase

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) e inicia sesión
2. Haz clic en "New Project"
3. Completa el formulario:
   - **Name:** `myracecal` (o el nombre que prefieras)
   - **Database Password:** Genera una contraseña segura (guárdala, la necesitarás)
   - **Region:** Elige la región más cercana (ej: South America - São Paulo)
   - **Pricing Plan:** Free tier está bien para empezar
4. Haz clic en "Create new project"
5. Espera 2-3 minutos mientras se crea el proyecto

### 2. Obtener Credenciales de Conexión

Una vez que el proyecto esté listo:

1. Ve a **Settings** (icono de engranaje) → **Database**
2. Busca la sección **Connection string**
3. Selecciona **URI** en el dropdown
4. Copia la **Connection string** (tiene este formato):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
5. **IMPORTANTE:** Reemplaza `[YOUR-PASSWORD]` con la contraseña que creaste en el paso 1
6. Guarda esta URL completa, la necesitarás para el `.env.local`

### 3. Habilitar UUID Extension (Opcional pero Recomendado)

1. Ve a **SQL Editor** en el menú lateral
2. Haz clic en "New query"
3. Ejecuta este comando:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```
4. Haz clic en "Run" (o presiona Ctrl+Enter)

Esto habilita la generación de UUIDs que usaremos en las tablas.

## 🔧 Pasos en el Proyecto Local

### 4. Instalar Dependencias

Asegúrate de tener Prisma instalado:

```bash
npm install prisma @prisma/client
```

### 5. Configurar Variables de Entorno

Crea o actualiza el archivo `.env.local` en la raíz del proyecto:

```env
# Supabase Database URL
DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.[TU-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# Google Sheets (mantener por ahora para migración)
GOOGLE_SHEET_URL="https://docs.google.com/spreadsheets/d/[TU-SHEET-ID]/edit#gid=0"
```

**Nota:** Reemplaza:
- `[TU-PASSWORD]` con la contraseña de la base de datos
- `[TU-PROJECT-REF]` con la referencia de tu proyecto Supabase
- `[TU-SHEET-ID]` con el ID de tu Google Sheet actual

### 6. Verificar Prisma está Configurado

El archivo `prisma/schema.prisma` debería existir. Si no, lo crearemos en el siguiente paso.

## ✅ Siguiente Paso

Una vez completados estos pasos, avísame y:
1. Generaré el schema completo de Prisma desde el DER
2. Crearemos las migraciones iniciales
3. Ejecutaremos las migraciones en Supabase

---

## 🔍 Cómo Encontrar tu Project Reference

Si no encuentras el Project Reference en la URL de conexión:

1. Ve a **Settings** → **General**
2. Busca **Reference ID** - ese es tu `[PROJECT-REF]`

## 🛠️ Troubleshooting

### Error: "password authentication failed"
- Verifica que reemplazaste `[YOUR-PASSWORD]` en la URL de conexión
- La contraseña puede tener caracteres especiales que necesitan ser URL-encoded

### Error: "connection refused"
- Verifica que el proyecto de Supabase esté completamente creado (puede tardar unos minutos)
- Verifica que la región sea correcta

### Error: "extension uuid-ossp does not exist"
- Ejecuta el comando SQL del paso 3 para habilitar la extensión
