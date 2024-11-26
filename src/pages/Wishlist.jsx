import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import '../css/home.css';
import Header from '../components/Header';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
  
    // LocalStorage에서 찜한 영화 목록 불러오기
    const getWishlistFromLocalStorage = () => {
      return JSON.parse(localStorage.getItem('wishlist')) || [];
    };
  
    // 처음 페이지 로드 시 찜한 목록을 가져옴
    useEffect(() => {
      setWishlist(getWishlistFromLocalStorage());
    }, []);
  
    // 리스트 갱신을 위해 업데이트 함수
    const updateWishlist = () => {
      setWishlist(getWishlistFromLocalStorage());
    };
  

  return (
    <div>
        <Header/>
        <div className="wishlist-page">
            <h2 className="hfont">내가 찜한 리스트</h2>
            {/* 찜한 영화 목록이 있을 때 테이블로 출력 */}
            {wishlist.length > 0 ? (
                <div className="wishlist-movie-list">
                {wishlist.map((movie) => (
                    <MovieCard
                    key={movie.id}
                    movie={movie}
                    onUpdateWishlist={updateWishlist} // 상태 갱신 함수 전달
                    hideDetails={true}
                    className="wishlist-movie-card"
                    isWishlist1={true}
                    isWishlist2={true}
                    />
                ))}
                </div>
            ) : (
                <p>찜한 영화가 없습니다.</p>
            )}
        </div>
    </div>
  );
};

export default Wishlist;
