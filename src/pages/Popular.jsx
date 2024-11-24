import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import TableView from "../components/TableView";
import InfiniteScrollView from "../components/InfiniteScrollView";
import ScrollToTopButton from "../components/ScrollToTopButton";
import Header from '../components/Header';
import "../css/popular.css";

const Popular = () => {
  const [movies, setMovies] = useState([]);
  const [Inmovies, setInMovies] = useState([]);
  const [viewType, setViewType] = useState("infinite");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState("");
  const [moviesPerPage, setMoviesPerPage] = useState(0); // 기본값 0으로 설정

  const containerRef = useRef(null); // 컨테이너 참조

  useEffect(() => {
    const isAuthenticatedString = localStorage.getItem('isAuthenticated');
    const isAuthenticated = isAuthenticatedString ? JSON.parse(isAuthenticatedString) : null;
  
    if (isAuthenticated) {
      setApiKey(isAuthenticated.password);
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  useEffect(() => {
    if (apiKey) {
      fetchMovies(currentPage);
    }
  }, [apiKey, currentPage]);

  // 영화 데이터를 가져오는 함수
  const BASE_URL = "https://api.themoviedb.org/3/movie/popular";

  const fetchMovies = async (page = 1) => {
    if (!apiKey) {
      console.error("API Key is missing!");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}?api_key=${apiKey}&page=${page}`);
      const data = await response.json();

      if (!response.ok) {
        console.error("Error fetching movies:", data);
        return;
      }

      if (data.results) {
        setMovies(data.results);
        if (page === 1) {
          setInMovies(data.results);
        } else {
          setInMovies((prevMovies) => [...prevMovies, ...data.results]);
        }

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
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Infinite Scroll 처리
  const handleScroll = () => {
    if (viewType === "infinite") {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollTop + clientHeight >= scrollHeight - 10 && !isLoading) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  };

  // 화면 크기에 따라 자율적으로 한 줄에 들어갈 영화 개수를 계산
  useEffect(() => {
    const calculateMoviesPerPage = () => {
      const containerWidth = containerRef.current ? containerRef.current.offsetWidth : window.innerWidth;
      const movieWidth = 200; // 영화의 너비 (예시로 200px로 설정, 실제 너비에 맞게 조정 필요)
      const moviesPerRow = Math.floor(containerWidth / movieWidth); // 한 줄에 들어갈 영화 개수 계산

      if (moviesPerRow > 0) {
        const moviesPerPage = moviesPerRow * 3; // 3행으로 계산 (각 줄에 moviesPerRow 개수의 영화가 들어가게 설정)
        setMoviesPerPage(moviesPerPage);
      } else {
        setMoviesPerPage(0); // 영화의 너비가 너무 커서 한 줄에 들어갈 수 없으면 0으로 설정
      }
    };

    calculateMoviesPerPage();  // 초기 계산
    window.addEventListener("resize", calculateMoviesPerPage);  // 화면 크기 변경 시 계산

    return () => window.removeEventListener("resize", calculateMoviesPerPage);  // 리스너 정리
  }, [containerRef]);

  useEffect(() => {
    if (viewType === "infinite") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [viewType, isLoading]);

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
            movies={Inmovies}
            isLoading={isLoading}
          />
        )}

        <ScrollToTopButton />
      </div>
    </div>
  );
};

export default Popular;
