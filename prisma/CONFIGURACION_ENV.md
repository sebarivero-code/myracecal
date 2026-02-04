# Configuración del archivo .env

## ✅ Para Prisma Migrate (LO QUE NECESITAS AHORA)

Solo necesitas **DIRECT_URL** para las migraciones. Es la conexión directa sin pooler.

### Cómo obtenerla en Supabase:

1. Ve a **Settings** → **Database**
2. Busca **Connection string**
3. Selecciona **URI**
4. **IMPORTANTE:** Asegúrate de que esté en modo **"Direct connection"** (no "Session mode" ni "Transaction mode")
5. Copia la URL completa

La URL debería verse así:
```
postgresql://postgres:[TU-PASSWORD]@db.ucbbxrmosglszjjkzdkb.supabase.co:5432/postgres
```

### Tu archivo .env debería tener:

```env
# Para migraciones (OBLIGATORIO)
DIRECT_URL="postgresql://postgres:[TU-PASSWORD]@db.ucbbxrmosglszjjkzdkb.supabase.co:5432/postgres"

# Para la app (OPCIONAL por ahora)
DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.ucbbxrmosglszjjkzdkb.supabase.co:5432/postgres"
```

**Nota:** Por ahora puedes usar la misma URL en ambas. La diferencia es que:
- `DIRECT_URL` es para migraciones (sin pooler)
- `DATABASE_URL` es para la app (puede usar pooler después)

## 🔍 Ejemplo Real

Si tu URL de conexión directa es:
```
postgresql://postgres:MiPassword123@db.ucbbxrmosglszjjkzdkb.supabase.co:5432/postgres
```

Entonces tu `.env` sería:
```env
DIRECT_URL="postgresql://postgres:MiPassword123@db.ucbbxrmosglszjjkzdkb.supabase.co:5432/postgres"
DATABASE_URL="postgresql://postgres:MiPassword123@db.ucbbxrmosglszjjkzdkb.supabase.co:5432/postgres"
```

## ⚠️ Importante

- **NO necesitas [REGION]** - eso solo aplica si usas la URL con pooler
- **Solo reemplaza [TU-PASSWORD]** con tu contraseña real
- La URL directa siempre tiene el formato: `db.[PROJECT-REF].supabase.co:5432`

## 📝 Pasos

1. Ve a Supabase → Settings → Database
2. Copia la URL de "Direct connection"
3. Pégala en tu `.env` como `DIRECT_URL`
4. Ejecuta: `npx prisma migrate dev --name init`
