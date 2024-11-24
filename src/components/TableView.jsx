// components/TableView.jsx

import React, { useEffect } from 'react';
import MovieCard from './MovieCard';
import Pagination from './Pagination';

const TableView = ({ movies, currentPage, totalPages, onPageChange, fetchMovies }) => {
  // currentPage가 변경될 때마다 새 영화를 불러옵니다.
  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage, fetchMovies]);

  return (
    <div className="table-view">
      <div className="table-grid">
        {movies.map((movie) => (
          <div className="table-item" key={movie.id}>
            <MovieCard movie={movie} hideDetails={true} />
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default TableView;
