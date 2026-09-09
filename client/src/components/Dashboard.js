// Pantalla que se muestra después de un inicio de sesión correcto.
const Dashboard = ({
  usuario,
  onLogout
}) => {

  return React.createElement(
    'main',
    {
      className: 'dashboard'
    },

    React.createElement(
      'header',
      {
        className: 'topbar'
      },

      React.createElement(
        'div',
        {
          className: 'topbar-brand'
        },

        React.createElement(
          'span',
          {
            className: 'brand-mark small'
          },
          'GA7'
        ),

        React.createElement(
          'strong',
          null,
          'Gestión de usuarios'
        )
      ),

      // Cierra la sesión únicamente en el estado de la interfaz.
      React.createElement(
        Button,
        {
          variant: 'secondary',
          onClick: onLogout
        },
        'Cerrar sesión'
      )
    ),

    React.createElement(
      'section',
      {
        className: 'dashboard-content'
      },

      React.createElement(
        'span',
        {
          className: 'badge'
        },
        'Sesión activa'
      ),

      React.createElement(
        'h1',
        null,
        `¡Bienvenido, ${usuario.name}!`
      ),

      React.createElement(
        'p',
        null,
        'Has ingresado correctamente al sistema mediante el componente Login.'
      ),

      // Presenta únicamente información pública recibida desde la API.
      React.createElement(
        'div',
        {
          className: 'summary-grid'
        },

        React.createElement(
          'article',
          null,

          React.createElement(
            'span',
            null,
            'Usuario'
          ),

          React.createElement(
            'strong',
            null,
            usuario.name
          )
        ),

        React.createElement(
          'article',
          null,

          React.createElement(
            'span',
            null,
            'Correo'
          ),

          React.createElement(
            'strong',
            null,
            usuario.email
          )
        ),

        React.createElement(
          'article',
          null,

          React.createElement(
            'span',
            null,
            'Estado'
          ),

          React.createElement(
            'strong',
            null,
            'Activo'
          )
        )
      )
    )
  );
};
