import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signin.css';

const Signin = () => {
  const [isSignUp, setIsSignUp] = useState(false); // 로그인/회원가입 전환
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const toggleAuthMode = () => setIsSignUp(!isSignUp);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSignIn = () => {
    if (!validateEmail(email)) {
      toast.error("유효한 이메일을 입력하세요.");
      return;
    }
    const storedPassword = localStorage.getItem(email);
    if (storedPassword && storedPassword === password) {
      toast.success("로그인 성공!");
      navigate('/');
    } else {
      toast.error("아이디 또는 비밀번호가 잘못되었습니다.");
    }
  };

  const handleSignUp = () => {
    if (!validateEmail(email)) {
      toast.error("유효한 이메일을 입력하세요.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!termsAccepted) {
      toast.error("약관에 동의해야 합니다.");
      return;
    }
    localStorage.setItem(email, password); // TMDB API 키를 사용해 저장할 수도 있음
    toast.success("회원가입 성공!");
    setIsSignUp(false); // 회원가입 완료 후 로그인 창으로 전환
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? "회원가입" : "로그인"}</h2>
      <input
        type="email"
        placeholder="아이디 (이메일)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {isSignUp && (
        <>
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
            />
            약관에 동의합니다.
          </label>
        </>
      )}
      <label>
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
        />
        Remember me
      </label>
      <button onClick={isSignUp ? handleSignUp : handleSignIn}>
        {isSignUp ? "회원가입" : "로그인"}
      </button>
      <button onClick={toggleAuthMode}>
        {isSignUp ? "로그인하기" : "회원가입하기"}
      </button>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Signin;
