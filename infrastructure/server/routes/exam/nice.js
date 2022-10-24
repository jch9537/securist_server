// 본인 인증 API
const express = require('express');
const router = express.Router();
const qs = require('querystring');

const niceModule = require('../../../../adapters/module/niceModule');
const { logger } = require('../../../../adapters/module');
const { SuccessResponse } = require('../../../../adapters/response');

// 휴대폰 본인 인증 (nice 모듈) 시작
router.get('/main', async (req, res, next) => {
    try {
        niceRedirectUrl = req.filteredQuery.redirectUrl;

        console.log('모듈시작 결과 : ', niceRedirectUrl);
        const result = await niceModule.main();
        console.log('모듈시작 결과 : ', req.session);

        if (req.session) {
            req.session.destroy(function (err) {
                if (err) throw err;
            });
        }
        const response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET /api/admin/exam/receptions/nice/main',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.log(
            '에러 > GET /api/admin/exam/receptions/nice/main : ',
            error
        );
        next(error);
    }
});

// 휴대폰 본인 인증 (nice 모듈) 성공 처리 : chrome 80 이상
router.get('/success', async (req, res, next) => {
    try {
        console.log('성공!!!');
        const encodeData = req.query.EncodeData;
        console.log('성공 - encodeData', encodeData, 'session : ', req.session);

        const result = await niceModule.successGet(encodeData);

        // 세션 생성 -----------------------------------------------------
        if (!req.session.ci) {
            req.session.ci = result.conninfo;
            console.log('처음 본인인증', req.session);
        } else {
            console.log('이미 자기가 본인인증', req.session);
        }

        logger.log(
            'info',
            'GET /api/admin/exam/receptions/exam/nice/success',
            '본인 인증 성공'
        );
        res.redirect(`${niceRedirectUrl}?${qs.stringify(result)}`);
    } catch (error) {
        console.log(
            '/api/admin/exam/receptions/nice/success 에러 응답 : ',
            error
        );
        next(error);
    }
});
// 휴대폰 본인 인증 (nice 모듈) 성공 처리 : chrome 80 이하 또는 다른 브라우저
router.post('/success', async (req, res, next) => {
    try {
        let encodeData = req.filteredBody.EncodeData;
        console.log('POST SUCESS 성공 - encodeData', encodeData);

        const result = await niceModule.successPost(encodeData);

        // 세션 생성 -----------------------------------------------------
        if (!req.session.ci) {
            req.session.ci = result.conninfo;
            console.log('처음 본인인증', req.session);
        } else {
            console.log('이미 자기가 본인인증', req.session);
        }

        console.log(
            '성공 - redirect : ',
            `${niceRedirectUrl}?${qs.stringify(result)}`
        );

        logger.log(
            'info',
            'POST /api/admin/exam/receptions/nice/success',
            '본인 인증 성공'
        );
        res.redirect(`${niceRedirectUrl}?${qs.stringify(result)}`);
    } catch (error) {
        console.log(
            '/api/admin/exam/receptions/nice/success 에러 응답 : ',
            error
        );
        next(error);
    }
});
// 휴대폰 본인 인증 (nice 모듈) 실패 처리 : chrome 80 이상
router.get('/fail', async (req, res, next) => {
    try {
        const encodeData = req.query.EncodeData;

        const result = await niceModule.failGet(encodeData);
        // console.log('모듈실패 결과 : ', result);

        logger.log(
            'info',
            'POST /api/admin/exam/receptions/nice/fail',
            '본인 인증 실패'
        );

        res.redirect(`${niceRedirectUrl}?${qs.stringify(result)}`);
    } catch (error) {
        console.log('/api/admin/exam/receptions/nice/fail 에러 응답 : ', error);
        next(error);
    }
});
// 휴대폰 본인 인증 (nice 모듈) 실패 처리 : chrome 80 이하 또는 다른 브라우저
router.post('/fail', async (req, res, next) => {
    try {
        const encodeData = request.body.EncodeData;

        const result = await niceModule.failPost(encodeData);
        // console.log('모듈실패 결과 : ', result);

        logger.log(
            'info',
            'POST /api/admin/exam/receptions/nice/fail',
            '본인 인증 실패'
        );

        res.redirect(`${niceRedirectUrl}?${qs.stringify(result)}`);
    } catch (error) {
        console.log('/api/admin/exam/receptions/nice/fail 에러 응답 : ', error);
        next(error);
    }
});

module.exports = router;
