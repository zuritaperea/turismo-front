import React, { useState } from 'react';

// Definir el componente Form para envolver el formulario
const Form = ({ children, className = '', onSubmit, noValidate = false, method = "post" }) => (
  <form
    className={`space-y-4 ${className}`}
    onSubmit={onSubmit}
    noValidate={noValidate} // Deshabilitar la validación del navegador
    method={method}
  >
    {children}
  </form>
);

Form.Group = ({ children, className = '', as: Component = 'div', controlId, ...props }) => {
  return (
    <Component
      {...props} // Aseguramos de pasar las demás propiedades (incluyendo id o cualquier otra)
      id={controlId} // Pasamos el controlId como el id del contenedor
      className={`mb-4 ${className}`}
    >
      {children}
    </Component>
  );
};

// Definir Form.Label como la etiqueta para los campos de formulario
Form.Label = ({ children, htmlFor, className = '' }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className}`}>
    {children}
  </label>
);

// Definir Form.Control como los campos de entrada (input, textarea, etc.)
Form.Control = React.forwardRef(({
  type,
  value,
  onChange,
  className = '',
  placeholder,
  required,
  size,
  as = 'input',
  disabled,
  readOnly,
  plaintext,
  rows,
  ...props
}, ref) => {

  const safeValue = value ?? '';  // Si el valor es null o undefined, asigna un string vacío

  const Element = as;  // Determina el tipo de campo (input, textarea, etc.)

  // Determinar las clases de tamaño según el prop `size` y las clases de Tailwind
  let sizeClass = '';
  if (size === 'sm') {
    sizeClass = 'text-sm py-1';  // Para tamaño pequeño
  } else if (size === 'lg') {
    sizeClass = 'text-lg py-3';  // Para tamaño grande
  } else {
    sizeClass = 'text-base py-2';  // Tamaño por defecto (normal)
  }

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);  // Llamar al onChange si se pasa
    }
  };

  return (
    <Element
      ref={ref}  // Asegúrate de pasar la referencia al campo de formulario
      type={as === 'input' ? type : undefined} // Solo el tipo si el elemento es input
      value={safeValue}  // Asegúrate de que el valor nunca sea undefined o null
      onChange={handleChange}  // Asegurarse de que onChange siempre se llame
      placeholder={placeholder}
      required={required}  // Propagar el prop required
      disabled={disabled}  // Propagar el prop disabled
      readOnly={readOnly}  // Propagar el prop readOnly
      plaintext={plaintext}  // Propagar el prop plaintext (solo si as es 'input')
      rows={rows}  // Propiedad rows para el textarea
      size={size}  // Propiedad de tamaño
      className={`mt-1 block w-full px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${sizeClass} ${className}`}  // Clases de Tailwind con tamaño
      {...props}  // Pasar cualquier otra propiedad adicional
    />
  );
});


// Agregar soporte para <Form.Select>
Form.Select = React.forwardRef(({ value, onChange, options = [], className = '', ...props }, ref) => (
  <select
    ref={ref}
    value={value == null ? "" : value}  // Si `value` es null o undefined, asigna una cadena vacía
    onChange={onChange}
    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
    {...props}
  >
    {options.map((option, index) => (
      <option key={index} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
));

// Agregar soporte para <Form.Check>
Form.Check = React.forwardRef(
  (
    {
      type = 'checkbox',
      label,
      id,
      inline = false,
      reverse = false,
      disabled = false,
      feedbackType,
      feedback,
      isValid,
      isInvalid,
      required = false,
      ...props
    },
    ref
  ) => {
    const [checked, setChecked] = useState(false);
    const [touched, setTouched] = useState(false);  // Para saber si el usuario interactuó con el campo

    let inputClassName = 'h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded';

    if (isValid) inputClassName += ' border-green-500';
    if (isInvalid) inputClassName += ' border-red-500';

    const layoutClass = inline ? 'inline-flex items-center' : 'flex items-center';
    const reverseClass = reverse ? 'flex-row-reverse' : '';

    const handleChange = (e) => {
      setChecked(e.target.checked);
      setTouched(true); // Marcar como tocado cuando el usuario interactúa
    };

    const showFeedback = touched && required && !checked && feedbackType === 'invalid';

    return (
      <div className={`${layoutClass} ${reverseClass} mb-3`}>
        <input
          {...props}
          id={id}
          type={type}
          ref={ref}
          disabled={disabled}
          required={required}
          checked={checked}
          onChange={handleChange}
          onBlur={() => setTouched(true)} // Marcar como tocado cuando el campo pierde el foco
          className={`${inputClassName} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        />
        {label && <label htmlFor={id} className="ml-2">{label}</label>}
        {showFeedback && (
          <div className={`mt-2 text-sm text-red-500`}>
            {feedback || 'Campo requerido'}
          </div>
        )}
      </div>
    );
  }
);

export default Form;
