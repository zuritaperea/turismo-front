import React, { useState } from 'react';

function SearchComponent({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div 
    id="search" 
    className="rounded-lg p-6 md:mt-6 text-white w-full max-w-lg mx-auto sm:mx-10 bg-principal"
  >
      <h2 className="text-md font-medium mb-2 text-center">
        ¿Estás buscando algo en particular?
      </h2>
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full p-3 rounded-md text-gray-900 indent-8"
          value={query}
          onChange={handleInputChange}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <i className="fas fa-search absolute text-lg right-3 top-2 text-gray-100 bg-principal rounded-lg px-4"
          style={{ cursor: 'pointer' }} 
          onClick={handleSearch}></i>
      </div>
    </div>
  );
};

export default SearchComponent;
