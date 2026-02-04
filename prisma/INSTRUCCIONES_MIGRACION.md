# Instrucciones para Ejecutar la Migración

## ✅ Pasos Completados

1. ✅ Schema de Prisma generado desde el DER
2. ✅ Prisma 6 instalado (versión estable)

## 🔧 Pasos Siguientes

### 1. Configurar Variables de Entorno

Asegúrate de que tu archivo `.env.local` tenga:

```env
DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.[TU-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
GOOGLE_SHEET_URL="[TU-URL-DE-GOOGLE-SHEETS]"
```

**Importante:** Reemplaza:
- `[TU-PASSWORD]` con tu contraseña de Supabase
- `[TU-PROJECT-REF]` con la referencia de tu proyecto

### 2. Generar el Cliente de Prisma

```bash
npx prisma generate
```

Esto crea el cliente de Prisma basado en tu schema.

### 3. Crear la Migración Inicial

```bash
npx prisma migrate dev --name init
```

Este comando:
- Crea las tablas en Supabase según tu schema
- Genera los archivos de migración en `prisma/migrations/`
- Aplica los cambios a tu base de datos

**Nota:** Si te pide crear una base de datos nueva, escribe `N` (No) porque ya existe en Supabase.

### 4. Verificar que Funcionó

Puedes verificar que las tablas se crearon correctamente:

1. Ve a Supabase → **Table Editor**
2. Deberías ver todas las tablas:
   - User
   - Account
   - Session
   - UserPreferences
   - UserCalendar
   - Country
   - Province
   - Race
   - RaceEdition
   - Stage
   - RaceOrganizer
   - RaceReport

### 5. (Opcional) Abrir Prisma Studio

Para ver y editar datos visualmente:

```bash
npx prisma studio
```

Esto abre una interfaz web en `http://localhost:5555`

## 🚨 Si Hay Errores

### Error: "Environment variable not found: DATABASE_URL"
- Verifica que `.env.local` existe y tiene `DATABASE_URL`
- Reinicia el terminal después de crear/editar `.env.local`

### Error: "Can't reach database server"
- Verifica que la URL de conexión sea correcta
- Verifica que el proyecto de Supabase esté activo
- Verifica que la contraseña en la URL sea correcta

### Error: "relation already exists"
- Las tablas ya existen, puedes usar `npx prisma migrate reset` para borrarlas y empezar de nuevo (¡CUIDADO: borra todos los datos!)

## 📝 Próximos Pasos

Una vez que las tablas estén creadas:

1. **Migrar datos desde Google Sheets** (ver `MIGRACION_GOOGLE_SHEETS.md`)
2. **Crear datos iniciales** (países y provincias de Argentina)
3. **Actualizar el código de la app** para usar Prisma en lugar de Google Sheets

## 🔍 Verificar Schema

Para verificar que el schema está correcto (sin necesidad de conexión):

```bash
npx prisma format
npx prisma validate --schema=./prisma/schema.prisma
```
