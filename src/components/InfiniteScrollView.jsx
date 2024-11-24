// components/InfiniteScrollView.jsx

import React from 'react';
import MovieCard from './MovieCard';

const InfiniteScrollView = ({ movies, isLoading}) => {
  return (
    <div className="infinite-scroll-view">
      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} hideDetails={true} />
        ))}
      </div>
      {isLoading && <p className="loading-text">Loading...</p>}
    </div>
  );
};

export default InfiniteScrollView;
