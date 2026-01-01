# 🎨 Cómo Ver y Editar el Diagrama DER

Tienes varias opciones para visualizar y editar el diagrama de tu base de datos:

## 🌐 Opción 1: dbdiagram.io (Recomendado - Más Fácil)

**dbdiagram.io** es una herramienta web gratuita y muy fácil de usar.

### Pasos:

1. **Ve a:** [https://dbdiagram.io](https://dbdiagram.io)

2. **Crea una cuenta gratuita** (opcional, pero recomendado para guardar)

3. **Importa el archivo:**
   - Haz clic en "Import" o "New Project"
   - Selecciona "Import from DBML"
   - Abre el archivo `prisma/schema.dbml` desde tu proyecto
   - O simplemente copia y pega el contenido del archivo

4. **Edita el diagrama:**
   - Puedes editar directamente el código DBML
   - O usar la interfaz visual para agregar/eliminar campos
   - Los cambios se reflejan en tiempo real

5. **Exporta los cambios:**
   - Después de editar, copia el código DBML actualizado
   - Pégalo de vuelta en `prisma/schema.dbml`
   - Actualiza también `prisma/schema.prisma` con los cambios

### Ventajas:
- ✅ Gratis
- ✅ Muy fácil de usar
- ✅ Interfaz visual bonita
- ✅ Exporta a SQL, PDF, PNG
- ✅ Colaboración en tiempo real

---

## 🎨 Opción 2: Draw.io (diagrams.net)

**Draw.io** es una herramienta más completa para diagramas en general.

### Pasos:

1. **Ve a:** [https://app.diagrams.net](https://app.diagrams.net)

2. **Crea un nuevo diagrama:**
   - Selecciona "Entity Relationship" o "Database"
   - O crea desde cero

3. **Dibuja manualmente:**
   - Usa las formas de "Entity" para crear la tabla
   - Agrega los campos manualmente
   - Conecta relaciones si las hay

### Ventajas:
- ✅ Muy completo
- ✅ Muchas opciones de diseño
- ✅ Guarda en Google Drive, OneDrive, etc.

### Desventajas:
- ⚠️ Más manual (no importa automáticamente desde Prisma)

---

## 🔧 Opción 3: Prisma Studio (Solo Visualización)

**Prisma Studio** te permite ver y editar los **datos** (no el esquema) después de crear las tablas.

### Pasos:

1. **Después de crear las tablas en Supabase**, ejecuta:
   ```bash
   npm run db:studio
   ```

2. **Verás:**
   - Todas las tablas
   - Los datos en formato visual
   - Puedes editar datos directamente

### Nota:
- Esto es para ver/editar **datos**, no el **esquema**
- El esquema se edita en `prisma/schema.prisma`

---

## 📝 Opción 4: Editar Directamente el Schema de Prisma

Puedes editar el modelo directamente en el archivo:

**Archivo:** `prisma/schema.prisma`

### Ejemplo de cambios comunes:

#### Agregar un campo:
```prisma
model Race {
  // ... campos existentes ...
  organizerName String?  // Nuevo campo
}
```

#### Cambiar un campo de opcional a requerido:
```prisma
model Race {
  // Antes: city String?
  city String  // Ahora es requerido
}
```

#### Agregar un índice:
```prisma
model Race {
  // ... campos ...
  @@index([city])  // Nuevo índice
}
```

Después de editar, ejecuta:
```bash
npm run db:push
```

---

## 🚀 Recomendación

**Para empezar, usa dbdiagram.io:**

1. Abre [https://dbdiagram.io](https://dbdiagram.io)
2. Crea cuenta (gratis)
3. Haz clic en "Import" → "Import from DBML"
4. Selecciona o pega el contenido de `prisma/schema.dbml`
5. ¡Edita visualmente!

Luego, cuando estés satisfecho:
- Copia el código DBML actualizado
- Actualiza `prisma/schema.prisma` con los cambios correspondientes
- Ejecuta `npm run db:push` para aplicar los cambios

---

## 📁 Archivos del Proyecto

- `prisma/schema.prisma` - Schema de Prisma (editable directamente)
- `prisma/schema.dbml` - Schema en formato DBML (para dbdiagram.io)
- `prisma/DER_DIAGRAM.md` - Documentación del modelo

---

## 🔄 Flujo de Trabajo Recomendado

1. **Visualiza** en dbdiagram.io
2. **Edita** en dbdiagram.io o directamente en `schema.prisma`
3. **Aplica cambios** con `npm run db:push`
4. **Verifica** en Prisma Studio con `npm run db:studio`

