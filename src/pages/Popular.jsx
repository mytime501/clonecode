import React, { useState, useEffect, useCallback } from "react";
import TableView from "../components/TableView";
import InfiniteScrollView from "../components/InfiniteScrollView";
import ScrollToTopButton from "../components/ScrollToTopButton";
import Header from '../components/Header';
import "../css/popular.css";

const Popular = () => {
  const [viewType, setViewType] = useState("table");
  const [apiKey, setApiKey] = useState("");
  const check = true

  // 인증 상태 확인 및 API 키 설정
  useEffect(() => {
    // 로그인이 되어있지 않으면 /signin으로 리디렉션
    const isAuthenticatedString = localStorage.getItem('isAuthenticated');
    const isAuthenticated = isAuthenticatedString ? JSON.parse(isAuthenticatedString) : null;
    if (isAuthenticated) {
      setApiKey(isAuthenticated.password);
    }
  }, []);

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

  return (
    <div>
      <Header/>
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
