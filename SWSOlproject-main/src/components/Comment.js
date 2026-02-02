import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useLocation,useNavigate } from 'react-router-dom';

function Comment() {
  const [nickname, setNickname] = useState('');
  const [comment, setComment] = useState('');
  const nickName = localStorage.getItem('nickname');
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const itemId = pathname.split('/').pop();
  
  useEffect(() => {
    console.log('Extracted item ID:', itemId);
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/comment', { nickname: nickName, comment, itemId }); // 서버로 댓글 데이터 전송
      setNickname('');
      setComment(''); // 입력 필드 초기화
      alert('댓글이 성공적으로 등록되었습니다.');
      navigate('/itemlist');
    } catch (error) {
      console.error('댓글 등록 중 에러 발생:', error);
      alert('댓글 등록에 실패했습니다.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>댓글 작성하기</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="닉네임"
            value={nickName}
            readOnly // 닉네임 입력 필드를 읽기 전용으로 변경
            required
          />
        </div>
        <div className="form-group">
          <textarea
            className="form-control"
            rows="3"
            placeholder="댓글을 입력하세요."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          댓글 작성
        </button>
      </form>
    </div>
  );
}

export default Comment;
