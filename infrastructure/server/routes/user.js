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
        try {
            let userData = req.userDataByIdToken;
            console.log('GET - /api/userinfo 요청 : ', userData);

            let result = await userAdapter.getUserInfo(userData);
            console.log('GET - /api/userinfo 응답 : ', result);

            let response = new Response(
                200,
                '사용자 정보가져오기 완료 - idToken',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('/api/user 에러 응답 : ', result);
            res.send(err);
        }
    });
    // 사용자 정보 변경 : 공통 : 비밀번호
    router.put('/api/user/info/changepassword', async (req, res) => {
        try {
            let accessToken = req.token;
            let reqData = req.filteredData;
            console.log('changepassword 요청 : ', reqData);

            let result = await authAdapter.changePassword(accessToken, reqData);
            console.log('changepassword 응답 : ', result);

            let response = new Response(200, '비밀번호 변경완료', result);
            res.send(response);
        } catch (err) {
            console.log('changepassword 에러 응답 : ', err);
            res.send(err);
        }
    });
    // 사용자 정보 변경 - 공통 : 연락처
    router.put('/api/user/info/phonenum', decryptIdToken, async (req, res) => {
        let result;
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

            let response = new Response(
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
    // 사용자 정보 변경 - 컨설턴트 공통 : 입금정보  => id token으로 처리했음 (access로 해야하는지 확인)
    router.put('/api/user/info/bankinfo', decryptIdToken, async (req, res) => {
        try {
            let userData = req.userDataByIdToken;
            let reqData = req.filteredData;
            console.log(
                'PUT - /api/user/info/bankinfo 요청 : ',
                userData,
                reqData
            );

            let result = await userAdapter.updateBankInfo(userData, reqData);
            console.log('PUT - /api/user/info/bankinfo 응답 : ', result);

            let response = new Response(
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
    // 사용자 기업소속 상태변경 : 사용자 소속 요청 처리 type - 0: 소속요청, 1: 요청취소/해제하기
    // 진행중인 프로젝트가 있는 경우 해제불가 : 해당 코드 프로젝트 진행 뒤 추가
    router.put('/api/user/join/status', decryptIdToken, async (req, res) => {
        try {
            let userData = req.userDataByIdToken;
            let reqData = req.filteredData;
            console.log(
                'PUT - /api/user/join/status 요청 : ',
                userData,
                reqData
            );

            let result = await userAdapter.updateJoinStatus(userData, reqData);
            console.log('PUT - /api/user/join/status 응답 : ', result);

            let response = new Response(
                200,
                '사용자 소속 상태 수정 완료',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('PUT - /api/user/join/status 에러 응답 : ', err);
            res.send(err);
        }
    });

    // 회원 탈퇴 : 윤이사님 확인 후 처리 : 정책논의와 다른 기능완성 후 작업진행!!
    router.delete('/api/user', async (req, res) => {
        try {
            let accessToken = req.token;
            let reqData = req.filteredData;
            console.log('DELETE - /api/user 요청 : ', accessToken, reqData);

            let result = await userAdapter.deleteUser(accessToken, reqData);
            console.log('DELETE - /api/user 응답 : ', result);

            let response = new Response(
                200,
                '회원탈퇴완료 - accessToken',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('DELETE - /api/user 에러 응답 : ', err);
            res.send(err);
        }
    });
};
