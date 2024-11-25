import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import FilterBar from "../components/FilterBar";
import InfiniteScrollView from "../components/InfiniteScrollView";
import "../css/search.css";
import Header from "../components/Header";

const Search = () => {
  const [filteredMovies, setFilteredMovies] = useState([]); // 필터링된 영화 데이터
  const [apiKey, setApiKey] = useState("");
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [filters, setFilters] = useState({
    genre: "",
    rating: "",
    sort: "popularity.desc",
    year: "",
  });

  useEffect(() => {
    const isAuthenticatedString = localStorage.getItem('isAuthenticated');
    const isAuthenticated = isAuthenticatedString ? JSON.parse(isAuthenticatedString) : null;
  
    if (isAuthenticated) {
      setApiKey(isAuthenticated.password);
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  // 필터를 기반으로 API 호출 (필터링된 영화만 가져오기)
  useEffect(() => {
    const fetchMovies = async () => {
      if (!apiKey) return;

      // API 요청 URL에 필터 조건 추가
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=1`;

      // 필터 조건이 있다면 URL에 추가
      if (filters.genre) {
        url += `&with_genres=${filters.genre}`;
      }
      if (filters.rating) {
        url += `&vote_average.gte=${filters.rating}`; // rating 이상인 영화만
      }
      if (filters.year) {
        url += `&primary_release_year=${filters.year}`;
      }
      if (filters.sort) {
        url += `&sort_by=${filters.sort}`;
      }

      try {
        setFilteredMovies(url);
      } catch (error) {
        console.error("영화 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchMovies();
  }, [apiKey, filters]); // filters 변경될 때마다 API 호출

  // 필터 초기화
  const resetFilters = () => {
    setFilters({
      genre: "",
      rating: "",
      sort: "popularity.desc",
      year: "",
    });
    // 필터 초기화 후, 전체 데이터를 다시 가져오기 위해 API 호출
  };

  return (
    <div>
        <Header />
        <div className="search-container">
            <FilterBar
                filters={filters}
                setFilters={setFilters}
                resetFilters={resetFilters}
            />
            <InfiniteScrollView 
              fullurl={filteredMovies} 
            />
        </div>
    </div>
  );
};

export default Search;
