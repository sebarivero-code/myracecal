# 🚴 Calendario de Carreras de Ciclismo

Aplicación web para mostrar el calendario de carreras de ciclismo, desarrollada con Next.js, TypeScript y Tailwind CSS.

## 📋 Requisitos Previos

Antes de ejecutar el proyecto, necesitas tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (viene incluido con Node.js)

### Instalación de Node.js

Si no tienes Node.js instalado, puedes descargarlo desde:
- [nodejs.org](https://nodejs.org/) - Descarga la versión LTS (Long Term Support)

O usando un gestor de paquetes:
- **Chocolatey** (Windows): `choco install nodejs-lts`
- **Scoop** (Windows): `scoop install nodejs-lts`

## 🚀 Cómo Ejecutar el Proyecto

### 1. Instalar Dependencias

Una vez que tengas Node.js instalado, abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Este comando instalará todas las dependencias necesarias (Next.js, React, TypeScript, Tailwind CSS, etc.)

### 2. Ejecutar el Servidor de Desarrollo

Para ver el frontend en acción, ejecuta:

```bash
npm run dev
```

El servidor de desarrollo se iniciará y verás un mensaje como:

```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - ready started server on 0.0.0.0:3000
```

### 3. Abrir en el Navegador

Abre tu navegador web y visita:
- **http://localhost:3000**

¡Listo! Ya puedes ver cómo se está viendo el frontend creado.

## 📁 Estructura del Proyecto

```
app/
├── page.tsx              # Página principal (Calendario Mensual)
├── layout.tsx            # Layout principal
├── globals.css           # Estilos globales
├── races/                # Páginas de carreras
│   ├── page.tsx         # Listado de carreras
│   └── [id]/            # Detalle de carrera
├── my-calendar/          # Calendario del usuario
├── profile/              # Perfil del usuario
├── organizer/            # Dashboard del organizador
└── map/                  # Mapa de carreras
```

## 🎨 Pantallas Disponibles

El proyecto incluye los siguientes bocetos/pantallas:

- **Home** (`/`) - Calendario mensual con carreras destacadas
- **Listado de Carreras** (`/races`) - Lista de carreras con filtros avanzados
- **Detalle de Carrera** (`/races/[id]`) - Información detallada de una carrera
- **Mi Calendario** (`/my-calendar`) - Calendario personal del usuario
- **Mi Perfil** (`/profile`) - Perfil y configuración del usuario
- **Dashboard Organizador** (`/organizer`) - Panel para organizadores
- **Crear Carrera** (`/organizer/races/new`) - Formulario para crear carreras
- **Mapa** (`/map`) - Mapa de carreras por provincia

## 📊 Fuente de Datos

El proyecto lee los datos directamente desde **Google Sheets**. No se requiere base de datos.

### Configuración de Google Sheets

1. **Prepara tu Google Sheet:**
   - Crea o abre tu planilla de Google Sheets con las carreras
   - Asegúrate de que la primera fila contenga los nombres de las columnas
   - La planilla debe ser **pública** o tener acceso público de lectura

2. **Haz la planilla pública:**
   - En Google Sheets, haz clic en "Compartir" (botón azul arriba a la derecha)
   - Selecciona "Cualquier usuario con el enlace" → "Lector"
   - O marca "Hacer público en la web"

3. **Obtén la URL:**
   - Copia la URL de tu Google Sheet
   - Formato: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit#gid={GID}`

4. **Configura la URL en el proyecto:**
   - Crea un archivo `.env.local` en la raíz del proyecto:
     ```env
     GOOGLE_SHEET_URL="https://docs.google.com/spreadsheets/d/TU_SHEET_ID/edit#gid=0"
     ```
   - O pásame la URL y la configuro por ti

### Columnas Esperadas en Google Sheets

El sistema mapea automáticamente estas columnas (pueden estar en español o inglés):

- **Nombre** / name - Nombre de la carrera (requerido)
- **Ubicación** / location - Ubicación completa (requerido)
- **Ciudad** / city - Ciudad (opcional)
- **Provincia** / province - Provincia (opcional)
- **País** / country - País (opcional, default: Argentina)
- **Disciplina** / discipline - Ruta, MTB, Rally, Gravel, etc. (requerido)
- **Modalidad** / modality - Individual, En parejas, Equipos (opcional)
- **Fecha Inicio** / startDate - Fecha de inicio (requerido)
- **Fecha Fin** / endDate - Fecha de fin (opcional)
- **Distancia** / distance - Ej: "116 km" (opcional)
- **Altimetría** / elevation - Ej: "2500m" (opcional)
- **Etapas** / stages - Número de etapas (opcional, default: 1)
- **Días** / days - Número de días (opcional, default: 1)
- **URL Inscripción** / registrationUrl - Link de inscripción (opcional)
- **Descripción** / description - Descripción de la carrera (opcional)
- **Email** / contactEmail - Email de contacto (opcional)
- **Teléfono** / contactPhone - Teléfono de contacto (opcional)
- **Sitio Web** / website - Sitio web (opcional)
- **Instagram** / instagram - Instagram (opcional)
- **Facebook** / facebook - Facebook (opcional)

### Ventajas de Usar Google Sheets

- ✅ No necesitas configurar base de datos
- ✅ Puedes editar los datos directamente en Google Sheets
- ✅ Los cambios se reflejan automáticamente (con cache de 60 segundos)
- ✅ Fácil de compartir y colaborar
- ✅ Gratis y sin límites para empezar

## 🛠️ Comandos Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter para verificar el código

## 📝 Notas

- El proyecto lee datos directamente desde Google Sheets
- Los datos se actualizan automáticamente cada 60 segundos
- Puedes editar los datos directamente en Google Sheets sin tocar código

## 🔧 Tecnologías Utilizadas

- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS utility-first
- **React 18** - Biblioteca de UI
- **Google Sheets API** - Fuente de datos

