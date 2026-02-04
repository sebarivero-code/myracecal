# Cómo Obtener el GID de la Pestaña "Carreras"

## 📋 Pasos para Obtener el GID

1. **Abre tu Google Sheet** en el navegador

2. **Haz clic en la pestaña "Carreras"** (la pestaña inferior)

3. **Mira la URL del navegador** - debería verse algo así:
   ```
   https://docs.google.com/spreadsheets/d/11LO2JWgnk0C9fUCO6YQwvYxZSDkju5l7LsFG3gse_dw/edit#gid=1234567890
   ```

4. **Copia el número después de `#gid=`**
   - En el ejemplo de arriba, sería: `1234567890`
   - Este es el GID de la pestaña "Carreras"

5. **Agrega el GID a tu `.env.local`**:
   ```env
   RACES_TAB_GID=1234567890
   ```

## 🚀 Ejecutar el Script

Una vez configurado el GID:

```bash
npm run migrate:races-without-edition
```

El script:
- ✅ Lee todas las carreras de la pestaña "Carreras"
- ✅ Verifica cuáles ya tienen edición 2026 en la base de datos
- ✅ Migra solo las que NO tienen edición 2026
- ✅ Crea solo el registro `Race` (sin `RaceEdition` porque no tienen fecha)

## 📝 Nota

Si no configuras `RACES_TAB_GID`, el script intentará usar el GID de la URL en `GOOGLE_SHEET_URL`, pero podría no ser el correcto si esa URL apunta a otra pestaña (como "2026").
