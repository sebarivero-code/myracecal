# Troubleshooting: Error de Conexión a Supabase

## 🔴 Error: "Can't reach database server"

Este error puede tener varias causas. Vamos a verificar paso a paso:

## ✅ Verificaciones

### 1. Verificar que el Proyecto esté Activo

1. Ve a [supabase.com](https://supabase.com) e inicia sesión
2. Verifica que tu proyecto esté en estado **"Active"** (no "Paused" ni "Inactive")
3. Si está pausado, haz clic en "Resume" o "Restore"

### 2. Verificar la Contraseña

La contraseña puede tener caracteres especiales que necesitan ser URL-encoded:

- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`

Si tu contraseña tiene alguno de estos caracteres, necesitas codificarlos en la URL.

### 3. Verificar Firewall/Red

- Asegúrate de que tu conexión a internet esté funcionando
- Algunas redes corporativas bloquean conexiones a bases de datos
- Prueba desde otra red si es posible

### 4. Verificar la URL en Supabase

1. Ve a **Settings** → **Database**
2. Busca **Connection string**
3. Selecciona **URI**
4. Asegúrate de copiar la URL completa
5. Verifica que el puerto sea **5432** (no 6543)

### 5. Probar Conexión Directa

Puedes probar conectarte usando `psql` o un cliente de PostgreSQL:

```bash
# Si tienes psql instalado
psql "postgresql://postgres:Qa6w5EkWlyIFvcRb@db.ucbbxrmosglszjjkzdkb.supabase.co:5432/postgres"
```

## 🔧 Soluciones Alternativas

### Opción 1: Usar Supabase CLI

```bash
# Instalar Supabase CLI
npm install -g supabase

# Iniciar sesión
supabase login

# Linkear proyecto
supabase link --project-ref ucbbxrmosglszjjkzdkb

# Ejecutar migraciones
npx prisma migrate dev --name init
```

### Opción 2: Verificar desde Supabase Dashboard

1. Ve a **Database** → **Connection pooling**
2. Verifica que el pooler esté activo
3. Intenta usar la URL del pooler temporalmente para verificar conexión

### Opción 3: Crear Tablas Manualmente

Si la conexión sigue fallando, podemos crear las tablas manualmente desde el SQL Editor de Supabase.

## 🧪 Prueba Rápida

Ejecuta este comando para verificar si Prisma puede leer las variables:

```bash
npx prisma db pull
```

Si este comando funciona, entonces el problema es específico de las migraciones.

## 📞 Siguiente Paso

Si ninguna de estas soluciones funciona, puede ser que:
1. El proyecto de Supabase necesite más tiempo para activarse
2. Haya un problema de red/firewall
3. La contraseña necesite encoding especial

En ese caso, podemos crear las tablas manualmente desde el SQL Editor de Supabase usando el SQL generado por Prisma.
