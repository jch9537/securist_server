// 내 프로필 임시저장 정보 API
const express = require('express');
const router = express.Router();
const tempRouter = require('./temp');

const { uploadFilesInStorage } = require('../../../webService/storageService');
const { sanitizer } = require('../../middlewares');

const { profilesAdapter } = require('../../../../adapters/inbound');
const {
    CreateProfileDto,
} = require('../../../../adapters/dtos/requestDto/profileDto');
const {
    CreateUploadFilesDto,
} = require('../../../../adapters/dtos/requestDto/uploadFilesDto');
const { logger } = require('../../../../adapters/module/logger');
const { SuccessResponse } = require('../../../../adapters/response');

router.use('/temp', tempRouter);

// 프로필 생성하기
router.post(
    '/',
    uploadFilesInStorage.fields([
        { name: 'academic' },
        { name: 'career' },
        { name: 'license' },
    ]),
    sanitizer,
    async (req, res, next) => {
        try {
            const userData = req.userDataByIdToken;
            const { profileData } = new CreateProfileDto(req.filteredBody);
            const { uploadFilesData } = new CreateUploadFilesDto(
                req.arrangedFiles
            );

            console.log(
                'POST - /api/user/profile 요청 : ',
                userData,
                profileData,
                uploadFilesData
            );

            const result = await profilesAdapter.createProfile(
                userData,
                profileData,
                uploadFilesData
            );
            console.log('POST - /api/user/profile 응답 : ', result);

            const response = new SuccessResponse(201, result);
            logger.log('info', 'POST - /api/user/my/profile', response.message);

            res.send(response);
        } catch (error) {
            console.error('POST - /api/user/profile 에러 응답 : ', error);
            next(error);
        }
    }
);

// 내 프로필 정보 가져오기
router.get('/', async (req, res, next) => {
    let result, response;
    try {
        let userData = req.userDataByIdToken;
        console.log('GET - /api/user/my/profile 요청 : ', userData);

        result = await profilesAdapter.getMyProfile(userData);
        console.log('GET - /api/user/my/profile 응답 : ', result);

        response = new SuccessResponse(200, result);
        logger.log('info', 'GET - /api/user/my/profile', response.message);

        res.send(response);
    } catch (error) {
        console.error('/api/user/my/profile 에러 응답 : ', error);
        next(error);
    }
});

module.exports = router;
