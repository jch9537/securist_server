// 미들웨어 : 서버에서 오는 API로 요청왔을 시에 토큰을 확인 - 처리 중!!

// 처음 서비스의 로그인 시 토큰 발급 - 처리!!

// 서비스별 데이터 env 파일에 저장 : 서비스 타입, 서비스 id, 서비스 비밀번호 - 처리!!

// 토큰 저장은 storage 라는 라이브러리 사용

// 토큰생성(로그인)/ 토큰 갱신 api 생성
// const jwt = require('jsonwebtoken');
// const axios = require('axios');
const extractToken = require('../modules/extractToken');
const { ServiceAuthenticationError, TokenError } = require('../../error');
const {
    issueToken,
    verifyToken,
    issueTokenByAdminService,
    verifyTokenByAdminService,
    issueTokenByProjectService,
    verifyTokenByProjectService,
} = require('../modules/serviceAuthentication/serviceAuthentication');

module.exports = (router) => {
    // router.use(extractToken);
    // 각 서비스 확인 (서비스별 로그인) > 토큰 발급
    router.post('/service/issuetoken', issueToken, async (req, res) => {
        try {
            let result = req.serviceToken;
            console.log('미들웨어 확인 : ', result);
            res.send(result);
        } catch (error) {
            res.send(error);
        }
    });
    // 토큰 확인
    router.get(
        '/service/verify',
        // extractToken,
        verifyToken,
        async (req, res) => {
            try {
                let result = req.serviceData;
                res.send(result);
            } catch (error) {
                response = new TokenError(error);
                res.send(error);
            }
        }
    );
    // access token이 만료되었을 때 refresh token으로 갱신 처리
    router.post('/service/renewtoken', async (req, res) => {});

    //--------------------------------------------------------------------------

    // 어드민 서비스 토큰 요청 (로그인) ------------------------------------------
    router.get(
        '/service/admin/auth',
        issueTokenByAdminService,
        async (req, res) => {
            try {
                let result = req.adminToken;
                res.send(result);
            } catch (error) {
                throw error;
            }
        }
    );
    router.get(
        '/service/admin/verify',
        extractToken,
        verifyTokenByAdminService,
        async (req, res) => {
            try {
                let result = req.userTokenDecryptData;
                res.send(result);
            } catch (error) {
                console.log('에러 : ', error);
                res.send(error);
            }
        }
    );
    // 프로젝트 서비스 인증 요청-------------------------------------------
    router.get(
        '/service/project/auth',
        issueTokenByProjectService,
        async (req, res) => {
            try {
                let result = req.projectToken;
                res.send(result);
            } catch (error) {
                throw error;
            }
        }
    );
    router.get(
        '/service/project/verify',
        extractToken,
        verifyTokenByProjectService,
        async (req, res) => {
            try {
                let result = req.userTokenDecryptData;
                res.send(result);
            } catch (error) {
                console.log('에러 : ', error);
                res.send(error);
            }
        }
    );
};
