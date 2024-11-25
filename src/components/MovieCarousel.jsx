import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/movieCarousel.css'; // CSS를 별도로 생성해 스타일링

const MovieCarousel = ({ movies }) => {
  const settings = {
    dots: true, // 하단에 네비게이션 점 추가
    infinite: true, // 무한 루프 슬라이드
    speed: 500, // 슬라이드 속도 (ms)
    slidesToShow: 1, // 한 번에 보여줄 영화 수
    slidesToScroll: 1, // 한 번에 넘길 슬라이드 수
    autoplay: true, // 자동 슬라이드 활성화
    autoplaySpeed: 2000, // 자동 슬라이드 간격 (2초)
  };

  return (
    <div className="movied-carousel">
      <Slider {...settings}>
        {movies.map((movie) => (
          <div key={movie.id} className="movied-slide">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
              alt={movie.title}
              className="movied-image"
            />
            <div className="movied-info">
              <h2>{movie.title}</h2>
              <p>{movie.overview}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MovieCarousel;
