# Solución: Error de Conexión a Supabase

## 🔴 Problema

Prisma Migrate necesita una **conexión directa** a la base de datos, no el pooler (pgbouncer).

## ✅ Solución

En Supabase hay **dos tipos de URLs de conexión**:

### 1. Connection Pooling (para la app en producción)
- Usa `?pgbouncer=true`
- **NO funciona para migraciones**

### 2. Direct Connection (para migraciones)
- **NO usa pgbouncer**
- Es la que necesitas para `prisma migrate`

## 📝 Pasos para Corregir

### Opción 1: Usar Direct Connection en .env (Recomendado)

1. Ve a Supabase → **Settings** → **Database**
2. Busca la sección **Connection string**
3. Selecciona **URI** en el dropdown
4. **IMPORTANTE:** Asegúrate de que NO esté seleccionado "Session mode" o "Transaction mode"
5. Copia la URL que NO tenga `pgbouncer` en la ruta

La URL debería verse así:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

O mejor aún, usa la **Direct connection**:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Opción 2: Usar DIRECT_URL (Alternativa)

Si quieres mantener ambas URLs, puedes usar `DIRECT_URL`:

1. En tu `.env`, agrega:
```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

2. Actualiza `schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## 🔍 Cómo Encontrar la URL Correcta

En Supabase:

1. Ve a **Settings** → **Database**
2. Busca **Connection string**
3. Selecciona **URI**
4. **NO selecciones "Session mode"** - usa la conexión directa
5. La URL debería tener el formato:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

## ⚠️ Importante

- **Para migraciones:** Usa la conexión directa (puerto 5432, sin pgbouncer)
- **Para la app:** Puedes usar el pooler (puerto 6543, con pgbouncer)

## 🧪 Probar la Conexión

Una vez que actualices el `.env`, prueba:

```bash
npx prisma db pull
```

Si funciona, entonces puedes ejecutar:

```bash
npx prisma migrate dev --name init
```
