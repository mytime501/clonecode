import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import TableView from "../components/TableView";
import InfiniteScrollView from "../components/InfiniteScrollView";
import ScrollToTopButton from "../components/ScrollToTopButton";
import Header from '../components/Header';
import "../css/popular.css";

const Popular = () => {
  const [viewType, setViewType] = useState("infinite");
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState("");
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);
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
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    },
    [apiKey] // 의존성 배열에 필요한 값 포함
  );

  useEffect(() => {
    if (apiKey) {
      fetchMovies();
    }
  }, [apiKey, fetchMovies]);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight); // Header의 높이 설정
    }
  }, []);

  return (
    <div>
      <Header ref={headerRef} />
      <div className="popular-container">
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
            apiKey={apiKey}
            baseurl={BASE_URL}
            headerHeight={headerHeight}       
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
