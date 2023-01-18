const express = require('express');
const cors = require('cors')
const session = require('express-session');
const cookieParser = require('cookie-parser');

const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models');
const passportConfig = require('./passport');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();
const app = express();


/*
app.get-> 가져오다
app.post-> 생성하다
app.put -> 전체 수정
app.delete->제거
app.patch->부분 수정
app.options->요청 가능 여부 찔러보기(?)
app.head-> (헤더/바디 중)헤더만 가져오기
 */

db.sequelize.sync({force:true})
    .then(()=>{
        console.log('db 연결 성공');
    })
    .catch(console.error);
    
passportConfig();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors({
    origin:'*',
    credentials:false,
}));


app.use(cookieParser('nodebirdsecret'));
app.use(session({
    saveUninitialized:false,
    resave:false,
    secret:process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/',(req,res)=>{
    res.send('hello express')
});

app.get('/',(req,res)=>{
    res.send('hello api');
});

app.get('/post',(req,res)=>{
    res.json([
        {id:1,content:'hello'},
        {id:2,content:'hello'},
        {id:3,content:'hello'}
    ]);
});

app.use('/post',postRouter);
app.use('/user',userRouter);


 app.listen(3065,()=>{
    console.log('서버 실행중')
 });

 module.exports = app;