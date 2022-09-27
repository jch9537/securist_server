// 인증 정보 가져오기 : admin 서버요청
const express = require('express');
const router = express.Router();

const { settingsAdapter } = require('../../../adapters/inbound');
const {
    GetTasksByCertificationsDto,
} = require('../../../adapters/dtos/requestDto/settingsDto');
const { logger } = require('../../../adapters/module/logger');
const { SuccessResponse } = require('../../../adapters/response');

// 인증 리스트 가져오기
router.get('/certifications', async (req, res, next) => {
    let result, response;
    try {
        console.log('요청 > GET > /api/admin/settings/certifications : ');
        result = await settingsAdapter.getCompleteCertifications();
        // console.log('응답 > GET > /api/admin/settings/certifications : ', result);
        response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET /api/admin/settings/certifications',
            response.message
        );
        res.send(response);
    } catch (error) {
        // console.log('에러 > GET > /api/admin/settings/certifications: ', error);
        next(error);
    }
});

// 인증의 모든 연결 정보 가져오기
router.get('/certifications/:certificationId', async (req, res, next) => {
    let result, response;
    try {
        let certificationData = req.params; // 이후 Dto 추가 예정
        console.log(
            '요청 > GET > /api/admin/settings/certifications/info : ',
            certificationData
        );
        result = await settingsAdapter.getCertificationConnectedInfo(
            certificationData
        );
        // console.log('응답 > GET > /api/admin/settings/certifications/:certificationId : ', result);
        response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET /api/admin/settings/certifications/:certificationId',
            response.message
        );
        res.send(response);
    } catch (error) {
        // console.log('에러 > GET > /api/admin/settings/certifications/:certificationId : ', error);
        next(error);
    }
});
// 인증 별 과제 가져오기
router.get('/tasks', async (req, res, next) => {
    let result, response;
    try {
        // let certificationId = req.params; // 이후 Dto 추가 예정
        // let certificationId = req.filteredQuery;
        const { certificationData } = new GetTasksByCertificationsDto(
            req.filteredQuery
        );
        console.log(
            '요청 > GET > /api/admin/settings/certifications/:certificationId : ',
            certificationData
        );
        result = await settingsAdapter.getTasksByCertifications(
            certificationData
        );
        // console.log('응답 > GET > /api/admin/settings/certifications/:certificationId : ', result);
        response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET /api/admin/settings/certifications/:certificationId',
            response.message
        );
        res.send(response);
    } catch (error) {
        // console.log('에러 > GET > /api/admin/settings/certifications/:certificationId : ', error);
        next(error);
    }
});
module.exports = router;
