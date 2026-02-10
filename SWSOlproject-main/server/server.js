const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3001;
const upload = multer({ dest: 'uploads/' });
const dataFilePath = path.join(__dirname, '..', 'db', 'item.json');
const buyCommentFilePath = path.join(__dirname, '..', 'db', 'buycomment.json');

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '??', // 본인의 MySQL 비밀번호로 변경
  database: '??', // 본인의 MySQL 데이터베이스 이름으로 변경
  insecureAuth: true
});

app.use(cors({
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// MySQL 연결
db.connect((err) => {
  if (err) {
    console.error('MySQL 데이터베이스에 연결할 수 없습니다:', err);
  } else {
    console.log('MySQL 데이터베이스에 연결되었습니다');
  }
});



// POST 요청을 처리하는 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: false }));

// 회원가입 요청 처리
app.post('/signup', (req, res) => {
  // POST 요청으로 전달된 데이터를 받아와서 처리하는 코드 작성
  const { userid, name, nickname, password } = req.body;
  db.query('INSERT INTO login (userid, name, nickname, password) VALUES (?, ?, ?, ?)', [userid, name, nickname, password], (err, result) => {
    if (err) {
      console.error('회원가입 오류:', err);
      res.status(500).json({ error: '회원가입에 실패했습니다.' });
    } else {
      res.status(200).json({ message: '회원가입이 완료되었습니다.' });
    }
  });
});

app.post('/login', (req, res) => {
  const { userid, password } = req.body;
  // 입력된 사용자 ID와 비밀번호가 일치하는지 데이터베이스에서 확인
  db.query('SELECT * FROM login WHERE userid = ? AND password = ?', [userid, password], (err, result) => {
    if (err) {
      console.error('로그인 오류:', err);
      res.status(500).json({ error: '로그인에 실패했습니다.' });
    } else {
      if (result.length > 0) {
        const { nickname } = result[0]; // 서버 응답에서 닉네임을 가져옴
        // 사용자가 존재하고 비밀번호가 일치하는 경우 로그인 성공
        res.status(200).json({ message: '로그인 성공!', nickname: nickname }); // 닉네임을 응답 데이터에 추가
      } else {
        // 사용자가 존재하지 않거나 비밀번호가 일치하지 않는 경우 로그인 실패
        res.status(401).json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' });
      }
    }
  });
});

//마이페이지
app.get('/api/mypage', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const userid = req.query.userid; // 쿼리 파라미터에서 userid를 가져옵니다.
  const sqlQuery = `SELECT * FROM login WHERE userid = ?`; // userid를 이용하여 쿼리를 생성합니다.
  db.query(sqlQuery, [userid], (err, result) => {
    if (err) {
      console.error('사용자 정보 불러오기 오류:', err);
      res.status(500).json({ error: '사용자 정보를 불러오는 중 오류가 발생했습니다.' });
    } else {
      if (result.length > 0) {
        res.status(200).json(result[0]);
      } else {
        res.status(404).json({ error: '사용자 정보를 찾을 수 없습니다.' });
      }
    }
  });
});

//회원탈퇴
app.delete('/api/withdraw', (req, res) => {
  const { userid } = req.query;

  // 사용자 정보 삭제 쿼리
  const deleteUserQuery = `DELETE FROM login WHERE userid = '${userid}'`;

  // 쿼리 실행
  db.query(deleteUserQuery, (err, result) => {
    if (err) {
      console.error('사용자 정보 삭제 오류:', err);
      res.status(500).send('사용자 정보 삭제 오류');
      return;
    }

    // 삭제된 행이 있으면 성공 메시지 응답
    if (result.affectedRows > 0) {
      res.status(200).send('회원 탈퇴 성공');
    } else {
      res.status(404).send('해당 사용자를 찾을 수 없음');
    }
  });
});


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/');  // 여기서 지정하는 경로가 서버의 작업 디렉토리 내부에 있어야 합니다.
  },
  filename: function(req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});




const uploaded = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));
app.post('/upload', uploaded.single('image'), (req, res) => {
  const { productName, description, price } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // 이미지 URL 수정
  const dataFilePath = path.join(__dirname, '..', 'db', 'item.json');
  const userId = req.headers.userid;
  const nickname = decodeURIComponent(req.headers.nickname);



  // item.json 파일에서 기존 데이터를 읽어옴
  let data = [];
  try {
    if (fs.existsSync(dataFilePath)) {
      const jsonData = fs.readFileSync(dataFilePath);
      data = JSON.parse(jsonData);
    }
  } catch (error) {
    console.error('item.json 파일을 읽는 중 에러 발생:', error);
  }

  const newItemId = Date.now();

  // 새로운 아이템 생성
  const newItem = {
    id: newItemId,
    userId: userId,
    nickname: nickname,
    img_url: imageUrl,
    title: productName,
    description,
    price,
    createdAt: new Date().toISOString(),
    ProductImages: [{ img_url: imageUrl }],
    ProductsTags: []
  };

  // 기존 데이터에 새로운 아이템 추가
  data.push(newItem);

  // item.json 파일에 쓰기
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

  // 클라이언트에 반환되는 이미지 URL 수정
  const publicImageUrl = req.file ? `${imageUrl}` : null;

  // 응답 보내기
  res.status(200).json({
    id: newItemId,
    imageUrl: publicImageUrl,
    message: '상품이 성공적으로 등록되었습니다.',
    nickname: nickname,
    userId: userId
  });
});


app.get('/items', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data file:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    try {
      const items = JSON.parse(data);
      res.json(items);
    } catch (err) {
      console.error('Error parsing JSON:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

app.get('/items/:itemId', (req, res) => {
  const itemId = parseInt(req.params.itemId);
  let data = [];
  try {
    if (fs.existsSync(dataFilePath)) {
      const jsonData = fs.readFileSync(dataFilePath);
      data = JSON.parse(jsonData);
    }
  } catch (error) {
    console.error('Error reading item.json:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }

  const item = data.find(item => item.id === itemId);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.json(item);
});

app.delete('/items/:itemId', (req, res) => {
  const itemId = parseInt(req.params.itemId);

  // 클라이언트에서 전달한 사용자 ID를 요청 헤더에서 가져옵니다.
  const userId = req.headers.userid;

  // 데이터 파일에서 상품 정보를 읽어옵니다.
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data file:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    try {
      let items = JSON.parse(data);

      // 해당 상품을 찾습니다.
      const index = items.findIndex(item => item.id === itemId);
      if (index === -1) {
        return res.status(404).json({ error: 'Item not found' });
      }

      const item = items[index];

      // 상품 작성자와 요청한 사용자가 일치하는지 확인합니다.
      if (item.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // 상품을 삭제합니다.
      items.splice(index, 1);

      // 변경된 상품 정보를 파일에 다시 씁니다.
      fs.writeFile(dataFilePath, JSON.stringify(items, null, 2), err => {
        if (err) {
          console.error('Error writing data file:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        res.json({ message: 'Item deleted successfully' });
      });
    } catch (err) {
      console.error('Error parsing JSON:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

app.post('/comment', (req, res) => {
  const { nickname, comment, itemId } = req.body; // 클라이언트로부터 전송된 데이터에서 itemId 가져오기
  const newCommentId = Date.now();
  // 댓글 데이터 읽기
  let comments = [];
  try {
    if (fs.existsSync(buyCommentFilePath)) {
      const jsonData = fs.readFileSync(buyCommentFilePath);
      comments = JSON.parse(jsonData);
    }
  } catch (error) {
    console.error('댓글 데이터를 읽는 중 에러 발생:', error);
  }

  // 새로운 댓글 생성
  const newComment = {
    id: newCommentId,
    itemId, // 아이템 ID 저장
    nickname,
    comment,
    createdAt: new Date().toISOString()
  };

  // 댓글 배열에 새로운 댓글 추가
  comments.push(newComment);

  // 댓글 데이터 쓰기
  fs.writeFileSync(buyCommentFilePath, JSON.stringify(comments, null, 2));

  // 응답 보내기
  res.status(200).json({
    message: '댓글이 성공적으로 등록되었습니다.'
  });
});

app.get('/buycomment', (req, res) => {
  try {
    // buycomment.json 파일 읽기
    const buyCommentData = fs.readFileSync(buyCommentFilePath);
    // JSON 형식으로 파싱
    const buyComment = JSON.parse(buyCommentData);
    // 클라이언트에게 JSON 데이터 응답으로 보내기
    res.json(buyComment);
  } catch (error) {
    console.error('구매 댓글 데이터를 읽는 중 에러 발생:', error);
    res.status(500).json({ message: '서버 에러 발생' });
  }
});


const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('파일 읽기 실패:', error);
    return [];
  }
};

// JSON 파일 쓰기 함수
const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log('파일 쓰기 성공');
  } catch (error) {
    console.error('파일 쓰기 실패:', error);
  }
};

// 댓글 조회 엔드포인트
app.get('/buycomment', (req, res) => {
  try {
    // buycomment.json 파일 읽기
    const buyCommentData = fs.readFileSync(buyCommentFilePath);
    // JSON 형식으로 파싱
    const buyComment = JSON.parse(buyCommentData);
    // 클라이언트에게 JSON 데이터 응답으로 보내기
    res.json(buyComment);
  } catch (error) {
    console.error('구매 댓글 데이터를 읽는 중 에러 발생:', error);
    res.status(500).json({ message: '서버 에러 발생' });
  }
});

// 댓글 수정 엔드포인트
app.put('/buycomment/:id', (req, res) => {
  const { id } = req.params;
  const { comment, nickname } = req.body;

  const buyComment = readJSONFile(buyCommentFilePath);
  const commentIndex = buyComment.findIndex(comment => comment.id === parseInt(id));

  if (commentIndex === -1) {
    return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
  }

  // 답글 속성 생성 또는 추가
  const replyKey = 'reply' + (Object.keys(buyComment[commentIndex]).filter(key => key.startsWith('reply')).length + 1);
  buyComment[commentIndex][replyKey] = nickname +"님의 답글: " + comment;

  writeJSONFile(buyCommentFilePath, buyComment);

  return res.status(200).json({ message: '댓글이 수정되었습니다.', updatedComment: buyComment[commentIndex] });
});

// 서버 리스닝
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
});
