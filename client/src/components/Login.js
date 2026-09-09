// Formulario de inicio de sesión.
const Login = ({
  onLogin,
  onGoRegister
}) => {

  // Estado local con los datos que escribe el usuario.
  const [form, setForm] = React.useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Actualiza únicamente el campo que está modificando el usuario.
  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
  };

  // Envía las credenciales al endpoint de login del servidor.
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage('');

    // Validación básica antes de hacer la petición.
    if (!form.email || !form.password) {
      setMessage(
        'Correo y contraseña son obligatorios.'
      );

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        '/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      // Convierte las respuestas de error de la API en mensajes visibles.
      if (!response.ok) {
        throw new Error(
          data.message ||
          'No fue posible iniciar sesión.'
        );
      }

      // Entrega los datos públicos del usuario al componente principal.
      onLogin(data.user);

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(
    'div',
    {
      className: 'card'
    },

    React.createElement(
      'div',
      {
        className: 'card-heading'
      },

      React.createElement(
        'span',
        {
          className: 'badge'
        },
        'Acceso'
      ),

      React.createElement(
        'h2',
        null,
        'Iniciar sesión'
      ),

      React.createElement(
        'p',
        null,
        'Ingresa tus credenciales para acceder al sistema.'
      )
    ),

    React.createElement(
      'form',
      {
        onSubmit: handleSubmit
      },

      React.createElement(
        Input,
        {
          label: 'Correo electrónico',
          name: 'email',
          type: 'email',
          value: form.email,
          onChange: handleChange,
          placeholder: 'nombre@correo.com',
          autoComplete: 'email'
        }
      ),

      React.createElement(
        Input,
        {
          label: 'Contraseña',
          name: 'password',
          type: 'password',
          value: form.password,
          onChange: handleChange,
          placeholder: '••••••••',
          autoComplete: 'current-password'
        }
      ),

      React.createElement(
        FormMessage,
        {
          message
        }
      ),

      React.createElement(
        Button,
        {
          type: 'submit',
          disabled: loading
        },
        loading
          ? 'Ingresando…'
          : 'Ingresar'
      )
    ),

    React.createElement(
      'div',
      {
        className: 'separator'
      },

      React.createElement(
        'span',
        null,
        'o'
      )
    ),

    React.createElement(
      'p',
      {
        className: 'switch-text'
      },
      '¿No tienes una cuenta?'
    ),

    React.createElement(
      Button,
      {
        variant: 'secondary',
        onClick: onGoRegister
      },
      'Crear cuenta'
    )
  );
};
