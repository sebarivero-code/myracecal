# Solución al Error 500 en la Búsqueda de Carreras

## Problema
Al buscar una carrera en `/races/new`, se produce un error 500 en la API `/api/races/search`.

## Posibles Causas

### 1. Prisma Client no está generado
**Solución:**
```bash
npx prisma generate
```

### 2. Variable de entorno DATABASE_URL no configurada
**Solución:**
Asegúrate de tener un archivo `.env.local` en la raíz del proyecto con:
```
DATABASE_URL="postgresql://postgres:TU_PASSWORD@db.TU_PROYECTO.supabase.co:5432/postgres"
```

### 3. Base de datos no accesible
**Solución:**
- Verifica que la URL de conexión sea correcta
- Verifica que el proyecto de Supabase esté activo
- Verifica que la IP esté permitida en Supabase (si aplica)

## Verificación

1. **Verificar que Prisma Client esté generado:**
   ```bash
   ls node_modules/.prisma/client
   ```

2. **Verificar variables de entorno:**
   ```bash
   # En Windows PowerShell
   Get-Content .env.local | Select-String "DATABASE_URL"
   ```

3. **Probar conexión manualmente:**
   Crea un archivo `test-db.js`:
   ```javascript
   const { PrismaClient } = require('@prisma/client')
   const prisma = new PrismaClient()
   
   prisma.race.findMany({ take: 1 })
     .then(() => console.log('✅ Conexión exitosa'))
     .catch(err => console.error('❌ Error:', err))
     .finally(() => prisma.$disconnect())
   ```
   
   Ejecuta: `node test-db.js`

## Cambios Realizados

1. ✅ Mejorado el manejo de errores en `/api/races/search`
2. ✅ Agregada validación de DATABASE_URL
3. ✅ Mensajes de error más descriptivos
4. ✅ Mejorado el manejo de errores en el frontend
