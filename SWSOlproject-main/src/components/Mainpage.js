import { Link } from 'react-router-dom';
import Footer from './Footer';

function Mainpage() {  
    return (
      <div>
        <div id="header-featured"> </div>
        <div id="wrapper">
          <div id="featured-wrapper">
            <div id="featured" className="container">
              <h2>아름다운 꽃을 이웃에게 나눠보세요!</h2>
              <p>동네 주민들과 가깝고 따뜻한 거래를지금 경험해보세요.</p>
              <Link to="/itemadd" className="button">물품 등록 하러가기</Link>
            </div>
          </div>
          <div id="header-rjfo"> </div>
          <div id="featured-wrapper">
            <div id="featured" className="container">
              <h2>인테리어로 화초는 어떠신가요?</h2>
              <p>집에 꽃과 화초로 활기를 더해보세요!</p>
              <Link to="/itemlist" className="button">물품 구경 하러가기</Link>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
  
  export default Mainpage;