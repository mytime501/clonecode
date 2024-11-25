import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import TableView from "../components/TableView";
import InfiniteScrollView from "../components/InfiniteScrollView";
import ScrollToTopButton from "../components/ScrollToTopButton";
import Header from '../components/Header';
import "../css/popular.css";

const Popular = () => {
  const [movies, setMovies] = useState([]);
  const [viewType, setViewType] = useState("infinite");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState("");
  const [moviesPerPage, setMoviesPerPage] = useState(0);

  const containerRef = useRef(null);
  const check = true

  // 인증 상태 확인 및 API 키 설정
  useEffect(() => {
    const isAuthenticatedString = localStorage.getItem('isAuthenticated');
    const isAuthenticated = isAuthenticatedString ? JSON.parse(isAuthenticatedString) : null;

    if (isAuthenticated) {
      setApiKey(isAuthenticated.password);
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  // 영화 데이터를 가져오는 함수 (useCallback 사용)
  const BASE_URL = "https://api.themoviedb.org/3/movie/popular";

  const fetchMovies = useCallback(
    async (page = 1) => {
      if (!apiKey) {
        console.error("API Key is missing!");
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}?api_key=${apiKey}&page=${page}`);
        const data = await response.json();

        if (!response.ok) {
          console.error("Error fetching movies:", data);
          return;
        }

        if (data.results) {
          setMovies(data.results);

          // 동적으로 총 페이지 수 계산
          const totalMovieCount = data.total_results;
          setTotalPages(Math.ceil(totalMovieCount / moviesPerPage));
        } else {
          console.error("Unexpected API response:", data);
          setMovies([]);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
      }
    },
    [apiKey, moviesPerPage] // 의존성 배열에 필요한 값 포함
  );

  useEffect(() => {
    if (apiKey) {
      fetchMovies(currentPage);
    }
  }, [apiKey, currentPage, fetchMovies]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 화면 크기에 따라 영화 개수 계산
  useEffect(() => {
    const calculateMoviesPerPage = () => {
      const containerWidth = containerRef.current ? containerRef.current.offsetWidth : window.innerWidth;
      const movieWidth = 200;
      const moviesPerRow = Math.floor(containerWidth / movieWidth);

      if (moviesPerRow > 0) {
        setMoviesPerPage(moviesPerRow * 3);
      } else {
        setMoviesPerPage(0);
      }
    };

    calculateMoviesPerPage();
    window.addEventListener("resize", calculateMoviesPerPage);

    return () => window.removeEventListener("resize", calculateMoviesPerPage);
  }, []);

  return (
    <div>
      <Header />
      <div className="popular-container" ref={containerRef}>
        <div className="view-toggle">
          <button onClick={() => setViewType("table")} className={viewType === "table" ? "active" : ""}>
            Table View
          </button>
          <button onClick={() => setViewType("infinite")} className={viewType === "infinite" ? "active" : ""}>
            Infinite Scroll
          </button>
        </div>

        {viewType === "table" ? (
          <TableView
            movies={movies}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            fetchMovies={fetchMovies}
          />
        ) : (
          <InfiniteScrollView
            apiKey={apiKey}
            baseurl={BASE_URL}
            check={check}
          />
        )}

        <ScrollToTopButton />
      </div>
    </div>
  );
};

export default Popular;
