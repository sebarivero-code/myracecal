# Google Search Console – Paso a paso

Guía para añadir tu sitio (Agenda Biker) a Google Search Console y enviar el sitemap para que Google indexe tus páginas.

---

## 1. Entrar a Search Console

1. Abrí **[search.google.com/search-console](https://search.google.com/search-console)**.
2. Iniciá sesión con la cuenta de Google que quieras usar (la misma del sitio o una que administre el dominio).

---

## 2. Añadir la propiedad (tu sitio)

1. Si es la primera vez, vas a ver **“Añadir propiedad”**. Si ya tenés otras propiedades, arriba a la izquierde hacé clic en el **selector de propiedad** (nombre del sitio) y elegí **“Añadir propiedad”**.
2. Vas a ver dos tipos:
   - **Dominio** (recomendado si tenés acceso al DNS): incluye todas las URLs (con y sin www, http y https).
   - **Prefijo de URL**: una URL exacta (ej. `https://www.agendabiker.com`).
3. **Opción A – Prefijo de URL (más simple):**
   - Elegí **“Prefijo de URL”**.
   - En el cuadro escribí exactamente la URL de tu sitio, por ejemplo:  
     `https://www.agendabiker.com`  
     (sin barra al final; con o sin `www` según cómo use la gente tu sitio).
   - Clic en **“Continuar”**.
4. **Opción B – Dominio (si querés que cuente www y no www):**
   - Elegí **“Dominio”**.
   - Escribí solo el dominio: `agendabiker.com`.
   - Clic en **“Continuar”**.  
   Después vas a tener que **verificar por DNS** (paso 3, método “Registro TXT”).

---

## 3. Verificar la propiedad

Google te va a pedir que demuestres que el sitio es tuyo. Según lo que elegiste en el paso 2:

### Si elegiste “Prefijo de URL”

Te muestra varios **métodos de verificación**. Con uno que funcione alcanza.

**Método 1 – Etiqueta HTML (muy fácil)**  
1. Elegí **“Etiqueta HTML”**.  
2. Google te muestra algo como:  
   `content="AbCdEf123456..."`  
   (o una etiqueta completa `<meta name="google-site-verification" content="AbCdEf123456...">`).  
   Copiá solo el **código** que va dentro de `content="..."` (ej. `AbCdEf123456...`).  
3. En tu proyecto, abrí **`app/layout.tsx`**. Dentro del objeto **`metadata`**, añadí la línea **`verification`** (si ya existe, reemplazala):
   ```js
   export const metadata: Metadata = {
     metadataBase: new URL(siteUrl),
     verification: { google: 'AbCdEf123456...' },  // ← Pegá acá el código que te dio Google
     title: { ... },
     // ... el resto igual
   }
   ```  
   Reemplazá `AbCdEf123456...` por el código que te dio Search Console.  
4. Guardá, subí el cambio a producción y cuando el sitio esté actualizado, volvé a Search Console y hacé clic en **“Comprobar”** o **“Verificar”**.

**Método 2 – Google Analytics**  
- Si ya tenés **Google Analytics 4** instalado en el mismo sitio (con el mismo dominio/URL que pusiste en Search Console), elegí **“Google Analytics”** y seguí las instrucciones. Con tener la etiqueta de GA en la página suele alcanzar para verificar.

**Método 3 – Carga de archivo HTML**  
- Google te da un archivo (ej. `google123.html`). Tenés que hacer que ese archivo se sirva en tu sitio en la ruta que te indica (ej. `https://www.agendabiker.com/google123.html`).  
- En Next.js podés poner el archivo en **`public/`** (ej. `public/google123.html`). Ese archivo se sirve en la raíz.  
- Cuando esté en producción, en Search Console hacé clic en **“Comprobar”**.

### Si elegiste “Dominio”

- Solo está disponible la verificación por **DNS**.  
- En el panel de tu proveedor de dominio (donde compraste agendabiker.com) entrá a la sección de **DNS** (registros del dominio).  
- Google te pide que añadas un **registro TXT** con un valor que te da.  
- Creá ese registro, guardá los cambios y en Search Console hacé clic en **“Comprobar”**.  
- La propagación DNS puede tardar unos minutos u horas.

Cuando la verificación sea correcta, vas a pasar al panel de la propiedad.

---

## 4. Enviar el sitemap

1. En el menú izquierdo de Search Console, entrá a **“Sitemaps”** (a veces en español: **“Mapas del sitio”**).
2. Donde dice **“Añadir un sitemap nuevo”** o **“Agregar sitemap”**, en el cuadro escribí solo la parte que va después de tu dominio.  
   Por ejemplo, si tu sitemap está en  
   `https://www.agendabiker.com/sitemap.xml`  
   escribí:  
   **`sitemap.xml`**  
   (no hace falta poner la URL completa).
3. Clic en **“Enviar”** o **“Enviar sitemap”**.
4. El estado puede aparecer como **“En cola”** o **“Correcto”**. Si hay error, Google suele indicar el motivo (ej. URL no accesible).  
   Asegurate de que en el navegador `https://www.agendabiker.com/sitemap.xml` se vea bien la lista de URLs.

---

## 5. (Opcional) Pedir que indexen páginas clave

1. En el menú izquierdo, andá a **“Inspección de URLs”** (o **“Inspección de URL”**).
2. Pegá una URL importante, por ejemplo:  
   `https://www.agendabiker.com/races`  
   o la de tu home:  
   `https://www.agendabiker.com`
3. Clic en **“Solicitar indexación”** (o **“Solicitar indexación”**) si aparece.  
   Eso le pide a Google que pase a rastrear esa URL pronto; no es obligatorio, pero puede ayudar a que las primeras páginas aparezcan antes en los resultados.

---

## Resumen rápido

| Paso | Dónde | Acción |
|------|--------|--------|
| 1 | search.google.com/search-console | Entrar con tu cuenta Google |
| 2 | Añadir propiedad | Elegir “Prefijo de URL” y poner `https://www.agendabiker.com` (o “Dominio” si preferís) |
| 3 | Verificación | Completar un método (etiqueta HTML, GA, archivo en `public/` o DNS) |
| 4 | Sitemaps | Añadir `sitemap.xml` y enviar |
| 5 | (Opcional) Inspección de URL | Pedir indexación para `/races` o la home |

Después de esto, Google irá rastreando tu sitio usando el sitemap. Los resultados pueden tardar días o semanas en verse; en Search Console podés seguir **“Cobertura”** o **“Páginas”** para ver cuántas URLs detectó e indexó.
