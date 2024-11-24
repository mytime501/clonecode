import React from 'react';
import '../css/home.css';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  return (
    <header className="header">
      <div className="header-container">
        {/* 로고 */}
        <div className="logo">
          <i 
            className="fas fa-video" 
            style={{ fontSize: '28px', cursor: 'pointer' }} 
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
            className="fas fa-user" 
            style={{ fontSize: '28px', cursor: 'pointer' }} 
            onClick={() => navigate("/Signin")}
            aria-label="user"
          ></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
