// Itemlist.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const baseURL = 'http://localhost:3001';

function Itemlist() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetch(`${baseURL}/items`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setItems(data);
      })
      .catch(error => setError(error.message));
  }, []);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <section className="wrapper style2">
      <div className="inner">
        {error && <p>Error fetching items: {error}</p>}
        <div className="row justify-content-center">
          <div className="col-md-8 offset-md-2 text-center" style={{ maxWidth: '75%', margin: 'auto' }}>
            <input
              type="text"
              placeholder="원하는 상품을 검색해보세요"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              className="rounded-lg py-2 px-4 w-100"
              style={{ outline: 'none', textAlign: 'center' }} // 텍스트를 가운데로 정렬합니다.
            />
          </div>
          {filteredItems.map(item => (
            <div className="col-md-6" key={item.id}>
              <div className="box text-center border">
                <div className="image fit" style={{ width: '40%', height: 'auto' }}>
                  <img
                    src={baseURL + item.img_url}
                    alt={item.title}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                <div className="content">
                  <header>
                    <h2>{item.title}</h2>
                  </header>
                  <p>{item.description}</p>
                  <footer>
                    <Link to={`/detail/${item.id}`} className="button alt">
                      상품보기
                    </Link>
                  </footer>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Itemlist;
