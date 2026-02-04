# Solución al Error de Formato de URL

## 🔍 Problema Detectado

Tu `DATABASE_URL` tiene:
```
postgresql://postgres.ucbbxrmosglszjjkzdkb:[PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres
```

**El problema:** El usuario es `postgres.ucbbxrmosglszjjkzdkb` pero debería ser solo `postgres`.

## ✅ Solución: Obtener la URL Correcta desde Supabase

### Paso 1: Ir a Connection String en Supabase

1. **Ve a Settings → Database**
2. **Busca "Connection string"** o **"Connection pooling"**
3. **Selecciona el modo "Transaction" o "Session"**
4. **Haz clic en el icono de copiar** 📋

La URL que copias debería verse así:

**Para Pooler:**
```
postgresql://postgres:[PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres
```

**Para Conexión Directa:**
```
postgresql://postgres:[PASSWORD]@db.ucbbxrmosglszjjkzdkb.supabase.co:6543/postgres?pgbouncer=true
```

**Nota:** El usuario debe ser `postgres`, NO `postgres.ucbbxrmosglszjjkzdkb`

### Paso 2: Actualizar .env.local

Pega la URL completa que copiaste desde Supabase:

```env
DATABASE_URL="[URL_COPIADA_DE_SUPABASE]"
```

### Paso 3: Verificar

Ejecuta el script de verificación:

```bash
node scripts/verificar-url.js
```

Luego prueba la conexión:

```bash
npm run test:db
```

## 🚨 Nota sobre Contraseñas

Si la contraseña tiene caracteres especiales (`@`, `#`, `%`, `&`, etc.), estos deben estar **URL-encoded** en la conexión string:

- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`

**Solución:** Copia la URL completa desde Supabase (ya viene con los caracteres correctamente escapados).
