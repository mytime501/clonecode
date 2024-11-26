import React, { useState, useEffect } from "react";
import FilterBar from "../components/FilterBar";
import InfiniteScrollView from "../components/InfiniteScrollView";
import "../css/search.css";
import Header from "../components/Header";
import ScrollToTopButton from "../components/ScrollToTopButton";

const Search = () => {
  const [filteredMovies, setFilteredMovies] = useState(""); // 필터링된 또는 검색된 영화 URL
  const [apiKey, setApiKey] = useState("");
  const [filters, setFilters] = useState({
    genre: "",
    rating: "",
    sort: "popularity.desc",
    year: "",
  });

  // 인증 처리 및 API 키 설정
  useEffect(() => {
    // 로그인이 되어있지 않으면 /signin으로 리디렉션
    const isAuthenticatedString = localStorage.getItem('isAuthenticated');
    const isAuthenticated = isAuthenticatedString ? JSON.parse(isAuthenticatedString) : null;
    if (isAuthenticated) {
      setApiKey(isAuthenticated.password);
    }
  }, []);

  // 필터를 기반으로 API 호출
  useEffect(() => {
    if (!apiKey) return;

    const fetchMovies = () => {
      // 기본 Discover API URL
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=1`;

      // 필터 조건 추가
      if (filters.genre) url += `&with_genres=${filters.genre}`;
      if (filters.rating) url += `&vote_average.gte=${filters.rating}`;
      if (filters.year) url += `&primary_release_year=${filters.year}`;
      if (filters.sort) url += `&sort_by=${filters.sort}`;

      setFilteredMovies(url);
    };

    fetchMovies();
  }, [apiKey, filters]);

  // 검색 기능 처리
  const handleSearch = (query) => {
    if (!apiKey) return;

    // 검색 API URL 생성
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1`;

    setFilteredMovies(searchUrl);
  };

  // 필터 초기화
  const resetFilters = () => {
    setFilters({
      genre: "",
      rating: "",
      sort: "popularity.desc",
      year: "",
    });
  };

  return (
    <div>
      <Header />
      <div className="search-container">
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
          onSearch={handleSearch} // 검색 함수 전달
        />
        <InfiniteScrollView fullurl={filteredMovies} />
        <ScrollToTopButton />
      </div>
    </div>
  );
};

export default Search;
