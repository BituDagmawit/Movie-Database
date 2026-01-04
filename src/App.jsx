// src/App.jsx
import React, { useState, useEffect } from 'react';
import { fetchPaginatedMovies, getMovieDetails } from './api';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import MovieDetails from './components/MovieDetails';
import GenreFilter from './components/GenreFilter';

const MOVIES_PER_LOAD = 18;
// Setting a popular franchise increases the chance of finding recent movies
const DEFAULT_SEARCH_TERM = 'marvel'; 

function App() {
  // Data State
  const [allMovies, setAllMovies] = useState([]); 
  const [displayedMovies, setDisplayedMovies] = useState([]); 
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  
  // Filter/Pagination State
  const [selectedGenre, setSelectedGenre] = useState(''); 
  const [currentQuery, setCurrentQuery] = useState(DEFAULT_SEARCH_TERM);
  const [currentPage, setCurrentPage] = useState(1); // Page number to fetch next
  const [totalResults, setTotalResults] = useState(0); 

  /**
   * Helper function to sort movies by Year (Descending)
   */
  const sortByYearDescending = (movies) => {
      // Sort in place. b.Year - a.Year results in descending order.
      return movies.sort((a, b) => {
          const yearA = parseInt(a.Year);
          const yearB = parseInt(b.Year);
          // Handle invalid years gracefully
          if (isNaN(yearA) || isNaN(yearB)) return 0; 
          return yearB - yearA; 
      });
  };


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

  // --- 2. Genre Filtering Effect: Runs when genre or base list changes ---
  useEffect(() => {
    if (!selectedGenre) {
      // Show the entire base list (already sorted by year)
      setDisplayedMovies(allMovies);
      return;
    }

    // Filter the entire list of 'allMovies' based on the selected genre
    const filtered = allMovies.filter(movie => {
      return movie.Genre && movie.Genre.toLowerCase().includes(selectedGenre.toLowerCase());
    });
    
    setDisplayedMovies(filtered);
    
  }, [selectedGenre, allMovies]); 

  // --- Handlers ---

  const handleSearch = (query) => {
    setSelectedGenre(''); // Reset genre filter on new text search
    setCurrentPage(1); // Start pagination over
    fetchMoviesAndDetails(query, 1, false); // Start a new search
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };
  
  const handleLoadMore = () => {
      // Fetch next set of pages and append to the current list
      fetchMoviesAndDetails(currentQuery, currentPage, true);
  };
  
  const handleMovieClick = (imdbID) => {
    setSelectedMovieId(imdbID);
  };

  const handleCloseDetails = () => {
    setSelectedMovieId(null);
  };

  // --- Render Logic ---

  const renderContent = () => {
    if (error) {
      return <p className="text-center text-xl text-red-400">Error: {error}</p>;
    }

    if (!loading && allMovies.length === 0) {
      return <p className="text-center text-xl text-gray-400">No movies found matching your criteria.</p>;
    }

    return (
      <>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-6">
          {displayedMovies.map((movie) => (
            <MovieCard 
              key={movie.imdbID} 
              movie={movie} 
              onClick={handleMovieClick} 
            />
          ))}
        </div>
        
        {loading && <p className="text-center text-xl text-gray-400 p-4">Loading more movies...</p>}

        {/* Load More Button: Only shown on the main (unfiltered) list */}
        {!loading && !selectedGenre && allMovies.length < totalResults && (
            <div className="flex justify-center p-6">
                <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-150 shadow-lg"
                >
                    Load More Movies
                </button>
            </div>
        )}
        
        {/* End of Results Message */}
        {!loading && !selectedGenre && allMovies.length >= totalResults && totalResults > 0 && (
            <p className="text-center text-gray-500 p-4">You have reached the end of the results for "{currentQuery}".</p>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-lg">
        <h1 className="text-4xl font-extrabold text-red-500 p-4 text-center">
          🎬 Bitu Movie Database
        </h1>
        <SearchBar onSearch={handleSearch} />
        <GenreFilter 
          selectedGenre={selectedGenre} 
          onGenreChange={handleGenreChange} 
        />
      </header>

      <main className="container mx-auto py-8">
        {renderContent()}
      </main>

      {/* Movie Details Modal/View */}
      {selectedMovieId && (
        <MovieDetails 
          imdbID={selectedMovieId} 
          onClose={handleCloseDetails} 
        />
      )}
    </div>
  );
}

export default App;