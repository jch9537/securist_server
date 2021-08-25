//서버
const path = require('path');
const dotenv = require('dotenv').config({
    path: path.join(__dirname, '../../.env'),
});
const express = require('express');
const app = express();
const port = process.env.SERVER_PORT || 3000;

const cors = require('cors');
const sanitizer = require('../server/modules/sanitizer');
const routes = require('./routes');

const { ErrorResponse } = require('../response');
const errorHandler = (err, req, res, next) => {
    console.error('최종 에러 처리', err);
    errResponse = new ErrorResponse(
        err.message || err.errMessage,
        err.data || err.errData
    );
    console.log('최종 에러 확인', errResponse);
    res.status(err.code || 500).send(errResponse);
};

app.use(
    cors({
        origin(origin, callback) {
            callback(null, true);
        },
        credentials: true,
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sanitizer); // 태그제거 : XSS 방어

app.use('/api', routes);

app.use((req, res, next) => {
    res.status(404).send('요청한 페이지를 찾을 수 없습니다');
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Securist App listen http://localhost:${port}`);
});
