// src/App.jsx
import React, { useState } from 'react';
import { searchMovies } from './api'; // Only using searchMovies now
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); // Tracks if a search has been performed

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setMovies([]);
    setHasSearched(true); 

    if (!query) {
      setLoading(false);
      return;
    }

    try {
      const results = await searchMovies(query);
      setMovies(results);
    } catch (err) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-xl text-gray-400">Loading...</p>;
    }

    if (error) {
      return <p className="text-center text-xl text-red-400">Error: {error}</p>;
    }

    if (hasSearched && movies.length === 0) {
      return <p className="text-center text-xl text-gray-400">No movies found.</p>;
    }
    
    // Show a welcome message if no search has been done yet
    if (!hasSearched) {
      return <p className="text-center text-xl text-gray-400">Search for a movie title above.</p>;
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6">
        {movies.map((movie) => (
          // Note: onClick is removed as MovieDetails component is removed
          <MovieCard 
            key={movie.imdbID} 
            movie={movie} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-lg">
        <h1 className="text-4xl font-extrabold text-red-500 p-4 text-center">
          🎬 React Movie Database
        </h1>
        <SearchBar onSearch={handleSearch} />
      </header>

      <main className="container mx-auto py-8">
        {renderContent()}
      </main>

      {/* MovieDetails component removed */}
    </div>
  );
}

export default App;