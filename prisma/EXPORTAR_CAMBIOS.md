# 📤 Cómo Exportar Cambios desde dbdiagram.io

## Pasos para Exportar y Aplicar Cambios

### 1. Exportar el Código DBML desde dbdiagram.io

1. **En dbdiagram.io**, después de hacer tus cambios, busca el botón de **"Export"** o **"Download"**
   - Generalmente está en la parte superior derecha
   - O en el menú (ícono de tres líneas ☰)

2. **Selecciona "Export as DBML"** o **"Download DBML"**
   - Esto descargará un archivo `.dbml` o te mostrará el código

3. **Copia el código completo** que aparece

---

### 2. Actualizar el Archivo en tu Proyecto

Tienes dos opciones:

#### Opción A: Actualizar el archivo DBML (para referencia)

1. Abre el archivo: `C:\app\prisma\schema.dbml`
2. Reemplaza TODO el contenido con el código que copiaste de dbdiagram.io
3. Guarda el archivo

#### Opción B: Actualizar el Schema de Prisma (necesario para aplicar cambios)

1. Abre el archivo: `C:\app\prisma\schema.prisma`
2. Actualiza el modelo `Race` según los cambios que hiciste en dbdiagram.io

---

### 3. Aplicar los Cambios a la Base de Datos

Después de actualizar `schema.prisma`, ejecuta:

```bash
npm run db:push
```

Esto aplicará los cambios a tu base de datos de Supabase.

---

## 📋 Mapeo de Tipos: DBML → Prisma

Cuando actualices `schema.prisma`, recuerda estos mapeos:

| DBML (dbdiagram.io) | Prisma |
|---------------------|--------|
| `int` | `Int` |
| `varchar` | `String` |
| `text` | `String` |
| `datetime` | `DateTime` |
| `[pk]` | `@id` |
| `[increment]` | `@default(autoincrement())` |
| `[not null]` | (sin `?` en Prisma) |
| (sin `[not null]`) | (con `?` en Prisma = opcional) |

---

## 🔄 Ejemplo de Conversión

### En DBML (dbdiagram.io):
```dbml
Table Race {
  id int [pk, increment]
  name varchar [not null]
  city varchar
  startDate datetime
}
```

### En Prisma (schema.prisma):
```prisma
model Race {
  id        Int      @id @default(autoincrement())
  name      String   // requerido (sin ?)
  city      String?  // opcional (con ?)
  startDate DateTime
}
```

---

## 💡 Forma Más Fácil: Compartir el Código

**La forma más fácil es:**

1. **Copia el código DBML** desde dbdiagram.io (del editor de código)
2. **Pégamelo aquí en el chat** y yo te ayudo a:
   - Convertirlo a Prisma
   - Actualizar el archivo `schema.prisma`
   - Verificar que todo esté correcto

---

## 📝 Checklist Después de Editar

- [ ] Exporté el código DBML desde dbdiagram.io
- [ ] Actualicé `prisma/schema.dbml` (opcional, para referencia)
- [ ] Actualicé `prisma/schema.prisma` con los cambios
- [ ] Ejecuté `npm run db:push` para aplicar cambios
- [ ] Verifiqué en Prisma Studio: `npm run db:studio`

---

## 🆘 Si Necesitas Ayuda

Si tienes dudas sobre cómo convertir algo específico:
1. **Pégame el código DBML** que exportaste
2. O **dime qué cambios hiciste** y yo te ayudo a actualizar el schema de Prisma

