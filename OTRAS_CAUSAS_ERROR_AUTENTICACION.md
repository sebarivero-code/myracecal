# Otras Posibles Causas del Error de Autenticación

## 🔍 Si la Contraseña es Correcta pero Sigue Fallando

### 1. Restricciones de IP en Supabase

Supabase puede tener restricciones de IP activadas.

**Verificar:**
1. Ve a **Settings → Database**
2. Busca **"Connection pooling"** o **"Network restrictions"**
3. Verifica si hay restricciones de IP activas
4. Si las hay, agrega tu IP o desactívalas temporalmente

### 2. Caracteres Especiales en la Contraseña (URL Encoding)

Si la contraseña tiene caracteres especiales, pueden necesitar URL encoding:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`

**Solución:** Copia la URL completa desde Supabase (ya viene con encoding correcto).

### 3. Problemas con el Pooler Transaction Mode

El Transaction pooler tiene limitaciones:
- No soporta PREPARE statements
- Puede tener restricciones específicas

**Probar con Session pooler:**
1. Ve a Connection string en Supabase
2. Cambia de "Transaction" a "Session" pooler
3. Copia la nueva URL
4. Pruébala

### 4. Probar Conexión Directa

Puedes probar con conexión directa (sin pooler) para verificar si el problema es del pooler:

```bash
node scripts/test-direct-connection.js
```

Si la conexión directa funciona, el problema está en el pooler.

**URL directa:**
```env
DATABASE_URL="postgresql://postgres:PASSWORD@db.ucbbxrmosglszjjkzdkb.supabase.co:5432/postgres"
```

### 5. Verificar Encoding del Archivo .env.local

A veces los archivos `.env` tienen problemas de encoding (UTF-8 vs Windows-1252).

**Solución:**
1. Abre `.env.local` en un editor de texto simple (Notepad++, VS Code)
2. Verifica que el encoding sea UTF-8
3. Guarda como UTF-8 sin BOM

### 6. Verificar Comillas en .env.local

Asegúrate de que las comillas sean las correctas:

**✅ Correcto:**
```env
DATABASE_URL="postgresql://..."
```

**❌ Incorrecto:**
```env
DATABASE_URL='postgresql://...'  # Comillas simples
DATABASE_URL=postgresql://...    # Sin comillas
DATABASE_URL = "postgresql://..." # Espacios alrededor del =
```

### 7. Reiniciar Servidor Después de Cambiar .env.local

Los cambios en `.env.local` solo se cargan al iniciar el servidor:

1. **Detén el servidor** (`Ctrl+C`)
2. **Reinicia:** `npm run dev`
3. **Prueba de nuevo**

### 8. Verificar Variable en Runtime

Puedes verificar qué URL está leyendo realmente el código:

```bash
node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env.DATABASE_URL)"
```

Esto mostrará exactamente qué URL está leyendo Node.js.

## 🧪 Pruebas Recomendadas

1. **Probar conexión directa:**
   ```bash
   node scripts/test-direct-connection.js
   ```

2. **Verificar URL que lee Node.js:**
   ```bash
   node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'))"
   ```

3. **Probar con Session pooler en lugar de Transaction**

4. **Verificar restricciones de IP en Supabase**

## 💡 Recomendación

Si nada funciona, prueba usar la conexión **directa** (puerto 5432, sin pooler) que es más simple y funciona mejor con Prisma:

```env
DATABASE_URL="postgresql://postgres:PASSWORD@db.ucbbxrmosglszjjkzdkb.supabase.co:5432/postgres"
```
