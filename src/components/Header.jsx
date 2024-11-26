import React, { useState, useEffect } from 'react';
import '../css/home.css';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [scrolling, setScrolling] = useState(false); // 스크롤 상태 관리

  // 스크롤 이벤트 처리
  const handleScroll = () => {
    if (window.scrollY > 50) { // 스크롤이 50px 이상일 때
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };

  // useEffect를 사용하여 스크롤 이벤트를 처리
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll); // 컴포넌트 언마운트 시 이벤트 제거
    };
  }, []);

  return (
    <header className={`header ${scrolling ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* 로고 */}
        <div className="logo">
          <i 
            className="fas fa-video logo-icon" 
            onClick={() => navigate("/")}
            aria-label="logo"
          ></i>
        </div>

        {/* 메뉴 항목 */}
        <nav className="nav-menu">
          <Link to="/" className="nav-item">
            홈
          </Link>
          <Link to="/popular" className="nav-item">
            대세 콘텐츠
          </Link>
          <Link to="/search" className="nav-item">
            찾아보기
          </Link>
          <Link to="/wishlist" className="nav-item">
            내가 찜한 리스트
          </Link>
        </nav>

        {/* 프로필 아이콘 */}
        <div className="profile-icon">
          <i 
            className="fas fa-user profile-icon-style"  
            onClick={() => {
              localStorage.removeItem("token");
              sessionStorage.removeItem("token");
              navigate("/Signin")}}
            aria-label="user"
          ></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
