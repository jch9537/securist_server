//API 사용자 별로 이동 처리
const { profileAdapter } = require('../../../adapters/inbound');
const Response = require('../modules/Response');

const sanitizer = require('../../server/modules/sanitizer');
const extractToken = require('../modules/extractToken');
const decryptIdToken = require('../modules/decryptIdToken');
// const decryptAccessToken = require('../modules/decryptAccessToken');
// const getUserInfoByAccessToken = require('../modules/getUserInfoByAccessToken');
const {
    uploadConsultantProfileTemp,
    uploadConsultingCompanyBusinessLicenseTemp,
} = require('../../webService/storageService');

module.exports = (router) => {
    router.use(extractToken);
    router.use(decryptIdToken);
    // 사용자 - 프로필 임시정보 생성 : 임시저장
    router.post(
        '/api/user/profile/temp',
        uploadConsultantProfileTemp.any(),
        sanitizer,
        async (req, res) => {
            try {
                let userData = req.userDataByIdToken;
                let reqData = req.filteredData;
                let uploadFiles = req.files;

                console.log(
                    'POST - /api/user/profile/temp 요청 :  userData : ',
                    userData
                );
                console.log(
                    'POST - /api/user/profile/temp 요청 :  reqData : ',
                    reqData
                );
                console.log(
                    'POST - /api/user/profile/temp 요청 : uploadFiles : ',
                    uploadFiles
                );
                let result = await profileAdapter.createConsultantProfileTemp(
                    userData,
                    reqData,
                    uploadFiles
                );
                console.log('POST - /api/user/profile/temp 응답 : ', result);
                let response = new Response(
                    200,
                    '컨설턴트 프로필 임시 저장 완료',
                    result
                );
                res.send(response);
            } catch (err) {
                console.log('/api/user/profile/temp 에러 응답 : ', err);
                res.send(err);
            }
        }
    );
    // 기업 - 프로필 임시정보 생성 : 임시저장
    router.post(
        '/api/company/profile/temp',
        uploadConsultingCompanyBusinessLicenseTemp.any(),
        sanitizer,
        async (req, res) => {
            try {
                console.log(
                    'POST - /api/company/profile/temp 요청 : ',
                    req.body
                );
                let userData = req.userDataByIdToken;
                let reqData = req.filteredData;
                let uploadFiles = req.files;
                console.log(
                    'POST - /api/company/profile/temp 요청 : ',
                    userData,
                    reqData,
                    uploadFiles
                );
                console.log(reqData);

                let result = await profileAdapter.createConsultingCompanyProfileTemp(
                    userData,
                    reqData,
                    uploadFiles
                );
                console.log('POST - /api/company/profile/temp 응답 : ', result);
                let response = new Response(
                    200,
                    '기업 프로필 임시 저장 완료',
                    result
                );
                res.send(response);
            } catch (err) {
                console.log('/api/company/profile/temp 에러 응답 : ', err);
                res.send(err);
            }
        }
    );
    // 사용자 프로필 임시정보 가져오기 : 임시저장 데이터 가져오기
    router.get('/api/user/profile/temp', async (req, res) => {
        try {
            let userData = req.userDataByIdToken;
            console.log('GET - /api/user/profile/temp 요청 : ', userData);

            let result = await profileAdapter.getProfileTemp(userData);
            console.log('GET - /api/user/profile/temp 응답 : ', result);

            let response = new Response(
                200,
                '사용자 임시 프로필 정보가져오기 완료 - idToken',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('/api/user/profile/temp 에러 응답 : ', result);
            res.send(err);
        }
    });
    // 기업 프로필 임시정보 가져오기 : 임시저장 데이터 가져오기
    router.get('/api/company/profile/temp', async (req, res) => {
        try {
            let userData = req.userDataByIdToken;
            console.log('GET - /api/company/profile/temp 요청 : ', userData);

            let result = await profileAdapter.getProfileTemp(userData);
            console.log('GET - /api/company/profile/temp 응답 : ', result);

            let response = new Response(
                200,
                '기업 임시 프로필 정보가져오기 완료 - idToken',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('/api/company/profile/temp 에러 응답 : ', result);
            res.send(err);
        }
    });
    // 임시저장 프로필 정보 삭제 : 공통
    router.delete('/api/profile/temp', async (req, res) => {
        try {
            let userData = req.userDataByIdToken;
            console.log('DELETE - /api/profile/temp 요청 : ', userData);

            let result = await profileAdapter.deleteProfileTemp(userData);
            console.log('DELETE - /api/profile/temp 응답 : ', result);

            let response = new Response(
                200,
                '프로필 임시저장 정보 삭제 완료',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('DELETE - /api/profile/temp 에러 응답 : ', result);
            res.send(err);
        }
    });
};
