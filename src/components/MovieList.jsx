import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ apiUrl, title }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setMovies(data.results || []); // 결과가 없으면 빈 배열로 설정
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [apiUrl]);

  return (
    <div className="movie-list">
      <h2>{title}</h2>
      <div className="movies-grid">
        {movies && movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <p>영화 데이터를 불러오는 중입니다...</p>
        )}
      </div>
    </div>
  );
};

export default MovieList;
