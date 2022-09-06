// 프로필 API
const express = require('express');
const router = express.Router();

const { profilesAdapter } = require('../../../../adapters/inbound');
const {
    UpdateMyInfoRequestDto,
} = require('../../../../adapters/dtos/requestDto/myInfoDto');
const { logger } = require('../../../../adapters/module/logger');
const { SuccessResponse } = require('../../../../adapters/response');

// 사용자 프로필 리스트 가져오기
router.get('/', async (req, res, next) => {
    let result, response;
    try {
        let reqParamsData = req.params;
        console.log(
            'GET - /api/user/consultant/users/:consultantUserId/profiles 요청 : ',
            req
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

// 프로필 정보 가져오기
router.get('/:profileId', async (req, res, next) => {
    let result, response;
    try {
        let userData = req.userDataByIdToken;
        console.log(
            'GET - /api/user/consultant/users/:consultantUserId/profiles/:profileId 요청 : ',
            userData
        );

        result = await profilesAdapter.getProfile(userData);
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

// 프로필 정보 수정하기
router.put('/:profileId', async (req, res, next) => {
    let result, response;
    try {
        let userData = req.userDataByIdToken;
        console.log(
            'PUT - /api/user/consultant/users/:consultantUserId/profiles/:profileId 요청 : ',
            userData
        );

        result = await profilesAdapter.updateProfile(userData);
        console.log(
            'PUT - /api/user/consultant/users/:consultantUserId/profiles/:profileId 응답 : ',
            result
        );

        response = new SuccessResponse(200, result);
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
});

module.exports = router;
