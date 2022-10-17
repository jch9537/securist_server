// 인증 정보 가져오기 : admin 서버요청
const express = require('express');
const router = express.Router();

const { settingsAdapter } = require('../../../adapters/inbound');
const {
    GetLinkedInfoDto,
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

// // 인증의 모든 연결 정보 가져오기
// router.get('/certifications/:certificationId', async (req, res, next) => {
//     let result, response;
//     try {
//         let certificationData = req.params; // 이후 Dto 추가 예정
//         console.log(
//             '요청 > GET > /api/admin/settings/certifications/info : ',
//             certificationData
//         );
//         result = await settingsAdapter.getLinkedAllInfoByCertification(
//             certificationData
//         );
//         // console.log('응답 > GET > /api/admin/settings/certifications/:certificationId : ', result);
//         response = new SuccessResponse(200, result);
//         logger.log(
//             'info',
//             'GET /api/admin/settings/certifications/:certificationId',
//             response.message
//         );
//         res.send(response);
//     } catch (error) {
//         // console.log('에러 > GET > /api/admin/settings/certifications/:certificationId : ', error);
//         next(error);
//     }
// });
// 인증의 모든 연결 정보 가져오기
router.get('/link/all', async (req, res, next) => {
    let result, response;
    try {
        const { linkData } = new GetLinkedInfoDto(req.filteredQuery);

        console.log('요청 > GET > /api/admin/settings/link/all : ', linkData);
        result = await settingsAdapter.getLinkedAllInfoByCertification(
            linkData
        );
        // console.log('응답 > GET > /api/admin/settings/link/all : ', result);
        response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET /api/admin/settings/link/all',
            response.message
        );
        res.send(response);
    } catch (error) {
        // console.log('에러 > GET > /api/admin/settings/link/all : ', error);
        next(error);
    }
});
// 인증 별 과제 가져오기
router.get('/link/tasks', async (req, res, next) => {
    let result, response;
    try {
        const { linkData } = new GetLinkedInfoDto(req.filteredQuery);
        console.log(
            '요청 > GET > /api/admin/settings/certifications/:certificationId : ',
            linkData
        );
        result = await settingsAdapter.getLinkedTasksInfo(linkData);
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
