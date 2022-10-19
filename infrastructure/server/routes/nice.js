const express = require('express');
const router = express.Router();

const niceModule = require('../../../adapters/module/niceModule');
const { SuccessResponse } = require('../../../adapters/response');

// 휴대폰 본인 인증 (nice 모듈) 시작
router.get('/main', async (req, res, next) => {
    let result, response;
    try {
        niceRedirectUrl = req.query.redirectUrl;

        result = await niceModule.main();
        // console.log('모듈시작 결과 : ', result);
        response = new SuccessResponse(200, result);
        res.status(200).send(response);
    } catch (error) {
        console.log('/main 에러 응답 : ', error);
        res.send(error);
    }
});
// 휴대폰 본인 인증 (nice 모듈) 성공 처리 : chrome 80 이상
router.get('/success', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let encodeData = req.param('EncodeData');

        result = await niceModule.successGet(encodeData);
        // console.log('모듈성공 결과 : ', result);

        res.redirect(`${niceRedirectUrl}?${qs.stringify(result)}`);
    } catch (error) {
        console.log('/success 에러 응답 : ', error);
        next(error);
    }
});
// 휴대폰 본인 인증 (nice 모듈) 성공 처리 : chrome 80 이하 또는 다른 브라우저
router.post('/success', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let encodeData = req.filteredBody.EncodeData;

        result = await niceModule.successPost(encodeData);
        // console.log('모듈성공 결과 : ', result);

        res.redirect(`${niceRedirectUrl}?${qs.stringify(result)}`);
    } catch (error) {
        console.log('/success 에러 응답 : ', error);
        next(error);
    }
});
// 휴대폰 본인 인증 (nice 모듈) 실패 처리 : chrome 80 이상
router.get('/fail', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let encodeData = req.param('EncodeData');

        result = await niceModule.failGet(encodeData);
        // console.log('모듈실패 결과 : ', result);

        res.redirect(`${niceRedirectUrl}?${qs.stringify(result)}`);
    } catch (error) {
        console.log('/fail 에러 응답 : ', error);
        next(error);
    }
});
// 휴대폰 본인 인증 (nice 모듈) 실패 처리 : chrome 80 이하 또는 다른 브라우저
router.post('/fail', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let encodeData = request.body.EncodeData;

        result = await niceModule.failPost(encodeData);
        // console.log('모듈실패 결과 : ', result);

        res.redirect(`${niceRedirectUrl}?${qs.stringify(result)}`);
    } catch (error) {
        console.log('/fail 에러 응답 : ', error);
        next(error);
    }
});
module.exports = router;
