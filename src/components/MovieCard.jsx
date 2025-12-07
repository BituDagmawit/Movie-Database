// src/components/MovieCard.jsx
import React from 'react';

function MovieCard({ movie }) {
  return (
    // Note: onClick handler is removed
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden cursor-pointer hover:shadow-red-500/50 transition duration-300">
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
        alt={movie.Title}
        className="w-full h-auto object-cover"
        style={{ height: '300px' }} // Keep a consistent size
      />
      <div className="p-4 text-white">
        <h3 className="text-lg font-semibold truncate">{movie.Title}</h3>
        <p className="text-gray-400 text-sm">{movie.Year}</p>
      </div>
    </div>
  );
}

export default MovieCard;