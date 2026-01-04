
import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center p-4 shadow-md bg-gray-800">
      <input
        type="text"
        placeholder="Search for a movie..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-lg p-2 border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-red-600 text-white rounded-r-md hover:bg-red-700 transition duration-150"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;