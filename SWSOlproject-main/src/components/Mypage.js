import axios from 'axios';
import { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';


export default function Mypage() {
  const [userinfo, setUserinfo] = useState(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [nickname, setNickname] = useState('');

  const handleLogout = () => {
    setIsLoggedIn(false);
    setNickname('');
    localStorage.removeItem('userid');
    localStorage.removeItem('nickname');
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const loggedInUser = localStorage.getItem('userid');
        const response = await axios.get(`http://localhost:3001/api/mypage?userid=${loggedInUser}`);
        setUserinfo(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleWithdrawal = async () => {
    try {
      const loggedInUser = localStorage.getItem('userid');
      await axios.delete(`http://localhost:3001/api/withdraw?userid=${loggedInUser}`);
      alert('회원 탈퇴가 완료되었습니다.');
      handleLogout();
      navigate('/');
      window.location.reload();
      // 회원 탈퇴 후 추가적인 작업 수행 (예: 로그아웃 처리 등)
    } catch (error) {
      console.error('Error:', error);
      alert('회원 탈퇴 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h1 className="text-center">마이페이지</h1>
            </div>
            <div className="card-body">
              {userinfo ? (
                <form>
                  <div className="mb-3">
                    <label htmlFor="userid" className="form-label">아이디:</label>
                    <input type="text" id="userid" value={userinfo.userid} className="form-control" readOnly />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="nickname" className="form-label">닉네임:</label>
                    <input type="text" id="nickname" value={userinfo.nickname} className="form-control" readOnly />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">이름:</label>
                    <input type="text" id="name" value={userinfo.name} className="form-control" readOnly />
                  </div>
                  <button type="button" className="btn btn-danger" onClick={handleWithdrawal}>회원 탈퇴</button>
                </form>
              ) : (
                <p className="text-center">사용자 정보를 불러오는 중...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
