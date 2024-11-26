import React, { useState, useEffect, useRef } from 'react';
import MovieCard from './MovieCard';
import Pagination from './Pagination';
import '../css/popular.css';
import axios from 'axios';

const TableView = ({ apiKey, baseurl, headerHeight }) => {
  const [movies, setMovies] = useState([]); // 초기값을 빈 배열로 설정
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(20); // 한 페이지당 영화 수
  const [totalMovies, setTotalMovies] = useState(0); // 전체 영화 수를 저장하는 상태
  const containerRef = useRef(null);

  // 화면 크기 변화에 따른 상태 업데이트
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = window.innerHeight - headerHeight - containerRef.current.offsetTop;
        let movieCardWidth = 0;
        let movieCardHeight = 0;

        if (window.innerWidth <= 768) {
          movieCardWidth = 120;
          movieCardHeight = 260;
        } else {
          movieCardWidth = 150;
          movieCardHeight = 350;
        }

        const horizontalGap = 20; // 가로 간격
        const verticalGap = 30; // 세로 간격

        // 한 줄에 표시할 수 있는 영화 개수 (가로)
        const rowSize = Math.floor(containerWidth / (movieCardWidth + horizontalGap));

        // 화면에 표시할 수 있는 세로 행의 개수
        const rowCount = Math.floor(containerHeight / (movieCardHeight + verticalGap));

        // 한 페이지에서 표시할 영화 개수 계산
        setMoviesPerPage(rowSize * rowCount); // 한 페이지에 표시할 영화 수
      }
    };

    // 화면 크기 변경 시 리사이즈 핸들러 실행
    window.addEventListener('resize', handleResize);
    
    // 초기 로딩 시 화면 크기 계산
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [headerHeight]); // headerHeight가 변경될 때마다 실행되도록 의존성 추가

  // 영화 목록을 API에서 가져오는 함수
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${baseurl}`, {
          params: {
            api_key: apiKey,
            page: currentPage,
            language: 'ko-KR',
          },
        });

        if (currentPage === 1) {
          setMovies(response.data.results || []); // 첫 페이지일 경우에는 초기화
        } else {
          setMovies((prevMovies) => [
            ...prevMovies,
            ...response.data.results || [], // 이전 영화 목록에 새 영화들 추가
          ]);
        }

        setTotalMovies(response.data.total_results || 0); // 전체 영화 수 설정
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [apiKey, baseurl, currentPage]); // currentPage가 변경될 때마다 새로운 데이터를 가져옴

  if (!movies || movies.length === 0) {
    return <div>영화를 불러오는 중입니다...</div>;
  }

  const totalPages = Math.ceil(totalMovies / moviesPerPage); // 전체 영화 수를 기준으로 총 페이지 수 계산
  const startIndex = (currentPage - 1) * moviesPerPage; // 현재 페이지에서 영화 시작 인덱스
  const currentMovies = movies.slice(startIndex, startIndex + moviesPerPage); // 현재 페이지의 영화들

  return (
    <div ref={containerRef} className="table-view">
      <div className="movie-row">
        {currentMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default TableView;
