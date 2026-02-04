# Usar el dominio agendabiker.com (reemplazar micalendariomtb.com / myracecal.net)

Para que **agendabiker.com** muestre lo que está en producción y dejar de usar los dominios viejos.

---

## 1. Dónde está hoy la producción

- Si la app está en **Cloudflare Pages** (proyecto tipo “myracecal”): seguí esta guía.
- Si está en **Vercel** u otro: la idea es la misma (añadir dominio custom y variables); los pasos se hacen en ese panel.

---

## 2. Añadir agendabiker.com en Cloudflare Pages

1. Entrá a [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → tu proyecto (el que sirve la app en prod).
2. **Custom domains** → **Set up a custom domain**.
3. Escribí **agendabiker.com** y guardá.
4. Cloudflare te va a pedir que el dominio use los nameservers de Cloudflare:
   - Si **agendabiker.com** ya está en Cloudflare: suele detectar el sitio y proponer el CNAME; aceptá.
   - Si el dominio está en otro registrador (GoDaddy, DonWeb, etc.):
     - En el registrador, cambiá los *nameservers* del dominio a los que te indica Cloudflare (ej. `xxx.ns.cloudflare.com` y `yyy.ns.cloudflare.com`).
     - Esperá la propagación (minutos a horas).
5. Cuando el dominio esté activo, Cloudflare generará el certificado SSL y **agendabiker.com** mostrará la misma app que hoy está en prod.

---

## 3. Variables de entorno en producción

Para que el login con Google y las redirecciones funcionen con el nuevo dominio:

1. En el mismo proyecto de Cloudflare Pages: **Settings** → **Environment variables**.
2. En **Production** (y en **Preview** si querés):
   - **NEXTAUTH_URL** = `https://agendabiker.com`  
     (sin barra final; debe ser exactamente la URL que usa la gente).
3. Guardá y **volvé a desplegar** el proyecto (un deploy desde Git o “Retry deployment”) para que tome la variable.

---

## 4. Google OAuth (login con Google)

Para que “Iniciar sesión con Google” funcione en agendabiker.com:

1. Entrá a [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Credentials**.
2. Abrí las credenciales **OAuth 2.0** que usa la app (tipo “Web application”).
3. En **Authorized redirect URIs** agregá:
   - `https://agendabiker.com/api/auth/callback/google`
4. En **Authorized JavaScript origins** (si lo tenés) agregá:
   - `https://agendabiker.com`
5. Guardá. No hace falta cambiar Client ID ni Client Secret si ya los usás en prod.

---

## 5. Redirigir los dominios viejos a agendabiker.com (opcional)

Para que **micalendariomtb.com** y **myracecal.net** dejen de usarse y manden todo a agendabiker.com:

### Si los dominios viejos están en Cloudflare

1. **Workers & Pages** → tu mismo proyecto → **Custom domains**.
2. Añadí **micalendariomtb.com** y **myracecal.net** como dominios custom del **mismo** proyecto (así sirven la misma app).
3. Luego, con **Redirect Rules** (o Page Rules / Redirect):
   - Creá una regla tipo:  
     Si la solicitud es a `micalendariomtb.com` o `myracecal.net` → redirección **301** a `https://agendabiker.com` (y opcionalmente a `https://agendabiker.com$uri` para mantener la ruta).

O bien:

- En **Rules** → **Redirect Rules**:  
  - URL: `*micalendariomtb.com*` o `*myracecal.net*`  
  - Action: Redirect (301) → `https://agendabiker.com`

Así quien entre a los dominios viejos termina siempre en agendabiker.com.

### Si los dominios viejos están en otro proveedor

En el panel DNS del registrador, podés crear un **redirect de dominio** (si el proveedor lo ofrece) hacia `https://agendabiker.com`. Si no, lo más simple es apuntar esos dominios a Cloudflare (cambiando nameservers) y hacer la redirección ahí como arriba.

---

## 6. Resumen rápido

| Paso | Dónde | Qué hacer |
|------|--------|-----------|
| 1 | Cloudflare Pages → Custom domains | Añadir **agendabiker.com** y configurar DNS/nameservers |
| 2 | Cloudflare Pages → Environment variables | `NEXTAUTH_URL` = `https://agendabiker.com` y redesplegar |
| 3 | Google Cloud Console → Credentials | Añadir `https://agendabiker.com/api/auth/callback/google` en redirect URIs |
| 4 | (Opcional) Cloudflare / DNS | Redirigir micalendariomtb.com y myracecal.net → agendabiker.com |

Después de esto, **agendabiker.com** mostrará lo que está en prod y podés dejar de usar los otros dominios.
