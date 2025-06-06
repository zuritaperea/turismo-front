import React from "react";
import { useTranslation } from 'react-i18next';


const Buscar = ({ onPress, onChangeText }) => {
  const { t } = useTranslation();

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
        className="w-full p-3 rounded-md text-gray-900 indent-8 border border-gray-200"
        placeholder={t('search.placeholder')}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <i className="fas fa-search absolute text-lg right-3 top-2 text-gray-100 bg-principal rounded-lg px-4"
        style={{ cursor: 'pointer' }}
        onClick={onPress}></i>
    </div>
  );
};

export default Buscar;
