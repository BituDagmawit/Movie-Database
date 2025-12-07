// src/api.js

// !!! IMPORTANT: REPLACE 'YOUR_OMDB_API_KEY' with your actual key !!!
const API_KEY = '1736dba4';
const API_BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

/**
 * Searches for movies by title (only returns the first 10 results).
 */
export async function searchMovies(query) {
  if (!query.trim()) {
    return [];
  }
  try {
    const response = await fetch(`${API_BASE_URL}&s=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (data.Response === 'True') {
      return data.Search; // Returns up to 10 movies
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw new Error('Failed to fetch movies.');
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