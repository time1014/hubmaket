import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';

const Signup = () => {
  const [userid, setUserid] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/signup', { userid, name, nickname, password });
      alert('회원가입이 완료되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입에 실패하였습니다.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">회원가입</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="userid">아이디:</label>
                  <input type="text" className="form-control" id="userid" value={userid} onChange={(e) => setUserid(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="name">이름:</label>
                  <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="nickname">닉네임:</label>
                  <input type="text" className="form-control" id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="password">비밀번호:</label>
                  <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary btn-block">가입하기</button>
              </form>
              <p className="text-center mt-3">계정이 있으신가요?<a href="/login">로그인</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
