# Solución al Error de Conexión a Supabase

## 🔍 Problema
No se puede alcanzar el servidor de base de datos: `Can't reach database server at 'db.ucbbxrmosglszjjkzdkb.supabase.co:5432'`

## ✅ Soluciones

### 1. Verificar que el Proyecto esté Activo (MÁS PROBABLE)

Los proyectos gratuitos de Supabase se **pausan automáticamente** después de inactividad.

**Pasos:**
1. Ve a https://supabase.com/dashboard
2. Busca tu proyecto "MyRaceCal"
3. Si ves un estado "Paused" o "Inactive":
   - Haz clic en el proyecto
   - Busca un botón "Restore", "Resume" o "Unpause"
   - Haz clic y espera 2-5 minutos
4. Vuelve a probar la conexión

### 2. Obtener la URL de Conexión Correcta

1. **Ve a Settings → Database:**
   - En tu proyecto de Supabase
   - Ve a **Settings** (⚙️) → **Database**

2. **Busca "Connection string":**
   - Verás varias opciones:
     - **URI**: URL completa con contraseña
     - **Connection pooling**: Para aplicaciones con muchas conexiones
     - **Direct connection**: Para Prisma Migrate

3. **Para Prisma, usa la URL "Transaction" o "Session" mode:**
   ```
   postgresql://postgres:[TU_PASSWORD]@db.ucbbxrmosglszjjkzdkb.supabase.co:5432/postgres?pgbouncer=true
   ```

4. **O usa la URL directa (sin pgbouncer):**
   ```
   postgresql://postgres:[TU_PASSWORD]@db.ucbbxrmosglszjjkzdkb.supabase.co:5432/postgres
   ```

### 3. Verificar la Contraseña

1. **Ve a Settings → Database:**
2. Si cambiaste la contraseña:
   - Haz clic en **Reset database password**
   - Copia la nueva contraseña
   - Actualiza `DATABASE_URL` en `.env.local`

### 4. Verificar Firewall/Red

Si usas un firewall o VPN:
- Asegúrate de que el puerto 5432 esté permitido
- Prueba desactivar temporalmente el firewall
- Prueba desde otra red

### 5. Usar Connection Pooling

Si `pgbouncer=true` no funciona, prueba la URL directa:

```env
# En .env.local
DATABASE_URL="postgresql://postgres:TU_PASSWORD@db.ucbbxrmosglszjjkzdkb.supabase.co:5432/postgres"
```

## 🔧 Prueba Rápida

1. **Verifica el estado del proyecto:**
   - Dashboard → Busca "MyRaceCal"
   - Si está pausado, reactívalo

2. **Obtén la URL correcta:**
   - Settings → Database → Connection string
   - Copia la URL "Transaction" o "Session"

3. **Actualiza .env.local:**
   ```env
   DATABASE_URL="postgresql://postgres:TU_PASSWORD@db.ucbbxrmosglszjjkzdkb.supabase.co:5432/postgres?pgbouncer=true"
   ```

4. **Prueba la conexión:**
   ```bash
   npm run test:db
   ```

## 🚨 Si el Proyecto está Pausado

Los proyectos gratuitos se pausan después de ~1 semana de inactividad.

**Reactivar:**
1. Dashboard principal de Supabase
2. Busca "MyRaceCal"
3. Haz clic en "Restore" o "Resume"
4. Espera 2-5 minutos
5. Vuelve a probar

## 📝 Nota sobre pgbouncer

Tu URL actual tiene `pgbouncer=true&connection_limit=1`. Esto está bien para la aplicación, pero si tienes problemas:
- Prueba sin `pgbouncer=true` (conexión directa)
- O asegúrate de que el parámetro esté configurado correctamente
