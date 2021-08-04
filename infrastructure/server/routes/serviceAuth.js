// 미들웨어 : 서버에서 오는 API로 요청왔을 시에 토큰을 확인

// 처음 서비스의 로그인 시 토큰 발급

// 서비스별 데이터 env 파일에 저장 : 서비스 타입, 서비스 id, 서비스 비밀번호

// 토큰 저장은 redis 사용

const { serviceAuthAdapter } = require('../../../adapters/inbound');
const extractToken = require('../modules/extractToken');
const Response = require('../modules/Response');

module.exports = (router) => {
    // 각 서비스 확인 (서비스별 로그인) > 토큰 발급
    router.post('/service/issuetoken', async (req, res) => {
        let result, response;
        try {
            let reqBodyData = req.filteredBody;
            result = await serviceAuthAdapter.issueToken(reqBodyData);

            response = new Response(200, result.message, result.token);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    });
    // 토큰 확인
    router.get(
        '/service/verify/:serviceType',
        // extractToken,
        async (req, res) => {
            let result, response;
            try {
                let reqParamData = req.params;
                console.log(reqParamData);
                // let reqToken = req.token; // 테스트 후 미들웨어와 함께 삭제
                let reqToken = req.filteredToken; // 테스트 후 살리기
                reqParamData.serviceToken = reqToken;

                result = await serviceAuthAdapter.verifyToken(reqParamData);
                response = new Response(200, result.message, result.data);
                res.send(response);
            } catch (error) {
                res.send(error);
            }
        }
    );
    // access token이 만료되었을 때 refresh token으로 갱신 처리
    router.post('/service/renewtoken', async (req, res) => {});

    //---------------------------------------------------------------------------
    // 유저 서비스 토큰 요청 (로그인)-------------------------------------------
    router.get('/service/admin/auth', async (req, res) => {
        let result, response;
        try {
            result = await serviceAuthAdapter.issueTokenByAdminService();
            response = new Response(200, result.message, result.data);
            res.send(response);
        } catch (error) {
            throw error;
        }
    });
    router.get('/service/admin/verify', extractToken, async (req, res) => {
        let result, response;
        try {
            // let userToken = await getToken('userTokenForAdmin'); //infra 처리
            result = await serviceAuthAdapter.verifyTokenByAdminService();
            response = new Response(200, result.message, result.data);
            res.send(response);
        } catch (error) {
            console.log('에러 : ', error);
            res.send(error);
        }
    });
    // 프로젝트 서비스 토큰 요청 (로그인)---------------------------------------
    router.get('/service/project/auth', async (req, res) => {
        let result, response;
        try {
            result = await serviceAuthAdapter.issueTokenByProjectService();
            response = new Response(200, result.message, result.data);
            res.send(response);
        } catch (error) {
            throw error;
        }
    });
    router.get('/service/project/verify', extractToken, async (req, res) => {
        let result, response;
        try {
            result = await serviceAuthAdapter.verifyTokenByProjectService();
            response = new Response(200, result.message, result.data);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    });
};
