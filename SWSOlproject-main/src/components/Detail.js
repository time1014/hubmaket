import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Comment from './Comment';

function Detail() {
  const { itemId } = useParams(); // useParams 훅을 사용하여 URL 매개변수 가져오기
  const [item, setItem] = useState(null);
  const [userId, setUserId] = useState('');
  const [buyComments, setBuyComments] = useState([]);
  const nickName = localStorage.getItem('nickname');
  const [replyMode, setReplyMode] = useState(false); // 답글 모드 상태
  const [replyComment, setReplyComment] = useState(''); // 답글 내용 상태
  const [replyId, setReplyId] = useState(null); // 답글할 댓글의 ID 상태



  useEffect(() => {
    // 페이지가 로드될 때 사용자 ID를 가져와 설정합니다.
    const loggedInUser = localStorage.getItem('userid');
    setUserId(loggedInUser);
  }, []);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/items/${itemId}`);
        setItem(response.data);
      } catch (error) {
        console.error('상품 정보를 가져오는데 실패했습니다:', error);
      }
    };
    fetchItem();
  }, [itemId]);

  useEffect(() => {
    const fetchBuyComments = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/buycomment`);
        setBuyComments(response.data);
      } catch (error) {
        console.error('구매 댓글 정보를 가져오는데 실패했습니다:', error);
      }
    };
    fetchBuyComments();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/items/${itemId}`, {
        headers: {
          userid: userId // 사용자 아이디를 요청 헤더에 전달
        }
      });
      alert('상품이 성공적으로 삭제되었습니다.');
      // 삭제 후에 다른 작업 수행 (예: 페이지 리로드)
    } catch (error) {
      console.error('상품 삭제 실패:', error);
      alert('상품 삭제에 실패했습니다.');
    }
  };

  const handleReplyMode = (id) => {
    setReplyId(id);
    setReplyMode(true);
  };

  const handleReplySubmit = async () => {
    try {
      await axios.put(`http://localhost:3001/buycomment/${replyId}`, {
        comment: replyComment,
        nickname: nickName
      });
      alert('댓글이 성공적으로 수정되었습니다.');
      setReplyMode(false);
      setReplyComment('');
      window.location.reload();
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert('댓글 수정에 실패했습니다.');
    }
  };


  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <Link to={`/itemlist`} className="button alt">
                상품 목록
              </Link>
              {userId === item.userId && (
                <button onClick={handleDelete} className="btn btn-danger float-right">삭제</button>
              )}
              <h1 className="card-title text-center">{item.title}</h1>
              <img src={`http://localhost:3001${item.img_url}`} alt={item.title} className="mt-2 img-thumbnail" style={{ width: '100%' }} />
              <p className="mt-2">판매자: {item.nickname}</p>
              <p className="mt-2">{item.description}</p>
              <p>가격: {item.price}원</p>
              <p className="mt-2">상품 등록일: {item.createdAt}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <h3 id="buy-comment-heading">구매 요청글 목록</h3>
        {buyComments.map((buyComment, index) => {
          // buyComment의 itemId와 itemId가 같을 때만 댓글을 표시합니다.
          if (buyComment.itemId === itemId) {
            return (
              <div key={index} className="card mt-3">
                <div className="card-body">
                  <p id="buy-consumer">닉네임: {buyComment.nickname}</p>
                  {(buyComment.nickname === nickName || item.userId === userId) ? (
                    <>
                      <p id="buy-comment">{buyComment.comment}</p>
                      {Object.keys(buyComment).map(key => {
                        if (key.startsWith('reply')) {
                          return <p key={key}>{buyComment[key]}</p>;
                        }
                        return null;
                      })}
                      {replyMode && buyComment.id === replyId ? (
                        <div>
                          <textarea value={replyComment} onChange={(e) => setReplyComment(e.target.value)} style={{ width: '100%', height: '200px' }} />
                          <button className="btn btn-primary" onClick={handleReplySubmit}>답글 달기</button>
                        </div>
                      ) : (
                        <div>
                          <button className="btn btn-primary" onClick={() => handleReplyMode(buyComment.id)}>답글</button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p>비밀 댓글입니다.</p>
                  )}
                  <p>작성일시: {buyComment.createdAt}</p>
                </div>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
      <Comment itemId={itemId} />
    </div>
  );
}
export default Detail;