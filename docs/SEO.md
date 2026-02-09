# Posicionamiento en buscadores (SEO)

Resumen de lo implementado y pasos recomendados para aparecer en Google y otros buscadores.

---

## Lo que ya tiene la app

### 1. Metadata (títulos y descripciones)
- **Sitio completo:** título "Agenda Biker – Calendario de carreras MTB y ciclismo", descripción con palabras clave (MTB, XCO, XCM, rally, gravel, fechas, inscripción).
- **Listado de carreras** (`/races`): título "Calendario de carreras" y descripción con filtros y disciplinas.
- **Cada ficha de carrera** (`/races/[id]`): título = nombre de la carrera, descripción con ubicación, disciplina y fecha (o el texto de la descripción si existe). **Canonical** y **Open Graph** por carrera.

### 2. Open Graph y Twitter
- Todas las páginas tienen etiquetas para que al compartir un enlace (Facebook, WhatsApp, Twitter, etc.) se vea título, descripción y URL correcta.

### 3. Sitemap
- **URL:** `https://www.agendabiker.com/sitemap.xml`
- Incluye: página principal, `/races`, `/races/filters` y **cada ficha de carrera** (`/races/123`, etc.) para que los buscadores descubran todas las URLs.
- Se genera de forma dinámica leyendo las carreras de la planilla.

### 4. robots.txt
- **URL:** `https://www.agendabiker.com/robots.txt`
- Permite rastrear todo el sitio **excepto** rutas que no interesan para búsqueda: `/api/`, `/auth/`, `/races/manage/`, `/races/new/`, `/races/my-calendar/`.
- Indica la ubicación del sitemap.

### 5. Datos estructurados (JSON-LD)
- En cada **ficha de carrera** se incluye un `Event` de schema.org (nombre, fecha, ubicación, descripción, URL de inscripción). Así Google puede mostrar resultados enriquecidos (fechas, lugar) si lo considera relevante.

### 6. Variable de entorno
- **`NEXT_PUBLIC_SITE_URL`**: debe ser la URL pública del sitio (ej. `https://www.agendabiker.com`) para que canonical, sitemap y Open Graph usen la URL correcta. Si no la definís, se usa por defecto `https://www.agendabiker.com`.

---

## Qué hacer vos (recomendado)

### 1. Definir la URL del sitio
En tu entorno (`.env.local` o variables del hosting) poné:
```env
NEXT_PUBLIC_SITE_URL=https://www.agendabiker.com
```
(sin barra al final; usá el dominio que realmente use la app)

### 2. Google Search Console
**Guía paso a paso completa:** [docs/GOOGLE_SEARCH_CONSOLE.md](GOOGLE_SEARCH_CONSOLE.md)

En resumen: entrá a [search.google.com/search-console](https://search.google.com/search-console), añadí la propiedad (URL del sitio), verificá con uno de los métodos (etiqueta HTML, Google Analytics o archivo en `public/`), y en **Sitemaps** enviá `sitemap.xml`. Opcional: en **Inspección de URL** pedí indexación para la home y `/races`.

### 3. Bing Webmaster Tools (opcional)
- [bing.com/webmasters](https://www.bing.com/webmasters): añadí el sitio y la misma URL del sitemap para que Bing también indexe.

### 4. Contenido y enlaces
- Mantené las descripciones de las carreras en la planilla; se usan en la ficha y en la metadata.
- Cuanto más enlaces externos (redes, clubes, prensa) apunten a agendabiker.com, mejor para el posicionamiento a largo plazo.

---

## Verificar que todo esté bien

- Abrí `https://www.agendabiker.com/sitemap.xml`: deberías ver la lista de URLs.
- Abrí `https://www.agendabiker.com/robots.txt`: deberías ver las reglas y el enlace al sitemap.
- En una ficha de carrera, "Ver código fuente" y buscá `application/ld+json`: deberías ver el bloque con `@type: "Event"`.
- En [Rich Results Test](https://search.google.com/test/rich-results) podés pegar la URL de una carrera y ver si Google detecta el evento.

Los resultados en Google pueden tardar unos días o semanas en reflejar los cambios; el sitemap y los canonical ayudan a que se indexe antes y bien.
