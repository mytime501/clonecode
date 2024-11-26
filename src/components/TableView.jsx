import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import Pagination from './Pagination';
import '../css/popular.css';
import axios from 'axios';

const TableView = ({ apiKey, baseurl }) => {
  const [movies, setMovies] = useState([]); // 초기값을 빈 배열로 설정
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(0); // 한 페이지당 영화 수
  const [totalMovies, setTotalMovies] = useState(0); // 전체 영화 수를 저장하는 상태
  const [rowSize, setRowSize] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const [test, setTest] = useState(0);
  

  // 화면 크기 변화에 따른 상태 업데이트
  useEffect(() => {
    const initializeResize = () => {
      handleResize(); // 초기 로드 시 실행
    };

    initializeResize();
    // 화면 크기 변경 시 리사이즈 핸들러 실행
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // headerHeight가 변경될 때마다 실행되도록 의존성 추가

  useEffect(() => {
    setMoviesPerPage(rowSize * rowCount);
  }, [rowSize, rowCount]); // rowSize와 rowCount 변경 시 실행

  const handleResize = () => {
      const containerWidth =  window.innerWidth;
      const containerHeight = window.innerHeight;

      setTest(containerHeight);

      if(containerWidth<=195)
      {
        setRowSize(1);
      }
      else if(containerWidth<=290)
      {
        setRowSize(2);
      }
      else if (containerWidth <= 480)
      {
        setRowSize(3);
      } 
      else if (containerWidth <= 1000)
      {
        setRowSize(4);
      } 
      else if (containerWidth <= 1200) 
      {
        setRowSize(5);
      } 
      else
      {
        setRowSize(6);
      }

      if(containerWidth<=768)
      {
        if(containerHeight <= 432)
          {
            setRowCount(1);
          }
          else if(containerHeight <= 675)
          {
            setRowCount(2);
          }
          else
          {
            setRowCount(3);
          }
      }
      else if(containerWidth<=820)
      {
        if(containerHeight <= 540)
        {
          setRowCount(0);
        }
        else if(containerHeight <= 940)
        {
          setRowCount(1);
          setRowSize(3);
        }
        else
        {
          setRowCount(2);
          setRowSize(3);
        }
      }
      else if(containerWidth<=1200)
      {
        setRowSize(4);
        if(containerHeight <= 540)
        {
          setRowCount(0);
        }
        else if(containerHeight <= 940)
        {
          setRowCount(1);
        }
        else{
          setRowCount(2);
        }
      }
      else if(containerWidth<=1220)
      {
        setRowSize(5);
        if(containerHeight <= 540)
        {
          setRowCount(0);
        }
        else if(containerHeight <= 940)
        {
          setRowCount(1);
        }
        else{
          setRowCount(2);
        }
      }
      else
      {
        if(containerHeight <= 540)
          {
            setRowCount(0);
          }
          else if(containerHeight <= 940)
          {
            setRowCount(1);
          }
          else{
            setRowCount(2);
          }
      }
  };
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
  
        setMovies((prevMovies) => {
          const uniqueMovies = [
            ...prevMovies,
            ...response.data.results,
          ].filter(
            (movie, index, self) =>
              self.findIndex((m) => m.id === movie.id) === index // 중복 제거
          );
  
          return uniqueMovies;
        });
  
        setTotalMovies(response.data.total_results || 0);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
  
    fetchMovies();
  }, [apiKey, baseurl, currentPage]);
  
  
  if (!movies || movies.length === 0) {
    return <div>영화를 불러오는 중입니다...</div>;
  }

  const totalPages = Math.ceil(totalMovies / moviesPerPage); // 전체 영화 수를 기준으로 총 페이지 수 계산
  const startIndex = (currentPage - 1) * moviesPerPage; // 현재 페이지에서 영화 시작 인덱스
  const currentMovies = movies.slice(startIndex, startIndex + moviesPerPage); // 현재 페이지의 영화들

  const rows = [];
  for (let i = 0; i < currentMovies.length; i += rowSize) {
    rows.push(currentMovies.slice(i, i + rowSize));
  }


  console.log(moviesPerPage, rowSize, rowCount, test);


  return (
    <div className="table-view">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="movie-row">
          {row.map((movie, movieIndex) => (
            <MovieCard key={movie.id || `empty-${movieIndex}`} movie={movie} hideDetails={true}  />
          ))}
        </div>
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default TableView;
