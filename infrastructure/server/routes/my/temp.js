// 프로필 임시 저장 API
const express = require('express');
const router = express.Router();
const filesRouter = require('./files');

const { uploadFilesInStorage } = require('../../../webService/storageService');
const { sanitizer } = require('../../middlewares');

const { tempProfilesAdapter } = require('../../../../adapters/inbound');
const {
    UpdateMyInfoRequestDto,
} = require('../../../../adapters/dtos/requestDto/myInfoDto');
const { logger } = require('../../../../adapters/module/logger');
const { SuccessResponse } = require('../../../../adapters/response');

router.use('/files', filesRouter);

// 프로필 임시 저장정보 생성하기
router.post(
    '/',
    uploadFilesInStorage.fields([
        { name: 'academic' },
        { name: 'career' },
        { name: 'license' },
    ]),
    sanitizer,
    async (req, res, next) => {
        let result, response;
        try {
            let userData = req.userDataByIdToken;
            let reqBodyData = req.filteredBody;
            let uploadFiles = req.arrangedFiles;

            // console.log(
            //     'GET - /api/user/my/profile/temp 요청 : ',
            //     userData,
            //     reqBodyData,
            //     uploadFiles
            // );

            result = await tempProfilesAdapter.createTempProfile(
                userData,
                reqBodyData,
                uploadFiles
            );
            console.log('GET - /api/user/my/profile/temp 응답 : ', result);

            response = new SuccessResponse(201, result);
            logger.log(
                'info',
                'GET - /api/user/my/profile/temp',
                response.message
            );

            res.send(response);
        } catch (error) {
            console.error('/api/user/my/profile/temp 에러 응답 : ', error);
            next(error);
        }
    }
);
// 프로필 임시저장 정보 가져오기
router.get('/', async (req, res, next) => {
    let result, response;
    try {
        let userData = req.userDataByIdToken;
        console.log('GET - /api/user/my/profile/temp 요청 : ', userData);

        result = await tempProfilesAdapter.getTempProfile(userData);
        console.log('GET - /api/user/my/profile/temp 응답 : ', result);

        response = new SuccessResponse(200, result);
        logger.log('info', 'GET - /api/user/my/profile/temp', response.message);

        res.send(response);
    } catch (error) {
        console.error('/api/user/my/profile/temp 에러 응답 : ', error);
        next(error);
    }
});

// 프로필 임시저장 정보 수정 : 삭제 후 생성하므로 필요없음

// 프로필 임시저장 정보 삭제
router.delete('/', async (req, res, next) => {
    let result, response;
    try {
        let userData = req.userDataByIdToken;

        console.log('DELETE - /api/user/my/profile/temp 요청 : ', userData);

        result = await tempProfilesAdapter.deleteTempProfile(userData);
        console.log('DELETE - /api/user/my/profile/temp 응답 : ', result);

        response = new SuccessResponse(204, result);
        logger.log(
            'info',
            'DELETE - /api/user/my/profile/temp',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.error('DELETE - /api/user/my/profile/temp 에러 응답 : ', error);
        next(error);
    }
});

module.exports = router;
