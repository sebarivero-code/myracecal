# 📥 Cómo Importar el Diagrama en dbdiagram.io

## Método 1: Pegar el Código Directamente (Más Fácil)

1. **Abre dbdiagram.io:** [https://dbdiagram.io](https://dbdiagram.io)

2. **Haz clic en "New Project"** o crea un nuevo diagrama

3. **En el panel izquierdo, verás un editor de código** (donde dice "DBML" o tiene un ícono de código)

4. **Abre el archivo `prisma/schema.dbml`** desde tu proyecto y **copia TODO el contenido**

5. **Borra el contenido que viene por defecto** en dbdiagram.io

6. **Pega el código DBML** que copiaste

7. **El diagrama se generará automáticamente** en el panel derecho

---

## Método 2: Usar el Menú de Importación

1. En dbdiagram.io, busca el menú **"File"** o el ícono de **"..."** (tres puntos)

2. Busca la opción **"Import"** o **"Import DBML"**

3. Si no aparece, usa el **atajo de teclado:**
   - Presiona `Ctrl + /` (o `Cmd + /` en Mac) para abrir comandos
   - Escribe "import" y selecciona la opción

---

## Método 3: Arrastrar y Soltar

1. Abre el archivo `prisma/schema.dbml` en tu editor

2. Selecciona TODO el contenido y cópialo (`Ctrl + A`, luego `Ctrl + C`)

3. En dbdiagram.io, haz clic en el área del editor de código

4. Pega el contenido (`Ctrl + V`)

---

## Si Solo Ves la Opción de CSV

Si dbdiagram.io solo te muestra la opción de importar CSV, significa que estás en una vista diferente. 

**Solución:**
1. Ve a la página principal: [https://dbdiagram.io/d](https://dbdiagram.io/d)
2. Haz clic en **"Create New Diagram"** o **"New Project"**
3. Verás dos paneles: **código a la izquierda** y **diagrama a la derecha**
4. En el panel izquierdo (editor de código), pega el contenido de `schema.dbml`

---

## Contenido del Archivo schema.dbml

Si necesitas copiarlo manualmente, aquí está:

```dbml
// Diagrama ER para dbdiagram.io
// Ve a https://dbdiagram.io y pega este contenido

Table Race {
  id int [pk, increment]
  name varchar [not null]
  location varchar [not null]
  city varchar
  province varchar [indexed]
  country varchar [default: 'Argentina']
  discipline varchar [not null, indexed]
  modality varchar
  startDate datetime [not null, indexed]
  endDate datetime
  distance varchar
  elevation varchar
  stages int [default: 1]
  days int [default: 1]
  registrationUrl varchar
  description text
  contactEmail varchar
  contactPhone varchar
  website varchar
  instagram varchar
  facebook varchar
  stagesList text
  createdAt datetime [default: `now()`]
  updatedAt datetime [default: `now()`]
}
```

---

## Verificación

Después de pegar el código, deberías ver:
- Una tabla llamada "Race" en el diagrama
- Todos los campos listados
- Índices marcados visualmente
- El diagrama se actualiza automáticamente

---

## ¿Necesitas Ayuda?

Si aún no puedes importarlo, puedes:
1. **Crear el diagrama manualmente** en dbdiagram.io usando la interfaz visual
2. **Usar otra herramienta** como Draw.io
3. **Editar directamente** el archivo `prisma/schema.prisma` (más técnico)

