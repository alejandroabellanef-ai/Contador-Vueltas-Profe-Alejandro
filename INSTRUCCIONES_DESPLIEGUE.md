# 📦 Instrucciones para Desplegar en GitHub Pages

## Paso 1: Generar el archivo de bloqueo de NPM

Antes de subir el proyecto a GitHub, debes generar el archivo `package-lock.json`:

\`\`\`bash
# Elimina node_modules si existe
rm -rf node_modules

# Instala las dependencias con NPM (esto generará package-lock.json)
npm install
\`\`\`

Esto creará el archivo `package-lock.json` que GitHub Actions necesita.

## Paso 2: Subir el proyecto a GitHub

\`\`\`bash
# Inicializa el repositorio (si no lo has hecho)
git init

# Añade todos los archivos
git add .

# Haz commit (asegúrate de que package-lock.json esté incluido)
git commit -m "Initial commit con package-lock.json"

# Conecta con tu repositorio de GitHub
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# Sube los archivos
git push -u origin main
\`\`\`

## Paso 3: Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona **GitHub Actions**

## Paso 4: Esperar el despliegue

El workflow de GitHub Actions se ejecutará automáticamente y desplegará tu aplicación. Puedes ver el progreso en la pestaña **Actions** de tu repositorio.

Una vez completado, tu aplicación estará disponible en:
\`\`\`
https://TU_USUARIO.github.io/TU_REPOSITORIO/
\`\`\`

## ⚠️ Importante

- **SIEMPRE** incluye el archivo `package-lock.json` en tu repositorio
- Si haces cambios en las dependencias, ejecuta `npm install` de nuevo para actualizar el `package-lock.json`
- El archivo `.gitignore` ya está configurado para NO ignorar `package-lock.json`

## 🔧 Desarrollo Local

Para trabajar en el proyecto localmente:

\`\`\`bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar la versión de producción
npm run preview
\`\`\`

## 📱 Versión Estática Alternativa

Si prefieres no usar el proceso de compilación, puedes usar los archivos en la carpeta `static/`:
- Copia `static/index.html`, `static/styles.css` y `static/app.js` a la raíz de tu repositorio
- Estos archivos funcionan directamente sin necesidad de compilación
\`\`\`

```gitignore file="" isHidden
