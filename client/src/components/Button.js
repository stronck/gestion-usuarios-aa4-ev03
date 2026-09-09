// Botón reutilizable que permite mantener el mismo estilo en toda la interfaz.
const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  onClick
}) => {

  return React.createElement(
    'button',
    {
      className: `button ${variant}`,
      type,
      disabled,
      onClick
    },
    children
  );
};
