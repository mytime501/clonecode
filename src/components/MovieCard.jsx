import React from 'react';
import '../css/home.css';

const MovieCard = ({ movie }) => {
  const { poster_path, title, overview, vote_average, release_date, genres } = movie;

  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w500${poster_path}`}
        alt={title}
        className="movie-poster"
      />
      <div className="movie-info">
        <h3 className="movie-title">{title}</h3>
        <p className="movie-overview">{overview}</p>
        <p className="movie-details">
          평점: {vote_average} | 개봉일: {release_date}
        </p>
        {genres && (
          <p className="movie-genres">
            장르: {genres.map((genre) => genre.name).join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
