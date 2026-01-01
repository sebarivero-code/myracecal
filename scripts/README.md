# Scripts de Importación

## Importar desde Google Sheets

### Pasos:

1. **Exporta tu Google Sheet como CSV:**
   - Abre tu Google Sheet
   - Archivo → Descargar → Valores separados por comas (.csv)

2. **Guarda el archivo:**
   - Guarda el archivo como `races.csv` en esta carpeta (`scripts/`)

3. **Ajusta el mapeo de columnas:**
   - Abre `import-from-sheets.ts`
   - Edita el objeto `COLUMN_MAPPING` para que coincida con los nombres de las columnas de tu planilla
   - Ejemplo: Si tu columna se llama "Nombre de la Carrera", cambia `name: 'Nombre'` a `name: 'Nombre de la Carrera'`

4. **Ejecuta el script:**
   ```bash
   npm run import:sheets
   ```

### Formato esperado del CSV:

Las columnas mínimas requeridas son:
- **Nombre** (o el nombre que uses): Nombre de la carrera
- **Fecha Inicio** (o el nombre que uses): Fecha en formato YYYY-MM-DD, DD/MM/YYYY, o DD-MM-YYYY
- **Ubicación** o **Ciudad**: Ubicación de la carrera

Columnas opcionales:
- Provincia
- Disciplina (Ruta, MTB, Rally, Gravel, etc.)
- Modalidad (Individual, En parejas, Equipos)
- Fecha Fin
- Distancia (ej: "116 km")
- Altimetría (ej: "2500m")
- Etapas (número)
- Días (número)
- URL Inscripción
- Email
- Teléfono
- Sitio Web
- Instagram

### Ejemplo de CSV:

```csv
Nombre,Fecha Inicio,Ubicación,Provincia,Disciplina,Distancia
100k de los Palmares Rally Bike,2024-03-15,Colón,Entre Ríos,Rally,116 km
2º desafío Cristo Rey del Valle,2024-03-20,Tupungato,Mendoza,Rally,
```

