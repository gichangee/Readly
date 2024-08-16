import { useState } from 'react';
import LoginForm from './LoginForm.jsx';
import SignupForm from './SignupForm.jsx';
import './LoginPage.css'; // 기존 CSS 스타일을 가져옴

export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <div className="relative w-full h-screen">
      <div className="background"></div>
      <div className="login-page">
        <div className="login-content-wrapper">
          {showSignIn ? <SignupForm /> : <LoginForm />}
          <div className="login-switcher">
            {showSignIn ? (
              <div className="login-switcher-signin">
                <h3>계정이 있으신가요?</h3>
                <button onClick={() => setShowSignIn(false)}>로그인</button>
              </div>
            ) : (
              <div className="login-switcher-signup">
                <h3>계정을 만들고 싶으신가요?</h3>
                <button onClick={() => setShowSignIn(true)}>회원가입</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
