# 🧩 Chaos Zero: Nightmare - Team Builder

Sistema interactivo de selección de equipos para Chaos Zero con compatibilidades dinámicas, animaciones suaves y diseño responsivo.

![Team Builder Preview](https://img.shields.io/badge/Status-Ready%20for%20Deploy-success)
![Netlify Compatible](https://img.shields.io/badge/Netlify-Compatible-00C7B7)

## ✨ Características

- **Selección Inteligente**: Sistema de compatibilidad que filtra automáticamente personajes disponibles
- **Animaciones Fluidas**: Transiciones y efectos visuales modernos
- **Diseño Responsivo**: Funciona perfectamente en desktop, tablet y móvil
- **Colores por Afinidad**: Cada personaje muestra su color elemental único
- **Placeholders Automáticos**: Si falta una imagen, se genera un placeholder visual
- **Sin Dependencias**: Vanilla JavaScript puro, sin frameworks necesarios

## 🎮 Cómo Funciona

### Flujo de Selección

1. **Selecciona un DPS** → Define la base del equipo
2. **Selecciona un Sub DPS** → Solo muestra personajes compatibles con el DPS
3. **Selecciona un Healer** → Muestra healers compatibles o universales

### Reglas de Compatibilidad

- Algunos DPS pueden actuar como Sub DPS si son compatibles (ej: Haru ↔ Khalipe)
- Los healers universales (Mika, Rei, Nia) aparecen cuando no hay compatibilidad específica
- No se puede seleccionar el mismo personaje dos veces
- Al cambiar una selección previa, los slots posteriores se resetean si pierden compatibilidad

## 📁 Estructura del Proyecto

```
CompCZN/
├── index.html          # Página principal
├── styles.css          # Estilos y animaciones
├── script.js           # Lógica de selección
├── data.json           # Datos de personajes y compatibilidades
├── assets/
│   └── characters/     # Imágenes de personajes (PNG)
│       ├── haru.png
│       ├── khalipe.png
│       ├── mei_lin.png
│       └── ...
└── README.md           # Este archivo
```

## 🖼️ Agregar Imágenes de Personajes

Las imágenes deben colocarse en `assets/characters/` siguiendo esta nomenclatura:

| Personaje | Archivo |
|-----------|---------|
| Haru | `haru.png` |
| Mei Lin | `mei_lin.png` |
| Khalipe | `khalipe.png` |

**Reglas de nombrado:**
- Todo en minúsculas
- Espacios reemplazados por guiones bajos (`_`)
- Extensión `.png`

**Requisitos de imagen:**
- Formato: PNG (preferiblemente con transparencia)
- Tamaño recomendado: 200x200px mínimo
- Relación de aspecto: Cuadrada (1:1)

Ver lista completa en [`assets/characters/README.md`](assets/characters/README.md)

## 🚀 Despliegue en Netlify

### Opción 1: Arrastrar y Soltar (Más Fácil)

1. Ve a [Netlify](https://netlify.com) y crea una cuenta (gratis)
2. Arrastra la carpeta completa del proyecto a Netlify Drop
3. ¡Listo! Tu sitio estará en línea en segundos

### Opción 2: Deploy desde Git

1. Sube el proyecto a GitHub:
   ```bash
   git add .
   git commit -m "Initial commit: Team Builder"
   git push
   ```

2. En Netlify:
   - Click en "Add new site" → "Import an existing project"
   - Conecta tu repositorio de GitHub
   - Netlify detectará automáticamente la configuración
   - Click en "Deploy"

3. Configuración de build (opcional, Netlify lo detecta automáticamente):
   - **Build command**: (dejar vacío)
   - **Publish directory**: `.` (directorio raíz)

### Opción 3: Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Desplegar
netlify deploy --prod
```

## 🛠️ Desarrollo Local

Para probar localmente, necesitas un servidor web simple (debido a las peticiones fetch):

### Con Python 3:
```bash
python -m http.server 8000
```

### Con Node.js:
```bash
npx serve
```

### Con PHP:
```bash
php -S localhost:8000
```

Luego abre `http://localhost:8000` en tu navegador.

## 📊 Personalización

### Modificar Personajes y Compatibilidades

Edita el archivo `data.json`:

```json
{
  "characters": [
    {
      "name": "Nuevo Personaje",
      "role": "dps",
      "affinity": "#FF0000"
    }
  ],
  "compatibility": {
    "Nuevo Personaje": {
      "sub_candidates": ["Veronica", "Beryl"],
      "healer_candidates": ["Mika"]
    }
  }
}
```

### Cambiar Colores del Tema

En `styles.css`, modifica las variables CSS:

```css
:root {
    --accent-primary: #00d4ff;
    --accent-secondary: #8a3dff;
    --bg-dark: #0a0e1a;
}
```

### Ajustar Animaciones

Las animaciones están en `styles.css` bajo la sección `/* Animations */`

## 🎨 Características Técnicas

- **HTML5** semántico
- **CSS3** moderno con variables CSS y Grid/Flexbox
- **JavaScript ES6+** con clases y async/await
- **Animaciones CSS** optimizadas con GPU
- **Responsive Design** con media queries
- **Sin dependencias externas**

## 🔧 Resolución de Problemas

### Las imágenes no cargan
- Verifica que estén en `assets/characters/`
- Verifica el nombre del archivo (minúsculas, guiones bajos)
- El sistema mostrará un placeholder si falta la imagen

### El panel de selección no aparece
- Abre la consola del navegador (F12)
- Verifica que `data.json` se cargue correctamente
- Asegúrate de servir el sitio desde un servidor (no `file://`)

### Errores en Netlify
- Asegúrate de que todos los archivos estén en el repositorio
- Verifica que `index.html` esté en la raíz del proyecto

## 📝 Ejemplos de Equipos

### Equipo Balanceado
- **DPS**: Haru
- **Sub**: Magna
- **Healer**: Mika

### Equipo de Fuego
- **DPS**: Mei Lin
- **Sub**: Veronica
- **Healer**: Rei

### Equipo Especializado
- **DPS**: Luke
- **Sub**: Lucas
- **Healer**: Rei

## 📄 Licencia

Este proyecto es de código abierto. Puedes modificarlo y distribuirlo libremente.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios mayores:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🌟 Créditos

Desarrollado para la comunidad de **Chaos Zero: Nightmare**

---

**¿Tienes preguntas?** Abre un issue en el repositorio.

**¿Te gusta el proyecto?** Dale una estrella ⭐
