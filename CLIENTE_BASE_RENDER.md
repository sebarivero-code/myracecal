# Cliente para acceder a la base de datos de Render

Guía paso a paso para conectarte a tu PostgreSQL en Render desde tu PC: ver tablas, ejecutar queries y explorar datos.

---

## Paso 1: Obtener la URL de conexión en Render

1. Entrá a [render.com](https://render.com) e iniciá sesión.
2. En el **Dashboard**, abrí tu base de datos PostgreSQL (ej. `agenda-biker-db`).
3. En la pestaña **Info**, buscá **Connections**.
4. Copiá la **External Database URL**. Se ve así:
   ```text
   postgresql://usuario:CONTRASEÑA@host.render.com:5432/nombre_base
   ```
   - Usá siempre la **External** (no la Internal); la Internal solo sirve dentro de Render.
   - Si hace falta, hacé clic en **Show** para ver la contraseña y copiarla.

Tené esa URL a mano; la vas a usar en el cliente.

---

## Paso 2: Elegir un cliente

Podés usar cualquiera de estos (todos funcionan con Render):

| Cliente   | Tipo        | Gratis        | Uso recomendado              |
|----------|-------------|---------------|-------------------------------|
| **pgAdmin** | Escritorio (GUI) | Sí            | Ver tablas, queries, exportar |
| **DBeaver** | Escritorio (GUI) | Sí (Community) | Igual que pgAdmin, muy usado  |
| **psql**    | Línea de comandos | Sí (viene con PostgreSQL) | Rápido, sin interfaz gráfica |

Abajo está el paso a paso para **pgAdmin** y para **psql**. Si preferís DBeaver, el flujo es muy parecido a pgAdmin (nueva conexión → PostgreSQL → pegar URL o datos).

---

## Opción A: Conectarte con pgAdmin

### 2.A.1 Instalar pgAdmin

1. Entrá a [pgadmin.org](https://www.pgadmin.org/download/).
2. Descargá la versión para tu sistema (Windows / macOS / Linux).
3. Instalá siguiendo el asistente (podés dejar todo por defecto).

### 2.A.2 Crear la conexión a Render

1. Abrí **pgAdmin**.
2. En el panel izquierdo, clic derecho en **Servers** → **Register** → **Server**.
3. Pestaña **General**:
   - **Name:** `Render` (o el nombre que quieras para identificar esta base).
4. Pestaña **Connection**:
   - **Host name/address:** lo que está después de `@` y antes de `:` en la URL.  
     Ejemplo: si la URL es `postgresql://user:pass@dpg-xxxxx-a.oregon-postgres.render.com:5432/dbname`, el host es `dpg-xxxxx-a.oregon-postgres.render.com`.
   - **Port:** `5432` (es el estándar; si tu URL tiene otro, usá ese).
   - **Maintenance database:** el nombre de la base (al final de la URL, ej. `dbname`). En Render suele ser el mismo que el nombre de la DB que elegiste al crearla.
   - **Username:** el usuario de la URL (ej. `user` en `postgresql://user:...`).
   - **Password:** la contraseña que está en la URL (entre `://user:` y `@host`).
   - Marcá **Save password** si querés que no te pida la contraseña cada vez.
5. Clic en **Save**. Si todo está bien, se conecta y en el panel izquierdo ves **Render** → **Databases** → tu base.

### 2.A.3 Ver tablas y ejecutar queries

- **Ver tablas:** expandí **Render** → **Databases** → tu base → **Schemas** → **public** → **Tables**. Ahí aparecen todas las tablas (Country, Province, Race, RaceEdition, etc.).
- **Ver datos de una tabla:** clic derecho en una tabla → **View/Edit Data** → **All Rows** (o **First 100 Rows**).
- **Ejecutar una query:**  
  - Clic derecho en la base → **Query Tool**,  
  - Escribí tu SQL (ej. `SELECT * FROM "Country";`)  
  - Clic en el botón de ejecutar (▶ o F5).

---

## Opción B: Conectarte con psql (línea de comandos)

Si tenés **PostgreSQL** instalado en tu PC, ya tenés el cliente `psql`.

### 2.B.1 Instalar PostgreSQL (si no lo tenés)

- **Windows:** [postgresql.org/download/windows](https://www.postgresql.org/download/windows/) → descargá el instalador y en los pasos de instalación marcá **Command Line Tools** (o instalar todo).
- **macOS:** `brew install libpq` y luego `brew link --force libpq`; o instalá Postgres.app desde [postgresapp.com](https://postgresapp.com).
- **Linux:** `sudo apt install postgresql-client` (Ubuntu/Debian) o el paquete equivalente.

### 2.B.2 Conectar

En PowerShell o terminal, ejecutá (reemplazá por tu **External Database URL** completa):

```bash
psql "postgresql://usuario:CONTRASEÑA@host.render.com:5432/nombre_base"
```

Ejemplo (con una URL de ejemplo):

```bash
psql "postgresql://usuario:abc123@dpg-xxxxx-a.oregon-postgres.render.com:5432/agenda_biker"
```

Si la contraseña tiene caracteres especiales (`@`, `#`, `%`, etc.), puede que tengas que escaparlos o poner la URL entre comillas simples en lugar de dobles según tu sistema.

Cuando conecte, vas a ver el prompt de psql, por ejemplo: `nombre_base=>`.

### 2.B.3 Comandos útiles en psql

| Comando              | Qué hace                         |
|----------------------|----------------------------------|
| `\dt`                 | Lista las tablas                 |
| `\d "NombreTabla"`    | Describe una tabla (columnas, tipos) |
| `SELECT * FROM "Country";` | Ejemplo de query (ejecutá y Enter) |
| `\q`                  | Salir de psql                    |

Ejemplo para ver países:

```sql
SELECT * FROM "Country";
```

Para ver carreras:

```sql
SELECT id, name, slug FROM "Race" LIMIT 10;
```

---

## Opción C: DBeaver (alternativa gráfica)

1. Descargá [DBeaver Community](https://dbeaver.io/download/) (gratis).
2. Instalá y abrí DBeaver.
3. **Database** → **New Database Connection** → elegí **PostgreSQL** → **Next**.
4. Podés pegar la **External Database URL** completa en el campo de URL si lo tiene, o completar:
   - **Host:** host de Render (ej. `dpg-xxxxx-a.oregon-postgres.render.com`).
   - **Port:** `5432`.
   - **Database:** nombre de la base.
   - **Username** y **Password:** los de la URL.
5. **Test Connection** → si pide descargar drivers, aceptá → **Finish**.
6. En el panel izquierdo expandí la conexión → **Schemas** → **public** → **Tables** para ver tablas; doble clic en una tabla para ver datos; **SQL Editor** (o Ctrl+]) para ejecutar queries.

---

## Resumen rápido

| Paso | Acción |
|------|--------|
| 1 | En Render → tu PostgreSQL → **Info** → copiar **External Database URL**. |
| 2 | Instalar un cliente: pgAdmin, DBeaver o psql. |
| 3 | En el cliente: nueva conexión PostgreSQL con Host, Puerto 5432, Base, Usuario y Contraseña de esa URL. |
| 4 | Conectado: ver tablas en **public**, abrir **Query Tool** (o SQL Editor) y ejecutar `SELECT` u otras queries. |

Si tenés **DATABASE_URL** en tu `.env` del proyecto, esa misma URL es la **External Database URL** de Render; podés usarla en pgAdmin, DBeaver o psql (no compartas ese archivo ni la URL con nadie).
