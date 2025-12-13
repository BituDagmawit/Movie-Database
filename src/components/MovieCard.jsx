
import React from 'react';

function MovieCard({ movie, onClick }) {
  // Use a placeholder if the poster is "N/A"
  const posterUrl = movie.Poster && movie.Poster !== 'N/A' 
    ? movie.Poster 
    : 'https://via.placeholder.com/300x450?text=No+Poster';

  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 cursor-pointer transform hover:scale-[1.02]"
      onClick={() => onClick(movie.imdbID)}
    >
      <img 
        src={posterUrl} 
        alt={`${movie.Title} Poster`} 
        className="w-full h-80 object-cover" 
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-white truncate">{movie.Title}</h3>
        <p className="text-sm text-gray-400">({movie.Year})</p>
      </div>
    </div>
  );
}

export default MovieCard;