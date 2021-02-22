//서버
const path = require('path');
const dotenv = require('dotenv').config({
    path: path.join(__dirname, '../../.env'),
});
// const dotenv = require('dotenv').config();
// const socket.io = require('socket.io')
const express = require('express');
const http = require('http');

const routes = require('./routes');

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(routes);

app.get('/', (req, res) => {
    res.send('Hello Securist');
});
const server = http.createServer(app);
//socket 서버 추가

app.listen(port, () =>
    console.log(`Securist App listen http://localhost:${port}`)
);

//서버에서 할 것 : 클라이언트 인증확인(토큰)
