// 추가할 사용자 처리 : 컨설턴트 등록요청, 기업 승인/반려처리, 기업정보 가져오기
const express = require('express');
const router = express.Router();

const { userAdapter } = require('../../../adapters/inbound');
const { SuccessResponse, ErrorResponse } = require('../../response');

const { extractToken, decryptIdToken } = require('../middlewares');


// 관리자 페이지 -------------------------------------------
// // 사용자 리스트 가져오기 : 클라이언트 컨설턴트 공통
// router.get('/', async (req, res, next) => {
//     let result, response;
//     try {
//         let reqQueryData = req.filteredQuery;
//         console.log('GET - /info 요청 : ', reqQueryData);

//         result = await userAdapter.getUsers(reqQueryData);
//         console.log('GET - /info 응답 : ', result);

//         response = new SuccessResponse(200, result);
//         res.send(response);
//     } catch (error) {
//         console.error('/info 에러 응답 : ', error);
//         next(error);
//     }
// });

// // 개별 사용자 정보 가져오기 : 클라이언트 컨설턴트 공통
// router.get('/:', async (req, res, next) => {
//     let result, response;
//     try {
//         let reqQueryData = req.filteredQuery;
//         console.log('GET - /info 요청 : ', reqQueryData);

//         result = await userAdapter.getUsers(reqQueryData);
//         console.log('GET - /info 응답 : ', result);

//         response = new SuccessResponse(200, result);
//         res.send(response);
//     } catch (error) {
//         console.error('/info 에러 응답 : ', error);
//         next(error);
//     }
// });

// 사용자 페이지 ---------------------------------------------------
router.use(extractToken);

// // 내 사용자 정보 가져오기 : 클라이언트 컨설턴트 공통
// router.get('/my', decryptIdToken, async (req, res, next) => {
//     let result, response;
//     try {
//         let userData = req.userDataByIdToken;
//         console.log('GET - /info 요청 : ', userData);

//         result = await userAdapter.getUser(userData);
//         console.log('GET - /info 응답 : ', result);

//         response = new SuccessResponse(200, result);
//         res.send(response);
//     } catch (error) {
//         console.error('/info 에러 응답 : ', error);
//         next(error);
//     }
// });

// // 사용자 정보 변경 - 공통 : 연락처
// router.put('/info/phonenum', decryptIdToken, async (req, res, next) => {
//     let result, response;
//     result;
//     try {
//         let userData = req.userDataByIdToken;
//         let reqBodyData = req.filteredBody;
//         console.log('PUT - /info/phonenum 요청 : ', userData, reqBodyData);

//         result = await userAdapter.updatePhoneNum(userData, reqBodyData);
//         console.log('PUT - /info/phonenum 응답 : ', result);

//         response = new SuccessResponse(result.message, result.data);
//         res.status(200).send(response);
//     } catch (error) {
//         console.error('PUT - /info/phonenum 에러 응답 : ', error);
//         next(error);
//     }
// });
// // 사용자 정보 변경 - 컨설턴트 공통 : 입금정보
// router.put('/info/bankinfo', decryptIdToken, async (req, res, next) => {
//     let result, response;
//     try {
//         let userData = req.userDataByIdToken;
//         let reqBodyData = req.filteredBody;
//         console.log('PUT - /info/bankinfo 요청 : ', userData, reqBodyData);

//         result = await userAdapter.updateBankInfo(userData, reqBodyData);
//         console.log('PUT - /info/bankinfo 응답 : ', result);

//         response = new SuccessResponse(result.message, result.data);
//         res.status(200).send(response);
//     } catch (error) {
//         console.error('PUT - /info/bankinfo 에러 응답 : ', error);
//         next(error);
//     }
// });
// // 회원 탈퇴 : 윤이사님 확인 후 처리 : 정책논의와 다른 기능완성 후 작업진행!!
// router.delete('/', async (req, res, next) => {
//     let result, response;
//     try {
//         let accessToken = req.token;
//         let reqBodyData = req.filteredBody;
//         console.log('DELETE - /api/user 요청 : ', accessToken, reqBodyData);

//         result = await userAdapter.deleteUser(accessToken, reqBodyData);
//         console.log('DELETE - /api/user 응답 : ', result);

//         response = new SuccessResponse(result.message, result.data);
//         res.status(200).send(response);
//     } catch (error) {
//         console.error('DELETE - /api/user 에러 응답 : ', error);
//         next(error);
//     }
// });

// 사용자 - 사용자-기업 연결 생성
router.post('/relation/join', decryptIdToken, async (req, res, next) => {
    let result, response;
    try {
        let userData = req.userDataByIdToken;
        let reqBodyData = req.filteredBody;
        console.log('요청 > GET > /relation/join: ', userData, reqBodyData);

        result = await userAdapter.createUserAndCompanyRelation(
            userData,
            reqBodyData
        );
        console.log('응답 > GET > /relation/join : ', result);

        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch (error) {
        console.error('에러 > GET > /relation/join: ', error);
        next(error);
    }
});

// 사용자-기업 연결정보 가져오기
router.get('/relation', decryptIdToken, async (req, res, next) => {
    let result, response;
    try {
        let userData = req.userDataByIdToken;
        console.log('요청 > /relation : ', userData);

        result = await userAdapter.getRelationInfo(userData);
        console.log('응답 > /relation : ', result);

        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch (error) {
        console.error('에러 > /relation : ', error);
        next(error);
    }
});
// 사용자 소속기업 정보 가져오기
router.get(
    '/belonging/company/info',
    decryptIdToken,
    async (req, res, next) => {
        let result, response;
        try {
            let userData = req.userDataByIdToken;
            console.log('요청 > /belonging/company/info : ', userData);

            result = await userAdapter.getUserBelongingCompanyInfo(userData);
            console.log('응답 > /belonging/company/info : ', result);

            response = new SuccessResponse(result.message, result.data);
            res.status(200).send(response);
        } catch (error) {
            console.error('에러 > /belonging/company/info : ', error);
            next(error);
        }
    }
);
// // 사용자 정보 변경 : 공통 : 비밀번호
// router.put('/info/changepassword', async (req, res, next) => {
//     let result, response;
//     try {
//         let accessToken = req.token;
//         let reqBodyData = req.filteredBody;
//         console.log('changepassword 요청 : ', reqBodyData);

//         result = await authAdapter.changePassword(accessToken, reqBodyData);
//         console.log('changepassword 응답 : ', result);

//         response = new SuccessResponse(result.message, result.data);
//         res.status(200).send(response);
//     } catch (error) {
//         console.error('changepassword 에러 응답 : ', error);
//         next(error)
//     }
// });

// 사용자 - 소속 상태변경(취소, 해제)처리
// 진행중인 프로젝트가 있는 경우 해제불가 : 해당 코드 프로젝트 진행 뒤 추가
router.put('/relation/unregister', decryptIdToken, async (req, res, next) => {
    let result, response;
    try {
        let userData = req.userDataByIdToken;
        let reqBodyData = req.filteredBody;
        console.log('요청 > /relation/unregister : ', userData, reqBodyData);

        result = await userAdapter.updateUserBelongingStatus(
            userData,
            reqBodyData
        );
        console.log('응답 > /relation/unregister : ', result);

        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch (error) {
        console.error('에러 > /relation/unregister : ', error);
        next(error);
    }
});

module.exports = router;
