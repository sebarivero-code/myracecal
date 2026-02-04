# 🔧 Corregir DATABASE_URL

## ❌ Problema Actual

Tu `DATABASE_URL` tiene:
```
postgresql://...@db.ucbbxrmosglszjjkzdkb.supabase.co:5432/...?pgbouncer=true
```

**Problema:** Estás usando `pgbouncer=true` pero el puerto es `5432` (directo). 
Pgbouncer usa el puerto **6543**, no 5432.

## ✅ Soluciones

### Opción 1: Usar Connection Pooling (Recomendado)

En `.env.local`, cambia `DATABASE_URL` a:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@db.ucbbxrmosglszjjkzdkb.supabase.co:6543/postgres?pgbouncer=true"
```

**Nota:** Cambia el puerto de `5432` a `6543`

### Opción 2: Usar Conexión Directa

Si prefieres conexión directa, quita `pgbouncer=true`:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@db.ucbbxrmosglszjjkzdkb.supabase.co:5432/postgres"
```

**Nota:** Sin `pgbouncer=true` y con puerto `5432`

## 📝 Cómo Obtener la URL Correcta en Supabase

1. Ve a **Settings → Database**
2. Busca **"Connection string"** o **"Connection pooling"**
3. Selecciona **"Transaction"** o **"Session"** mode
4. Copia la URL que muestra
5. Debería tener el puerto **6543** si es para pooling

## 🧪 Probar la Conexión

Después de corregir la URL:

```bash
npm run test:db
```
