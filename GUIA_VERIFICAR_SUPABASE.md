# Guía para Verificar el Estado de Supabase

## 🔍 Cómo Verificar si tu Proyecto está Activo

### Opción 1: Desde el Dashboard Principal

1. **Ve al Dashboard de Supabase:**
   - Abre https://supabase.com/dashboard
   - Inicia sesión si es necesario

2. **Busca tu proyecto:**
   - En la lista de proyectos, busca "MyRaceCal"
   - El estado se muestra visualmente:
     - ✅ **Verde/Activo**: El proyecto está corriendo
     - ⏸️ **Pausado**: El proyecto está pausado (gratis se pausa después de inactividad)
     - ❌ **Error**: Hay un problema

3. **Si está pausado:**
   - Haz clic en el proyecto
   - Debería aparecer un botón para "Restore" o "Resume"

### Opción 2: Desde Settings → General

1. **Dentro de tu proyecto:**
   - Ve a **Settings** (⚙️) en el menú lateral
   - Haz clic en **General**

2. **Información del proyecto:**
   - Verás el nombre del proyecto
   - El "Reference ID" (necesario para la URL de conexión)
   - El estado del proyecto

### Opción 3: Probar la Conexión Directamente

Ejecuta el script de prueba:

```bash
node scripts/test-db-connection.js
```

Este script:
- ✅ Verifica que DATABASE_URL esté configurada
- ✅ Intenta conectar a la base de datos
- ✅ Prueba hacer queries simples
- ✅ Te dice exactamente qué está fallando

### Opción 4: Verificar desde la Terminal

Puedes probar la conexión directamente con psql (si lo tienes instalado):

```bash
psql "postgresql://postgres:TU_PASSWORD@db.ucbbxrmosglszjjkzdkb.supabase.co:5432/postgres"
```

Si conecta, el proyecto está activo. Si no, verás un error específico.

## 🚨 Problemas Comunes

### Proyecto Pausado (Free Tier)

Los proyectos gratuitos de Supabase se pausan automáticamente después de:
- 1 semana de inactividad
- O según la política de Supabase

**Solución:**
1. Ve al dashboard
2. Busca tu proyecto
3. Haz clic en "Restore" o "Resume"
4. Espera unos minutos a que se reactive

### URL de Conexión Incorrecta

Verifica que tu `DATABASE_URL` tenga el formato correcto:

```
postgresql://postgres:TU_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
```

Donde:
- `TU_PASSWORD`: La contraseña de la base de datos
- `PROJECT_REF`: El Reference ID de tu proyecto (ej: `ucbbxrmosglszjjkzdkb`)

### Contraseña Incorrecta

Si cambiaste la contraseña de la base de datos:
1. Ve a **Settings → Database**
2. Haz clic en **Reset database password**
3. Actualiza `DATABASE_URL` en `.env.local` con la nueva contraseña

## ✅ Verificación Rápida

La forma más rápida de verificar:

1. **Abre tu proyecto en Supabase Dashboard**
   - Si puedes ver las tablas, está activo ✅
   - Si ves un mensaje de "paused" o "inactive", está pausado ⏸️

2. **Ejecuta el script de prueba:**
   ```bash
   node scripts/test-db-connection.js
   ```

3. **Revisa los logs del servidor:**
   - Si ves errores `P1001`, no hay conexión
   - Si no hay errores, la conexión funciona
