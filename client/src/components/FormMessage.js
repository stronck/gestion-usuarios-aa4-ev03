// Muestra mensajes de validación o errores debajo de los campos del formulario.
const FormMessage = ({
  message,
  type = 'error'
}) => {

  // Si no hay mensaje, no se agrega ningún elemento al DOM.
  if (!message) {
    return null;
  }

  return React.createElement(
    'div',
    {
      className: `message ${type}`,
      role: 'alert'
    },
    message
  );
};
