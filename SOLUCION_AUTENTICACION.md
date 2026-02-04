# Solución al Error de Autenticación

## ❌ Error Actual
```
Authentication failed against database server, the provided database credentials for 'postgres' are not valid.
```

## ✅ Solución: Resetear la Contraseña de la Base de Datos

### Paso 1: Obtener Nueva Contraseña en Supabase

1. **Ve a Settings → Database:**
   - En tu proyecto de Supabase
   - Ve a **Settings** (⚙️) en el menú lateral
   - Haz clic en **Database**

2. **Busca "Database password":**
   - Verás una sección que dice "Database password"
   - Haz clic en el botón **"Reset database password"**

3. **Copia la nueva contraseña:**
   - Se generará una nueva contraseña automáticamente
   - **IMPORTANTE:** Copia esta contraseña inmediatamente
   - Si la pierdes, tendrás que resetearla de nuevo

### Paso 2: Actualizar DATABASE_URL

Abre tu archivo `.env.local` y actualiza `DATABASE_URL` con la nueva contraseña:

**Formato actual (con pooler - aws-0-us-west-2):**
```env
DATABASE_URL="postgresql://postgres.ucbbxrmosglszjjkzdkb:NUEVA_PASSWORD@aws-0-us-west-2.pooler.supabase.com:6543/postgres"
```

**O si prefieres usar db.ucbbxrmosglszjjkzdkb:**
```env
DATABASE_URL="postgresql://postgres:NUEVA_PASSWORD@db.ucbbxrmosglszjjkzdkb.supabase.co:6543/postgres?pgbouncer=true"
```

### Paso 3: Probar la Conexión

```bash
npm run test:db
```

## 🔍 Obtener la URL Completa desde Supabase

Si prefieres copiar la URL completa:

1. **Ve a Settings → Database**
2. **Busca "Connection string"** o **"Connection pooling"**
3. Selecciona **"Transaction"** o **"Session"** mode
4. **Haz clic en el icono de copiar** 📋
5. La URL ya incluirá la contraseña correcta
6. Pégala directamente en `.env.local` como:
   ```env
   DATABASE_URL="[URL_COPIADA]"
   ```

## ⚠️ Nota Importante

- **NUNCA** compartas tu `.env.local` o la contraseña
- La contraseña es sensible a mayúsculas/minúsculas
- Si cambias la contraseña, actualiza `.env.local` inmediatamente

## 🧪 Verificar

Después de actualizar:

```bash
npm run test:db
```

Deberías ver:
```
✅ Conexión exitosa!
✅ Query exitosa!
   Países en la base de datos: X
```
