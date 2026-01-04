
import React, { useEffect, useState } from 'react';
import { getMovieDetails } from '../api';

function MovieDetails({ imdbID, onClose }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Clear previous state and start loading
    setMovie(null);
    setLoading(true);
    setError(null);

    getMovieDetails(imdbID)
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not load movie details.');
        setLoading(false);
      });
  }, [imdbID]);

  if (loading) {
    return <div className="p-8 text-center text-white">Loading details...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-400">{error}</div>;
  }

  if (!movie) {
      return null; // Should not happen if loading/error handling is correct
  }
  
  // Use a placeholder if the poster is "N/A"
  const posterUrl = movie.Poster && movie.Poster !== 'N/A' 
    ? movie.Poster 
    : 'https://via.placeholder.com/300x450?text=No+Poster';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-y-auto p-4 flex justify-center">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full p-6 shadow-2xl relative m-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-500 transition"
        >
          &times;
        </button>
        
        <h2 className="text-4xl font-extrabold text-red-500 mb-6 border-b border-gray-700 pb-2">
          {movie.Title} ({movie.Year})
        </h2>

        <div className="md:flex gap-6">
          <div className="md:w-1/3 mb-4 md:mb-0 flex-shrink-0">
            <img 
              src={posterUrl} 
              alt={`${movie.Title} Poster`} 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-2/3 text-white">
            <p className="text-xl mb-4 italic text-gray-300">{movie.Plot}</p>
            
            <p className="mb-2"><strong>Genre:</strong> <span className="text-red-400">{movie.Genre}</span></p>
            <p className="mb-2"><strong>Directed by:</strong> {movie.Director}</p>
            <p className="mb-2"><strong>Cast:</strong> {movie.Actors}</p>
            <p className="mb-2"><strong>Runtime:</strong> {movie.Runtime}</p>
            <p className="mb-4"><strong>IMDB Rating:</strong> <span className="font-bold text-yellow-500">{movie.imdbRating}</span> ({movie.imdbVotes})</p>

            <h3 className="text-2xl font-semibold mt-4 mb-2 border-t border-gray-700 pt-4">Ratings</h3>
            <ul className="list-disc list-inside space-y-1">
              {movie.Ratings && movie.Ratings.map((rating, index) => (
                <li key={index}>
                  <span className="font-medium text-gray-400">{rating.Source}:</span> {rating.Value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;