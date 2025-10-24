# Guía de Despliegue en GitHub Pages

## Despliegue Automático con GitHub Actions (Recomendado)

### Pasos:

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
   - En "Source", selecciona "GitHub Actions"

3. **¡Listo!** El workflow se ejecutará automáticamente y tu app estará disponible en:
   `https://TU_USUARIO.github.io/TU_REPOSITORIO/`

### El workflow automáticamente:
- ✅ Instala las dependencias
- ✅ Compila la aplicación
- ✅ Despliega a GitHub Pages

---

## Despliegue Manual (Alternativa)

Si prefieres compilar localmente:

1. **Instala dependencias:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Compila la aplicación:**
   \`\`\`bash
   npm run build
   \`\`\`

3. **Sube la carpeta `dist/` a GitHub:**
   - Crea una rama `gh-pages`
   - Sube solo el contenido de `dist/`
   - Configura GitHub Pages para usar la rama `gh-pages`

---

## Configuración Importante

El archivo `vite.config.ts` ya está configurado con:
\`\`\`typescript
base: '/qr-lap-counter/'
\`\`\`

**⚠️ IMPORTANTE:** Cambia `'/qr-lap-counter/'` por el nombre de tu repositorio:
- Si tu repo es `https://github.com/usuario/mi-app`, usa `base: '/mi-app/'`
- Si usas un dominio personalizado, usa `base: '/'`

---

## Solución de Problemas

### La app no carga correctamente
- Verifica que el `base` en `vite.config.ts` coincida con el nombre de tu repositorio
- Asegúrate de que GitHub Pages esté configurado correctamente en Settings

### El workflow falla
- Verifica que el archivo `package.json` esté en la raíz del repositorio
- Asegúrate de que la rama principal se llame `main` (o ajusta el workflow)

### Permisos de GitHub Actions
- Ve a Settings → Actions → General
- En "Workflow permissions", selecciona "Read and write permissions"
\`\`\`

```typescript file="" isHidden
