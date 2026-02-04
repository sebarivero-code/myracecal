# Resumen Ejecutivo - DER Mi Calendario MTB

## 📊 Entidades Principales (12 tablas)

### 🔐 Autenticación (3 tablas)
1. **User** - Usuarios del sistema
2. **Account** - Cuentas de autenticación externa (Google, etc.)
3. **Session** - Sesiones activas

### 👤 Usuario y Preferencias (2 tablas)
4. **UserPreferences** - Preferencias para pre-cargar filtros
5. **UserCalendar** - Carreras en el calendario personal

### 🌍 Ubicación (2 tablas)
6. **Country** - Países disponibles
7. **Province** - Provincias/estados por país

### 🏁 Carreras (3 tablas)
8. **Race** - Información base de carreras
9. **RaceEdition** - Ediciones anuales de carreras (con provincia obligatoria)
10. **Stage** - Etapas de cada edición

### 👥 Organización (1 tabla)
11. **RaceOrganizer** - Relación usuarios-carreras (organizadores)

### ⚠️ Moderación (1 tabla)
12. **RaceReport** - Denuncias de organizadores

---

## 🎯 Requerimientos Funcionales Cubiertos

### ✅ Usuario y Autenticación
- [x] Sistema de login (Account, Session)
- [x] Perfiles de usuario con privacidad configurable (User.privacyLevel)
- [x] Visualización de perfiles de corredores

### ✅ Calendario Personal
- [x] Agregar edición a "Mi calendario" (UserCalendar - solo ediciones)
- [x] Visualizar "Mi Calendario" (UserCalendar con joins a RaceEdition)
- [x] Los usuarios solo ven ediciones, no carreras completas

### ✅ Preferencias
- [x] Setear preferencias en el perfil (UserPreferences)
- [x] Pre-cargar filtros según preferencias (UserPreferences)

### ✅ Organización de Carreras
- [x] Marcar carrera como "Soy parte de la organización" (RaceOrganizer)
- [x] Listar mis carreras (RaceOrganizer WHERE userId = X)
- [x] Listar co-organizadores de una carrera (RaceOrganizer WHERE raceId = X)
- [x] Seleccionar co-organizador como principal (RaceOrganizer.isPrimary)
- [x] Quitar a otro usuario como co-organizador (DELETE RaceOrganizer)

### ✅ Gestión de Carreras
- [x] Crear una nueva carrera (Race)
- [x] Crear nueva edición para una carrera (RaceEdition)
- [x] Editar una carrera (UPDATE Race)
- [x] Editar una edición (UPDATE RaceEdition)
- [x] Editar una etapa (UPDATE Stage)

### ✅ Denuncias
- [x] Denunciar organizador de una carrera (RaceReport)
- [x] Envío automático de email al administrador (sebarivero@gmail.com)
- [x] El sistema NO gestiona corrección/resolución de denuncias

### ✅ Privacidad
- [x] Configurar privacidad en el perfil (User.privacyLevel)

---

## 🔑 Decisiones de Diseño Clave

### 1. Separación Race / RaceEdition
**Razón:** Permite mantener información histórica y reutilizar datos entre años.

**Ejemplo:**
- Race: "Carrera de la Montaña" (nombre, disciplina)
- RaceEdition: "Carrera de la Montaña 2026" (fechas, distancias, ubicación de 2026)

### 1.1. Ubicación en Edición
**Razón:** Una carrera puede cambiar de ubicación entre ediciones.

**Ejemplo:**
- RaceEdition 2025: Provincia "Córdoba", ciudad "Villa Carlos Paz"
- RaceEdition 2026: Provincia "Buenos Aires", ciudad "La Plata"

**Restricción:** Cada edición DEBE tener una provincia (provinceId NOT NULL)

### 2. Países y Provincias Normalizados
**Razón:** Permite filtros eficientes y facilita expansión a otros países.

**Estructura:**
- Country: Países (Argentina, Chile, etc.)
- Province: Provincias relacionadas con países
- RaceEdition: Cada edición pertenece a una provincia (obligatorio)

**Beneficios:**
- Filtros por país/provincia eficientes
- Validación de datos consistente
- Facilita expansión internacional

### 3. UUID en lugar de Int
**Razón:** Mayor seguridad (no se pueden adivinar IDs) y mejor para sistemas distribuidos.

### 4. Soft Deletes (isActive)
**Razón:** Permite desactivar sin perder datos históricos.

### 5. Normalización de Organizadores
**Razón:** Un usuario puede organizar múltiples carreras, una carrera puede tener múltiples organizadores.

### 6. Calendario Solo con Ediciones
**Razón:** Los usuarios solo ven y agregan ediciones específicas, no carreras completas.

**Flujo de creación de edición:**
1. Usuario quiere dar de alta una edición
2. Sistema lista carreras existentes para evitar duplicados
3. Si encuentra la carrera: usuario selecciona y crea edición con fecha obligatoria
4. Si NO encuentra: usuario crea carrera desde cero, sistema crea automáticamente Race + RaceEdition

---

## 📈 Escalabilidad

### Índices Estratégicos
- Búsquedas por fecha (RaceEdition.startDate)
- Filtros por ubicación (Province.countryId, RaceEdition.provinceId)
- Filtros por disciplina (Race.discipline)
- Consultas de organizadores (RaceOrganizer.userId, RaceOrganizer.raceId)
- Calendario del usuario (UserCalendar.userId, UserCalendar.editionId)

### Optimizaciones Futuras
- Considerar particionamiento por año en RaceEdition
- Cache de consultas frecuentes (carreras activas, organizadores)
- Full-text search en Race.name y Race.description

---

## 🔒 Seguridad

### Validaciones a Implementar
1. **RaceOrganizer**: Solo organizadores principales pueden agregar/quitar co-organizadores
2. **RaceReport**: Un usuario no puede denunciarse a sí mismo
3. **UserCalendar**: Usuarios solo pueden ver su propio calendario
4. **RaceEdition**: Solo organizadores pueden crear/editar ediciones

### Auditoría
- Campos `createdAt` y `updatedAt` en todas las tablas
- Campo `addedBy` en RaceOrganizer para rastrear quién agregó organizadores
- Campo `reviewedBy` en RaceReport para rastrear moderación

---

## 📝 Próximos Pasos

1. **Revisar DER** con el equipo
2. **Ajustar** según feedback
3. **Generar schema Prisma** desde el DER
4. **Crear migraciones** iniciales
5. **Migrar datos desde Google Sheets** (ver `MIGRACION_GOOGLE_SHEETS.md`)
6. **Implementar validaciones** de negocio
7. **Configurar índices** en producción

---

## 📧 Integración de Email para Denuncias

### Configuración Requerida
- **Servicio de email:** Configurar servicio SMTP o API de email (ej: SendGrid, AWS SES, Resend)
- **Template de email:**
  - **Destinatario:** sebarivero@gmail.com
  - **Asunto:** "Denuncia: Organizador mal asignado"
  - **Cuerpo:**
    ```
    Usuario que denuncia: [nombre del usuario] ([email])
    Carrera: [nombre de la carrera]
    
    Mensaje:
    [texto ingresado por el usuario - máximo 1000 caracteres]
    ```

### Flujo
1. Usuario crea denuncia en la app
2. Sistema guarda denuncia en base de datos (RaceReport)
3. Sistema envía email automáticamente al administrador
4. Administrador revisa y resuelve fuera del sistema

## ❓ Preguntas para Definir

1. ¿Necesitamos historial de cambios en carreras/ediciones?
2. ¿Los usuarios pueden seguir a otros usuarios?
3. ¿Necesitamos sistema de notificaciones?
4. ¿Hay límite de co-organizadores por carrera?
5. ¿Qué servicio de email usar para enviar las denuncias?
