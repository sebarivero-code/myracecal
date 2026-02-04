# Verificación de URLs de Conexión

## ⚠️ IMPORTANTE: Diferencias entre URLs

### `DATABASE_URL` (para la aplicación Next.js)
- **Puerto:** `6543` (pooler/pgbouncer)
- **Formato:** `postgresql://postgres.PROYECTO:[PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres`
- **Uso:** Para la aplicación en producción/desarrollo
- **No soporta prepared statements** - pero la app usa queries normales de Prisma

### `DIRECT_URL` (para scripts y migraciones)
- **Puerto:** `5432` (conexión directa)
- **Formato:** `postgresql://postgres:[PASSWORD]@db.PROYECTO.supabase.co:5432/postgres`
- **Uso:** Para scripts de migración, Prisma Migrate, etc.
- **Soporta prepared statements** - necesario para algunas operaciones de Prisma

## ✅ Configuración Correcta

```env
# Para la aplicación (pooler)
DATABASE_URL="postgresql://postgres.ucbbxrmosglszjjkzdkb:[PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres"

# Para scripts/migraciones (directa)
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.ucbbxrmosglszjjkzdkb.supabase.co:5432/postgres"
```

## 🔍 Cómo obtener la URL directa en Supabase

1. Ve a **Supabase Dashboard** → Tu proyecto
2. **Settings** → **Database**
3. En **Connection string**, selecciona **"Direct connection"** (no "Transaction pooler")
4. Copia la URL que aparece
5. Úsala como `DIRECT_URL` en `.env`

## 📝 Nota

El script `migrate-races-without-2026-edition.ts` ahora usa `$queryRawUnsafe` para evitar prepared statements, pero aún es recomendable usar `DIRECT_URL` con puerto 5432 para mayor compatibilidad.
