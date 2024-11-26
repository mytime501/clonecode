import React, { useEffect, useState, useCallback } from "react";
import MovieCard from './MovieCard';

const InfiniteScrollView = ({ apiKey, baseurl, fullurl, check }) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [CssCheck, setCssCheck] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const BASE_URL = baseurl;
  
  useEffect(() => {
    setCssCheck(check);
  }, [check]);

  // fetchMovies 함수 메모이제이션
  const fetchMovies = useCallback(
    async (page, isReset = false) => {
      setIsLoading(true);

      try {
        let response;
        // fullurl이 제공되었으면 해당 URL 사용
        if (fullurl) {
          response = await fetch(`${fullurl}&page=${page}&language=ko-KR`);
        } else {
          response = await fetch(`${BASE_URL}?api_key=${apiKey}&page=${page}&language=ko-KR`);
        }

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.results) {
          setMovies((prevMovies) => {
            // isReset이 true인 경우 새 데이터로 교체
            if (isReset) {
              return data.results;
            }

            // 기존 데이터에 새 데이터를 추가하며 중복 제거
            const uniqueMovies = data.results.filter(
              (newMovie) => !prevMovies.some((movie) => movie.id === newMovie.id)
            );
            return [...prevMovies, ...uniqueMovies];
          });
          setTotalPages(data.total_pages);
        } else {
          console.error("No results found in response data.");
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey, BASE_URL, fullurl] // 의존성 배열에 필요한 값만 포함
  );

  // fullurl이 변경될 때마다 데이터를 새로 가져오도록 처리
  useEffect(() => {
    if (fullurl) {
      fetchMovies(1, true); // fullurl이 변경되면 초기화 후 첫 페이지부터 새로 데이터를 가져옴
    }
  }, [fullurl, fetchMovies]);

  // 스크롤 이벤트 핸들러 메모이제이션
  const handleScroll = useCallback(() => {
    if (isLoading || currentPage >= totalPages) return;

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, currentPage, totalPages]);

  // currentPage 변경 시 fetchMovies 호출
  useEffect(() => {
    if (currentPage > 1 || !fullurl) {
      fetchMovies(currentPage);
    }
  }, [fetchMovies, currentPage, fullurl]);

  // 스크롤 이벤트 등록 및 해제
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="infinite-scroll-view">
      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} hideDetails={CssCheck} />
        ))}
      </div>
      {isLoading && <p className="loading-text">Loading...</p>}
      {currentPage >= totalPages && <p className="end-text">You have reached the end.</p>}
    </div>
  );
};

export default InfiniteScrollView;
