import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MovieList from '../components/MovieList';

const Home = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    // 로그인이 되어있지 않으면 /signin으로 리디렉션
    const isAuthenticatedString = localStorage.getItem('isAuthenticated');
    const isAuthenticated = isAuthenticatedString ? JSON.parse(isAuthenticatedString) : null;
    if (isAuthenticated) {
      setApiKey(isAuthenticated.password);
    }
    else{
      navigate('/signin');
    }
  }, []);

  const baseUrl = 'https://api.themoviedb.org/3';
  
  const endpoints = {
    upcoming: `${baseUrl}/movie/upcoming?api_key=${apiKey}`,
    nowPlaying: `${baseUrl}/movie/now_playing?api_key=${apiKey}`,
    popular: `${baseUrl}/movie?api_key=${apiKey}`,
    topRated: `${baseUrl}/movie/top_rated?api_key=${apiKey}`
  };

  if(apiKey)
  {
    return (
      <div>
        <Header />
        <div className="home-content">
          <MovieList apiUrl={endpoints.upcoming} title="개봉 예정 영화" />
          <MovieList apiUrl={endpoints.nowPlaying} title="현재 상영 중" />
          <MovieList apiUrl={endpoints.popular} title="인기 영화" />
          <MovieList apiUrl={endpoints.topRated} title="높은 평점 영화" />
        </div>
      </div>
    );
  }
};

export default Home;
