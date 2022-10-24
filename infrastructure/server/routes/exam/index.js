const express = require('express');
const router = express.Router();
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const { createClient } = require('redis');
const redisClient = createClient();
const { AuthenticationException } = require('../../../../domain/exceptions');
const { logger } = require('../../../../adapters/module');
const { examInfoAdapter } = require('../../../../adapters/inbound');
const {
    GetExamRequestDto,
} = require('../../../../adapters/dtos/requestDto/examDto/registrationDto');
const { SuccessResponse } = require('../../../../adapters/response');

// 세션 미들웨어 처리
router.use(
    session({
        saveUninitialized: false, // 수정되지 않은 새 세션 저장 여부 - true: 저장
        secret: process.env.SESSION_SECRET,
        resave: false, //세션 저장하고 불러올 때 다시 저장할지 여부
        cookie: {
            httpOnly: true,
            secure: true, //https 환경에서만 session 정보를 주고받도록처리
            maxAge: 1000 * 60 * 15, // 만료시간
            domain: 'securist.co.kr', // 도메인
        },
        store: new RedisStore({ client: redisClient }), // redis stroage 사용
    })
);

// 테스트용 세션 ci 생성
router.use((req, res, next) => {
    if (process.env.NODE_ENV === 'local') {
        req.session.ci = process.env.TEST_SESSION_CI;
    }
    next();
});
router.get('/times', async (req, res, next) => {
    try {
        if (!(req.session && req.session.ci)) {
            throw new AuthenticationException();
        }
        console.log('세션값 확인 : ', req.session);

        const userDataByIdToken = req.userDataByIdToken;
        const { examData } = new GetExamRequestDto(req.filteredQuery);
        console.log('요청 > GET > /api/admin/exam/times : ', examData);

        const result = await examInfoAdapter.getExamTimeList(
            examData,
            userDataByIdToken
        );
        // console.log('응답 > GET > /api/admin/exam/times : ', result);

        const response = new SuccessResponse(200, result);
        logger.log('info', 'GET /api/admin/exam/times', response.message);

        res.send(response);
    } catch (error) {
        // console.log('에러 > GET > /api/admin/exam/times : ', error);
        next(error);
    }
});
router.get('/dates', async (req, res, next) => {
    try {
        if (!(req.session && req.session.ci)) {
            throw new AuthenticationException();
        }
        console.log('세션값 확인 : ', req.session);

        const userDataByIdToken = req.userDataByIdToken;
        const { examData } = new GetExamRequestDto(req.filteredQuery);
        console.log('요청 > GET > /api/admin/exam/dates : ', examData);

        const result = await examInfoAdapter.getExamDateList(
            examData,
            userDataByIdToken
        );
        // console.log('응답 > GET > /api/admin/exam/dates : ', result);

        const response = new SuccessResponse(200, result);
        logger.log('info', 'GET /api/admin/exam/dates', response.message);

        res.send(response);
    } catch (error) {
        // console.log('에러 > GET > /api/admin/exam/dates : ', error);
        next(error);
    }
});
const niceRouter = require('./nice');
router.use('/nice', niceRouter);
const receptionsRouter = require('./receptions');
router.use('/receptions', receptionsRouter); // SECURIST 시험 접수 API 라우터
const issuanceRouter = require('./issuance');
router.use('/issuance', issuanceRouter); // SECURIST 자격증 발급 API 라우터

module.exports = router;
