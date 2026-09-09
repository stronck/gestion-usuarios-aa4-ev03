// Carga las variables definidas en el archivo .env.
require('dotenv').config();

// Importa las dependencias principales del servidor.
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Crea la aplicación de Express y define el puerto de trabajo.
const app = express();
const PORT = Number(process.env.PORT) || 3000;

// MongoDB es necesaria para que los usuarios permanezcan guardados.
// Si no existe la variable de conexión, se detiene el servidor para evitar
// que la aplicación funcione con datos temporales o inconsistentes.
if (!process.env.MONGODB_URI) {
  throw new Error(
    'MONGODB_URI no está configurada. Configura MongoDB en el archivo .env antes de iniciar el servidor.'
  );
}

// Permite recibir peticiones desde otros orígenes y procesar JSON.
app.use(cors());
app.use(express.json());

// Define la estructura que tendrá cada usuario en MongoDB.
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Crea el modelo que permite guardar y consultar usuarios.
const User = mongoose.model('User', UserSchema);

// Abre la conexión con MongoDB antes de iniciar el servidor.
async function connectMongo() {
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });

  console.log('MongoDB conectado correctamente.');
}

// Valida y normaliza los datos recibidos antes de consultar o modificar MongoDB.
function validateUserInput(name, email, password) {
  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    return 'Nombre, correo y contraseña deben ser textos válidos.';
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanName || !cleanEmail || !password.trim()) {
    return 'Nombre, correo y contraseña son obligatorios.';
  }

  if (cleanName.length < 2 || cleanName.length > 80) {
    return 'El nombre debe tener entre 2 y 80 caracteres.';
  }

  if (cleanEmail.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return 'Ingresa un correo electrónico válido.';
  }

  if (password.length < 6 || password.length > 128) {
    return 'La contraseña debe tener entre 6 y 128 caracteres.';
  }

  return null;
}

// Registra un nuevo usuario en MongoDB.
const registerUser = async (req, res) => {
  try {
    // Obtiene los datos enviados en el cuerpo de la petición.
    const body = req.body || {};
    const name = body.name ?? body.usuario;
    const email = body.email ?? body.correo;
    const password = body.password ?? body.contraseña;

    const validationError = validateUserInput(name, email, password);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    // La contraseña nunca se guarda directamente en la base de datos.
    // bcrypt genera un hash que posteriormente puede comprobarse durante el login.
    const userData = {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      password: await bcrypt.hash(String(password), 10)
    };

    // Guarda el usuario en MongoDB.
    await User.create(userData);

    // Indica que el recurso fue creado correctamente.
    return res.status(201).json({
      message: 'Usuario registrado correctamente.'
    });

  } catch (error) {
    // Registra el error en la consola del servidor sin exponer detalles internos.
    // MongoDB usa el código 11000 cuando se intenta repetir un correo único.
    if (error && error.code === 11000) {
      return res.status(409).json({
        message: 'El correo electrónico ya está registrado.'
      });
    }

    console.error('Error en registro:', error.message);

    return res.status(500).json({
      message: 'Error interno al registrar el usuario.'
    });
  }
};

// Endpoint principal de registro y alias compatible con las pruebas de Postman.
app.post('/api/auth/register', registerUser);
app.post('/registro', registerUser);

// Comprueba las credenciales de un usuario registrado.
const loginUser = async (req, res) => {
  try {
    const body = req.body || {};
    const identifier = body.usuario ?? body.email ?? body.correo;
    const password = body.password ?? body.contraseña;
    const usingUsername = body.usuario !== undefined;

    // Valida tipos y campos para que entradas inesperadas no provoquen errores.
    if (typeof identifier !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        message: 'Usuario/correo y contraseña deben ser textos válidos.'
      });
    }

    if (!identifier.trim() || !password) {
      return res.status(400).json({
        message: 'Usuario/correo y contraseña son obligatorios.'
      });
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();

    // Si Postman envía "email" o "correo", se valida el formato del correo.
    // Si envía "usuario", se permite un nombre de usuario como en la guía de pruebas.
    if (!usingUsername &&
        (normalizedIdentifier.length > 150 ||
         !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedIdentifier))) {
      return res.status(400).json({
        message: 'Ingresa un correo electrónico válido.'
      });
    }

    if (normalizedIdentifier.length > 150) {
      return res.status(400).json({
        message: 'El usuario/correo no puede superar los 150 caracteres.'
      });
    }

    if (password.length > 128) {
      return res.status(400).json({
        message: 'La contraseña no puede superar los 128 caracteres.'
      });
    }

    // Busca el usuario por su correo electrónico.
    // Permite iniciar sesión usando correo electrónico o nombre de usuario.
    const user = usingUsername
      ? await User.findOne({ name: identifier.trim() })
      : await User.findOne({ email: normalizedIdentifier });

    // Si no existe, devuelve un mensaje general de credenciales incorrectas.
    if (!user) {
      return res.status(401).json({
        message: 'Credenciales incorrectas.'
      });
    }

    // Compara la contraseña recibida con el hash almacenado.
    const validPassword = await bcrypt.compare(
      String(password),
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: 'Credenciales incorrectas.'
      });
    }

    // Solo devuelve información pública del usuario.
    // El hash de la contraseña nunca se envía al cliente.
    const safeUser = {
      id: String(user._id),
      name: user.name,
      email: user.email
    };

    return res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      user: safeUser
    });

  } catch (error) {
    console.error('Error en login:', error.message);

    return res.status(500).json({
      message: 'Error interno al iniciar sesión.'
    });
  }
};

// Endpoint principal de login y alias compatible con las pruebas de Postman.
app.post('/api/auth/login', loginUser);
app.post('/login', loginUser);

// Responde de forma controlada ante JSON mal formado enviado desde Postman u otro cliente.
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ message: 'El cuerpo de la petición contiene JSON inválido.' });
  }
  return next(error);
});

// Devuelve JSON para rutas de API inexistentes en lugar de una página HTML.
app.use('/api', (req, res) => {
  return res.status(404).json({ message: 'Endpoint no encontrado.' });
});

// Sirve el contenido del front-end desde el mismo servidor.
const clientPath = path.join(__dirname, '..', 'client');
app.use(express.static(clientPath));

// Permite que las rutas del front-end puedan resolverse correctamente.
// Las rutas que comienzan por /api quedan disponibles para los endpoints anteriores.
app.get('/*splat', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  return res.sendFile(
    path.join(clientPath, 'index.html')
  );
});

// Primero se conecta MongoDB y solamente después se inicia Express.
// De esta manera la aplicación no comienza a recibir usuarios si la base de datos
// no está disponible.
connectMongo()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor disponible en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      'No fue posible conectar con MongoDB:',
      error.message
    );

    process.exit(1);
  });
