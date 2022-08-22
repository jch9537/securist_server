// TODO : 임시저장 데이터 삭제 시 S3에서도 삭제 처리!!
// TODP : /api/company/profile/temp -> /api/profile/company/temp 이런식으로 모든 API 주소 변경!!
const express = require('express');
const router = express.Router();

const { profileAdapter } = require('../../../adapters/inbound');
const { SuccessResponse, ErrorResponse } = require('../../response');

const { sanitizer, extractToken, decryptIdToken } = require('../middlewares');
// const {
//     uploadClientProfile,
//     uploadConsultantProfile,
//     uploadConsultingCompanyBusinessLicense,
//     uploadConsultantProfileTemp,
//     uploadConsultingCompanyBusinessLicenseTemp,
// } = require('../../webService/storageService');

router.use(extractToken);
router.use(decryptIdToken);

// 개인 컨설턴트 프로필 인증 요청 : 프로필 정보 생성
router.post(
    '/user',
    // uploadConsultantProfile.any(),
    sanitizer,
    async (req, res, next) => {
        let result, response, errResponse;
        try {
            let userData = req.userDataByIdToken;
            let reqBodyData = req.filteredBody;
            let uploadFiles = req.files;
            // console.log(
            //     'POST - /api/company/profile/temp 요청 : ',
            //     userData,
            //     reqBodyData,
            //     uploadFiles
            // );
            console.log(reqBodyData);

            result = await profileAdapter.createConsultantProfile(
                userData,
                reqBodyData,
                uploadFiles
            );
            console.log('POST - /api/user/profile 응답 : ', result);
            response = new SuccessResponse(result.message, result.data);
            res.status(200).send(response);
        } catch (error) {
            console.error('/api/user/profile 에러 응답 : ', error);
            next(error);
        }
    }
);
// 컨설팅 업체 프로필 인증 요청 : 프로필 정보 생성
router.post(
    '/company',
    // uploadConsultingCompanyBusinessLicense.any(),
    sanitizer,
    async (req, res, next) => {
        let result, response, errResponse;
        try {
            let userData = req.userDataByIdToken;
            let reqBodyData = req.filteredBody;
            let uploadFiles = req.files;

            result = await profileAdapter.createConsultingCompanyProfile(
                userData,
                reqBodyData,
                uploadFiles
            );
            console.log('POST - /api/company/profile 응답 : ', result);
            response = new SuccessResponse(result.message, result.data);
            res.status(200).send(response);
        } catch (error) {
            console.error('/api/company/profile 에러 응답 : ', error);
            next(error);
        }
    }
);
// 개인 컨설턴트 프로필 임시저장 : 프로필 임시정보 생성
router.post(
    '/temp/user',
    // uploadConsultantProfileTemp.any(),
    sanitizer,
    async (req, res, next) => {
        let result, response, errResponse;
        try {
            let userData = req.userDataByIdToken;
            let reqBodyData = req.filteredBody;
            let uploadFiles = req.files;

            result = await profileAdapter.createConsultantProfileTemp(
                userData,
                reqBodyData,
                uploadFiles
            );
            console.log('POST - /api/user/profile/temp 응답 : ', result);
            response = new SuccessResponse(result.message, result.data);
            res.status(200).send(response);
        } catch (error) {
            console.error('/api/user/profile/temp 에러 응답 : ', error);
            next(error);
        }
    }
);
// 기업 프로필 임시저장 : 프로필 임시정보 생성
router.post(
    '/temp/company',
    // uploadConsultingCompanyBusinessLicenseTemp.any(),
    sanitizer,
    async (req, res, next) => {
        let result, response, errResponse;
        try {
            let userData = req.userDataByIdToken;
            let reqBodyData = req.filteredBody;
            let uploadFiles = req.files;

            result = await profileAdapter.createConsultingCompanyProfileTemp(
                userData,
                reqBodyData,
                uploadFiles
            );
            console.log('POST - /api/company/profile/temp 응답 : ', result);
            response = new SuccessResponse(result.message, result.data);
            res.status(200).send(response);
        } catch (error) {
            console.error('/api/company/profile/temp 에러 응답 : ', error);
            next(error);
        }
    }
);

// 프로필 임시저장 데이터 유뮤 확인
router.get('/temp/exist', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let userData = req.userDataByIdToken;
        result = await profileAdapter.checkProfileTempExist(userData);

        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch (error) {
        console.error('/api/profile/temp/exist 에러 응답 : ', error);
        next(error);
    }
});
// 개인 컨설턴트 프로필 정보 가져오기
router.get('/user', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let userData = req.userDataByIdToken;
        console.log('GET - /api/user/profile 요청 : ', userData);

        result = await profileAdapter.getProfile(userData);
        console.log('GET - /api/user/profile 응답 : ', result);

        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch (error) {
        console.error('/api/user/profile 에러 응답 : ', error);
        next(error);
    }
});
// 컨설팅 기업 프로필 정보 가져오기
router.get('/company', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let userData = req.userDataByIdToken;
        console.log('GET - /api/company/profile 요청 : ', userData);

        result = await profileAdapter.getProfile(userData);
        console.log('GET - /api/company/profile 응답 : ', result);

        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch (error) {
        console.error('/api/company/profile 에러 응답 : ', error);
        next(error);
    }
});
// 개인 컨설턴트 프로필 임시저장 정보 가져오기
router.get('/temp/user', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let userData = req.userDataByIdToken;
        console.log('GET - /api/user/profile/temp 요청 : ', userData);

        result = await profileAdapter.getProfileTemp(userData);
        console.log('GET - /api/user/profile/temp 응답 : ', result);

        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch (error) {
        console.error('/api/user/profile/temp 에러 응답 : ', error);
        next(error);
    }
});
// 컨설팅 기업 프로필 임시저장 정보 가져오기
router.get('/temp/company', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let userData = req.userDataByIdToken;
        console.log('GET - /api/company/profile/temp 요청 : ', userData);

        result = await profileAdapter.getProfileTemp(userData);
        console.log('GET - /api/company/profile/temp 응답 : ', result);

        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch (error) {
        console.error('/api/company/profile/temp 에러 응답 : ', error);
        next(error);
    }
});
// 클라이언트 프로필 인증 요청 : 사용자/기업 정보 수정
router.put(
    '/auth/info',
    // uploadClientProfile.any(),
    sanitizer,
    async (req, res, next) => {
        let result, response, errResponse;
        try {
            console.log('PUT - /api/client/auth 요청 : ', req.body);
            let userData = req.userDataByIdToken;
            let reqBodyData = req.filteredBody;
            let uploadFiles = req.files;
            console.log(
                'PUT - /api/company/profile/temp 요청 : ',
                userData,
                reqBodyData,
                uploadFiles
            );

            result = await profileAdapter.requestClientAuth(
                userData,
                reqBodyData,
                uploadFiles
            );
            console.log('PUT - /api/client/auth 응답 : ', result);
            response = new SuccessResponse(result.message, result.data);
            res.status(200).send(response);
        } catch (error) {
            console.error('/api/client/auth 에러 응답 : ', error);
            next(error);
        }
    }
);
// 프로필 임시저장 정보 삭제 : 컨설턴트 (개인/기업) 공통
router.delete('/temp', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let userData = req.userDataByIdToken;
        console.log('DELETE - /api/profile/temp 요청 : ', userData);

        result = await profileAdapter.deleteProfileTemp(userData);
        console.log('DELETE - /api/profile/temp 응답 : ', result);

        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch (error) {
        console.error('DELETE - /api/profile/temp 에러 응답 : ', error);
        next(error);
    }
});

module.exports = router;
