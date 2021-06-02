// 추가할 사용자 처리 : 컨설턴트 등록요청, 기업 승인/반려처리
// 기업정보 가져오기
const { authAdapter, userAdapter } = require('../../../adapters/inbound');

const Response = require('../modules/Response');
const extractToken = require('../modules/extractToken');
const decryptIdToken = require('../modules/decryptIdToken');
// const decryptAccessToken = require('../modules/decryptAccessToken');
// const getUserInfoByAccessToken = require('../modules/getUserInfoByAccessToken');

module.exports = (router) => {
    router.use(extractToken);
    // 사용자 DB 정보가져오기
    router.get('/api/user/userinfo', decryptIdToken, async (req, res) => {
        let result, response;
        try {
            let userData = req.userDataByIdToken;
            console.log('GET - /api/userinfo 요청 : ', userData);

            result = await userAdapter.getUserInfo(userData);
            console.log('GET - /api/userinfo 응답 : ', result);

            response = new Response(
                200,
                '사용자 정보가져오기 완료 - idToken',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('/api/user 에러 응답 : ', err);
            res.send(err);
        }
    });
    // 사용자 소속기업 정보 가져오기
    router.get(
        '/api/user/belonging/company/info',
        decryptIdToken,
        async (req, res) => {
            let result, response;
            try {
                let userData = req.userDataByIdToken;
                console.log(
                    '요청 > /api/user/belonging/company/info : ',
                    userData
                );

                result = await userAdapter.getUserBelongingCompanyInfo(
                    userData
                );
                console.log(
                    '응답 > /api/user/belonging/company/info : ',
                    result
                );

                response = new Response(
                    200,
                    '사용자 소속 기업정보 가져오기 완료',
                    result
                );
                res.send(response);
            } catch (err) {
                console.log('에러 > /api/user/belonging/company/info : ', err);
                res.send(err);
            }
        }
    );
    // 사용자 정보 변경 : 공통 : 비밀번호
    router.put('/api/user/info/changepassword', async (req, res) => {
        let result, response;
        try {
            let accessToken = req.token;
            let reqData = req.filteredData;
            console.log('changepassword 요청 : ', reqData);

            result = await authAdapter.changePassword(accessToken, reqData);
            console.log('changepassword 응답 : ', result);

            response = new Response(200, '비밀번호 변경완료', result);
            res.send(response);
        } catch (err) {
            console.log('changepassword 에러 응답 : ', err);
            res.send(err);
        }
    });
    // 사용자 정보 변경 - 공통 : 연락처
    router.put('/api/user/info/phonenum', decryptIdToken, async (req, res) => {
        let result, response;
        result;
        try {
            let userData = req.userDataByIdToken;
            let reqData = req.filteredData;
            console.log(
                'PUT - /api/user/info/phonenum 요청 : ',
                userData,
                reqData
            );

            result = await userAdapter.updatePhoneNum(userData, reqData);
            console.log('PUT - /api/user/info/phonenum 응답 : ', result);

            response = new Response(
                200,
                '사용자 정보 수정 완료 - idToken',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('PUT - /api/user/info/phonenum 에러 응답 : ', err);
            res.send(err);
        }
    });
    // 사용자 정보 변경 - 컨설턴트 공통 : 입금정보
    router.put('/api/user/info/bankinfo', decryptIdToken, async (req, res) => {
        let result, response;
        try {
            let userData = req.userDataByIdToken;
            let reqData = req.filteredData;
            console.log(
                'PUT - /api/user/info/bankinfo 요청 : ',
                userData,
                reqData
            );

            result = await userAdapter.updateBankInfo(userData, reqData);
            console.log('PUT - /api/user/info/bankinfo 응답 : ', result);

            response = new Response(
                200,
                '사용자 정보 수정 완료 - idToken',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('PUT - /api/user/info/bankinfo 에러 응답 : ', err);
            res.send(err);
        }
    });
    // 회원 탈퇴 : 윤이사님 확인 후 처리 : 정책논의와 다른 기능완성 후 작업진행!!
    router.delete('/api/user', async (req, res) => {
        let result, response;
        try {
            let accessToken = req.token;
            let reqData = req.filteredData;
            console.log('DELETE - /api/user 요청 : ', accessToken, reqData);

            result = await userAdapter.deleteUser(accessToken, reqData);
            console.log('DELETE - /api/user 응답 : ', result);

            response = new Response(200, '회원탈퇴완료 - accessToken', result);
            res.send(response);
        } catch (err) {
            console.log('DELETE - /api/user 에러 응답 : ', err);
            res.send(err);
        }
    });
};
