# Gestión de usuarios — GA7-220501096-AA4-EV03

Aplicación web para el registro e inicio de sesión de usuarios. El proyecto cuenta con un front-end desarrollado con React y una API REST desarrollada con Node.js y Express, con persistencia de datos en MongoDB.

## Objetivo

Desarrollar el módulo front-end del proyecto formativo, aplicando una estructura organizada, navegación funcional, código comentado y buenas prácticas de programación.

## Funcionalidades

- Registro de usuarios.
- Validación de datos del formulario.
- Almacenamiento seguro de contraseñas mediante `bcryptjs`.
- Inicio de sesión con correo y contraseña.
- Panel principal después del inicio de sesión.
- Cierre de sesión.
- API REST preparada para pruebas con Postman.

## Tecnologías

- Front-end: React 18, HTML5 y CSS3.
- Back-end: Node.js y Express.
- Base de datos: MongoDB con Mongoose.
- Seguridad de contraseñas: bcryptjs.
- CORS y dotenv.
- Pruebas de API: Postman.
- Versionamiento: Git y GitHub.

## Estructura del proyecto

```text
client/
├── index.html
├── styles.css
└── src/
    ├── App.js
    ├── main.js
    └── components/
        ├── Button.js
        ├── Dashboard.js
        ├── FormMessage.js
        ├── Input.js
        ├── Login.js
        └── Registro.js

server/
└── app.js

.env.example
.gitignore
package.json
README.md
REPOSITORIO.txt
```

## Requisitos previos

- Node.js instalado.
- MongoDB disponible de forma local o mediante MongoDB Atlas.
- Postman para probar la API.

## Instalación

1. Descomprimir el proyecto.
2. Abrir una terminal en la carpeta raíz.
3. Instalar las dependencias:

```bash
npm install
```

4. Crear un archivo `.env` tomando como referencia `.env.example`.
5. Configurar la conexión de MongoDB en `MONGODB_URI`.

Ejemplo:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/gestion_usuarios
PORT=3000
```

## Ejecución

Desde la carpeta raíz ejecutar:

```bash
npm start
```

La aplicación quedará disponible en:

```text
http://localhost:3000
```

El front-end se sirve desde el mismo servidor Express.

## API para Postman

### Registrar usuario

**POST** `http://localhost:3000/api/auth/register`

También está disponible el alias usado para las pruebas de Postman:
`POST http://localhost:3000/registro`

Body → raw → JSON:

```json
{
  "name": "Camilo Tibata",
  "email": "camilo@example.com",
  "password": "123456"
}
```

### Iniciar sesión

**POST** `http://localhost:3000/api/auth/login`

También está disponible el alias usado para las pruebas de Postman:
`POST http://localhost:3000/login`

Body → raw → JSON:

```json
{
  "email": "camilo@example.com",
  "password": "123456"
}
```

Los endpoints principales `/api/auth/register` y `/api/auth/login` mantienen compatibilidad con los alias `/registro` y `/login` usados en las pruebas de Postman. En estos alias se aceptan los nombres de campos `usuario`/`contraseña` además de `email`/`password`.


## Navegación del front-end

El flujo principal es:

```text
Registro → Inicio de sesión → Dashboard → Cerrar sesión
```

## Versionamiento y repositorio

El proyecto está preparado para ser gestionado mediante Git y publicado en GitHub. El enlace del repositorio se encuentra en `REPOSITORIO.txt`.

## Consideraciones

- Las contraseñas se almacenan mediante hash y no se envían al cliente.
- El archivo `.env` debe mantenerse fuera del repositorio.
- Se recomienda mantener MongoDB disponible antes de iniciar el servidor.
