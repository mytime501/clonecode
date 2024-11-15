import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인이 되어있지 않으면 /signin으로 리디렉션
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [navigate]);

  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <p>TMDB 영화 데이터 등을 사용할 수 있는 페이지입니다.</p>
      {/* 메인 페이지 내용 추가 */}
    </div>
  );
};

export default Home;
