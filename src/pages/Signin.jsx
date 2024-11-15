import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputField from '../components/InputField';
import CheckboxField from '../components/CheckboxField';
import Button from '../components/Button';
import '../css/Signin.css';

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
      localStorage.setItem("isAuthenticated", true); // 로그인 상태 저장
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
    localStorage.setItem(email, password); // 비밀번호 저장
    toast.success("회원가입 성공!");
    setIsSignUp(false); // 회원가입 완료 후 로그인 화면으로 전환
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? "회원가입" : "로그인"}</h2>
      <InputField
        type="email"
        placeholder="아이디 (이메일)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {isSignUp && (
        <>
          <InputField
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <CheckboxField
            label="약관에 동의합니다."
            checked={termsAccepted}
            onChange={() => setTermsAccepted(!termsAccepted)}
          />
        </>
      )}
      <CheckboxField
        label="Remember me"
        checked={rememberMe}
        onChange={() => setRememberMe(!rememberMe)}
      />
      <Button onClick={isSignUp ? handleSignUp : handleSignIn}>
        {isSignUp ? "회원가입" : "로그인"}
      </Button>
      <Button onClick={toggleAuthMode}>
        {isSignUp ? "로그인하기" : "회원가입하기"}
      </Button>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Signin;
