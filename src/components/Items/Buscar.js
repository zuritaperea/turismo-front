import React from "react";


const Buscar = ({ onPress, onChangeText }) => {
  const handleChange = (event) => {
    const textoBuscar = event.target.value;
    onChangeText(textoBuscar);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      onPress();
    }
  };

  return (
    <div className="relative my-5">

      <input
        type="text"
        className="w-full p-3 rounded-md text-gray-900 buscador border border-gray-200"
        placeholder="Buscar"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <i className="fas fa-search absolute text-lg left-3 top-2 text-gray-500"
        style={{ cursor: 'pointer' }}
        onClick={onPress}></i>
    </div>
  );
};

export default Buscar;
