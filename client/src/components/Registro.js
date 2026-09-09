// Formulario encargado de registrar nuevos usuarios.
const Registro = ({
  onRegistered,
  onCancel
}) => {

  // Incluye el campo de confirmación para comprobar la contraseña en el navegador.
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Actualiza el estado del formulario según el nombre del input.
  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
  };

  // Valida los datos y envía al servidor solamente los campos necesarios.
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage('');

    // La confirmación no se guarda en MongoDB; solo se utiliza para validar.
    if (
      form.password !==
      form.confirmPassword
    ) {
      setMessage(
        'Las contraseñas no coinciden.'
      );

      return;
    }

    // Mantiene la misma regla de longitud que utiliza la API.
    if (form.password.length < 6) {
      setMessage(
        'La contraseña debe tener mínimo 6 caracteres.'
      );

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        '/api/auth/register',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          'No fue posible registrar el usuario.'
        );
      }

      // Si el registro fue correcto, vuelve a la pantalla de login.
      onRegistered();

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
        'Registro'
      ),

      React.createElement(
        'h2',
        null,
        'Crear cuenta'
      ),

      React.createElement(
        'p',
        null,
        'Completa los datos para registrar un nuevo usuario.'
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
          label: 'Nombre completo',
          name: 'name',
          value: form.name,
          onChange: handleChange,
          placeholder: 'Camilo Andrés Tibatá',
          autoComplete: 'name'
        }
      ),

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
          placeholder: 'Mínimo 6 caracteres',
          autoComplete: 'new-password'
        }
      ),

      React.createElement(
        Input,
        {
          label: 'Confirmar contraseña',
          name: 'confirmPassword',
          type: 'password',
          value: form.confirmPassword,
          onChange: handleChange,
          placeholder: 'Repite la contraseña',
          autoComplete: 'new-password'
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
          ? 'Registrando…'
          : 'Registrarse'
      )
    ),

    React.createElement(
      Button,
      {
        variant: 'secondary',
        onClick: onCancel
      },
      'Cancelar'
    )
  );
};
