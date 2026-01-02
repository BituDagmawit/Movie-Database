// src/api.js

const API_KEY = '1736dba4';

const API_BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;
const MOVIES_PER_LOAD = 18;

/*
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
 * Fetches two consecutive pages to get up to 20 results, returning the first 18.
 * This is used for initial load and 'Load More'.
 */
export async function fetchPaginatedMovies(query, startPage) {
    // Fetch startPage (e.g., page 1) and startPage + 1 (e.g., page 2) concurrently
    const [page1Data, page2Data] = await Promise.all([
        searchMovies(query, startPage),
        searchMovies(query, startPage + 1)
    ]);
    
    // Combine results and limit to 18
    const combinedResults = [
        ...page1Data.movies, 
        ...page2Data.movies
    ].slice(0, MOVIES_PER_LOAD);

    // Use the totalResults from the first successful call for pagination tracking
    const totalResults = page1Data.totalResults || page2Data.totalResults || 0;

    return { 
        movies: combinedResults, 
        totalResults: totalResults 
    };
}


/**
 * Fetches detailed information for a single movie by IMDB ID.
 */
export async function getMovieDetails(imdbID) {
  try {
    const response = await fetch(`${API_BASE_URL}&i=${imdbID}&plot=full`);
    const data = await response.json();

    if (data.Response === 'True') {
      return data;
    } else {
      throw new Error(data.Error || 'Movie details not found.');
    }
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw new Error('Failed to fetch movie details. Check network connection.');
  }
}