import React, { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';

function ItemAdd() {
  const [image, setImage] = useState(null);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [preview, setPreview] = useState(''); // 이미지 미리보기를 위한 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 관리하는 상태
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('userid');
    const userNickname = localStorage.getItem('nickname');
    if (loggedInUser) {
      setIsLoggedIn(true);
      setNickname(userNickname);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

    const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  useEffect(() => {
    // 이미지 상태가 변경될 때마다 미리보기 업데이트
    if (!image) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    // Clean up
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);




  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('image', image);
    formData.append('productName', productName);
    formData.append('description', description);
    formData.append('price', price);

    const userId = localStorage.getItem('userid'); // 로그인한 사용자의 userid를 가져옴
    const nickname = encodeURIComponent(localStorage.getItem('nickname'));
    formData.append('userid', userId); // FormData에 userid 추가

  
    try {
        const response = await fetch('http://localhost:3001/upload', {
            method: 'POST',
            body: formData,
            headers: {
              'userid': userId,// 헤더에도 userid 추가
              'nickname': nickname
            }
        });
        const data = await response.json(); // 서버로부터의 응답을 JSON으로 받음
        const imageUrl = data.imageUrl; // 서버에서 받은 이미지 URL
        alert('상품이 성공적으로 등록되었습니다.');
        navigate('/itemlist');
        // 이후에 필요한 작업 수행 (예: 화면 리로드)
    } catch (error) {
        console.error('상품 등록 실패:', error);
        alert('상품 등록에 실패했습니다.');
    }
  };
  

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">상품 등록</h1>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="productImage">상품 이미지:</label>
                  <input type="file" className="form-control-file" id="productImage" onChange={handleImageChange} />
                  {preview && <img src={preview} alt="Preview" className="mt-2 img-thumbnail" style={{ width: '100px' }} />}
                </div>
                <div className="form-group">
                  <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="form-control" placeholder="상품명" />
                </div>
                <div className="form-group">
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" placeholder="상품 설명"></textarea>
                </div>
                <div className="form-group">
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control" placeholder="가격" />
                </div>
                <button type="submit" className="btn btn-primary btn-block">등록</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemAdd;
