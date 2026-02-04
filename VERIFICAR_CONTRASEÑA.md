# Verificar Contraseña - Transaction Pooler

## ✅ Formato Correcto (confirmado por Supabase)

Para "Transaction pooler" en Supabase, el formato correcto es:

```
postgresql://postgres.ucbbxrmosglszjjkzdkb:[YOUR-PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres
```

**El formato que tienes es correcto.** ✅

## 🔍 Posibles Problemas con la Contraseña

Si el formato es correcto pero sigue dando error de autenticación:

### 1. Verificar que copiaste la contraseña completa

- Asegúrate de copiar **toda** la contraseña
- No debe tener espacios al inicio o final
- Debe ser exactamente como aparece en Supabase

### 2. Usar la URL completa desde Supabase

**Recomendado:** En lugar de copiar solo la contraseña, copia la URL completa:

1. **Ve a Settings → Database → Connection string**
2. **Selecciona "Transaction pooler"**
3. **Haz clic en el botón de copiar** 📋
4. **Reemplaza `[YOUR-PASSWORD]` con tu contraseña actual**
   - O mejor aún: copia la URL después de que Supabase reemplace `[YOUR-PASSWORD]`

### 3. Verificar caracteres especiales

Si la contraseña tiene caracteres especiales (`@`, `#`, `%`, `&`, etc.), estos deben estar URL-encoded:
- Copiar la URL completa desde Supabase garantiza que están correctamente escapados

### 4. Resetear la contraseña nuevamente

Si cambiaste la contraseña pero sigue sin funcionar:

1. **Ve a Settings → Database**
2. **Haz clic en "Reset database password"**
3. **Copia la contraseña inmediatamente**
4. **Copia también la URL completa desde "Connection string"**
5. **Actualiza `.env.local`** con la URL completa

### 5. Verificar formato en .env.local

Asegúrate de que `.env.local` tenga el formato exacto:

```env
DATABASE_URL="postgresql://postgres.ucbbxrmosglszjjkzdkb:PASSWORD@aws-0-us-west-2.pooler.supabase.com:6543/postgres"
```

**Sin:**
- Espacios antes o después de las comillas
- Comillas simples (usa comillas dobles)
- Líneas adicionales o comentarios en la misma línea

## 🧪 Ejecutar Verificación

```bash
node scripts/test-password.js
```

Este script verificará:
- Longitud de la contraseña
- Caracteres especiales
- Formato de la URL
- Posibles problemas comunes

## 💡 Recomendación Final

**La forma más segura:**

1. Resetear contraseña en Supabase
2. Ir a Connection string → Transaction pooler
3. Copiar la URL completa (que ya incluye la contraseña reemplazada)
4. Pegarla directamente en `.env.local`

Esto asegura que todo el formato sea correcto.
