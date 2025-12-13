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
      // --- Core Fetching Logic ---
  const fetchMoviesAndDetails = async (query, page, append = false) => {
    setLoading(true);
    setError(null);
    setCurrentQuery(query);
    
    // OMDB pages start at 1 and go up sequentially. 
    // Since we fetch 2 pages at a time, we jump by 2: 1 -> 3 -> 5
    const startPage = page === 1 ? 1 : ((page - 1) * 2) + 1;

    try {
      const { movies: initialMovies, totalResults: total } = await fetchPaginatedMovies(query, startPage);
      
      setTotalResults(total);

      if (initialMovies.length === 0) {
        setLoading(false);
        if (!append) { 
            setAllMovies([]);
            setDisplayedMovies([]);
        }
        return;
      }

      // 1. Fetch details for every movie to get the Genre field
      const detailPromises = initialMovies.map(movie => 
          getMovieDetails(movie.imdbID).catch(e => {
            console.error(`Failed to get details for ${movie.Title}:`, e);
            return null; 
          })
      );

      const detailedMovies = (await Promise.all(detailPromises)).filter(m => m && m.Response === 'True');
      
      // 2. Update the main movie list
      if (append) {
        setAllMovies(prev => {
            const combined = [...prev, ...detailedMovies];
            // Re-sort the entire combined list after appending new movies
            return sortByYearDescending(combined);
        });
      } else {
        // Sort the fresh list and store it
        setAllMovies(sortByYearDescending(detailedMovies)); 
      }
      
      setCurrentPage(page + 1); // Set the next page number for the next load
      
    } catch (err) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };


      // --- 1. Initial Load Effect: Runs once on mount ---
  useEffect(() => {
    fetchMoviesAndDetails(DEFAULT_SEARCH_TERM, 1, false);
  }, []);

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