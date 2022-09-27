// 인증 정보 가져오기 : admin 서버요청
const express = require('express');
const router = express.Router();

const { infoAdapter } = require('../../../adapters/inbound');
const { GetAreaDto } = require('../../../adapters/dtos/requestDto/infoDto');
const { logger } = require('../../../adapters/module/logger');
const { SuccessResponse } = require('../../../adapters/response');

// 지역(시/도) 리스트 가져오기
router.get('/region', async (req, res, next) => {
    let result, response;
    try {
        console.log('요청 > GET > /api/user/info/region : ');
        result = await infoAdapter.getRegion();
        console.log('응답 > GET > /api/user/info/region : ', result);
        response = new SuccessResponse(200, result);
        logger.log('info', 'GET /api/user/info/region', response.message);
        res.send(response);
    } catch (error) {
        // console.log('에러 > GET > /api/user/info/region: ', error);
        next(error);
    }
});
// 세부 지역(구/군) 리스트 가져오기
router.get('/area', async (req, res, next) => {
    let result, response;
    try {
        console.log('요청 > GET > /api/user/info/area : ');

        const { regionData } = new GetAreaDto(req.filteredQuery);
        result = await infoAdapter.getArea(regionData);
        console.log('응답 > GET > /api/user/info/area : ', result);
        response = new SuccessResponse(200, result);
        logger.log('info', 'GET /api/user/info/area', response.message);
        res.send(response);
    } catch (error) {
        // console.log('에러 > GET > /api/user/info/area: ', error);
        next(error);
    }
});
// 지역(시/도) 리스트 가져오기
router.get('/industries', async (req, res, next) => {
    let result, response;
    try {
        console.log('요청 > GET > /api/user/info/industries : ');
        result = await infoAdapter.getIndustries();
        console.log('응답 > GET > /api/user/info/industries : ', result);
        response = new SuccessResponse(200, result);
        logger.log('info', 'GET /api/user/info/industries', response.message);
        res.send(response);
    } catch (error) {
        // console.log('에러 > GET > /api/user/info/industries: ', error);
        next(error);
    }
});

module.exports = router;
