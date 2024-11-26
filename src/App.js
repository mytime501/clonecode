import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Signin from './pages/Signin';
import Home from './pages/Home';
import Wishlist from './pages/Wishlist';
import Popular from './pages/Popular';
import Search from './pages/Search';
import './App.css'; // 애니메이션을 위한 CSS 파일

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  return token ? (
    children
  ) : (
    <Navigate to="/signin" state={{ from: window.location.pathname }} />
  );
}

function App() {
  return (
    <Router> {/* Router 컴포넌트 안에서 useLocation() 사용 */}
      <RoutesWithTransition />
    </Router>
  );
}

function RoutesWithTransition() {
  const location = useLocation(); // 현재 위치 추적

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}  // 페이지마다 고유한 키를 사용하여 애니메이션 적용
        timeout={500}        // 애니메이션 시간
        classNames="fade"    // CSS 클래스 이름 (fade-enter, fade-exit 등)
      >
        {/* 애니메이션을 적용할 영역: Routes */}
        <Routes location={location}>
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/popular"
            element={
              <PrivateRoute>
                <Popular />
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <Search />
              </PrivateRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <PrivateRoute>
                <Wishlist />
              </PrivateRoute>
            }
          />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default App;
