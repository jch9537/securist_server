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
} = require('../../webService/storageService');

module.exports = (router) => {
    router.use(extractToken);
    router.use(decryptIdToken);
    // 사용자 - 프로필 임시정보 생성 : 임시저장
    router.post(
        '/api/profile/user/temp',
        uploadConsultantProfileTemp.any(),
        sanitizer,
        async (req, res) => {
            try {
                let userData = req.userDataByIdToken;
                let reqData = req.filteredData;
                let uploadFiles = req.files;

                console.log(
                    'POST - /api/profile/user/temp 요청 :  userData : ',
                    userData
                );
                console.log(
                    'POST - /api/profile/user/temp 요청 :  reqData : ',
                    reqData
                );
                console.log(
                    'POST - /api/profile/user/temp 요청 : uploadFiles : ',
                    uploadFiles
                );
                let result = await profileAdapter.createConsultantProfileTemp(
                    userData,
                    reqData,
                    uploadFiles
                );
                console.log('POST - /api/profile/user/temp 응답 : ', result);
                let response = new Response(200, '임시 저장 완료', result);
                res.send(response);
            } catch (err) {
                console.log('/api/profile/user/temp 에러 응답 : ', err);
                res.send(err);
            }
        }
    );
    // 기업 - 프로필 임시정보 생성 : 임시저장
    router.post(
        '/api/company/profile/temp',
        // upload.any(),
        sanitizer,
        async (req, res) => {
            try {
                // console.log('POST - /api/profile/user/temp 요청 : ', req.body);
                let userData = req.userDataByIdToken;
                let reqData = req.filteredData;
                let uploadFiles = req.files;
                console.log(
                    'POST - /api/profile/user/temp 요청 : ',
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
                console.log('POST - /api/profile/user/temp 응답 : ', result);
                let response = new Response(
                    200,
                    '사용자 정보가져오기 완료 - idToken',
                    result
                );
                res.send(response);
            } catch (err) {
                console.log('/api/profile/user/temp 에러 응답 : ', err);
                res.send(err);
            }
        }
    );
    // 프로필 임시정보 가져오기 : 임시저장 데이터 가져오기
    router.get('/api/profile/temp/:userId', async (req, res) => {
        try {
            let userData = req.userDataByIdToken;
            console.log(
                'GET - /api/profile/temp/:userId 요청 : ',
                userData,
                reqData
            );

            let result = await profileAdapter.getProfileTemp(userData);
            console.log('GET - /api/profile/temp/:userId 응답 : ', result);

            let response = new Response(
                200,
                '사용자 정보가져오기 완료 - idToken',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('/api/profile/temp/:userId 에러 응답 : ', result);
            res.send(err);
        }
    });
    // // 프로필 정보가져오기
    // router.get('/api/profile/:userId', async (req, res) => {
    //     try {
    //         let userData = req.userDataByIdToken;
    //         console.log('GET - /api/profile/:userId 요청 : ', userData);

    //         let result = await userAdapter.getProfile(userData);
    //         console.log('GET - /api/profile/:userId 응답 : ', result);

    //         let response = new Response(
    //             200,
    //             '사용자 정보가져오기 완료 - idToken',
    //             result
    //         );
    //         res.send(response);
    //     } catch (err) {
    //         console.log('/api/profile/:userId 에러 응답 : ', result);
    //         res.send(err);
    //     }
    // });
};
