// 컨설턴트 사용자 API - 관리자 요청
const express = require('express');
const router = express.Router();

const { uploadFilesInStorage } = require('../../../webService/storageService');
const { sanitizer } = require('../../middlewares');
const { extractToken, decryptIdToken } = require('../../middlewares');

const {
    consultantUsersAdapter,
    profilesAdapter,
} = require('../../../../adapters/inbound');
const { logger } = require('../../../../adapters/module/logger');
const { SuccessResponse } = require('../../../../adapters/response');

// 컨설턴트 리스트 가져오기
router.get('/', async (req, res, next) => {
    let result, response;
    try {
        let reqQueryData = req.filteredQuery;
        console.log('GET - /api/user/consultant/users 요청 : ', reqQueryData);

        result = await consultantUsersAdapter.getConsultantUsers(reqQueryData);
        console.log('GET - /api/user/consultant/users 응답 : ', result);

        response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET - /api/user/consultant/users',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.error('/api/user/consultant/users 에러 응답 : ', error);
        next(error);
    }
});

// 개별 컨설턴트 정보 가져오기
router.get('/:consultantUserId', async (req, res, next) => {
    let result, response;
    try {
        let reqParamsData = req.params;
        console.log(
            'GET - /api/user/consultant/users/:consultantUserId 요청 : ',
            reqParamsData
        );

        result = await consultantUsersAdapter.getConsultantUser(reqParamsData);
        console.log(
            'GET - /api/user/consultant/users/:consultantUserId 응답 : ',
            result
        );

        response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET - /api/user/consultant/users/:consultantUserId',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.error(
            '/api/user/consultant/users/:consultantUserId 에러 응답 : ',
            error
        );
        next(error);
    }
});
// 개별 컨설턴트 정보 수정하기
router.put('/:consultantUserId', async (req, res, next) => {
    let result, response;
    try {
        let reqBodyData = req.filteredBody;
        console.log(
            'GET - /api/user/consultant/users/:consultantUserId 요청 : ',
            reqBodyData
        );

        result = await consultantUsersAdapter.updateConsultantUser(reqBodyData);
        console.log(
            'GET - /api/user/consultant/users/:consultantUserId 응답 : ',
            result
        );

        response = new SuccessResponse(204, result);
        logger.log(
            'info',
            'GET - /api/user/consultant/users/:consultantUserId',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.error(
            '/api/user/consultant/users/:consultantUserId 에러 응답 : ',
            error
        );
        next(error);
    }
});
//---------------------------- 프로필 ---------------------------------

// 사용자 프로필 리스트 가져오기
router.get('/:consultantUserId/profiles', async (req, res, next) => {
    let result, response;
    try {
        let reqParamsData = req.params;
        console.log(
            'GET - /api/user/consultant/users/:consultantUserId/profiles 요청 : ',
            reqParamsData
        );

        result = await profilesAdapter.getProfiles(reqParamsData);
        console.log(
            'GET - /api/user/consultant/users/:consultantUserId/profiles  응답 : ',
            result
        );

        response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET - /api/user/consultant/users/:consultantUserId/profiles ',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.error(
            'GET - /api/user/consultant/users/:consultantUserId/profiles  에러 응답 : ',
            error
        );
        next(error);
    }
});

// 최신 프로필 정보 가져오기
router.get('/:consultantUserId/profiles/latest', async (req, res, next) => {
    let result, response;
    try {
        const reqParamsData = req.params;
        console.log(
            'GET - /api/user/consultant/users/:consultantUserId/profiles/latest 요청 : ',
            reqParamsData
        );

        result = await profilesAdapter.getMyProfile(reqParamsData);
        console.log(
            'GET - /api/user/consultant/users/:consultantUserId/profiles/latest 응답 : ',
            result
        );

        response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET - /api/user/consultant/users/:consultantUserId/profiles/latest',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.error(
            'GET - /api/user/consultant/users/:consultantUserId/profiles/:profileId 에러 응답 : ',
            error
        );
        next(error);
    }
});
// 프로필 정보 가져오기
router.get('/:consultantUserId/profiles/:profileId', async (req, res, next) => {
    let result, response;
    try {
        const reqParamsData = req.params;
        console.log(
            'GET - /api/user/consultant/users/:consultantUserId/profiles/:profileId 요청 : ',
            reqParamsData
        );

        result = await profilesAdapter.getProfile(reqParamsData);
        console.log(
            'GET - /api/user/consultant/users/:consultantUserId/profiles/:profileId 응답 : ',
            result
        );

        response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET - /api/user/consultant/users/:consultantUserId/profiles/:profileId',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.error(
            'GET - /api/user/consultant/users/:consultantUserId/profiles/:profileId 에러 응답 : ',
            error
        );
        next(error);
    }
});

// 프로필 정보 수정하기 (관리자 프로필 인증) : 삭제 후 생성
router.put(
    '/:consultantUserId/profiles/:profileId',
    uploadFilesInStorage.fields([
        { name: 'academic' },
        { name: 'career' },
        { name: 'license' },
    ]),
    sanitizer,
    async (req, res, next) => {
        let result, response;
        try {
            const reqBodyData = req.filteredBody;
            const uploadFiles = req.arrangedFiles;

            console.log(
                'PUT - /api/user/consultant/users/:consultantUserId/profiles/:profileId 요청 : '
            );

            result = await profilesAdapter.updateProfile(
                reqBodyData,
                uploadFiles
            );
            console.log(
                'PUT - /api/user/consultant/users/:consultantUserId/profiles/:profileId 응답 : ',
                result
            );

            response = new SuccessResponse(201, result);
            logger.log(
                'info',
                'PUT - /api/user/consultant/users/:consultantUserId/profiles/:profileId',
                response.message
            );

            res.send(response);
        } catch (error) {
            console.error(
                'PUT - /api/user/consultant/users/:consultantUserId/profiles/:profileId 에러 응답 : ',
                error
            );
            next(error);
        }
    }
);

module.exports = router;
