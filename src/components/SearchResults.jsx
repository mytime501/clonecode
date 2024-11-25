import React from "react";
import MovieCard from "./MovieCard";


const SearchResults = ({ movies }) => {
    if (!movies || movies.length === 0) {
      return <p>결과가 없습니다.</p>;
    }
  
    return (
      <div className="search-results">
        {movies.map((movie) => (
          <div className="table-item" key={movie.id}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    );
  };
  
export default SearchResults;
