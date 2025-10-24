# Control de Vueltas QR - Educación Física

Sistema de seguimiento de circuitos deportivos mediante códigos QR para profesores de Educación Física.

## Características

- **Gestión de alumnos**: Añade alumnos y genera códigos QR únicos imprimibles
- **Códigos QR reutilizables**: Los alumnos llevan el código QR impreso, sin necesidad de teléfono
- **Escaneo automático**: La cámara detecta y registra automáticamente los códigos QR
- **Control de tiempo**: Sistema de cooldown de 15 segundos para evitar escaneos duplicados
- **Estadísticas completas**: Vueltas, tiempos por vuelta, distancia total recorrida
- **Exportación de datos**: Descarga los resultados en formato CSV

## Instalación Local

\`\`\`bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview
\`\`\`

## Despliegue en GitHub Pages (Automático)

### Opción 1: Con GitHub Actions (Recomendado)

1. **Sube el código a GitHub:**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   \`\`\`

2. **Configura GitHub Pages:**
   - Ve a tu repositorio en GitHub
   - Settings → Pages
   - En "Source", selecciona **"GitHub Actions"**

3. **Configura permisos:**
   - Settings → Actions → General
   - En "Workflow permissions", selecciona **"Read and write permissions"**

4. El workflow `.github/workflows/deploy.yml` se ejecutará automáticamente y tu app estará disponible en:
   `https://TU_USUARIO.github.io/TU_REPOSITORIO/`

### Opción 2: Despliegue Manual

1. Compila el proyecto:
   \`\`\`bash
   npm run build
   \`\`\`

2. Los archivos estáticos estarán en la carpeta `dist/`

3. Sube el contenido de `dist/` a una rama `gh-pages`:
   \`\`\`bash
   git checkout -b gh-pages
   git add dist -f
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix dist origin gh-pages
   \`\`\`

4. Configura GitHub Pages para usar la rama `gh-pages`

## Uso

1. **Añadir alumnos**: Ve a "Gestionar Alumnos" y añade los nombres de tus alumnos
2. **Imprimir QR**: Haz clic en "Imprimir Todos los QR" para obtener una hoja imprimible
3. **Crear sesión**: Configura una nueva sesión con la distancia por vuelta (ej: 400m)
4. **Escanear**: Durante la actividad, escanea los códigos QR cuando los alumnos pasen por la zona de control
5. **Ver resultados**: Consulta las estadísticas en tiempo real y exporta los datos en CSV

## Tecnologías

- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- html5-qrcode para escaneo de QR
- qrcode para generación de códigos QR
- LocalStorage para persistencia de datos

## Licencia

MIT
