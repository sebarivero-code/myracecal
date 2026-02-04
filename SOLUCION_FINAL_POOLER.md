# Solución Final para Error de Autenticación con Pooler

## 🔍 Diagnóstico

Si el formato de la URL es correcto según Supabase pero sigue dando error de autenticación, puede ser:

### 1. Restricciones de IP

Supabase puede tener restricciones de IP que bloquean conexiones.

**Verificar:**
- Settings → Database → Connection pooling
- Busca "IP restrictions" o "Network access"
- Agrega tu IP o desactívalas temporalmente

### 2. Session Pooler vs Transaction Pooler

El Transaction pooler tiene limitaciones que pueden causar problemas.

**Probar con Session pooler:**
1. Ve a Connection string en Supabase
2. Cambia de "Transaction" a "Session" pooler
3. Copia la URL
4. Prueba con esa URL

### 3. URL Encoding de Caracteres Especiales

Si la contraseña tiene caracteres especiales, deben estar URL-encoded.

**Solución:** Copia la URL completa desde Supabase (ya viene con encoding correcto).

### 4. Verificar Configuración del Pooler

En Supabase:
- Settings → Database → Connection pooling configuration
- Verifica que el pooler esté habilitado
- Verifica el "Pool Size" y "Max Client Connections"

## 💡 Solución Temporal: Usar Conexión Directa

Si el pooler sigue sin funcionar, usa conexión directa:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.ucbbxrmosglszjjkzdkb.supabase.co:5432/postgres"
```

**Nota:** Esto requiere que la conexión directa esté habilitada en Supabase (puede estar restringida en el plan gratuito).

## 🔧 Prueba de Formatos

Ejecuta el script para probar diferentes formatos:

```bash
node scripts/test-pooler-format.js
```

Esto probará:
- Usuario con punto: `postgres.ucbbxrmosglszjjkzdkb`
- Usuario sin punto: `postgres`
- Con parámetro `pgbouncer=true`

## 📋 Checklist Final

- [ ] URL tiene formato correcto según Supabase ✅
- [ ] Contraseña verificada manualmente ✅
- [ ] Archivo .env.local sin espacios extras
- [ ] Servidor reiniciado después de cambiar .env.local
- [ ] Restricciones de IP verificadas en Supabase
- [ ] Probado con Session pooler
- [ ] Probado con URL completa copiada desde Supabase
