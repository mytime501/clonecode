import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import MovieList from '../components/MovieList';
import MovieCarousel from '../components/MovieCarousel';

const Home = () => {
  const [apiKey, setApiKey] = useState("");
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // 로그인이 되어있지 않으면 /signin으로 리디렉션
    const isAuthenticatedString = localStorage.getItem('isAuthenticated');
    const isAuthenticated = isAuthenticatedString ? JSON.parse(isAuthenticatedString) : null;
    if (isAuthenticated) {
      setApiKey(isAuthenticated.password);
    }
  }, []);

  const baseUrl = 'https://api.themoviedb.org/3';
  

  useEffect(() => {
    if (apiKey) {
      const fetchMovies = async () => {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=ko-KR`
        );
        const data = await response.json();
        setMovies(data.results.slice(0, 7)); // 상위 7개 영화만 가져옴
      };

      fetchMovies();
    }
  }, [apiKey]);

  const endpoints = {
    upcoming: `${baseUrl}/movie/upcoming?api_key=${apiKey}&language=ko-KR`,
    nowPlaying: `${baseUrl}/movie/now_playing?api_key=${apiKey}&language=ko-KR`,
    popular: `${baseUrl}/movie/popular?api_key=${apiKey}&page=2&language=ko-KR`,
    topRated: `${baseUrl}/movie/top_rated?api_key=${apiKey}&language=ko-KR`
  };

  if(apiKey)
  {
    return (
      <div>
        <Header />
        <div className="home-content">
          <MovieCarousel movies={movies} />
          <MovieList apiUrl={endpoints.upcoming} title="최신 영화" />
          <MovieList apiUrl={endpoints.nowPlaying} title="현재 상영 중" />
          <MovieList apiUrl={endpoints.popular} title="인기 영화" />
          <MovieList apiUrl={endpoints.topRated} title="높은 평점 영화" />
        </div>
      </div>
    );
  }
};

export default Home;
