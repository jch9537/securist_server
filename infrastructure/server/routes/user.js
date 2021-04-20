// 추가할 사용자 처리 : 컨설턴트 등록요청/처리, 취소/반려처리
const { authAdapter, userAdapter } = require('../../../adapters/inbound');

const Response = require('../modules/Response');
const extractToken = require('../modules/extractToken');

module.exports = (router) => {
    router.use(extractToken);
    // 사용자 DB 정보가져오기
    router.get('/api/user/userinfo', async (req, res) => {
        try {
            let idToken = req.token;
            console.log('GET - /api/userinfo 요청 : ', idToken);
            let result = await userAdapter.getUserInfo(idToken);
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
        let accessToken = req.token;
        let reqData = req.filteredData;
        console.log('changepassword 요청 : ', reqData);

        try {
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
    router.put('/api/user/info/phonenum', async (req, res) => {
        try {
            let idToken = req.token;
            let filteredData = req.filteredData;
            console.log(
                'PUT - /api/user/info/phonenum 요청 : ',
                idToken,
                filteredData
            );
            let result = await userAdapter.updatePhoneNum(
                idToken,
                filteredData
            );
            console.log('PUT - /api/user/info/phonenum 응답 : ', result);
            let response = new Response(
                200,
                '사용자 정보 수정 완료 - idToken',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('PUT - /api/user/info/phonenum 에러 응답 : ', result);
            res.send(err);
        }
    });
    // 사용자 정보 변경 - 컨설턴트 공통 : 입금정보  => id token으로 처리했음 (access로 해야하는지 확인)
    router.put('/api/user/info/bankinfo', async (req, res) => {
        try {
            let idToken = req.token;
            let filteredData = req.filteredData;
            console.log(
                'PUT - /api/user/info/bankinfo 요청 : ',
                idToken,
                filteredData
            );
            let result = await userAdapter.updateBankInfo(
                idToken,
                filteredData
            );
            console.log('PUT - /api/user/info/bankinfo 응답 : ', result);
            let response = new Response(
                200,
                '사용자 정보 수정 완료 - idToken',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('PUT - /api/user/info/bankinfo 에러 응답 : ', result);
            res.send(err);
        }
    });

    // 회원 탈퇴 : 윤이사님 확인 후 처리
    router.delete('/api/user', async (req, res) => {
        let accessToken = req.token;
        let deleteData = req.filteredData;
        console.log('DELETE - /api/user 요청 : ', accessToken, deleteData);
        try {
            let result = await userAdapter.deleteUser(accessToken, deleteData);
            console.log('DELETE - /api/user 응답 : ', result);
            let response = new Response(
                200,
                '회원탈퇴완료 - accessToken',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('DELETE - /api/user 에러 응답 : ', result);
            res.send(err);
        }
    });
};
