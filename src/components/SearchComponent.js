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
    <div id="search" className="bg-principal rounded-lg p-6 mt-6 text-white">
      <h2 className="text-md font-medium mb-2">
        ¿Estás buscando algo en particular?
      </h2>
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full p-3 rounded-md text-gray-900 buscador"
          value={query}
          onChange={handleInputChange}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <i className="fas fa-search absolute text-lg left-3 top-2 text-gray-500"
          style={{ cursor: 'pointer' }} 
          onClick={handleSearch}></i>
      </div>
    </div>
  );
};

export default SearchComponent;
