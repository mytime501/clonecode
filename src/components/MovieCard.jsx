import React, { useState } from 'react';
import '../css/home.css';

const MovieCard = ({ movie, onUpdateWishlist }) => {
  const { poster_path, title, overview, vote_average, release_date, genres } = movie;

  // 찜한 영화인지 확인
  const isInWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    return wishlist.some((item) => item.id === movie.id);
  };

  const [isWished, setIsWished] = useState(isInWishlist);

  // 찜하기/취소하기
  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (isWished) {
      // 찜한 영화를 삭제
      const updatedWishlist = wishlist.filter((item) => item.id !== movie.id);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    } else {
      // 찜한 영화가 이미 존재하지 않으면 추가
      const isAlreadyInWishlist = wishlist.some((item) => item.id === movie.id);
      if (!isAlreadyInWishlist) {
        wishlist.push(movie);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      }
    }

    // 상태 업데이트
    setIsWished(!isWished);

    // 부모 컴포넌트에 상태 변경 알림 (Wishlist 페이지 상태 업데이트)
    if (onUpdateWishlist) {
      onUpdateWishlist();
    }
  };

  return (
    <div className="movie-card"  onClick={toggleWishlist}>
      <img
        src={`https://image.tmdb.org/t/p/w500${poster_path}`}
        alt={title}
        className="movie-poster"
      />
      <div className="movie-info">
        <h3 className="movie-title">{title}</h3>
        <p className="movie-details">
          평점: {vote_average} | 개봉일: {release_date}
        </p>
        {genres && (
          <p className="movie-genres">
            장르: {genres.map((genre) => genre.name).join(', ')}
          </p>
        )}
        {/* 찜하기 버튼 (하트) */}
        <i className={`fa-heart ${isWished ? 'fas' : 'far'}`} style={{ fontSize: '24px' }}></i>
      </div>
    </div>
  );
};

export default MovieCard;
