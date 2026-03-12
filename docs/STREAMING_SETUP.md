# Guía de Configuración de Streaming Seguro 🔒

Para que el sistema de protección funcione correctamente, es **crítico** configurar el evento en YouTube Studio de la siguiente manera:

## 1. Configuración del Video/Evento

1.  Ve a [YouTube Studio](https://studio.youtube.com/).
2.  Crea o edita tu transmisión en vivo.
3.  En **Visibilidad**, selecciona: **No listado (Unlisted)**.
    *   *Esto evita que aparezca en búsquedas o en tu canal público.*

## 2. Restricción por Dominio (Domain Restriction)

Esta es la barrera más importante. Evita que alguien robe el código de inserción y lo ponga en otra web.

1.  Ve a la configuración de **Inserción (Embed)** del video.
    *   *Nota: En algunos canales nuevos, esta opción está en "Configuración avanzada" o requiere habilitar la API de YouTube.*
2.  Si usas una clave de transmisión persistente o API, busca la opción de **"Permitir inserción" (Allow embedding)** y asegúrate de que esté ACTIVADA.
3.  **Restricción de Referencia (Referrer/Origin)**:
    *   YouTube no tiene una interfaz visual simple para esto en todos los canales. La forma más efectiva de hacerlo cumplir es a través de la API o verificando que tu web sea la única que tiene el link.
    *   *Nuestro reproductor ya envía la señal de `origin`, por lo que si YouTube detecta una discrepancia masiva, puede bloquearlo, pero la medida más fuerte es mantener el video como No Listado.*

## 3. Recomendaciones Adicionales

*   **No compartir el link directo de YouTube**: Nunca envíes el link `youtube.com/watch?v=...` por WhatsApp o redes sociales. Solo comparte el link de tu web: `clubmalanzan.com.ar/live`.
*   **Monitoreo**: Durante el partido, ten abierto el panel de "Estadísticas en tiempo real" de YouTube. Si ves una fuente de tráfico externa desconocida, puedes detener la inserción y cambiar la clave, aunque esto cortaría la transmisión momentáneamente.

## Resumen para el Operador

| Configuración | Valor |
| :--- | :--- |
| **Visibilidad** | **No listado** |
| **Permitir Inserción** | **Sí** |
| **Link a compartir** | SOLO el de tu página web |
