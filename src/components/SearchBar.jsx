// src/components/SearchBar.jsx
import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex justify-center space-x-2">
      <input
        type="text"
        placeholder="Search movie title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-2 w-full max-w-md border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition duration-150"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;