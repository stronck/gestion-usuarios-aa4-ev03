// Componente principal: controla si se muestra el login, el registro o el dashboard.
const App = () => {
  const [vista, setVista] = React.useState('login');
  const [usuario, setUsuario] = React.useState(null);

  // Guarda el usuario recibido después de iniciar sesión.
  const handleLogin = (user) => {
    setUsuario(user);
    setVista('dashboard');
  };

  // Limpia la sesión visual y regresa al formulario de acceso.
  const handleLogout = () => {
    setUsuario(null);
    setVista('login');
  };

  // Mientras exista un usuario, se muestra el dashboard.
  if (usuario) {
    return React.createElement(
      Dashboard,
      {
        usuario,
        onLogout: handleLogout
      }
    );
  }

  // Pantalla principal para login y registro.
  return React.createElement(
    'main',
    {
      className: 'app-shell'
    },

    React.createElement(
      'section',
      {
        className: 'brand-panel',
        'aria-label': 'Información del proyecto'
      },

      React.createElement(
        'div',
        {
          className: 'brand-mark'
        },
        'GA7'
      ),

      React.createElement(
        'p',
        {
          className: 'eyebrow'
        },
        'SENA · ADSO'
      ),

      React.createElement(
        'h1',
        null,
        'Gestión de usuarios'
      ),

      React.createElement(
        'p',
        {
          className: 'brand-copy'
        },
        'Interfaz web construida con React mediante componentes reutilizables para registro e inicio de sesión.'
      ),

      React.createElement(
        'div',
        {
          className: 'feature-list'
        },

        React.createElement(
          'span',
          null,
          '✓ Componentes reutilizables'
        ),

        React.createElement(
          'span',
          null,
          '✓ Validación de formularios'
        ),

        React.createElement(
          'span',
          null,
          '✓ API con Express'
        ),

        React.createElement(
          'span',
          null,
          '✓ MongoDB configurable'
        )
      )
    ),

    React.createElement(
      'section',
      {
        className: 'form-panel'
      },

      vista === 'login'
        ? React.createElement(
            Login,
            {
              onLogin: handleLogin,
              onGoRegister: () => setVista('registro')
            }
          )

        : React.createElement(
            Registro,
            {
              onRegistered: () => setVista('login'),
              onCancel: () => setVista('login')
            }
          )
    )
  );
};
