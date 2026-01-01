# Guía de Despliegue en Cloudflare Pages

Esta guía te ayudará a desplegar tu aplicación Next.js en Cloudflare Pages con el dominio `MyRaceCal.app`.

## Prerrequisitos

1. Una cuenta en Cloudflare
2. El dominio `MyRaceCal.app` configurado en Cloudflare
3. Node.js instalado (versión 18 o superior)
4. Git configurado

## Paso 1: Instalar Dependencias

Primero, instala las dependencias necesarias:

```bash
npm install
```

## Paso 2: Configurar Variables de Entorno

Crea un archivo `.env.production` con las variables de entorno necesarias:

```env
GOOGLE_SHEET_URL=tu_url_de_google_sheets_aqui
```

**Importante:** También necesitarás configurar estas variables en Cloudflare Pages después del despliegue.

## Paso 3: Configurar el Dominio en Cloudflare

### 3.1 Añadir el dominio a Cloudflare

1. Inicia sesión en tu cuenta de Cloudflare
2. Haz clic en "Añadir sitio" e introduce `MyRaceCal.app`
3. Selecciona el plan (el plan gratuito es suficiente)
4. Cloudflare escaneará tus registros DNS existentes

### 3.2 Actualizar los servidores de nombres

1. Cloudflare te proporcionará dos servidores de nombres
2. Accede al panel de control de tu registrador de dominios
3. Reemplaza los servidores de nombres actuales por los de Cloudflare
4. Espera a que se propaguen (puede tardar hasta 72 horas, generalmente es más rápido)

## Paso 4: Desplegar en Cloudflare Pages

### Opción A: Despliegue desde GitHub/GitLab/Bitbucket (Recomendado)

1. **Sube tu código a un repositorio Git:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin tu_repositorio_url
   git push -u origin main
   ```

2. **Conecta el repositorio a Cloudflare Pages:**
   - Ve a Cloudflare Dashboard → Pages
   - Haz clic en "Crear un proyecto"
   - Selecciona "Conectar a Git"
   - Autoriza Cloudflare para acceder a tu repositorio
   - Selecciona el repositorio y la rama (generalmente `main` o `master`)

3. **Configura el build:**
   - **Framework preset:** Next.js
   - **Build command:** `npm run pages:build`
   - **Build output directory:** `.vercel/output/static`
   - **Node version:** 18 o superior

4. **Configura las variables de entorno:**
   - En la configuración del proyecto, ve a "Variables de entorno"
   - Añade `GOOGLE_SHEET_URL` con el valor correspondiente
   - Guarda los cambios

5. **Despliega:**
   - Haz clic en "Guardar y desplegar"
   - Cloudflare construirá y desplegará tu aplicación automáticamente

### Opción B: Despliegue Manual con Wrangler

1. **Instala Wrangler globalmente (si no lo tienes):**
   ```bash
   npm install -g wrangler
   ```

2. **Autentica Wrangler:**
   ```bash
   wrangler login
   ```

3. **Construye la aplicación:**
   ```bash
   npm run pages:build
   ```

4. **Despliega:**
   ```bash
   wrangler pages deploy .vercel/output/static --project-name=myracecal
   ```

## Paso 5: Configurar el Dominio Personalizado

1. En Cloudflare Pages, ve a tu proyecto
2. Ve a la pestaña "Custom domains"
3. Haz clic en "Set up a custom domain"
4. Introduce `MyRaceCal.app`
5. Cloudflare configurará automáticamente los registros DNS necesarios

### Configurar www (Opcional)

Si quieres que `www.MyRaceCal.app` también funcione:

1. Añade `www.MyRaceCal.app` como dominio personalizado adicional
2. O configura una redirección en Cloudflare:
   - Ve a "Page Rules"
   - Crea una regla: `www.MyRaceCal.app/*` → Redirect (301) a `https://MyRaceCal.app/$1`

## Paso 6: Configurar SSL/TLS

1. Ve a la sección "SSL/TLS" en Cloudflare
2. Selecciona el modo "Full" o "Full (strict)"
3. Cloudflare proporcionará automáticamente un certificado SSL gratuito

## Verificación

Una vez desplegado, verifica que:

- ✅ La aplicación carga correctamente en `https://MyRaceCal.app`
- ✅ Las variables de entorno están configuradas correctamente
- ✅ El SSL/TLS está activo (candado verde en el navegador)
- ✅ Las API routes funcionan correctamente

## Troubleshooting

### Error: "GOOGLE_SHEET_URL no configurada"

- Verifica que la variable de entorno `GOOGLE_SHEET_URL` esté configurada en Cloudflare Pages
- Ve a tu proyecto → Settings → Environment variables
- Añade la variable y vuelve a desplegar

### Error de build

- Verifica que estés usando Node.js 18 o superior
- Revisa los logs de build en Cloudflare Pages
- Asegúrate de que todas las dependencias estén en `package.json`

### El dominio no carga

- Verifica que los servidores de nombres estén configurados correctamente
- Espera a que se propaguen los cambios DNS (puede tardar hasta 72 horas)
- Verifica los registros DNS en Cloudflare

## Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build para Cloudflare
npm run pages:build

# Desplegar manualmente
npm run pages:deploy

# Ver logs de Cloudflare
wrangler pages deployment tail
```

## Recursos Adicionales

- [Documentación de Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Documentación de @cloudflare/next-on-pages](https://github.com/cloudflare/next-on-pages)
- [Guía de Next.js en Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)

