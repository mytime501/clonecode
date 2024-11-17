import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signin from './pages/Signin';
import Home from './pages/Home';
import Wishlist from './pages/Wishlist'; // 추가된 찜한 리스트 페이지 예시

function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/signin" state={{ from: window.location.pathname }} />
  );
}

function App() {
  return (
    <Router>
      <Routes>
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
          path="/wishlist"
          element={
            <PrivateRoute>
              <Wishlist />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
