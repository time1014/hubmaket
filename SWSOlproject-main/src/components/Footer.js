import '../App.css';

function Footer() {
  return (
    <div className="at-footer">
      <div className="at-container">
        <div className="at-footermenu">
        </div>
        <div className="at-copyright">
          <hr></hr>
          <p></p>
          <p></p>
          <p></p>
          <address>
            <span>상호 : 허브마켓</span><span>대표 : 방진영</span><span>사업자등록번호 : 000-0000-0000</span><br />
            <span>대표전화 : 054-841-5077</span><span>이메일 : asd123@naver.com</span><span>Fax : 054-841-5377</span><br />
            <span>본사 :  대구 수성구 욱수동 화인비즈니스타운 2층 201호</span><span>서울지점 : (우:06762) 서울 서초구 바우뫼로2길 8, B2</span>
            <p>Copyright ⓒ ㈜허브마켓. All rights reserved.</p>
          </address>
          <div className="at-footer-telinfo">
            <strong>1644-4548</strong>
            <ul>
              <li><b>F.</b> 054-841-5377</li>
              <li><b>E.</b> asd123@naver.com</li>
            </ul>
            <p>평일 09:00 ~ 18:00 (점심시간 12:00~13:00)<br />토/일/공휴일 휴무</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer;