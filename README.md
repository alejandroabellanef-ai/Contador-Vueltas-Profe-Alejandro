# Control de Vueltas QR - Educación Física

Sistema de seguimiento de circuitos deportivos mediante códigos QR para profesores de Educación Física.

## Características

- **Gestión de alumnos**: Añade alumnos y genera códigos QR únicos imprimibles
- **Códigos QR reutilizables**: Los alumnos llevan el código QR impreso, sin necesidad de teléfono
- **Escaneo automático**: La cámara detecta y registra automáticamente los códigos QR
- **Control de tiempo**: Sistema de cooldown de 15 segundos para evitar escaneos duplicados
- **Estadísticas completas**: Vueltas, tiempos por vuelta, distancia total recorrida
- **Exportación de datos**: Descarga los resultados en formato CSV

## Despliegue en GitHub Pages

### Archivos Listos para Producción

Los archivos estáticos listos para GitHub Pages están en la carpeta **`static/`**:
- `static/index.html`
- `static/styles.css`
- `static/app.js`

### Pasos para Desplegar

1. **Copia los archivos de la carpeta `static/` a la raíz de tu repositorio de GitHub**

2. **Activa GitHub Pages:**
   - Ve a tu repositorio en GitHub
   - Settings → Pages
   - En "Source", selecciona la rama `main` y carpeta `/ (root)`
   - Guarda los cambios

3. Tu aplicación estará disponible en:
   `https://TU_USUARIO.github.io/TU_REPOSITORIO/`

### Estructura para GitHub Pages

Tu repositorio debe tener esta estructura:
\`\`\`
tu-repositorio/
├── index.html      (copia de static/index.html)
├── styles.css      (copia de static/styles.css)
├── app.js          (copia de static/app.js)
└── README.md
\`\`\`

## Uso

1. **Añadir alumnos**: Ve a "Gestión de Alumnos" y añade los nombres de tus alumnos
2. **Imprimir QR**: Haz clic en "Imprimir Todos los QR" para obtener una hoja imprimible con los códigos QR
3. **Crear sesión**: Configura una nueva sesión con la distancia por vuelta (ej: 400m)
4. **Escanear**: Durante la actividad, escanea los códigos QR cuando los alumnos pasen por la zona de control
5. **Ver resultados**: Consulta las estadísticas en tiempo real y exporta los datos en CSV

## Tecnologías

- HTML5
- CSS3
- JavaScript (Vanilla)
- html5-qrcode (CDN) para escaneo de QR
- qrcode.js (CDN) para generación de códigos QR
- LocalStorage para persistencia de datos

## Licencia

MIT
