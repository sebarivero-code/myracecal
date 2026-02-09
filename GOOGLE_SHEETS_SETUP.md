# 📊 Configuración de Google Sheets

Esta guía te ayudará a configurar tu Google Sheet para que la aplicación lea los datos directamente.

## 📋 Paso 1: Preparar tu Google Sheet

1. **Abre tu Google Sheet** con las carreras de ciclismo
2. **Asegúrate de que la primera fila** contenga los nombres de las columnas
3. **Verifica que tengas al menos estas columnas:**
   - Nombre (o name)
   - Ubicación (o location)
   - Fecha Inicio (o startDate)
   - Disciplina (o discipline)

## 📋 Paso 2: Acceso a la planilla (dos opciones)

### Opción A: Planilla pública (más simple)

Para que la aplicación pueda leer los datos sin configuración extra:

1. **Haz clic en "Compartir"** (botón azul arriba a la derecha)
2. **En "Obtener enlace"**, selecciona:
   - **"Cualquier usuario con el enlace"**
   - **Rol: "Lector"**
3. **Copia la URL** que aparece

Cualquiera con el enlace podrá ver la planilla. Si querés que solo la app (y vos) la vea, usá la Opción B.

### Opción B: Planilla restringida con cuenta de servicio (recomendado si no querés que cualquiera vea la planilla)

La app puede leer la planilla usando un "usuario robot" (cuenta de servicio). Así podés poner la planilla en **"Restringido"** o **"Solo personas añadidas"** y compartirla solo con ese robot.

1. **Crear la cuenta de servicio** (en el mismo proyecto de Google Cloud donde tenés OAuth para el login, o en uno nuevo):
   - Entrá a [Google Cloud Console](https://console.cloud.google.com/) → tu proyecto → **APIs y servicios** → **Biblioteca** → buscá **Google Sheets API** → habilitarla si no está
   - Luego **Credenciales**
   - **Crear credenciales** → **Cuenta de servicio**
   - Nombre (ej. "agendabiker-sheets") → Crear → podés saltar permisos → Listo
   - En la lista, hacé clic en la cuenta creada → pestaña **Claves** → **Añadir clave** → **Crear clave nueva** → JSON → Descargar

2. **Compartir la planilla solo con el robot**:
   - Abrí el JSON descargado. Necesitás dos valores: `client_email` y `private_key`
   - En la planilla: **Compartir** → añadí el **client_email** (ej. `agendabiker-sheets@tu-proyecto.iam.gserviceaccount.com`) con rol **Lector**
   - Podés quitar "Cualquier usuario con el enlace" y dejar solo ese email (y el tuyo)

3. **Configurar las variables en el proyecto** (ver Paso 3): añadí en `.env.local` (o en las variables de tu hosting):
   - `GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL` = el `client_email` del JSON
   - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` = el `private_key` del JSON (entero, entre comillas; los `\n` se dejan como están o se pasan como nueva línea real según cómo lea tu hosting)

Después de esto, la app leerá la planilla por API y nadie más podrá abrirla sin que vos les des acceso.

## 📋 Paso 3: Configurar la URL en el Proyecto

1. **Crea un archivo `.env.local`** en la raíz del proyecto (`C:\app\.env.local`)

2. **Agrega la URL de tu Google Sheet:**
   ```env
   GOOGLE_SHEET_URL="https://docs.google.com/spreadsheets/d/TU_SHEET_ID/edit#gid=0"
   ```

3. **Reemplaza `TU_SHEET_ID`** con el ID real de tu planilla

   El ID es la parte larga que aparece en la URL, por ejemplo:
   ```
   https://docs.google.com/spreadsheets/d/1ABC123xyz456/edit#gid=0
                                    ↑ Este es el ID ↑
   ```

## 📋 Paso 4: Reiniciar el Servidor

Si el servidor está corriendo, reinícialo para que cargue la nueva variable de entorno:

1. Detén el servidor (`Ctrl + C`)
2. Vuelve a ejecutar: `npm run dev`

## ✅ Verificar que Funciona

1. Abre tu navegador en: `http://localhost:3000/api/races`
2. Deberías ver un JSON con todas las carreras de tu Google Sheet

## 🔧 Mapeo de Columnas

El sistema mapea automáticamente estas columnas (pueden estar en español o inglés):

| Español | Inglés | Campo | Requerido |
|---------|--------|-------|-----------|
| Nombre | name | name | ✅ Sí |
| Ubicación | location | location | ✅ Sí |
| Ciudad | city | city | ❌ No |
| Provincia | province | province | ❌ No |
| País | country | country | ❌ No |
| Disciplina | discipline | discipline | ✅ Sí |
| Modalidad | modality | modality | ❌ No |
| Fecha Inicio | startDate | startDate | ✅ Sí |
| Fecha Fin | endDate | endDate | ❌ No |
| Distancia | distance | distance | ❌ No |
| Altimetría | elevation | elevation | ❌ No |
| Etapas | stages | stages | ❌ No |
| Días | days | days | ❌ No |
| URL Inscripción | registrationUrl | registrationUrl | ❌ No |
| Descripción | description | description | ❌ No |
| Email | contactEmail | contactEmail | ❌ No |
| Teléfono | contactPhone | contactPhone | ❌ No |
| Sitio Web | website | website | ❌ No |
| Instagram | instagram | instagram | ❌ No |
| Facebook | facebook | facebook | ❌ No |

## 🆘 Solución de Problemas

### Error: "GOOGLE_SHEET_URL no configurada"
- Verifica que el archivo `.env.local` existe en la raíz del proyecto
- Verifica que la variable `GOOGLE_SHEET_URL` está escrita correctamente
- Reinicia el servidor después de crear/modificar `.env.local`

### Error: "Error al obtener datos"
- Si **no** usás cuenta de servicio: verifica que la planilla es pública (cualquiera con el enlace puede verla) y que la URL es correcta
- Si **sí** usás cuenta de servicio: verifica que compartiste la planilla con el `client_email` de la cuenta como Lector, y que `GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL` y `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` están bien en `.env` (la clave suele tener `\n`; en algunos entornos hay que reemplazarlos por nueva línea real)

### No aparecen las carreras
- Verifica que la primera fila tiene los nombres de las columnas
- Verifica que tienes al menos las columnas requeridas (Nombre, Ubicación, Fecha Inicio, Disciplina)
- Verifica que hay datos en las filas (no solo headers)

## 💡 Tips

- Los datos se actualizan automáticamente cada **60 segundos**
- Puedes editar los datos directamente en Google Sheets sin tocar código
- Si cambias los nombres de las columnas, el sistema intentará mapearlas automáticamente
- Si agregas nuevas columnas, puedes actualizar el mapeo en `lib/google-sheets.ts`

