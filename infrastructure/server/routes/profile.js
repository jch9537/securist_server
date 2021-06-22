//API 사용자 별로 이동 처리
const { profileAdapter } = require('../../../adapters/inbound');
const Response = require('../modules/Response');

const sanitizer = require('../../server/modules/sanitizer');
const extractToken = require('../modules/extractToken');
const decryptIdToken = require('../modules/decryptIdToken');
// const decryptAccessToken = require('../modules/decryptAccessToken');
// const getUserInfoByAccessToken = require('../modules/getUserInfoByAccessToken');
const {
    uploadClientProfile,
    uploadConsultantProfile,
    uploadConsultingCompanyBusinessLicense,
    uploadConsultantProfileTemp,
    uploadConsultingCompanyBusinessLicenseTemp,
} = require('../../webService/storageService');

module.exports = (router) => {
    router.use(extractToken);
    router.use(decryptIdToken);

    // 개인 컨설턴트 프로필 등록/요청
    router.post(
        '/api/user/profile',
        uploadConsultantProfile.any(),
        sanitizer,
        async (req, res) => {
            let result, response;
            try {
                console.log('POST - /api/user/profile 요청 : ', req.body);
                let userData = req.userDataByIdToken;
                let reqData = req.filteredData;
                let uploadFiles = req.files;
                // console.log(
                //     'POST - /api/company/profile/temp 요청 : ',
                //     userData,
                //     reqData,
                //     uploadFiles
                // );
                console.log(reqData);

                result = await profileAdapter.createConsultantProfile(
                    userData,
                    reqData,
                    uploadFiles
                );
                console.log('POST - /api/user/profile 응답 : ', result);
                response = new Response(
                    200,
                    '개인 컨설턴트 프로필 생성 완료',
                    result
                );
                res.send(response);
            } catch (err) {
                console.log('/api/user/profile 에러 응답 : ', err);
                res.send(err);
            }
        }
    );
    // 기업 프로필 등록/요청
    router.post(
        '/api/company/profile',
        uploadConsultingCompanyBusinessLicense.any(),
        sanitizer,
        async (req, res) => {
            let result, response;
            try {
                let userData = req.userDataByIdToken;
                let reqData = req.filteredData;
                let uploadFiles = req.files;

                result = await profileAdapter.createConsultingCompanyProfile(
                    userData,
                    reqData,
                    uploadFiles
                );
                console.log('POST - /api/company/profile 응답 : ', result);
                response = new Response(
                    200,
                    '컨설팅 업체 프로필 생성 완료',
                    result
                );
                res.send(response);
            } catch (err) {
                console.log('/api/company/profile 에러 응답 : ', err);
                res.send(err);
            }
        }
    );
    // 사용자 - 프로필 임시정보 생성 : 임시저장
    router.post(
        '/api/user/profile/temp',
        uploadConsultantProfileTemp.any(),
        sanitizer,
        async (req, res) => {
            let result, response;
            try {
                let userData = req.userDataByIdToken;
                let reqData = req.filteredData;
                let uploadFiles = req.files;

                result = await profileAdapter.createConsultantProfileTemp(
                    userData,
                    reqData,
                    uploadFiles
                );
                console.log('POST - /api/user/profile/temp 응답 : ', result);
                response = new Response(
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
            let result, response;
            try {
                let userData = req.userDataByIdToken;
                let reqData = req.filteredData;
                let uploadFiles = req.files;

                result = await profileAdapter.createConsultingCompanyProfileTemp(
                    userData,
                    reqData,
                    uploadFiles
                );
                console.log('POST - /api/company/profile/temp 응답 : ', result);
                response = new Response(
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

    // 임시저장 데이터 존재유무 확인
    router.get('/api/profile/temp/exist', async (req, res) => {
        let result, response;
        try {
            let userData = req.userDataByIdToken;
            result = await profileAdapter.checkProfileTempExist(userData);
            let existTemp = !!result.length ? true : false;
            response = new Response(200, '임시데이터 확인 성공', {
                existTemp: existTemp,
            });
            res.send(response);
        } catch (err) {
            res.send(err);
        }
    });
    // 사용자 프로필 임시정보 가져오기 : 임시저장 데이터 가져오기
    router.get('/api/user/profile/temp', async (req, res) => {
        let result, response;
        try {
            let userData = req.userDataByIdToken;
            console.log('GET - /api/user/profile/temp 요청 : ', userData);

            result = await profileAdapter.getProfileTemp(userData);
            console.log('GET - /api/user/profile/temp 응답 : ', result);

            response = new Response(
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
        let result, response;
        try {
            let userData = req.userDataByIdToken;
            console.log('GET - /api/company/profile/temp 요청 : ', userData);

            result = await profileAdapter.getProfileTemp(userData);
            console.log('GET - /api/company/profile/temp 응답 : ', result);

            response = new Response(
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
    // 클라이언트 인증 요청
    router.put(
        '/api/client/auth',
        uploadClientProfile.any(),
        sanitizer,
        async (req, res) => {
            let result, response;
            try {
                console.log('PUT - /api/client/auth 요청 : ', req.body);
                let userData = req.userDataByIdToken;
                let reqData = req.filteredData;
                let uploadFiles = req.files;
                console.log(
                    'PUT - /api/company/profile/temp 요청 : ',
                    userData,
                    reqData,
                    uploadFiles
                );

                result = await profileAdapter.requestClientAuth(
                    userData,
                    reqData,
                    uploadFiles
                );
                console.log('PUT - /api/client/auth 응답 : ', result);
                response = new Response(
                    200,
                    '개인 컨설턴트 프로필 생성 완료',
                    result
                );
                res.send(response);
            } catch (err) {
                console.log('/api/client/auth 에러 응답 : ', err);
                res.send(err);
            }
        }
    );
    // 임시저장 프로필 정보 삭제 : 공통
    router.delete('/api/profile/temp', async (req, res) => {
        let result, response;
        try {
            let userData = req.userDataByIdToken;
            console.log('DELETE - /api/profile/temp 요청 : ', userData);

            result = await profileAdapter.deleteProfileTemp(userData);
            console.log('DELETE - /api/profile/temp 응답 : ', result);

            response = new Response(
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
