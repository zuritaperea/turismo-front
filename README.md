# Sistema de Turismo

Este es el proyecto Frontend del Sistema de Turismo SIT, diseñado para gestionar y mostrar información sobre destinos turísticos, actividades, y más.

## Requisitos

Para poder ejecutar este proyecto, asegúrate de tener instalados los siguientes requisitos previos:

- **Node.js** (Recomendado: versión 14 o superior). Puedes descargarlo desde [aquí](https://nodejs.org/).

## Instalación

1. **Instalar las dependencias del proyecto:**

   Ejecuta el siguiente comando en la raíz del proyecto para instalar las dependencias necesarias:

   ```bash
   npm install

2. **Configurar las variables de entorno:**

   Copia el archivo .env.example a .env ejecutando el siguiente comando:
   
    ```bash
    cp .env.example .env
   ```


   Luego, edita el archivo .env con los siguientes valores:
   
   ```bash
   PUBLIC_URL=/web   
   REACT_APP_STATUS=development
   REACT_APP_API_URL=https://url.com.ar
   REACT_APP_API_VERSION=/api/v1
   REACT_APP_AUTH_PATH=/oauth2/token/
   REACT_APP_CLIENT_ID=client_ID
   REACT_APP_CLIENT_SECRET=Secret-here
   REACT_APP_FILE_MAX_SIZE=10
   REACT_APP_IMAGE_DEFAULT=https://picsum.photos/200/300?random=1
   REACT_APP_DOCUMENT_TITLE=Turismo
   ```

   
   Asegúrate de reemplazar los valores de REACT_APP_CLIENT_ID y REACT_APP_CLIENT_SECRET con los datos correspondientes de tu aplicación.

   **Configuración del entorno**
   
   - PUBLIC_URL: Define la URL pública base donde se ejecutará la aplicación. Por ejemplo, /web si la aplicación estará bajo esa ruta en el servidor.   
   - REACT_APP_STATUS: El estado actual de la aplicación. Puede ser development, production, etc.   
   - REACT_APP_API_URL: La URL base de la API que el frontend utilizará para hacer solicitudes.   
   - REACT_APP_API_VERSION: La versión de la API que se está utilizando.   
   - REACT_APP_AUTH_PATH: Ruta para obtener el token de autenticación.   
   - REACT_APP_CLIENT_ID: El ID de cliente proporcionado por el servidor de autenticación.   
   - REACT_APP_CLIENT_SECRET: El secreto del cliente proporcionado por el servidor de autenticación.   
   - REACT_APP_FILE_MAX_SIZE: El tamaño máximo permitido para archivos (en MB) que los usuarios puedan cargar.   
   - REACT_APP_IMAGE_DEFAULT: Imagen predeterminada que se usará cuando no se encuentre una imagen de destino.   
   - REACT_APP_DOCUMENT_TITLE: Título por defecto de la pestaña del navegador.
   
4. **Construcción y despliegue**
   Generar los archivos estáticos para producción:
   
   Una vez que el archivo .env esté correctamente configurado, puedes ejecutar el siguiente comando para construir los archivos estáticos (HTML, JS, CSS) que serán servidos por el servidor web:
   
   ```bash
   npm run build
   ```


   Esto generará la carpeta build con los archivos optimizados listos para ser desplegados.

   **Scripts disponibles**
   
   - npm start: Inicia el servidor de desarrollo, y puedes ver la aplicación en http://localhost:3000.
   - npm run build: Crea una versión optimizada de la aplicación lista para producción.
   - npm run lint: Verifica el código y detecta posibles errores o problemas de estilo.
   - npm test: Ejecuta las pruebas automatizadas.
