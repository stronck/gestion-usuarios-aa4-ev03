# Gestión de usuarios — GA7-220501096-AA4-EV03

Aplicación web de gestión de usuarios con registro e inicio de sesión, construida con un front-end React mediante componentes reutilizables y una API REST con Express y MongoDB.

## Tecnologías

- Node.js
- Express
- MongoDB
- Mongoose
- React 18 mediante CDN
- JavaScript
- HTML5 y CSS3

## Estructura

```text
.
├── client/
│   ├── index.html
│   ├── package.json
│   ├── styles.css
│   └── src/
│       ├── App.js
│       ├── main.js
│       └── components/
│           ├── Button.js
│           ├── Dashboard.js
│           ├── FormMessage.js
│           ├── Input.js
│           ├── Login.js
│           └── Registro.js
├── server/
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
└── REPOSITORIO.txt
```

## Requisitos

- Node.js 18 o superior.
- MongoDB local o una instancia compatible.

## Configuración

1. Instala las dependencias:

```bash
npm install
```

2. Crea un archivo `.env` a partir de `.env.example` y configura la conexión de MongoDB.

3. Inicia el servidor:

```bash
npm start
```

La aplicación utiliza el puerto `3000` por defecto.

## API

### Registrar usuario

`POST /api/auth/register`

```json
{
  "name": "Nombre del usuario",
  "email": "usuario@correo.com",
  "password": "123456"
}
```

### Iniciar sesión

`POST /api/auth/login`

```json
{
  "email": "usuario@correo.com",
  "password": "123456"
}
```

La respuesta de inicio de sesión devuelve los datos públicos del usuario. Esta versión del proyecto no implementa JWT ni sesiones persistentes: el front-end mantiene el usuario autenticado únicamente en el estado de React.

## Seguridad

- Las contraseñas se almacenan mediante hash con `bcryptjs` y nunca se guardan en texto plano.
- La API compara la contraseña recibida con el hash almacenado usando `bcrypt.compare`.
- El correo se normaliza antes de consultar y registrar usuarios.
- El endpoint de login no devuelve el hash de contraseña.
- No se utiliza token JWT en esta implementación.

## Ejecución

Después de iniciar el servidor, abre `http://localhost:3000` en el navegador.
