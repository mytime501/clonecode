import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/movieCarousel.css';

const MovieCarousel = ({ movies }) => {
  const [maxLength, setMaxLength] = useState(100); // 초기값을 100으로 설정

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  // 화면 크기에 따라 maxLength 값을 동적으로 변경
  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setMaxLength(50); // 모바일에서는 50자
    } else {
      setMaxLength(100); // PC에서는 100자
    }
  };

  // 화면 크기 변경 시마다 handleResize를 호출하여 maxLength 갱신
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize); // 리사이즈 이벤트 리스너 추가

    return () => {
      window.removeEventListener('resize', handleResize); // 컴포넌트가 unmount될 때 리스너 제거
    };
  }, []);

  const truncateText = (text) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
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
              <p>{truncateText(movie.overview)}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MovieCarousel;
