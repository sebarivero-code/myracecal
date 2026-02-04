# Guía: Poblar Render desde el Excel / Google Sheets

## 🎯 Objetivo

Usar **Render PostgreSQL** como base de datos y cargar los datos desde **tu Excel** (o Google Sheets). Lo que esté en Supabase ya no se usa; la fuente de verdad es el archivo / la planilla.

---

## 📋 Paso 1: Crear base de datos en Render

1. Entrá a [render.com](https://render.com) y creá la cuenta (o usá GitHub/Google).
2. En el dashboard: **New +** → **PostgreSQL**.
3. Configurá:
   - **Name:** `agenda-biker-db` (o el que uses)
   - **Database:** `agenda_biker` (o el que uses)
   - **Region:** La más cercana (ej. Virginia US East, Oregon US West).
   - **PostgreSQL Version:** 16, 17 o 18 (recomendado **16**).
   - **Plan:** Free para probar; Starter ($7/mes) para producción.
4. **Create Database** y esperá 2–3 minutos.
5. En la base creada, pestaña **Info**, copiá la **External Database URL** (para conectar desde tu PC).

---

## ⚙️ Paso 2: Configurar variables de entorno

1. En la raíz del proyecto, en `.env` o `.env.local`:
   - Poné `DATABASE_URL` con la **External Database URL** de Render.
   - No uses `DIRECT_URL`; con Render no hace falta.

2. Para que el script lea desde Google Sheets, agregá:
   ```env
   GOOGLE_SHEET_URL="https://docs.google.com/spreadsheets/d/TU_SHEET_ID/edit#gid=0"
   ```
   Reemplazá por la URL real de tu planilla (o la pestaña que quieras usar).

   Si en lugar de Sheets usás un **CSV exportado del Excel**, no hace falta esta variable; el script puede leer desde un archivo (ver Paso 4).

---

## 🗄️ Paso 3: Crear el schema en Render

Con `DATABASE_URL` apuntando a Render:

```bash
npx prisma generate
npx prisma db push
```

Con eso Render queda con las tablas vacías y el schema actual.

---

## 📥 Paso 4: Cargar datos desde el Excel / Sheets

La **fuente de verdad** es tu Excel (o la planilla de Google Sheets).

El script **lee la pestaña "2026"**. En `GOOGLE_SHEET_URL` tené el `gid` de esa pestaña (ej. `...edit#gid=123456789`).

**Columnas usadas (pestaña "2026"):** B=Fecha, C=Carrera, D=Id, E=Discip., F=Formato, G=Localidad, H=Provincia, I=País, J=Modalidad, K=Campeonato, L=# Etapas, M=# Días, N=Km, O=M+, P=Instagram, Q=Tel, R=Site, S=Inscripcion, T–X=Etapa 1 (name, dist, alt, from, to), Y–AC=Etapa 2, etc.  
**Formato de fecha en B:** d/m/aaaa (día/mes/año). También acepta d/m/aa (aa → 2000–2099) y aaaa-mm-dd.

### Si usás Google Sheets

1. Subí el Excel a Google Sheets o usá una planilla que ya tengas.
2. Dejá bien configurada `GOOGLE_SHEET_URL` en `.env` / `.env.local` (ver Paso 2), con el **gid de la pestaña "2026"**.
3. Ejecutá:

   ```bash
   npm run migrate:sheets
   ```

   Ese script lee la planilla, crea países y provincias que falten y luego Race → RaceEdition → EditionFormat (y Stage si corresponde).

### Migrar también la pestaña **"Carreras"** (ej. carreras de Santa Fe)

El script solo lee **una pestaña** por ejecución (la que indica el `gid` en la URL). Si tenés carreras en la solapa **"Carreras"** (p. ej. 2 de Santa Fe) que no están en "2026", no se migran por defecto.

Para migrarlas:

1. En `.env` / `.env.local` poné la **misma URL de la planilla pero con el gid de la pestaña "Carreras"** (el número que aparece en la pestaña al abrirla en Sheets).
2. Agregá:
   ```env
   MIGRATE_SHEET_LAYOUT=carreras
   ```
3. Ejecutá de nuevo:
   ```bash
   npm run migrate:sheets
   ```

Columnas esperadas en **"Carreras"**: A=Carrera, B=Id, C=Disciplina, D=Formato, E=Localidad, F=Provincia, G=País, H=Modalidad, J=#Etapas, K=#Días, L=Kms. Si en G tenés el código (ej. **ARG**), el script lo normaliza a "Argentina" para crear país y provincias. Como no hay columna Fecha, se crea una edición con fecha 2026-01-01; podés editarla después en la app. Las provincias que aparezcan (ej. Santa Fe) se crean automáticamente.

Si preferís no migrar "Carreras" y solo tener Santa Fe en el selector, ejecutá una vez: `npm run seed:provinces`.

### Si usás solo un CSV (exportado desde Excel)

1. Exportá el Excel como CSV (por ejemplo `races.csv`) y guardalo en `scripts/`.
2. Si el script `migrate:sheets` tiene opción de leer desde archivo, usá esa opción.
3. Si no, subí ese CSV a una hoja de Google Sheets y usá `GOOGLE_SHEET_URL` + `npm run migrate:sheets` como arriba.

---

## ✅ Paso 5: Verificar

1. Reiniciá el servidor:
   ```bash
   npm run dev
   ```
2. Entrá a `http://localhost:3000/races/manage` (o la ruta donde veas el listado de carreras).
3. Comprobá que se vean las carreras que cargaste desde el Excel/Sheets.

---

## 📌 Nota sobre Supabase

Los datos que haya en **Supabase** ya no se migran a Render. Todo lo que quieras en Render debe salir del **Excel / Google Sheets** (o del CSV exportado). Los scripts `export:supabase` e `import:render` quedan solo por si en el futuro quisieras rescatar algo de Supabase; el flujo recomendado es **Excel/Sheets → Render** con `migrate:sheets`.

---

## 🔧 Troubleshooting

- **Vaciar tablas sin cliente SQL:** Desde el proyecto ejecutá `npm run truncate:render`. Eso vacía EditionFormat, Stage, UserCalendar, RaceEdition, Race, Province y Country usando `DATABASE_URL` (no hace falta psql ni ningún cliente).
- **Error de conexión:** Usá la **External Database URL** de Render, no la Internal.
- **“GOOGLE_SHEET_URL no está configurada”:** Definí esa variable con la URL de tu planilla o asegurate de que el script pueda leer desde un CSV local, si lo soporta.
- **Errores al crear ediciones:** Revisá que en el Excel/Sheets tengas al menos: nombre de carrera, fecha, disciplina, provincia y país; el script necesita esos campos.
- **Fechas en 2001 o “Sin ubicación”:** El script lee la pestaña **“2026”** y la columna **B** como Fecha. El formato debe ser **d/m/aaaa** (día/mes/año). Si en la planilla tenés año en 2 cifras (ej. 26), el script lo toma como 2026. Si ya migraste y seguís viendo 2001, ejecutá `npm run truncate:render` y después `npm run migrate:sheets`; revisá que en la columna B de “2026” las fechas estén en d/m/aaaa (ej. 15/4/2026).
