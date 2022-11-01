//서버
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');

const app = express();
const ip = process.env.SERVER_IP || 'localhost';
const port = process.env.SERVER_PORT || 8000;

const routes = require('./routes');
const { Sentry, sentryInit } = require('../webService/monitorService');
const { logger } = require('../../adapters/module');
const { sanitizer, swagger } = require('../server/middlewares');
const { swaggerUi, specs } = swagger;
const { ErrorResponse } = require('../../adapters/response');

sentryInit(app);

app.use(
    cors({
        origin(origin, callback) {
            callback(null, true);
        },
        credentials: true,
    })
);

app.use(express.urlencoded({ extended: true }));
// x-www-form-urlencoded 데이터 해석 (extended - true: qs, false:queryString)
app.use(express.json()); //  JSON 데이터 해석

app.use(
    Sentry.Handlers.requestHandler({
        ip: true,
    })
); // 요청에 대한 개별 실행 컨택스트 생성
app.use(Sentry.Handlers.tracingHandler()); // 요청에 대한 추적 생성

app.get('/healthcheck', async (req, res, next) => {
    // console.log('hello Securist');
    res.send('Securist_User');
});

// const errorHandler = (err, req, res, next) => {
//     console.error('최종 에러 처리', err);
//     errResponse = new ErrorResponse(
//         err.message || err.errMessage,
//         err.data || err.errData
//     );
//     console.log('최종 에러 확인', errResponse);
//     res.status(err.code || 500).send(errResponse);
// };

app.use(sanitizer); // 태그제거 : XSS 방어
app.use('/api/user', routes);
// app.use('/api/user', swaggerUi.serve, swaggerUi.setup(specs));

app.use((req, res, next) => {
    res.status(404).send(
        '요청한 페이지를 찾을 수 없습니다 Securist User Server'
    );
});

// app.use(errorHandler);
// 오류 로그 sentry 전달
app.use(
    Sentry.Handlers.errorHandler({
        shouldHandleError(error) {
            // console.log('상태코드 확인 ', error);
            // true 리턴 시 에러 캡쳐, false 리턴 시 캡쳐 안함
            return true;
        },
    })
);

// error Handler : 에러 로그 확인 / 클라이언트 응답
app.use((err, req, res, next) => {
    console.error('최종 에러 처리', err);
    logger.log(
        'error',
        err.location || 'server',
        err.message || 'Internal Server Error'
    );
    let errResponse =
        err.message === 'Not exist'
            ? new ErrorResponse(err.code, err.message)
            : new ErrorResponse(err.statusCode, err.errMessage, err.data);
    console.log('에러처리 ', errResponse);
    res.status(err.statusCode || 500).send(errResponse);
});

app.listen(port, () => {
    console.log(`Securist App listen ${ip}:${port}`);
});
