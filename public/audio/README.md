# Audio Ambiental - Olas del Mar (PAUSA)

Este directorio está preparado para alojar el archivo de audio ambiental real si se desea utilizar una grabación externa específica.

- **Ruta esperada**: `/audio/ocean-waves.mp3` (archivo ubicado en `public/audio/ocean-waves.mp3`).
- **Formato recomendado**: MP3 estéreo optimizado, 64-128 kbps, loop continuo suave.
- **Funcionamiento automático**:
  1. Si `ocean-waves.mp3` existe en esta carpeta, el reproductor de PAUSA lo detectará y reproducirá en bucle continuo de fondo con fade-in y fade-out suaves.
  2. Si no existe ningún archivo o si la conexión falla, el motor acústico de PAUSA genera automáticamente olas del mar orgánicas y continuas mediante la Web Audio API (ruido browniano modelado con osciladores LFO de 10-12s y filtros paso-bajo resonantes).
