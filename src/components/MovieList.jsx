import React, { useEffect, useState, useRef } from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ apiUrl, title }) => {
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]); // 복제된 영화 목록을 저장
  const moviesGridRef = useRef(null); // 영화 리스트 그리드 참조
  const [scrolling, setScrolling] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // 마우스 hover 상태 관리

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setMovies(data.results || []); // 결과가 없으면 빈 배열로 설정
        setAllMovies(data.results || []); // 영화 데이터를 복제할 원본 데이터로 설정
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [apiUrl]);

  useEffect(() => {
    if (movies.length > 0) {
      // 전체 영화 목록을 두 배로 늘리기
      setAllMovies((prevMovies) => [...prevMovies, ...prevMovies]);
    }
  }, [movies]);

  // 영화 리스트가 끝나면 전체 영화 리스트를 이어붙이는 방식
  const handleScroll = () => {
    if (moviesGridRef.current && !scrolling) {
      const { scrollLeft, scrollWidth, clientWidth } = moviesGridRef.current;

      // 스크롤이 끝에 도달했을 때
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        setScrolling(true);

        setTimeout(() => {
          // 영화 목록을 끝까지 스크롤한 후에, 처음으로 돌아가는 방식으로 처리
          moviesGridRef.current.scrollLeft = 0;

          setScrolling(false);
        }, 200);
      }
    }
  };

  // 스크롤 잠그기
  const lockScroll = () => {
    // 현재 스크롤 위치를 저장
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
    // 스크롤 잠금
    window.scrollTo(0, scrollTop); // 현재 위치에서 고정
    document.body.style.overflow = 'hidden'; // 스크롤 막기
  };

  const unlockScroll = () => {
    document.body.style.overflow = ''; // 스크롤 해제
  };

  // 휠로 스크롤
  const handleWheel = (e) => {
    if (e.deltaY !== 0 && moviesGridRef.current && isHovered) {
      // 마우스가 영화 리스트 컨테이너 위에 있을 때만 휠 이벤트 처리
      const scrollAmount = e.deltaY > 0 ? 300 : -300; // 휠 스크롤 양
      moviesGridRef.current.scrollLeft += scrollAmount;
    }
  };

  // 좌우 화살표 클릭 시 스크롤
  const handleArrowClick = (direction) => {
    if (moviesGridRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      const newScrollPosition = moviesGridRef.current.scrollLeft + scrollAmount;

      // 스크롤 위치를 바로 설정하는 방식으로 변경
      moviesGridRef.current.scrollLeft = newScrollPosition;
    }
  };

  return (
    <div className="movie-list">
      <h2>{title}</h2>
      <div
        className="movies-grid-container"
        onMouseEnter={() => {
          setIsHovered(true);  // 마우스가 올라가면 hover 상태로 설정
          lockScroll();  // 페이지 스크롤 잠금
        }}  
        onMouseLeave={() => {
          setIsHovered(false); // 마우스가 벗어나면 hover 상태 해제
          unlockScroll(); // 페이지 스크롤 해제
        }}
      >
        {/* 좌측 화살표 버튼 */}
        {isHovered && (
          <button
            className="arrow-btn arrow-left"
            onClick={() => handleArrowClick('left')}
          >
            ←
          </button>
        )}

        {/* 영화 그리드 */}
        <div
          className="movies-grid"
          ref={moviesGridRef}
          onScroll={handleScroll}
          onWheel={handleWheel}
        >
          {allMovies && allMovies.length > 0 ? (
            allMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
          ) : (
            <p>영화 데이터를 불러오는 중입니다...</p>
          )}
        </div>

        {/* 우측 화살표 버튼 */}
        {isHovered && (
          <button
            className="arrow-btn arrow-right"
            onClick={() => handleArrowClick('right')}
          >
            →
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieList;
