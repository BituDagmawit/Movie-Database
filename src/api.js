// src/api.js

// !!! IMPORTANT: REPLACE 'YOUR_OMDB_API_KEY' with your actual key !!!
const API_KEY = '1736dba4';
const API_BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

/**
 * Searches for movies by title, fetching a specific page (max 10 results per call).
 * This function returns both the movie array and the total results count.
 */
export async function searchMovies(query, page = 1) {
  if (!query.trim()) {
    return { movies: [], totalResults: 0 };
  }
  try {
    // Standard search URL: NO &y= year filter parameter
    const response = await fetch(`${API_BASE_URL}&s=${encodeURIComponent(query)}&page=${page}`);
    const data = await response.json();

    if (data.Response === 'True') {
      return {
        movies: data.Search,
        totalResults: parseInt(data.totalResults, 10)
      };
    } else {
      return { movies: [], totalResults: 0 };
    }
  } catch (error) {
    console.error(`Error fetching search results (page ${page}):`, error);
    throw new Error('Failed to fetch movies. Check network connection.');
  }
}


/**
 * Fetches detailed information for a single movie by IMDB ID.
 */
export async function getMovieDetails(imdbID) {
  try {
    const response = await fetch(`${API_BASE_URL}&i=${imdbID}&plot=short`);
    const data = await response.json();

    if (data.Response === 'True') {
      return data;
    } else {
      throw new Error(data.Error || 'Movie details not found.');
    }
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw new Error('Failed to fetch movie details.');
  }
}