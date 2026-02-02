import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate

const Login = ({ isLoggedIn, setIsLoggedIn }) => { // Add isLoggedIn to props
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedNickname = localStorage.getItem('nickname');
    if (storedNickname) {
      setNickname(storedNickname);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', { userid, password });
      if (response.status === 200) {
        const { nickname } = response.data;
        alert('로그인 성공!');
        setIsLoggedIn(true);
        localStorage.setItem('userid', userid);
        localStorage.setItem('nickname', nickname);
        navigate('/');
        window.location.reload();
      } else {
        alert('로그인 실패');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인에 실패하였습니다.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/'); // Redirect to home after logout
  };


  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {!isLoggedIn ? (
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center">로그인</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="userid">아이디:</label>
                    <input type="text" className="form-control" id="userid" value={userid} onChange={(e) => setUserid(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">비밀번호:</label>
                    <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">로그인</button>
                </form>
                <p className="text-center mt-3">계정이 없으신가요? <Link to="/signup">회원가입</Link></p> {/* Use Link component */}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center">로그아웃</h2>
                <button onClick={handleLogout} className="btn btn-danger btn-block">로그아웃</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
