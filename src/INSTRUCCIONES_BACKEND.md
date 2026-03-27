# Instrucciones para conectar la Base de Datos (Google Apps Script)

Para que el sistema de reservas funcione y guarde los datos en un Google Sheet, sigue estos pasos:

1. **Crear un Google Sheet:**
   - Ve a [Google Sheets](https://sheets.google.com) y crea una nueva hoja de cálculo en blanco.
   - Nómbrala algo como "Regalos Bienvenida Evelyn".
   - En la primera fila, pon los siguientes encabezados en las columnas A a E: `Fecha`, `ID Regalo`, `Nombre Regalo`, `Nombre Invitado`, `Teléfono`.

2. **Abrir el Editor de Apps Script:**
   - En tu Google Sheet, ve al menú superior: **Extensiones > Apps Script**.
   - Se abrirá una nueva pestaña con el editor de código.

3. **Pegar el Código Backend:**
   - Borra cualquier código que haya en el editor (`function myFunction() { ... }`).
   - Copia todo el contenido del archivo `backend.gs` que generé para ti y pégalo en el editor.
   - Guarda el proyecto (icono de disquete o Ctrl+S / Cmd+S).

4. **Implementar como Aplicación Web (Crear el Webhook):**
   - En la esquina superior derecha del editor de Apps Script, haz clic en el botón azul **"Implementar"** (Deploy) y selecciona **"Nueva implementación"** (New deployment).
   - Haz clic en el icono de engranaje junto a "Seleccionar tipo" y elige **"Aplicación web"** (Web app).
   - Configura lo siguiente:
     - **Descripción:** "Webhook Reservas Evelyn"
     - **Ejecutar como:** "Yo" (Tu correo)
     - **Quién tiene acceso:** **"Cualquier persona"** (Anyone) -> *Esto es crucial para que la web pueda enviar datos sin pedir login.*
   - Haz clic en **"Implementar"**.
   - *Nota de seguridad:* Google te pedirá autorizar el script. Haz clic en "Revisar permisos", selecciona tu cuenta, haz clic en "Avanzado" (Advanced) y luego en "Ir a Proyecto (no seguro)" para conceder los permisos.

5. **Copiar la URL del Webhook:**
   - Una vez implementado, te dará una **"URL de la aplicación web"** (empieza con `https://script.google.com/macros/s/.../exec`).
   - Copia esa URL.

6. **Conectar el Front-end:**
   - Abre el archivo `src/App.tsx` en este proyecto.
   - Busca la constante `GOOGLE_SCRIPT_WEBHOOK_URL` (cerca de la línea 15).
   - Reemplaza el valor vacío con la URL que acabas de copiar.
   - ¡Listo! Ahora las reservas se guardarán automáticamente en tu Google Sheet.
