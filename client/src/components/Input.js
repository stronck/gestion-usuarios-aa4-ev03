// Campo de formulario reutilizable para todos los formularios de la aplicación.
const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete
}) => {

  return React.createElement(
    'label',
    {
      className: 'field'
    },

    React.createElement(
      'span',
      null,
      label
    ),

    React.createElement(
      'input',
      {
        name,
        type,
        value,
        onChange,
        placeholder,
        autoComplete,
        required: true
      }
    )
  );
};
