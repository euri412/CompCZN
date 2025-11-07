# Imágenes Cuadradas para Panel de Selección

Esta carpeta contiene las imágenes cuadradas de los personajes que se muestran en el panel de selección.

## Especificaciones:

- **Formato**: PNG con transparencia (recomendado)
- **Resolución**: 400x400 píxeles
- **Aspecto**: Cuadrado (1:1)
- **Nombre de archivo**: Debe coincidir con el ID del personaje en data.json

## Ejemplo:

Si en `data.json` tienes un personaje con `"id": "harumasa"`, la imagen debe llamarse:
```
harumasa.png
```

## Notas:

- Las imágenes se mostrarán con bordes redondeados (8px radius)
- Se aplicará un borde cyan con efecto glow al hacer hover
- Tamaño de visualización en el panel: 90x90px (redimensionado automáticamente)
