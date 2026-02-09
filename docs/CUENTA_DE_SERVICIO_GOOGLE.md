# Crear una cuenta de servicio en Google Cloud (paso a paso)

Una **cuenta de servicio** es un “usuario robot” que usa la app para leer tu planilla de Google Sheets sin que nadie tenga que iniciar sesión. Así podés restringir la planilla y compartirla solo con ese robot.

---

## 1. Entrar a Google Cloud Console

1. Abrí **[console.cloud.google.com](https://console.cloud.google.com/)**.
2. Iniciá sesión con la misma cuenta de Google que usa la planilla de carreras.
3. Arriba a la izquierda, en el selector de proyecto, hacé clic en el nombre del proyecto:
   - Si ya tenés un proyecto (por ejemplo el que usás para el login de Agenda Biker), elegilo.
   - Si no tenés ninguno, hacé clic en **“Nuevo proyecto”**, poné un nombre (ej. “Agenda Biker”) y **Crear**. Esperá unos segundos y seleccioná ese proyecto.

---

## 2. Habilitar la API de Google Sheets

1. En el menú de la izquierda (las tres rayitas si está cerrado), andá a **“APIs y servicios”** → **“Biblioteca”** (o abrí directamente: [Biblioteca de APIs](https://console.cloud.google.com/apis/library)).
2. En el buscador escribí **“Google Sheets API”**.
3. Entrá a **“Google Sheets API”**.
4. Si dice **“Habilitar”**, hacé clic ahí. Si dice **“Administrar”**, ya está habilitada; no hagas nada más en este paso.

---

## 3. Crear la cuenta de servicio

1. En el menú izquierdo: **“APIs y servicios”** → **“Credenciales”** (o [Credenciales](https://console.cloud.google.com/apis/credentials)).
2. Arriba hacé clic en **“+ Crear credenciales”**.
3. Elegí **“Cuenta de servicio”**.
4. **Nombre de la cuenta de servicio:** por ejemplo `agendabiker-sheets` (sirve solo para identificarla en la consola).
5. **ID de cuenta de servicio:** se completa solo. Dejalo así.
6. Clic en **“Crear y continuar”**.
7. En **“Conceder a esta cuenta de servicio acceso al proyecto”** podés **omitir** (no hace falta asignar roles para solo leer la planilla). Clic en **“Continuar”**.
8. Clic en **“Listo”**.

---

## 4. Crear y descargar la clave (JSON)

1. En la lista de **“Cuentas de servicio”**, hacé clic en la que acabás de crear (ej. `agendabiker-sheets@...`).
2. Arriba, pestaña **“Claves”**.
3. **“Añadir clave”** → **“Crear clave nueva”**.
4. Tipo: **JSON** → **“Crear”**.
5. Se descargará un archivo `.json`. Guardalo en un lugar seguro (no lo subas a GitHub ni lo compartas).

---

## 5. Sacar del JSON lo que necesita la app

Abrí el archivo JSON descargado. Vas a usar **solo dos valores**:

- **`client_email`**  
  Ejemplo: `agendabiker-sheets@tu-proyecto.iam.gserviceaccount.com`

- **`private_key`**  
  Es un texto largo que empieza con `"-----BEGIN PRIVATE KEY-----\n"` y termina con `"\n-----END PRIVATE KEY-----\n"`. Copiá **todo** el valor (con las comillas que tiene en el JSON, o solo el contenido entre comillas; en la app va sin las comillas externas del JSON).

En tu proyecto (o en el hosting):

- **`GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL`** = ese `client_email` (tal cual, sin comillas).
- **`GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`** = el `private_key` completo.  
  Si lo pegás en `.env` o en variables de entorno:
  - Podés pegarlo entre comillas dobles y dejar los `\n` como están (la app los convierte a salto de línea).
  - O, si tu entorno lo pide, reemplazá cada `\n` por una tecla Enter (una línea real).

Ejemplo (en `.env.local`; el valor de la clave está recortado):

```env
GOOGLE_SHEET_URL="https://docs.google.com/spreadsheets/d/TU_SHEET_ID/edit#gid=0"
GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL=agendabiker-sheets@tu-proyecto.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...(muchas líneas)...\n-----END PRIVATE KEY-----\n"
```

---

## 6. Compartir la planilla con el “robot”

1. Abrí tu **Google Sheet** de carreras.
2. Clic en **“Compartir”**.
3. Donde dice “Añadir personas y grupos”, pegá el **`client_email`** de la cuenta de servicio (el mismo que pusiste en `GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL`).
4. Rol: **“Lector”**.
5. Opcional: desmarcá **“Notificar a las personas”** si no querés enviar un mail al robot.
6. **Compartir** (o “Enviar”).

Si antes tenías “Cualquier usuario con el enlace”, podés cambiarlo a **“Restringido”** o **“Solo las personas añadidas”**. La app seguirá entrando porque tiene al robot como lector.

---

## 7. En producción (Cloudflare Pages, Vercel, etc.)

En el panel de tu hosting definí **estas 3 variables** (en Variables and secrets / Environment variables):

- **`GOOGLE_SHEET_URL`** – URL completa de la planilla (ej. `https://docs.google.com/spreadsheets/d/XXX/edit#gid=0`).
- **`GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL`** – el `client_email` del JSON (ej. `xxx@yyy.iam.gserviceaccount.com`).
- **`GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`** – el `private_key` completo del JSON.

**Cloudflare Pages – clave privada:** en "Variables and secrets" el valor suele guardarse en una sola línea y Cloudflare puede **quitar los saltos de línea** de la clave. Opciones:

1. **Pegar en una sola línea con `\n`:** copiá el `private_key` del JSON y, en un editor de texto, reemplazá cada salto de línea por los dos caracteres `\n` (barra invertida + n). Pegá ese texto completo como valor de `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`. La app convierte esos `\n` en saltos de línea.
2. Si ya pegaste la clave con saltos de línea y sigue 401: la app intenta rearmar la clave automáticamente; hacé un **nuevo deploy** después de los cambios en el código.

No olvides **compartir la planilla** con el `client_email` como Lector (paso 6). Sin eso, aunque las variables estén bien, Google devuelve 401.

---

## 8. Probar que funciona

1. Reiniciá el servidor local (o volvé a desplegar si usás hosting).
2. Abrí en el navegador: `http://localhost:3000/api/races` (o la URL de tu sitio + `/api/races`).
3. Deberías ver el JSON con las carreras. Si ves un error, revisá:
   - Que la planilla esté compartida con el `client_email`.
   - Que `GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL` y `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` estén bien pegados (sin quitar ni agregar caracteres en la clave).
   - Que en Cloud Console tengas habilitada la **Google Sheets API**.

---

## Resumen rápido

| Paso | Dónde | Qué hacer |
|------|--------|-----------|
| 1 | Google Cloud Console | Entrar y elegir/crear proyecto |
| 2 | APIs y servicios → Biblioteca | Habilitar “Google Sheets API” |
| 3 | APIs y servicios → Credenciales | Crear credenciales → Cuenta de servicio |
| 4 | Esa cuenta → Claves | Añadir clave → JSON → Descargar |
| 5 | Tu proyecto / hosting | Definir `GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL` y `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` |
| 6 | Google Sheet | Compartir con el `client_email` como Lector |
| 7 | Producción | Definir las 3 variables en el panel del hosting y compartir la planilla con el `client_email` |
| 8 | Navegador | Probar `/api/races` |

Si algo no coincide con lo que ves en pantalla (porque Google cambió el diseño), buscá siempre “Credenciales” y “Cuenta de servicio” dentro de **APIs y servicios** en Cloud Console.
