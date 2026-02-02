import React, { useState, useEffect } from 'react';
import './App.css';
import 허브Image from './images/메인로고.jpg';
import { BrowserRouter as Router, Routes, Route, Link, Navigate} from 'react-router-dom';
import Mainpage from './components/Mainpage';
import Login from './components/Login';
import Itemlist from './components/Itemlist';
import Itemadd from './components/Itemadd';
import Signup from './components/Signup';
import Mypage from './components/Mypage';
import Detail from './components/Detail';
import Comment from './components/Comment';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 관리하는 상태
  const [nickname, setNickname] = useState(''); // 사용자 닉네임을 관리하는 상태
  useEffect(() => {
    const loggedInUser = localStorage.getItem('userid');
    const loggedInNickname = localStorage.getItem('nickname');
    if (loggedInUser) {
      setIsLoggedIn(true);
      setNickname(loggedInNickname);
    } else {
      setIsLoggedIn(false);
      setNickname('');
    }
  }, []);

  // 회원가입 처리 함수 정의
  const handleSignup = async (signupData) => {
    // 서버에 회원가입 정보 전송하는 로직 구현
    // 성공 또는 실패에 따라 true 또는 false 반환
    try {
      // 서버로 회원가입 정보 전송
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });
      const data = await response.json();

      if (response.ok) {
        // 회원가입 성공 시
        return true;
      } else {
        // 회원가입 실패 시
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };


  // 로그아웃 처리 함수 정의
  const handleLogout = () => {
    setIsLoggedIn(false);
    setNickname('');
    localStorage.removeItem('userid');
    localStorage.removeItem('nickname');
  };
  const handleLogin = async (nickname) => {
    try {
      setIsLoggedIn(true); // 로그인 상태를 true로 업데이트
      setNickname(nickname); // 사용자 닉네임을 설정
      localStorage.setItem('nickname', nickname);
    } catch (error) {
      console.error('로컬 스토리지에 값 저장 실패:', error);
    }
  };
  

  return (
    <Router>
      <div>
        <div id="header-wrapper">
          <div id="header" className="container">
            <div id="user-info">
              {isLoggedIn && (
                <p>{nickname}님,환영합니다. <button onClick={handleLogout}>로그아웃</button></p>
              )}
            </div>
            <div id="logo">
              <h1>
                <Link to="/">
                  <div style={{ backgroundImage: `url(${허브Image})`, width: '200px', height: '100px' }}></div>
                </Link>
              </h1>
            </div>
            <div id="menu">
              <ul>
                {/* 로그인 상태에 따라 메뉴 변경 */}
                {!isLoggedIn ? (
                  <li className="current_page_item"><Link to="/login">로그인/회원가입</Link></li>
                ) : (
                  <li className="current_page_item"><Link to="/mypage">마이페이지</Link></li>
                )}
                {/* 공통 메뉴 */}
                <li className=" blue_page_item"><Link to="/itemlist">물품 거래</Link></li>
                <li className="blue_page_item"><Link to="/itemadd">상품 등록</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setNickname={setNickname} handleLogin={handleLogin} />} />
          <Route path="/itemlist" element={<Itemlist />} />
          <Route path="/itemadd" element={isLoggedIn ? <Itemadd /> : <Navigate to="/login" />} />
          <Route path="/signup" element={<Signup handleSignup={handleSignup} />} />
          <Route path="/mypage" element={isLoggedIn ? <Mypage /> : <Navigate to="/login" />} />
          <Route path="/detail/:itemId" element={<Detail />} />
          <Route path="/comment" element={<Comment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
