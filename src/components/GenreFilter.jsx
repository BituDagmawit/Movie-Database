// src/components/GenreFilter.jsx
import React from 'react';

// UPDATED: Added 'Biography' and 'History'
const GENRES = [
  'All Genres',
  'Action',
  'Adventure',
  'Biography', // <-- New Genre
  'Comedy',
  'Crime',
  'Drama',
  'Horror',
  'History',   // <-- New Genre (often overlaps with Biography)
  'Romance',
  'Sci-Fi',
  'Thriller',
  'Animation',
];

function GenreFilter({ selectedGenre, onGenreChange }) {
  return (
    <div className="flex justify-center p-4 bg-gray-800">
      <label htmlFor="genre-select" className="text-white text-lg font-semibold mr-4 self-center">
        Filter by Genre:
      </label>
      <select
        id="genre-select"
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value)}
        className="p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
      >
        {GENRES.map((genre) => (
          <option key={genre} value={genre === 'All Genres' ? '' : genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
}

export default GenreFilter;