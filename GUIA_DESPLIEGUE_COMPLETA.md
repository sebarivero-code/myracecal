# Guía Completa de Despliegue - Paso a Paso

Esta guía te llevará desde cero hasta tener tu aplicación funcionando en **agendabiker.com**.

---

## PARTE 1: INSTALAR Y CONFIGURAR GIT

### Paso 1.1: Descargar Git

1. Ve a: https://git-scm.com/download/win
2. Descarga la versión para Windows
3. Ejecuta el instalador
4. Durante la instalación, deja todas las opciones por defecto (solo haz clic en "Siguiente")
5. Cuando termine, cierra cualquier ventana que se haya abierto

### Paso 1.2: Verificar que Git se instaló correctamente

1. Abre PowerShell (presiona `Windows + X` y selecciona "Windows PowerShell" o busca "PowerShell" en el menú inicio)
2. Escribe este comando y presiona Enter:
   ```powershell
   git --version
   ```
3. Deberías ver algo como: `git version 2.x.x`
4. Si ves un error, reinicia tu computadora e intenta de nuevo

### Paso 1.3: Configurar Git (solo la primera vez)

En PowerShell, ejecuta estos dos comandos (reemplaza con tu nombre y email real):

```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

Ejemplo:
```powershell
git config --global user.name "Sebastian Rivero"
git config --global user.email "sebastian@ejemplo.com"
```

---

## PARTE 2: CREAR CUENTA EN GITHUB

### Paso 2.1: Crear cuenta

1. Ve a: https://github.com
2. Haz clic en "Sign up" (Registrarse)
3. Completa el formulario:
   - Username (nombre de usuario)
   - Email
   - Contraseña
4. Verifica tu email cuando GitHub te lo pida
5. Selecciona el plan gratuito cuando te pregunte

### Paso 2.2: Verificar tu cuenta

1. Inicia sesión en GitHub
2. Asegúrate de estar en tu página principal (dashboard)

---

## PARTE 3: SUBIR TU CÓDIGO A GITHUB

### Paso 3.1: Abrir PowerShell en la carpeta de tu proyecto

1. Abre el Explorador de Archivos de Windows
2. Navega a: `C:\app`
3. En la barra de direcciones, escribe: `powershell` y presiona Enter
4. Se abrirá PowerShell en esa carpeta

### Paso 3.2: Inicializar Git en tu proyecto

En PowerShell, ejecuta estos comandos uno por uno:

```powershell
git init
```

Esto crea un repositorio Git en tu carpeta.

### Paso 3.3: Crear archivo .gitignore (opcional pero recomendado)

Esto evita subir archivos innecesarios. Ejecuta:

```powershell
New-Item -Path .gitignore -ItemType File -Force
```

Luego abre el archivo `.gitignore` con el Bloc de notas y añade estas líneas:

```
node_modules/
.next/
.vercel/
.env.local
.env.production
.DS_Store
*.log
```

Guarda y cierra el archivo.

### Paso 3.4: Añadir todos los archivos

```powershell
git add .
```

Este comando prepara todos los archivos para subirlos.

### Paso 3.5: Hacer tu primer commit

```powershell
git commit -m "Primera versión de Agenda Biker"
```

Este comando guarda una "foto" de tu código en este momento.

### Paso 3.6: Crear repositorio en GitHub

1. Ve a GitHub en tu navegador
2. Haz clic en el botón verde "New" o el símbolo "+" en la esquina superior derecha
3. Selecciona "New repository"
4. Llena el formulario:
   - **Repository name:** `agendabiker` o `calendario-ciclismo` (o el nombre que prefieras)
   - **Description:** "Calendario de carreras de ciclismo" (opcional)
   - **Visibility:** Selecciona "Public" (puedes cambiarlo después)
   - **NO marques** "Add a README file"
   - **NO marques** "Add .gitignore"
   - **NO marques** "Choose a license"
5. Haz clic en "Create repository"

### Paso 3.7: Conectar tu carpeta local con GitHub

GitHub te mostrará una página con instrucciones. En PowerShell, ejecuta estos comandos (reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub):

```powershell
git branch -M main
git remote add origin https://github.com/TU_USUARIO/agendabiker.git
git push -u origin main
```

**Ejemplo:**
Si tu usuario es `sebastianrivero`, sería:
```powershell
git branch -M main
git remote add origin https://github.com/TU_USUARIO/agendabiker.git
git push -u origin main
```

**Nota:** La primera vez que hagas `push`, GitHub te pedirá que inicies sesión:
- Te abrirá una ventana del navegador
- Inicia sesión en GitHub
- Autoriza la aplicación

### Paso 3.8: Verificar que se subió correctamente

1. Refresca la página de tu repositorio en GitHub
2. Deberías ver todos tus archivos ahí
3. ¡Felicidades! Tu código está en GitHub

---

## PARTE 4: CONFIGURAR CLOUDFLARE PAGES

### Paso 4.1: Ir a Cloudflare Pages

1. Inicia sesión en tu cuenta de Cloudflare: https://dash.cloudflare.com
2. En el menú lateral izquierdo, busca "Workers & Pages"
3. Haz clic en "Pages"
4. Haz clic en el botón "Create a project"

### Paso 4.2: Conectar con GitHub

1. Verás opciones para conectar tu repositorio
2. Haz clic en "Connect to Git"
3. Si es la primera vez, te pedirá autorizar Cloudflare para acceder a GitHub:
   - Haz clic en "Authorize Cloudflare"
   - Inicia sesión en GitHub si es necesario
   - Autoriza el acceso
4. Selecciona tu repositorio (ej. `agendabiker`) de la lista
5. Haz clic en "Begin setup"

### Paso 4.3: Configurar el Build

Llena el formulario con estos valores:

- **Project name:** `agendabiker` (o el nombre que prefieras)
- **Production branch:** `main` (debería estar seleccionado automáticamente)
- **Framework preset:** Selecciona "Next.js" del menú desplegable
- **Build command:** `npm run pages:build`
- **Build output directory:** `.vercel/output/static`
- **Root directory:** (déjalo vacío)
- **Environment variables:** Por ahora déjalo vacío, lo configuraremos después

### Paso 4.4: Añadir Variable de Entorno

Antes de hacer clic en "Save and Deploy", necesitas añadir tu variable de entorno:

1. Haz clic en "Add environment variable"
2. Llena:
   - **Variable name:** `GOOGLE_SHEET_URL`
   - ** **Value:** Pega aquí la URL de tu Google Sheet
3. Haz clic en "Save"

**¿Cómo obtener la URL de Google Sheets?**
- Abre tu Google Sheet
- Haz clic en "Compartir" → "Obtener enlace"
- Asegúrate de que esté configurado como "Cualquier persona con el enlace puede ver"
- Copia la URL completa

### Paso 4.5: Desplegar

1. Haz clic en "Save and Deploy"
2. Cloudflare comenzará a construir tu aplicación
3. Esto puede tardar 2-5 minutos
4. Verás un progreso en tiempo real
5. Cuando termine, verás un mensaje de éxito

### Paso 4.6: Ver tu aplicación

1. Una vez desplegado, verás una URL temporal como: `agendabiker.pages.dev`
2. Haz clic en esa URL para ver tu aplicación
3. Debería cargar correctamente

---

## PARTE 5: CONFIGURAR TU DOMINIO PERSONALIZADO

### Paso 5.1: Añadir dominio en Cloudflare Pages

1. En la página de tu proyecto en Cloudflare Pages
2. Ve a la pestaña "Custom domains"
3. Haz clic en "Set up a custom domain"
4. Escribe: `agendabiker.com`
5. Haz clic en "Continue"
6. Cloudflare configurará automáticamente los registros DNS necesarios

### Paso 5.2: Verificar la configuración DNS

1. Ve a tu dominio en Cloudflare (en la sección principal, no Pages)
2. Haz clic en "DNS" en el menú lateral
3. Deberías ver un registro CNAME que Cloudflare creó automáticamente:
   - **Type:** CNAME
   - **Name:** @ (o agendabiker.com)
   - **Target:** algo como `agendabiker.pages.dev`
   - **Proxy status:** Proxied (nube naranja)

Si no lo ves, espera unos minutos y refresca.

### Paso 5.3: Esperar la propagación

1. Puede tardar entre 5 minutos y 24 horas
2. Generalmente es rápido (15-30 minutos)
3. Mientras esperas, puedes verificar el estado en:
   - Cloudflare Pages → Custom domains
   - Verás el estado del dominio

### Paso 5.4: Verificar que funciona

1. Abre tu navegador
2. Ve a: `https://agendabiker.com`
3. Deberías ver tu aplicación funcionando
4. Si ves un error, espera unos minutos más y vuelve a intentar

---

## PARTE 6: CONFIGURAR SSL (SEGURIDAD)

Cloudflare debería configurar SSL automáticamente, pero verifica:

1. En Cloudflare, ve a tu dominio (no Pages)
2. Ve a "SSL/TLS"
3. Asegúrate de que esté en modo "Full" o "Full (strict)"
4. Si no está, cámbialo y espera unos minutos

---

## RESUMEN DE COMANDOS IMPORTANTES

### Para subir cambios futuros a GitHub:

```powershell
cd C:\app
git add .
git commit -m "Descripción de los cambios"
git push
```

### Para ver el estado de tu código:

```powershell
git status
```

---

## SOLUCIÓN DE PROBLEMAS

### Error: "GOOGLE_SHEET_URL no configurada"

1. Ve a Cloudflare Pages → Tu proyecto → Settings → Environment variables
2. Verifica que `GOOGLE_SHEET_URL` esté configurada
3. Si no está, añádela
4. Haz clic en "Retry deployment" o espera al próximo despliegue automático

### Error: "Build failed"

1. Ve a Cloudflare Pages → Tu proyecto → Deployments
2. Haz clic en el deployment que falló
3. Revisa los logs para ver el error específico
4. Comúnmente es por:
   - Variable de entorno faltante
   - Error en el código
   - Versión de Node.js incorrecta

### El dominio no carga

1. Verifica que el dominio esté configurado en Cloudflare Pages
2. Verifica los registros DNS en Cloudflare
3. Espera más tiempo (puede tardar hasta 24 horas)
4. Prueba en modo incógnito del navegador

### No puedo hacer push a GitHub

1. Verifica que estés conectado a internet
2. Intenta iniciar sesión de nuevo:
   ```powershell
   git config --global credential.helper wincred
   ```
3. Vuelve a intentar el push

---

## PRÓXIMOS PASOS

Una vez que todo esté funcionando:

1. **Actualizaciones automáticas:** Cada vez que hagas `git push`, Cloudflare desplegará automáticamente los cambios
2. **Monitoreo:** Puedes ver los deployments en Cloudflare Pages
3. **Logs:** Puedes ver los logs de tu aplicación en Cloudflare

---

## ¿NECESITAS AYUDA?

Si encuentras algún problema:
1. Revisa los logs en Cloudflare Pages
2. Verifica que todos los pasos se hayan completado
3. Asegúrate de que las variables de entorno estén configuradas

¡Buena suerte con tu despliegue! 🚀

